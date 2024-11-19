import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Box } from 'native-base';
import { useFocusEffect } from '@react-navigation/native';
import { useGlobalState } from '@/contexts/GlobalProvider';
import useServicePackages from '@/hooks/useServicePackage';
import { formatDate } from '@/utils/formatDate';

const ServiceTab: React.FC = () => {
  const { fetchCustomerContracts, contracts, loading } = useServicePackages();
  const { userInfo, serviceStartDate, serviceEndDate } = useGlobalState();

  useFocusEffect(
    React.useCallback(() => {
      if (userInfo?.accountId) {
        fetchCustomerContracts(
          userInfo.accountId,
          serviceStartDate?.toISOString(),
          serviceEndDate?.toISOString()
        );
      }
    }, [userInfo?.accountId, serviceStartDate, serviceEndDate])
  );

  if (loading) {
    return <Text style={styles.loadingText}>Đang tải dữ liệu hợp đồng...</Text>;
  }

  if (contracts.length === 0) {
    return (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>Không có hợp đồng nào.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
      {contracts.map(contract => (
        <Box key={contract.contractId} style={styles.cardContainer}>
          <View style={styles.row}>
            <Image source={{ uri: contract.imageUrl }} style={styles.image} />
            <View style={styles.contentContainer}>
              <Text style={styles.name}>{contract.name}</Text>
              <Text style={styles.price}>Giá: {contract.priceByDate} VND</Text>
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
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  image: { width: 100, height: 100, borderRadius: 8, marginRight: 10 },
  contentContainer: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, color: '#888' },
  purchaseTime: { fontSize: 12, marginBottom: 5 },
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
