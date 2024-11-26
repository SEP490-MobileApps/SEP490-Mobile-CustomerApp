// app/PendingContractScreen.tsx
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'native-base';
import Lottie from 'lottie-react-native';
import NoDataComponent from '@/components/ui/NoDataComponent';
import useServicePackages from '@/hooks/useServicePackage';
import PendingContractCard from '@/components/home/PendingContractCard';

export default function PendingContractScreen() {
  const { fetchPendingContracts, pendingContracts, loading } = useServicePackages();
  const [customerContracts, setCustomerContracts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch pending contracts from API
    fetchPendingContracts()
      .then((contracts) => setCustomerContracts(contracts))
      .catch((err) => console.error('Failed to fetch contracts', err));
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Lottie
              source={require('../assets/animations/loading.json')} // Đường dẫn tới animation
              autoPlay
              loop
              style={styles.loadingAnimation}
            />
          </View>
        ) : customerContracts.length === 0 ? (
          <NoDataComponent
            imageUrl={require('../assets/images/no-contract.png')}
            title="Không có hợp đồng"
            description="Hiện tại bạn không có hợp đồng nào đang chờ xử lý."
          />
        ) : (
          customerContracts.map((contract) => (
            <PendingContractCard key={contract.contractId} contract={contract} />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F7F7',
  },
  scrollContent: {
    padding: 16,
    backgroundColor: '#F9F7F7',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#112D4E',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingAnimation: {
    width: 150,
    height: 150,
  },
});
