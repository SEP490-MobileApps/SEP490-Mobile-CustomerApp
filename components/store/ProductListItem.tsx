import React from 'react';
import { Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Product } from '@/models/Product';
import { FormatPriceToVnd } from '@/utils/PriceUtils';
import { Divider } from 'native-base';
import { useRouter } from 'expo-router';

interface ProductListItemProps {
  product: Product;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/ProductDetail/${product.productId}`);
  };

  const getShortName = (name: string) => (name.length > 20 ? `${name.substring(0, 17)}...` : name);

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <Image source={{ uri: product.imageUrl }} style={styles.image} />
      <Divider my="2" bg="#112D4E" />
      <Text style={styles.name}>{getShortName(product.name)}</Text>
      <Text style={styles.price}>{FormatPriceToVnd(product.priceByDate)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: '#DBE2EF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'center'
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#112D4E',
  },
  price: {
    fontSize: 14,
    color: '#3F72AF',
    marginTop: 5,
  },
  warranty: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
});

export default ProductListItem;
