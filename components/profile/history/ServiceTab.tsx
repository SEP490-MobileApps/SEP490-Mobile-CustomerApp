import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Box, Divider } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import { useGlobalState } from '@/contexts/GlobalProvider';
import useServicePackages from '@/hooks/useServicePackage';
import { formatDate } from '@/utils/formatDate';
import Lottie from 'lottie-react-native';
import NoData from '@/components/ui/NoData';
import { FormatPriceToVnd } from '@/utils/PriceUtils';

const ServiceTab: React.FC = () => {
  const { fetchCustomerContracts, contracts, loading } = useServicePackages();
  const { userInfo, serviceStartDate, serviceEndDate } = useGlobalState();

  useFocusEffect(
    React.useCallback(() => {
      if (userInfo?.accountId) {
        fetchCustomerContracts(
          userInfo.accountId,
          serviceStartDate?.toISOString().split("T")[0],
          serviceEndDate?.toISOString().split("T")[0]
        );
      }
    }, [userInfo?.accountId, serviceStartDate, serviceEndDate])
  );

  if (loading) {
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

  if (contracts.length === 0) {
    return (
      <NoData />
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {contracts.map(contract => (
        <Box key={contract.contractId} style={styles.cardContainer}>
          <View style={styles.row}>
            <Image source={{ uri: contract.imageUrl }} style={styles.image} />
            <Divider bg="#3F72AF" thickness="2" mx="3" orientation="vertical" />
            <View style={styles.contentContainer}>
              <Text style={styles.name}>{contract.name}</Text>
              <Text style={styles.price}>Giá: {FormatPriceToVnd(contract.priceByDate)}</Text>
              <Text style={styles.purchaseTime}>
                Ngày đăng ký: {formatDate(contract.purchaseTime)}
              </Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(contract.fileUrl)}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Xem hợp đồng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Box>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { paddingVertical: 16 },
  loadingText: { textAlign: 'center', marginTop: 20, fontSize: 16 },
  noDataContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noDataText: { fontSize: 16, color: '#888' },
  cardContainer: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#DBE2EF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  image: { width: 100, height: 100, borderRadius: 8, marginRight: 10 },
  contentContainer: { flex: 1, gap: 3 },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: {
    fontSize: 14,
    color: '#3F72AF',
  },
  purchaseTime: { marginBottom: 5 },
  button: {
    marginTop: 5,
    backgroundColor: '#3F72AF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: { color: '#FFF', textAlign: 'center', fontWeight: 'bold' },
});

export default ServiceTab;
