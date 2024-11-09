// app/ServicePackage/[id].tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from 'native-base';
import { FormatPriceToVnd } from '../../utils/PriceUtils';
import useServicePackages from '../../hooks/useServicePackage';

export default function ServicePackageDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { fetchServicePackageDetail, servicePackageDetail, loading } = useServicePackages();

  useEffect(() => {
    if (id) {
      fetchServicePackageDetail(id as string);
    }
  }, [id]);

  if (loading || !servicePackageDetail) {
    return (
      <View style={styles.container}>
        <Text>{loading ? 'Loading...' : 'Gói dịch vụ không tồn tại.'}</Text>
      </View>
    );
  }

  const handleRegisterPress = () => {
    router.push({
      pathname: '/ServicePackageContract',
      params: { packageItem: JSON.stringify(servicePackageDetail) },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: servicePackageDetail.imageUrl }} style={styles.image} />
        <Text style={styles.packageName}>{servicePackageDetail.name}</Text>
        <Text style={styles.packagePrice}>{FormatPriceToVnd(servicePackageDetail.priceByDate)}</Text>
      </View>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Mô tả gói:</Text>
      <Text style={styles.sectionContent}>{servicePackageDetail.description}</Text>

      <Text style={styles.sectionTitle}>Chính sách:</Text>
      <Text style={styles.sectionContent}>{servicePackageDetail.policy}</Text>

      <Button style={styles.registerButton} onPress={handleRegisterPress}>
        ĐĂNG KÝ
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9F7F7',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  packageName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#112D4E',
  },
  packagePrice: {
    fontSize: 18,
    color: '#3F72AF',
  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#112D4E',
    textDecorationLine: 'underline',
  },
  sectionContent: {
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
  },
  servicesList: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  errorText: {
    textAlign: 'center',
    fontSize: 18,
    color: 'red',
  },
  registerButton: {
    backgroundColor: '#3F72AF',
    paddingVertical: 12,
    marginTop: 20,
    borderRadius: 8,
    width: '100%',
  },
});
