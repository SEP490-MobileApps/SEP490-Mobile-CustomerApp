// components/store/ProductListItem.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Product } from '../../models/Product';
import { FormatPriceToVnd } from '../../utils/PriceUtils';
import { Divider } from 'native-base';

interface ProductListItemProps {
  product: Product;
  onPress: () => void;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product, onPress }) => {
  const getShortName = (name: string) => (name.length > 20 ? `${name.substring(0, 17)}...` : name);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={{ uri: product.ImageUrl }} style={styles.image} />
      <Divider my="2" bg="#112D4E" />
      <Text style={styles.name}>{getShortName(product.Name)}</Text>
      <Text style={styles.price}>{FormatPriceToVnd(product.Price)}</Text>
      <Text style={styles.warranty}>
        {product.WarrantyMonths >= 12
          ? `${product.WarrantyMonths / 12} năm bảo hành`
          : `${product.WarrantyMonths} tháng bảo hành`}
      </Text>
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
