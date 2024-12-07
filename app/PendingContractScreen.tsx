import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Lottie from 'lottie-react-native';
import useServicePackages from '@/hooks/useServicePackage';
import PendingContractCard from '@/components/home/PendingContractCard';
import NoData from '@/components/ui/NoData';

export default function PendingContractScreen() {
  const { fetchPendingContracts, pendingContracts, loading } = useServicePackages();
  const [customerContracts, setCustomerContracts] = useState<any[]>([]);

  useEffect(() => {
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
              source={require('@/assets/animations/loading.json')}
              autoPlay
              loop
              style={styles.loadingAnimation}
            />
          </View>
        ) : customerContracts.length === 0 ? (
          (
            <View style={{ marginTop: 200 }}>
              <NoData />
            </View>
          )

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
    width: 200,
    height: 200,
    marginTop: 300,
  },
});
