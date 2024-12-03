// app/OrderSuccess.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import LottieView from 'lottie-react-native';
import useProducts from '@/hooks/useProduct';
import { useToast } from 'native-base';


export const unstable_settings = {
  headerShown: false,
};

export default function OrderSuccess() {
  const { orderCode, id1, isCanceled, customerNote } = useLocalSearchParams();
  const { finalizeOrder } = useProducts();
  const toast = useToast();
  const navigation = useNavigation();

  useEffect(() => {

    navigation.setOptions({
      headerShown: false,
    });

    if (isCanceled === undefined) {
      if (orderCode && id1) {
        console.log('thông tin:', orderCode, id1)
        handleFinalizeOrder();
      } else {
        toast.show({
          description: 'Thiếu thông tin đơn hàng.',
          placement: 'top',
          duration: 5000,
        });
        navigateToHome();
      }
    } else {
      navigateToHome();
    }
  }, [orderCode, id1, isCanceled]);

  const handleFinalizeOrder = async () => {
    try {
      await finalizeOrder({
        orderCode: parseInt(orderCode as string, 10),
        id1: id1 as string,
        customerNote: customerNote as string,
      });

      navigateToHistory();
    } catch (error) {
      console.error('Error finalizing order:', error);
      toast.show({
        description: 'Có lỗi khi hoàn tất đơn hàng.',
        placement: 'top',
        duration: 5000,
      });
      navigateToHome();
    }
  };


  const navigateToHome = () => {
    setTimeout(() => {
      router.replace('/(tabs)');
    }, 5000);
  };

  const navigateToHistory = () => {
    setTimeout(() => {
      router.replace({
        pathname: '/HistoryScreen',
        params: { selectedTab: 'order' },
      });
    }, 5000);
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
  }
});
