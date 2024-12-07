import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import LottieView from 'lottie-react-native';
import useServicePackages from '../hooks/useServicePackage';
import { useToast } from 'native-base';
import { GetLatestPushNotificationRecordByLeaderId, InitializeFirestoreDb, sendPushNotification } from '@/utils/PushNotification';
import { useFocusEffect } from '@react-navigation/native';
import useUser from '@/hooks/useUser';
import { Leader } from '@/models/LeaderInfo';
import { User } from '@/models/User';

export const unstable_settings = {
  headerShown: false,
};

export default function ServicePackageSuccess() {
  const { servicePackageId, orderCode, contractId, isCanceled } = useLocalSearchParams();
  const { fetchUserAndLeader, leaderInfo, user } = useUser();
  const { finalizePayment } = useServicePackages();
  const navigation = useNavigation();
  const toast = useToast();

  useFocusEffect(
    React.useCallback(() => {
      fetchUserAndLeader();
    }, [])
  );

  const db = InitializeFirestoreDb();

  // const sendPushNotificationToLeader = async () => {
  //   try {
  //     // Lấy bản ghi mới nhất từ Firestore theo leaderId
  //     const result = await GetLatestPushNotificationRecordByLeaderId(
  //       db,
  //       "L_0000000001"
  //     );

  //     // Log kết quả để kiểm tra dữ liệu
  //     console.log("Latest Record:", result);

  //     // Kiểm tra nếu dữ liệu tồn tại và chứa expoPushToken
  //     if (result && result.exponentPushToken) {
  //       const expoPushToken = result.exponentPushToken;

  //       // Gọi hàm sendPushNotification với token
  //       await sendPushNotification(expoPushToken);

  //       console.log("Push notification sent successfully!");
  //     } else {
  //       console.log("No valid exponentPushToken found in the record.");
  //     }
  //   } catch (error) {
  //     console.error("Error sending push notification:", error);
  //   }
  // };




  const sendPushNotificationToLeader = async ({ leaderInfo, user }: { leaderInfo: Leader, user: User }) => {
    try {
      // Lấy bản ghi push notification mới nhất từ Firestore
      const result = await GetLatestPushNotificationRecordByLeaderId(
        db,
        leaderInfo.accountId
      );

      console.log('result', result)

      if (result && result.exponentPushToken) {
        const expoPushToken = result.exponentPushToken;

        // Lấy fullName của user và truyền cùng contractId
        const fullName = user.fullName; // Lấy fullName từ user

        // Gửi push notification
        await sendPushNotification(expoPushToken, contractId as string, fullName);

        console.log('Push notification sent successfully!');
      } else {
        console.error('Không tìm thấy expoPushToken trong bản ghi Firestore.');
      }
    } catch (error) {
      console.error('Lỗi khi gửi push notification:', error);
    }
  };

  useEffect(() => {
    if (servicePackageId && orderCode && contractId) {
      console.log('log 1', servicePackageId)
      if (leaderInfo && user) {
        console.log('log 2', leaderInfo, user)
        sendPushNotificationToLeader({ leaderInfo, user });
      }
    }
  }, [servicePackageId, orderCode, contractId, leaderInfo, user])

  useEffect(() => {
    // Ẩn header
    navigation.setOptions({
      headerShown: false,
    });

    if (isCanceled === undefined) {
      console.log('cancel', isCanceled)
      // Trường hợp thanh toán thành công
      if (servicePackageId && orderCode && contractId) {
        handleFinalizePayment(); // Gọi API hoàn tất thanh toán
      } else {
        toast.show({
          description: 'Lỗi: Thiếu thông tin thanh toán!',
          placement: 'top',
          duration: 5000,
        });
        navigateToHome(); // Chuyển hướng về trang chủ nếu thiếu thông tin
      }
    } else {
      // Trường hợp thanh toán bị hủy
      toast.show({
        description: 'Thanh toán đã bị hủy!',
        placement: 'top',
        duration: 5000,
      });
      setTimeout(navigateToHome, 5000); // 5 giây trước khi chuyển hướng
    }
  }, [isCanceled, servicePackageId, orderCode, contractId]);

  const handleFinalizePayment = async () => {
    try {
      await finalizePayment({
        servicePackageId: servicePackageId as string,
        orderCode: parseInt(orderCode as string, 10),
        contractId: contractId as string,
      });

      toast.show({
        description: 'Thanh toán thành công!',
        placement: 'top',
        duration: 5000,
      });

      setTimeout(navigateToHistory, 5000); // 5 giây trước khi chuyển hướng
    } catch (error) {
      console.error('Error finalizing payment:', error);
      toast.show({
        description: 'Có lỗi khi hoàn tất thanh toán.',
        placement: 'top',
        duration: 5000,
      });
    }
  };

  const navigateToHome = () => {
    router.replace('/(tabs)'); // Chuyển hướng về trang chủ
  };

  const navigateToHistory = () => {
    router.replace('/PendingContractScreen'); // Chuyển hướng về trang chủ
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={
          isCanceled === undefined
            ? require('../assets/animations/payment-success.json') // Thành công
            : require('../assets/animations/payment-cancel.json') // Hủy
        }
        autoPlay
        loop={false}
        style={styles.animation}
        speed={0.5}
      />
      <Text style={styles.title}>
        {isCanceled === undefined ? 'Thanh toán thành công' : 'Thanh toán bị hủy'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F7F7',
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#112D4E',
  },
});