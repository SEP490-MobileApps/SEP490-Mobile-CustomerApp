// components/home/ServicePackages.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { servicePackages } from '../../constants/Datas';
import { ServicePackage } from '../../models/ServicePackage';
import CustomButton from '../ui/CustomButton';
import { FormatPriceToVnd } from '../../utils/PriceUtils'; // Import FormatPriceToVnd
import { useRouter } from 'expo-router';

function ServicePackages(): React.JSX.Element {
  const router = useRouter();

  const handleServicePackagePress = (id: string) => {
    router.push(`/ServicePackage/${id}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TẤT CẢ CÁC GÓI DỊCH VỤ</Text>
      {servicePackages.map((packageItem: ServicePackage) => (
        <View key={packageItem.id} style={styles.packageContainer}>
          <Image source={packageItem.imageUrl} style={styles.packageImage} />
          <View style={styles.packageInfo}>
            <Text style={styles.packageName}>{packageItem.name}</Text>
            <Text style={styles.packagePrice}>
              {FormatPriceToVnd(packageItem.price)} {/* Apply FormatPriceToVnd */}
            </Text>
          </View>
          <CustomButton
            title="Chi Tiết"
            onPress={() => handleServicePackagePress(packageItem.id)}
            variant="secondary"
            style={styles.detailButton}
            textStyle={styles.detailButtonText}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#112D4E',
    marginBottom: 10,
  },
  packageContainer: {
    backgroundColor: '#DBE2EF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 16,
  },
  packageInfo: {
    flex: 1,
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  packagePrice: {
    fontSize: 14,
    color: '#3F72AF',
  },
  detailButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  detailButtonText: {
    color: '#5185C0',
    textDecorationLine: 'underline',
  },
});

export default ServicePackages;
