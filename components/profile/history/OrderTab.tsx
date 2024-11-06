// components/profile/history/OrderTab.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { orders } from "../../../constants/Datas";
import { useGlobalState } from "../../../contexts/GlobalProvider";
import { formatDate } from "@/utils/formatDate";

export default function OrderTab() {
  const { orderStartDate, orderEndDate } = useGlobalState();

  const filteredOrders = orders.filter((order) => {
    if (!orderStartDate || !orderEndDate) return true;
    const purchaseDate = new Date(order.purchaseTime);
    return purchaseDate >= orderStartDate && purchaseDate <= orderEndDate;
  });

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {filteredOrders.map((order) => (
        <View key={order.id.toString()} style={styles.orderCard}>
          <View style={styles.iconContainer}>
            <FontAwesome name="home" size={40} color="#112D4E" />
          </View>
          <View style={styles.orderDetails}>
            <Text style={styles.orderDateTitle}>Đơn hàng ngày: {formatDate(order.purchaseTime)}</Text>
            <Text style={styles.orderInfo}>{order.productCount.toString()} sản phẩm</Text>
            <Text style={styles.orderPrice}>{order.price.toString()} VNĐ</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: { paddingVertical: 16 },
  orderCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#112D4E",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    width: 60,  // Đặt chiều rộng cố định để căn giữa icon
    height: 60, // Đặt chiều cao cố định để căn giữa icon
  },
  orderDetails: {
    flex: 1,
  },
  orderDateTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#112D4E",
    marginBottom: 4,
  },
  orderInfo: {
    color: "#6C757D",
    marginBottom: 4,
  },
  orderPrice: {
    fontWeight: "bold",
    color: "#112D4E",
  },
});
