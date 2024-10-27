// app/ProductDetail/[id].tsx
import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FormatPriceToVnd } from '../../utils/PriceUtils';
import { products } from '../../constants/Datas';
import { Divider, Button } from 'native-base';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((item) => item.ProductId === id);

  if (!product) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Sản phẩm không tồn tại.</Text>
      </View>
    );
  }

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: product.ImageUrl }} style={styles.image} />
      <Divider my={2} bg="#000" />

      <Text style={styles.name}>{product.Name}</Text>

      <View style={styles.priceStockContainer}>
        <Text style={styles.price}>{FormatPriceToVnd(product.Price)}</Text>
        <View style={styles.stockContainer}>
          <Text style={styles.stockText}>Còn hàng: {product.In_Of_Stock}</Text>
        </View>
      </View>

      <Text style={styles.descriptionTitle}>Mô tả sản phẩm</Text>
      <Text style={styles.description}>{product.Description}</Text>

      {/* Cập nhật bảo hành */}
      <Text style={styles.warranty}>
        Bảo hành:{" "}
        <Text style={styles.warrantyValue}>
          {product.WarrantyMonths >= 12
            ? `${product.WarrantyMonths / 12} năm`
            : `${product.WarrantyMonths} tháng`}
        </Text>
      </Text>

      <Divider my={2} bg="#000" />

      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.quantityButton} onPress={handleDecrease}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{quantity}</Text>
        <TouchableOpacity style={styles.quantityButton} onPress={handleIncrease}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <Button style={styles.addToCartButton}>Thêm vào giỏ hàng</Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F9F7F7',
    flex: 1,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#112D4E',
    marginBottom: 8,
  },
  priceStockContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#3F72AF',
  },
  stockContainer: {
    backgroundColor: '#EEFAF6',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  stockText: {
    color: '#3A9B7A',
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#333',
    marginBottom: 5,
  },
  description: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  warranty: {
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#112D4E',
    marginBottom: 8,
  },
  warrantyValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#112D4E',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  quantityButton: {
    width: 40,
    height: 40,
    backgroundColor: '#DBE2EF',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  quantityButtonText: {
    fontSize: 18,
    color: '#112D4E',
  },
  quantity: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 16,
  },
  addToCartButton: {
    backgroundColor: '#3F72AF',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});
