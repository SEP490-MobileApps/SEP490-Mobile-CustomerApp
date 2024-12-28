import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Box, Button, useDisclose, useToast } from 'native-base';
import { useLocalSearchParams } from 'expo-router';
import useServicePackages from '@/hooks/useServicePackage';
import PaymentMethodModal from '@/components/home/PaymentMethodModal';
import { useRouter } from 'expo-router';
import Lottie from 'lottie-react-native';
import LottieView from 'lottie-react-native';

export default function ServicePackageContract() {
  const { packageItem } = useLocalSearchParams();
  const { createDraftContract, handlePaymentMethod, draftContract, loading } = useServicePackages();
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [packageData, setPackageData] = useState<any | null>(null);
  const { isOpen, onOpen, onClose } = useDisclose();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (packageItem) {
      const parsedPackageData = JSON.parse(packageItem as string);
      setPackageData(parsedPackageData);
      createDraftContract(parsedPackageData.servicePackageId);
    }
  }, [packageItem]);

  const handlePayment = async () => {
    if (!packageData?.servicePackageId) {
      console.error('Missing servicePackageId in packageData');
      return;
    }

    try {
      const isOnlinePayment = paymentMethod === 'payos';
      console.log('Calling handlePaymentMethod with:', packageData.servicePackageId, isOnlinePayment);

      const result = await handlePaymentMethod(packageData.servicePackageId, isOnlinePayment);

      if (result.type === 'link') {
        onClose();
        Linking.openURL(result.data);
      } else if (result.type === 'message') {
        onClose();
        router.push("/(tabs)");
        toast.show({
          duration: 3800,
          placement: 'top',
          render: () => {
            return <Box
              borderTopColor='#16a34a'
              borderTopWidth={5} bg="#bbf7d0"
              alignSelf='center'
              px="2"
              py="1"
              rounded="sm"
              mb={5}
              style={{ flexDirection: 'column', width: '98%', justifyContent: 'center' }}
            >
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#bbf7d0',
                marginHorizontal: 30,
                flexDirection: 'row'
              }}>
                <LottieView
                  source={require('@/assets/animations/success.json')}
                  autoPlay
                  loop
                  style={{ width: 52, height: 52 }}
                />
                <Text
                  style={{
                    fontSize: 18,
                    color: '#112D4E',
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}>
                  Thanh toán thành công!
                </Text>
              </View>
              <View >
                <Text
                  style={{
                    fontSize: 14,
                    color: '#112D4E',
                    textAlign: 'center',
                    marginBottom: 12,
                    marginHorizontal: 12
                  }}>
                  {result.data}
                </Text>
              </View>
            </Box>;
          }
        });
      }
    } catch (error) {
      toast.show({
        duration: 3800,
        placement: 'top',
        render: () => {
          return <Box
            borderTopColor='#dc2626'
            borderTopWidth={5} bg="#fecaca"
            alignSelf='center'
            px="2"
            py="1"
            rounded="sm"
            mb={5}
            style={{ flexDirection: 'column', width: '98%', justifyContent: 'center' }}
          >
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#fecaca',
              marginHorizontal: 30,
              flexDirection: 'row'
            }}>
              <LottieView
                source={require('@/assets/animations/error.json')}
                autoPlay
                loop
                style={{ width: 52, height: 52 }}
              />
              <Text
                style={{
                  fontSize: 18,
                  color: '#112D4E',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                Thanh toán thất bại!
              </Text>
            </View>
            <View >
              <Text
                style={{
                  fontSize: 14,
                  color: '#112D4E',
                  textAlign: 'center',
                  marginBottom: 12,
                  marginHorizontal: 12
                }}>
                Có lỗi xảy ra khi thanh toán.
              </Text>
            </View>
          </Box>;
        }
      });
      console.error('Error in handlePayment:', error);
    }
  };

  if (loading || !draftContract) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
        <Lottie
          source={require('@/assets/animations/loading.json')}
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

      <View style={styles.section}>
        <Text style={styles.text}>{draftContract.side_A.a}</Text>
        <Text style={styles.text}>{draftContract.side_A.businessName}</Text>
        <Text style={styles.text}>{draftContract.side_A.apartmentName}</Text>
        <Text style={styles.text}>{draftContract.side_A.address}</Text>
        <Text style={styles.text}>{draftContract.side_A.phoneNumber}</Text>
        <Text style={styles.text}>{draftContract.side_A.email}</Text>
        <Text style={styles.text}>{draftContract.side_A.role}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.text}>{draftContract.side_B.b}</Text>
        <Text style={styles.text}>{draftContract.side_B.userName}</Text>
        <Text style={styles.text}>{draftContract.side_B.apartmentName}</Text>
        <Text style={styles.text}>{draftContract.side_B.address}</Text>
        <Text style={styles.text}>{draftContract.side_B.roomIds}</Text>
        <Text style={styles.text}>{draftContract.side_B.phoneNumber}</Text>
        <Text style={styles.text}>{draftContract.side_B.email}</Text>
        <Text style={styles.text}>{draftContract.side_B.role}</Text>
      </View>

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

      <View style={styles.section1}>
        <View >
          <Text style={styles.text}>{draftContract.signature_A.a}</Text>
          <Text style={styles.text}>{draftContract.signature_A.sign}</Text>
        </View>
        <View >
          <Text style={styles.text}>{draftContract.signature_B.b}</Text>
          <Text style={styles.text}>{draftContract.signature_B.sign}</Text>
        </View>
      </View>

      <Button style={styles.registerButton} onPress={onOpen}>
        XÁC NHẬN THANH TOÁN
      </Button>



      <PaymentMethodModal
        isOpen={isOpen}
        onClose={onClose}
        selectedMethod={paymentMethod}
        setSelectedMethod={setPaymentMethod}
        handleConfirm={handlePayment}
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    lineHeight: 30
  },
  date: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  section1: {
    marginBottom: 24,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 14,
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
