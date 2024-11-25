// app/ServicePackageContract.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Button, useDisclose, useToast } from 'native-base';
import { useLocalSearchParams } from 'expo-router';
import useServicePackages from '../hooks/useServicePackage';
import PaymentMethodModal from '../components/home/PaymentMethodModal';
import { useRouter } from 'expo-router';
import Lottie from 'lottie-react-native';

export default function ServicePackageContract() {
  const { packageItem } = useLocalSearchParams();
  const { createDraftContract, handlePaymentMethod, draftContract, loading } = useServicePackages();
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [packageData, setPackageData] = useState<any | null>(null);
  const { isOpen, onOpen, onClose } = useDisclose();
  const toast = useToast();
  const router = useRouter();

  // Lấy dữ liệu từ packageItem và tạo hợp đồng nháp
  useEffect(() => {
    if (packageItem) {
      const parsedPackageData = JSON.parse(packageItem as string);
      setPackageData(parsedPackageData); // Lưu lại packageData
      createDraftContract(parsedPackageData.servicePackageId); // Tạo hợp đồng nháp
    }
  }, [packageItem]);

  // Xử lý thanh toán
  const handlePayment = async () => {
    if (!packageData?.servicePackageId) {
      console.error('Missing servicePackageId in packageData');
      return;
    }

    try {
      const isOnlinePayment = paymentMethod === 'payos';
      console.log('Calling handlePaymentMethod with:', packageData.servicePackageId, isOnlinePayment);

      const result = await handlePaymentMethod(packageData.servicePackageId, isOnlinePayment); // Sử dụng packageData.servicePackageId

      if (result.type === 'link') {
        onClose();
        Linking.openURL(result.data); // Mở link thanh toán
      } else if (result.type === 'message') {
        onClose();
        router.replace("/(tabs)");
        toast.show({
          description: result.data, // Hiển thị thông báo từ API
          placement: 'top',
          duration: 5000,
        });
      }
    } catch (error) {
      toast.show({
        description: 'Có lỗi xảy ra khi xử lý thanh toán.',
        placement: 'top',
        duration: 5000,
      });
      console.error('Error in handlePayment:', error);
    }
  };

  if (loading || !draftContract) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
        <Lottie
          source={require('../assets/animations/loading.json')} // Đường dẫn tới file animation
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { paddingHorizontal: 16 }]}>
      <Text style={styles.header}>{draftContract.header}</Text>
      <Text style={styles.date}>{draftContract.date}</Text>

      {/* Hiển thị thông tin bên A */}
      <View style={styles.section}>
        <Text style={styles.text}>{draftContract.side_A.a}</Text>
        <Text style={styles.text}>{draftContract.side_A.businessName}</Text>
        <Text style={styles.text}>{draftContract.side_A.apartmentName}</Text>
        <Text style={styles.text}>{draftContract.side_A.address}</Text>
        <Text style={styles.text}>{draftContract.side_A.phoneNumber}</Text>
        <Text style={styles.text}>{draftContract.side_A.email}</Text>
        <Text style={styles.text}>{draftContract.side_A.role}</Text>
      </View>

      {/* Hiển thị thông tin bên B */}
      <View style={styles.section}>
        <Text style={styles.text}>{draftContract.side_B.b}</Text>
        <Text style={styles.text}>{draftContract.side_B.userName}</Text>
        <Text style={styles.text}>{draftContract.side_B.apartmentName}</Text>
        <Text style={styles.text}>{draftContract.side_B.phoneNumber}</Text>
        <Text style={styles.text}>{draftContract.side_B.email}</Text>
        <Text style={styles.text}>{draftContract.side_B.role}</Text>
      </View>

      {/* Hiển thị các điều khoản */}
      <View style={styles.section}>
        <Text style={styles.text}>{draftContract.clause1.title1}</Text>
        <Text style={styles.text}>{`Dịch vụ: ${draftContract.clause1.name}`}</Text>
        <Text style={styles.text}>{`Số lượng yêu cầu: ${draftContract.clause1.numOfRequest}`}</Text>
        <Text style={styles.text}>{`Giá theo ngày: ${draftContract.clause1.priceByDate}`}</Text>
        <Text style={styles.text}>{`Tổng giá trị: ${draftContract.clause1.totalPrice}`}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>{draftContract.clause2.title2}</Text>
        <Text style={styles.text}>{draftContract.clause2.policy}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>{draftContract.clause3.title3}</Text>
        <Text style={styles.text}>{draftContract.clause3.rule}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>{draftContract.clause4.title4}</Text>
        <Text style={styles.text}>{draftContract.clause4.generalTerms}</Text>
      </View>

      {/* Chữ ký của hai bên */}
      <View style={styles.section}>
        <Text style={styles.text}>{draftContract.signature_A.a}</Text>
        <Text style={styles.text}>{draftContract.signature_A.sign}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.text}>{draftContract.signature_B.b}</Text>
        <Text style={styles.text}>{draftContract.signature_B.sign}</Text>
      </View>

      {/* Nút đăng ký hợp đồng và chọn phương thức thanh toán */}
      <Button style={styles.registerButton} onPress={onOpen}>
        ĐĂNG KÝ
      </Button>

      {/* Modal chọn phương thức thanh toán */}
      <PaymentMethodModal
        isOpen={isOpen}
        onClose={onClose}
        selectedMethod={paymentMethod}
        setSelectedMethod={setPaymentMethod}
        handleConfirm={handlePayment} // Đảm bảo truyền đúng prop này
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9F7F7',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 30, // Tăng khoảng cách dòng
  },
  date: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'justify',
  },
  registerButton: {
    backgroundColor: '#3F72AF',
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 8,
    width: '100%',
  },
});
