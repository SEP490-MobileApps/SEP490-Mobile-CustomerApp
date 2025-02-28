import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import LottieView from 'lottie-react-native';
import useProducts from '@/hooks/useProduct';
import { useToast } from 'native-base';
import { saveNotificationToFirestore } from '@/utils/PushNotification';
import { Leader } from '@/models/LeaderInfo';
import { useFocusEffect } from '@react-navigation/native';
import useUser from '@/hooks/useUser';


export const unstable_settings = {
  headerShown: false,
};

export default function OrderSuccess() {
  const { orderCode, id1, isCanceled, customerNote, address } = useLocalSearchParams();
  const { finalizeOrder } = useProducts();
  const { fetchUserAndLeader, leaderInfo } = useUser();
  const toast = useToast();
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      fetchUserAndLeader();
    }, [])
  );

  const savePushNotificationToLeader = async ({ leaderInfo }: { leaderInfo: Leader }) => {

    try {
      await saveNotificationToFirestore(
        {
          title: 'Có một đơn hàng mới',
          body: `${customerNote}`,
          data: { orderId: id1 },
        },
        leaderInfo.accountId
      )

      console.log('Push notification sent successfully!');
    } catch (error) {
      console.error('Lỗi khi gửi push notification:', error);
    }
  }

  useEffect(() => {
    if (orderCode && id1) {
      console.log('log orderCode', orderCode)
      console.log('log id1', id1)
      console.log('log customerNote', customerNote)
      console.log('log address', address)
      if (leaderInfo) {
        console.log('log 2', leaderInfo)
        savePushNotificationToLeader({ leaderInfo });
      }
    }
  }, [orderCode, leaderInfo, id1, customerNote, address])

  useEffect(() => {

    navigation.setOptions({
      headerShown: false,
    });

    if (isCanceled === undefined) {
      console.log('cancel', isCanceled)
      if (orderCode && id1) {
        console.log('thông tin:', orderCode, id1)
        console.log('cusnote order success', customerNote)
        console.log('address order success', address)
        handleFinalizeOrder();
      } else {
        toast.show({
          description: 'Thiếu thông tin đơn hàng.',
          placement: 'top',
          duration: 6000,
        });
        navigateToHome();
      }
    } else {
      navigateToHome();
    }
  }, [orderCode, id1, isCanceled, customerNote]);

  const handleFinalizeOrder = async () => {
    try {
      await finalizeOrder({
        orderCode: parseInt(orderCode as string, 10),
        id1: id1 as string,
        customerNote: customerNote as string,
        address: address as string
      });

      navigateToHistory();
    } catch (error) {
      console.error('Error finalizing order:', error);
      toast.show({
        description: 'Có lỗi khi hoàn tất đơn hàng.',
        placement: 'top',
        duration: 6000,
      });
      navigateToHome();
    }
  };


  const navigateToHome = () => {
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 6000);
  };

  const navigateToHistory = () => {
    setTimeout(() => {
      router.replace({
        pathname: '/HistoryScreen',
        params: { selectedTab: 'order' },
      });
    }, 6000);
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={
          isCanceled === undefined
            ? require('@/assets/animations/payment-success.json')
            : require('@/assets/animations/payment-cancel.json')
        }
        autoPlay
        loop={false}
        style={styles.animation}
        speed={0.5}
      />
      <Text style={styles.title}>
        {isCanceled === undefined ? 'Đơn hàng đã thanh toán' : 'Thanh toán bị hủy'}
      </Text>
      {isCanceled === undefined
        ?
        <Text style={styles.subtitle}>
          Đơn hàng sẽ được xử lý trong vòng 72 giờ
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
  title1: {
    fontSize: 16,
    marginTop: 4,
    color: '#112D4E'
  },
  subtitle: {
    fontSize: 18,
    marginTop: 16,
    color: '#112D4E',
  },
});
