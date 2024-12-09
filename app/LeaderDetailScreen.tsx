import React, { useCallback } from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { Input, Icon } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import useUser from "../hooks/useUser";

export default function LeaderDetailScreen() {
  const { leaderInfo, fetchUserAndLeader, loading } = useUser();

  useFocusEffect(
    useCallback(() => {
      fetchUserAndLeader();
    }, [])
  );

  if (loading) {
    return <Text>Đang tải dữ liệu...</Text>;
  }

  if (!leaderInfo) {
    return (
      <Text>Chưa có leader</Text>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: leaderInfo.avatarUrl }} style={styles.avatar} />

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Tên đầy đủ</Text>
        <Input
          isReadOnly
          value={leaderInfo.fullName || "Không có thông tin"}
          variant="filled"
          bg="#DBE2EF"
          InputRightElement={<Icon as={FontAwesome} name="user" size="sm" mr={2} color="#6C757D" />}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Số điện thoại</Text>
        <Input
          isReadOnly
          value={leaderInfo.phoneNumber || "Không có thông tin"}
          variant="filled"
          bg="#DBE2EF"
          InputRightElement={<Icon as={FontAwesome} name="phone" size="sm" mr={2} color="#6C757D" />}
        />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Địa chỉ Email</Text>
        <Input
          isReadOnly
          value={leaderInfo.email || "Không có thông tin"}
          variant="filled"
          bg="#DBE2EF"
          InputRightElement={<Icon as={FontAwesome} name="envelope" size="sm" mr={2} color="#6C757D" />}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, alignItems: "center", backgroundColor: "#F9F7F7", padding: 16 },
  avatar: { width: 120, height: 120, borderRadius: 60, marginVertical: 16 },
  fieldContainer: { width: "100%", marginVertical: 10 },
  label: { fontSize: 16, fontWeight: "bold", color: "#112D4E", marginBottom: 4 },
});
