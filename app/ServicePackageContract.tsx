// app/ServicePackageContract.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { Input, Icon, Button, useDisclose } from 'native-base';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { FormatPriceToVnd } from '../utils/PriceUtils';
import PaymentMethodModal from '../components/home/PaymentMethodModal';

export default function ServicePackageContract() {
  const router = useRouter();
  const { packageItem } = useLocalSearchParams();
  const packageData = JSON.parse(packageItem as string);

  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const { isOpen, onOpen, onClose } = useDisclose();

  // Thông tin cá nhân (được truyền từ mock dữ liệu)
  const user = {
    fullName: 'Võ Hoàng Vũ',
    dateOfBirth: '18/02/2003',
    phoneNumber: '0898901823',
    email: 'vu@gmail.com',
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Section: Thông tin cá nhân */}
      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Tên đầy đủ:</Text>
          <Input
            defaultValue={user.fullName}
            bg="#DBE2EF"
            InputRightElement={<Icon as={FontAwesome} name="user" size="sm" mr={3} />}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Ngày sinh:</Text>
          <Input
            defaultValue={user.dateOfBirth}
            bg="#DBE2EF"
            InputRightElement={<Icon as={FontAwesome} name="calendar" size="sm" mr={3} />}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Số điện thoại:</Text>
          <Input
            defaultValue={user.phoneNumber}
            bg="#DBE2EF"
            InputRightElement={<Icon as={FontAwesome} name="phone" size="sm" mr={3} />}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Địa chỉ Email:</Text>
          <Input
            defaultValue={user.email}
            bg="#DBE2EF"
            InputRightElement={<Icon as={FontAwesome} name="envelope" size="sm" mr={3} />}
          />
        </View>
      </View>

      {/* Section: Thông tin gói dịch vụ */}
      <View style={styles.section}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Thông tin gói dịch vụ</Text>
        </View>
        <View style={styles.packageHeader}>
          <Image source={packageData.imageUrl} style={styles.packageImage} />
          <Text style={styles.packageName}>{packageData.name}</Text>
          <Text style={styles.packagePrice}>{FormatPriceToVnd(packageData.price)}</Text>
        </View>
        <View style={styles.divider} />

        <Text style={styles.infoTitle}>Mô tả gói:</Text>
        <Text style={styles.infoContent}>{packageData.description}</Text>

        <Text style={styles.infoTitle}>Chính sách:</Text>
        <Text style={styles.infoContent}>{packageData.policy}</Text>

        <Text style={styles.infoTitle}>Danh sách các dịch vụ sửa chữa gói:</Text>
        <Text style={styles.infoContent}>{packageData.servicesList}</Text>
      </View>

      {/* Nút Xác Nhận Thanh Toán */}
      <Button style={styles.confirmButton} onPress={onOpen}>
        XÁC NHẬN THANH TOÁN
      </Button>

      {/* Modal Chọn Phương Thức Thanh Toán */}
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
  section: {
    marginBottom: 24,
  },
  sectionTitleContainer: {
    backgroundColor: '#DBE2EF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#112D4E',
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: '#112D4E',
    marginBottom: 5,
  },
  packageHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  packageImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 10,
  },
  packageName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#112D4E',
  },
  packagePrice: {
    fontSize: 16,
    color: '#3F72AF',
  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    marginVertical: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#112D4E',
  },
  infoContent: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
    lineHeight: 20,
  },
  confirmButton: {
    backgroundColor: '#3F72AF',
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 8,
    width: '100%',
  },
});
