// components/profile/history/ServiceTab.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { servicePackages } from "../../../constants/Datas";
import { useGlobalState } from "../../../contexts/GlobalProvider";
import { formatDate } from "@/utils/formatDate";

export default function ServiceTab() {
  const { serviceStartDate, serviceEndDate } = useGlobalState();

  const filteredPackages = servicePackages.filter((pkg) => {
    if (!serviceStartDate || !serviceEndDate) return true;
    const purchaseDate = new Date(pkg.purchaseTime);
    return purchaseDate >= serviceStartDate && purchaseDate <= serviceEndDate;
  });

  return (
    <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      {filteredPackages.map((pkg) => (
        <View key={pkg.id} style={styles.serviceCard}>
          <View style={styles.serviceInfo}>
            <FontAwesome name="diamond" size={40} color="#FFA500" />
            <View style={styles.serviceDetails}>
              <Text style={styles.packageName}>{pkg.name}</Text>
              <Text style={styles.packagePrice}>{pkg.price} VNĐ</Text>
            </View>
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.dateLabel}>Ngày đăng ký:</Text>
            <Text style={styles.dateValue}>{formatDate(pkg.purchaseTime)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: { paddingVertical: 16 },
  serviceCard: { backgroundColor: "#DBE2EF", padding: 16, marginBottom: 16, borderRadius: 8 },
  serviceInfo: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  serviceDetails: { marginLeft: 16 },
  packageName: { fontSize: 18, fontWeight: "bold" },
  packagePrice: { color: "#3F72AF" },
  dateContainer: {
    flexDirection: "row", // Sắp xếp theo hàng ngang
    justifyContent: "space-between", // Đẩy các phần tử về hai bên
    alignItems: "center", // Căn giữa theo trục dọc
    backgroundColor: "#F9F7F7",
    padding: 8,
    borderRadius: 5,
  },
  dateLabel: { color: "#6C757D" },
  dateValue: { fontWeight: "bold" },
});
