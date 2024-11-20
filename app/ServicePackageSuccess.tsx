// app/ServicePackageSuccess.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import useServicePackages from '../hooks/useServicePackage';
import { useToast } from 'native-base';

export default function ServicePackageSuccess() {
  const { servicePackageId, orderCode, contractId } = useLocalSearchParams();
  const toast = useToast();
  const { finalizePayment } = useServicePackages();

  useEffect(() => {
    if (servicePackageId && orderCode && contractId) {
      handleFinalizePayment();
    } else {
      toast.show({
        description: 'Lỗi: Thiếu thông tin thanh toán!',
        placement: 'top',
        duration: 5000,
      });
    }
  }, [servicePackageId, orderCode, contractId]);

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

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error finalizing payment:', error);
      toast.show({
        description: 'Có lỗi khi hoàn tất thanh toán.',
        placement: 'top',
        duration: 5000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đang xử lý thanh toán...</Text>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});
