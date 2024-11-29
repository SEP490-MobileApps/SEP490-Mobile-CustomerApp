import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useGlobalState } from "../../../contexts/GlobalProvider";
import { formatDate } from "@/utils/formatDate";
import { useFocusEffect } from "@react-navigation/native";
import useProduct from "../../../hooks/useProduct";
import { Divider } from "native-base";
import { Order } from "../../../models/Order"; // Import model
import { Linking } from "react-native"; // Import Linking from react-native
import Lottie from 'lottie-react-native';

export default function OrderTab() {
  const { orderStartDate, orderEndDate, userInfo } = useGlobalState();
  const { orders, fetchOrders, loading } = useProduct();

  useFocusEffect(
    React.useCallback(() => {
      if (userInfo?.accountId) {
        fetchOrders(userInfo.accountId, orderStartDate?.toISOString(), orderEndDate?.toISOString());
      }
    }, [orderStartDate, orderEndDate, userInfo?.accountId])
  );

  // Ensure orders data is correctly unwrapped if nested
  const flatOrders = Array.isArray(orders) && Array.isArray(orders[0]) ? orders[0] : orders;

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
        <Lottie
          source={require('../../../assets/animations/loading.json')} // Đường dẫn tới file animation
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
      </View>
    );
  }

  if (!flatOrders || flatOrders.length === 0) {
    return (
      <Text>Không có sản phẩm</Text>)
  }

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {flatOrders.map((order: Order) => (
        <View key={order.orderId} style={styles.orderCard}>
          <View style={styles.iconContainer}>
            <FontAwesome name="home" size={40} color="#112D4E" />
          </View>
          <Divider orientation="vertical" bg="#112D4E" thickness={1} style={styles.divider} />
          <View style={styles.orderDetails}>
            <Text style={styles.orderDateTitle}>
              Đơn hàng ngày: {order.purchaseTime ? formatDate(order.purchaseTime) : "N/A"}
            </Text>
            <Text style={styles.orderInfo}>
              {order.orderDetails ? order.orderDetails.length : 0} sản phẩm
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL(order.fileUrl)}>
              <Text style={styles.viewInvoice}>Xem chi tiết hóa đơn</Text>
            </TouchableOpacity>
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
    width: 60,
    height: 60,
  },
  divider: {
    height: '100%',
    marginHorizontal: 10,
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
  viewInvoice: {
    fontWeight: "bold",
    color: "#3F72AF",
    textDecorationLine: "underline",
  },
});
