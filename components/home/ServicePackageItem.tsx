// components/home/ServicePackageItem.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ServicePackage } from '../../models/ServicePackage';
import { FormatPriceToVnd } from '../../utils/PriceUtils';
import { useRouter } from 'expo-router';

interface ServicePackageItemProps {
  packageItem: ServicePackage;
}

const ServicePackageItem: React.FC<ServicePackageItemProps> = ({ packageItem }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/ServicePackage/${packageItem.servicePackageId}`);
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={{ uri: packageItem.imageUrl }} style={styles.image} />
      <View style={styles.divider} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{packageItem.name}</Text>
        <Text style={styles.price}>{FormatPriceToVnd(packageItem.priceByDate)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#DBE2EF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // For Android shadow
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  divider: {
    width: 1,
    backgroundColor: '#112D4E',
    marginHorizontal: 8,
  },
  infoContainer: {
    flex: 1,
    alignSelf: 'center'
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#3F72AF',
  },
});

export default ServicePackageItem;
