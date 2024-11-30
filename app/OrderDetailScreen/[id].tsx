import React, { useEffect } from "react";
import { View, Text, Button, Modal, StyleSheet, Image } from "react-native";
import { Divider } from "native-base";
import { useLocalSearchParams } from "expo-router";  // Dùng useLocalSearchParams
import useProduct from "@/hooks/useProduct";
import { OrderDetail } from "@/models/OrderDetail";

export default function OrderDetailScreen() {
  // Lấy orderId từ query string với useLocalSearchParams
  const { orderId } = useLocalSearchParams();  // orderId sẽ lấy từ query params

  // Kiểm tra và đảm bảo orderId là string, không phải array
  const orderIdStr = Array.isArray(orderId) ? orderId[0] : orderId;

  const { orderDetail, fetchOrderDetail, loading } = useProduct();
  const [showWarrantyModal, setShowWarrantyModal] = React.useState(false);

  useEffect(() => {
    if (orderIdStr) {
      fetchOrderDetail(orderIdStr);  // Fetch dữ liệu khi có orderId
    }
  }, [orderIdStr]);

  // Nếu đang tải dữ liệu
  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {orderDetail?.products.map((product) => (
        <View key={product.productId} style={styles.productContainer}>
          <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
          <Divider style={styles.divider} />
          <View style={styles.productDetails}>
            <Text>{product.name}</Text>
            <Text>Số lượng: {product.quantity}</Text>
            <Text>Tổng giá: {product.totalPrice}</Text>
            <Button title="Xem thẻ bảo hành" onPress={() => setShowWarrantyModal(true)} />
          </View>
        </View>
      ))}

      {/* <Modal visible={showWarrantyModal} onRequestClose={() => setShowWarrantyModal(false)}>
        <View style={styles.modalContent}>
          <Text>Tên sản phẩm: {product.name}</Text>
          <Text>Mã bảo hành: {product.warrantyCardId}</Text>
          <Text>Ngày bắt đầu: {product.startDate}</Text>
          <Text>Ngày kết thúc: {product.expireDate}</Text>
          <Text>Còn lại: {calculateDaysLeft(product.expireDate)} ngày</Text>
        </View>
      </Modal> */}
    </View>
  );
}

// Hàm tính số ngày còn lại
const calculateDaysLeft = (expireDate: string) => {
  const expiry = new Date(expireDate);
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  productContainer: { flexDirection: "row", marginBottom: 16 },
  productImage: { width: 80, height: 80, marginRight: 16 },
  productDetails: { flex: 1 },
  modalContent: { padding: 20 },
  divider: { marginVertical: 8 },
});
