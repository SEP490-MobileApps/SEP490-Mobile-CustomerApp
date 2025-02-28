import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import ServiceTab from "@/components/profile/history/ServiceTab";
import OrderTab from "@/components/profile/history/OrderTab";
import DateRangePicker from "@/components/profile/history/DateRangePicker";
import { useDisclose } from "native-base";
import { useGlobalState } from "@/contexts/GlobalProvider";
import { useLocalSearchParams } from 'expo-router';

export default function HistoryScreen() {
  const { selectedTab: initialTab } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState<"service" | "order">(
    initialTab === "order" ? "order" : "service"
  );
  const { isOpen, onOpen, onClose } = useDisclose();
  const { userInfo, setServiceStartDate, setServiceEndDate, setOrderStartDate, setOrderEndDate } =
    useGlobalState();

  useEffect(() => {
    return () => {
      setServiceStartDate(null);
      setServiceEndDate(null);
      setOrderStartDate(null);
      setOrderEndDate(null);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "service" && styles.selectedTab]}
          onPress={() => setSelectedTab("service")}
        >
          <Text style={[styles.tabText, selectedTab === "service" && styles.selectedTabText]}>
            Gói dịch vụ
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "order" && styles.selectedTab]}
          onPress={() => setSelectedTab("order")}
        >
          <Text style={[styles.tabText, selectedTab === "order" && styles.selectedTabText]}>
            Đơn hàng
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onOpen} style={styles.filterButton}>
        <FontAwesome name="filter" size={20} color="#FFF" style={styles.filterIcon} />
        <Text style={styles.filterButtonText}>Bộ Lọc</Text>
      </TouchableOpacity>

      <DateRangePicker isOpen={isOpen} onClose={onClose} selectedTab={selectedTab} />

      {selectedTab === "service" ? (
        <ServiceTab />
      ) : (
        <OrderTab />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#F9F7F7" },
  tabContainer: { flexDirection: "row", marginBottom: 16 },
  tab: { flex: 1, padding: 12, backgroundColor: "#DBE2EF", alignItems: "center" },
  selectedTab: { backgroundColor: "#3F72AF" },
  tabText: { color: "#112D4E", fontWeight: "bold" },
  selectedTabText: { color: "#F9F7F7", fontWeight: "bold" },
  filterButton: {
    alignSelf: "flex-end",
    backgroundColor: "#3F72AF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  filterIcon: { marginRight: 8 },
  filterButtonText: { color: "#FFF" },
});
