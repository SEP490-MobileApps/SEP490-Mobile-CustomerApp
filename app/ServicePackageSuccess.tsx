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

        const fullName = user.fullName;

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
      if (servicePackageId && orderCode && contractId) {
        handleFinalizePayment();
      } else {
        toast.show({
          description: 'Lỗi: Thiếu thông tin thanh toán!',
          placement: 'top',
          duration: 6000,
        });
        navigateToHome();
      }
    } else {
      setTimeout(navigateToHome, 6000);
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
        duration: 6000,
      });

      setTimeout(navigateToHistory, 6000);
    } catch (error) {
      console.error('Error finalizing payment:', error);
      toast.show({
        description: 'Có lỗi khi hoàn tất thanh toán.',
        placement: 'top',
        duration: 6000,
      });
    }
  };

  const navigateToHome = () => {
    router.replace('/(tabs)');
  };

  const navigateToHistory = () => {
    router.replace('/PendingContractScreen');
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={
          isCanceled === undefined
            ? require('../assets/animations/payment-success.json')
            : require('../assets/animations/payment-cancel.json')
        }
        autoPlay
        loop={false}
        style={styles.animation}
        speed={0.5}
      />
      <Text style={styles.title}>
        {isCanceled === undefined ? 'Thanh toán thành công' : 'Thanh toán bị hủy'}
      </Text>
      {isCanceled === undefined
        ?
        <Text style={styles.subtitle}>
          Hợp đồng sẽ được xử lý trong vòng 72 giờ!
        </Text>
        :
        <>
        </>
      }
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
  subtitle: {
    fontSize: 18,
    marginTop: 16,
    color: '#112D4E',
  },
});