// app/ProductDetail/[id].tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { FormatPriceToVnd } from '../../utils/PriceUtils';
import useProduct from '../../hooks/useProduct'; // Import useProducts
import { Button } from 'native-base';
import { WebView } from 'react-native-webview'; // Import WebView

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { fetchProductDetail, productDetail, detailLoading } = useProduct();
  const [quantity, setQuantity] = useState(1);

  const handleIncrease = () => setQuantity(quantity + 1);
  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  useEffect(() => {
    if (id) {
      fetchProductDetail(id as string); // Gọi API lấy chi tiết sản phẩm
    }
  }, [id]);

  if (detailLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3F72AF" />
      </View>
    );
  }

  if (!productDetail) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Sản phẩm không tồn tại.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: productDetail.imageUrl }} style={styles.image} />
      <Text style={styles.name}>{productDetail.name}</Text>
      <Text style={styles.price}>{FormatPriceToVnd(productDetail.priceByDate)}</Text>

      {/* Hiển thị mô tả sản phẩm bằng WebView */}
      <Text style={styles.descriptionTitle}>Mô tả sản phẩm</Text>
      <View style={styles.webViewContainer}>
        <WebView
          originWhitelist={['*']}
          source={{ html: productDetail.description }}
          style={styles.webView}
          scalesPageToFit={false}
        />
      </View>

      <Text style={styles.stockText}>Còn hàng: {productDetail.inOfStock}</Text>
      <Text style={styles.warranty}>
        Bảo hành: {productDetail.warantyMonths >= 12 ? `${productDetail.warantyMonths / 12} năm` : `${productDetail.warantyMonths} tháng`}
      </Text>

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
  price: {
    fontSize: 20,
    color: '#3F72AF',
    marginBottom: 8,
  },
  webViewContainer: {
    height: 200, // Chiều cao của WebView, điều chỉnh theo nhu cầu
    marginBottom: 16,
  },
  webView: {
    flex: 1,
  },
  stockText: {
    color: '#3A9B7A',
    marginBottom: 8,
  },
  warranty: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#112D4E',
    marginBottom: 8,
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
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#112D4E',
    marginBottom: 8,
  },
});
