// app/ServicePackageContract.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button, useDisclose } from 'native-base';
import { useLocalSearchParams } from 'expo-router';
import useServicePackages from '../hooks/useServicePackage';
import PaymentMethodModal from '../components/home/PaymentMethodModal';

export default function ServicePackageContract() {
  const { packageItem } = useLocalSearchParams();
  const { createDraftContract, draftContract, loading } = useServicePackages();
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const { isOpen, onOpen, onClose } = useDisclose();

  useEffect(() => {
    if (packageItem) {
      const packageData = JSON.parse(packageItem as string);
      createDraftContract(packageData.servicePackageId); // Tạo hợp đồng nháp
    }
  }, [packageItem]);

  if (loading || !draftContract) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{draftContract.header}</Text>
      <Text style={styles.date}>{draftContract.date}</Text>

      {/* Hiển thị thông tin bên A */}
      <View style={styles.section}>
        <Text>{draftContract.side_A.a}</Text>
        <Text>{draftContract.side_A.businessName}</Text>
        <Text>{draftContract.side_A.apartmentName}</Text>
        <Text>{draftContract.side_A.address}</Text>
        <Text>{draftContract.side_A.phoneNumber}</Text>
        <Text>{draftContract.side_A.email}</Text>
        <Text>{draftContract.side_A.role}</Text>
      </View>

      {/* Hiển thị thông tin bên B */}
      <View style={styles.section}>
        <Text>{draftContract.side_B.b}</Text>
        <Text>{draftContract.side_B.userName}</Text>
        <Text>{draftContract.side_B.apartmentName}</Text>
        <Text>{draftContract.side_B.phoneNumber}</Text>
        <Text>{draftContract.side_B.email}</Text>
        <Text>{draftContract.side_B.role}</Text>
      </View>

      {/* Hiển thị các điều khoản của hợp đồng */}
      <View style={styles.section}>
        <Text>{draftContract.clause1.title1}</Text>
        <Text>{`Dịch vụ: ${draftContract.clause1.name}`}</Text>
        <Text>{`Số lượng yêu cầu: ${draftContract.clause1.numOfRequest}`}</Text>
        <Text>{`Giá theo ngày: ${draftContract.clause1.priceByDate}`}</Text>
        <Text>{`Tổng giá trị: ${draftContract.clause1.totalPrice}`}</Text>
      </View>

      <View style={styles.section}>
        <Text>{draftContract.clause2.title2}</Text>
        <Text>{draftContract.clause2.policy}</Text>
      </View>

      <View style={styles.section}>
        <Text>{draftContract.clause3.title3}</Text>
        <Text>{draftContract.clause3.rule}</Text>
      </View>

      <View style={styles.section}>
        <Text>{draftContract.clause4.title4}</Text>
        <Text>{draftContract.clause4.generalTerms}</Text>
      </View>

      {/* Chữ ký của hai bên */}
      <View style={styles.section}>
        <Text>{draftContract.signature_A.a}</Text>
        <Text>{draftContract.signature_A.sign}</Text>
      </View>
      <View style={styles.section}>
        <Text>{draftContract.signature_B.b}</Text>
        <Text>{draftContract.signature_B.sign}</Text>
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
  },
  date: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  registerButton: {
    backgroundColor: '#3F72AF',
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 8,
    width: '100%',
  },
});

