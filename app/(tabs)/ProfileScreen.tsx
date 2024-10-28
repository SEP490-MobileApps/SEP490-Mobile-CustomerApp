// app/(tabs)/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Personal Info */}
      <View style={styles.personalInfoContainer}>
        <Image
          source={{ uri: 'https://cdn-icons-png.flaticon.com/512/219/219983.png' }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Võ Hoàng Vũ</Text>
        <Text style={styles.profileEmail}>vuvhse172148@fpt.edu.vn</Text>
      </View>

      {/* Section: Thông tin chung */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>THÔNG TIN CHUNG</Text>
      </View>
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.optionContainer} onPress={() => router.push("/EditProfileScreen")}>
          <FontAwesome name="edit" size={24} color="#112D4E" />
          <Text style={styles.optionText}>Thông tin cá nhân chi tiết</Text>
          <MaterialIcons name="navigate-next" size={24} color="#112D4E" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer}>
          <FontAwesome name="history" size={24} color="#112D4E" />
          <Text style={styles.optionText}>Lịch sử</Text>
          <MaterialIcons name="navigate-next" size={24} color="#112D4E" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer}>
          <FontAwesome name="user" size={24} color="#112D4E" />
          <Text style={styles.optionText}>Coi thông tin Leader</Text>
          <MaterialIcons name="navigate-next" size={24} color="#112D4E" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer}>
          <FontAwesome name="file-text" size={24} color="#112D4E" />
          <Text style={styles.optionText}>Hợp đồng của tôi</Text>
          <MaterialIcons name="navigate-next" size={24} color="#112D4E" />
        </TouchableOpacity>
      </View>

      {/* Section: Về ứng dụng */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>VỀ ỨNG DỤNG</Text>
      </View>
      <View style={styles.sectionContainer}>
        <TouchableOpacity style={styles.optionContainer}>
          <FontAwesome name="shield" size={24} color="#112D4E" />
          <Text style={styles.optionText}>Chính sách bảo mật</Text>
          <MaterialIcons name="navigate-next" size={24} color="#112D4E" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer}>
          <FontAwesome name="file" size={24} color="#112D4E" />
          <Text style={styles.optionText}>Điều khoản và điều kiện</Text>
          <MaterialIcons name="navigate-next" size={24} color="#112D4E" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionContainer}>
          <FontAwesome name="info-circle" size={24} color="#112D4E" />
          <Text style={styles.optionText}>Giới thiệu</Text>
          <MaterialIcons name="navigate-next" size={24} color="#112D4E" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>ĐĂNG XUẤT</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F7F7' },
  personalInfoContainer: { alignItems: 'center', paddingVertical: 24 },
  profileImage: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#112D4E' },
  profileEmail: { fontSize: 14, color: '#6C757D' },
  sectionHeader: { backgroundColor: '#DBE2EF', paddingVertical: 8, paddingHorizontal: 16 },
  sectionTitle: { color: '#112D4E', fontWeight: 'bold', fontSize: 14 },
  sectionContainer: { backgroundColor: '#F9F7F7', paddingVertical: 8 },
  optionContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: '#DBE2EF' },
  optionText: { flex: 1, marginLeft: 16, fontSize: 16, color: '#112D4E' },
  logoutButton: { backgroundColor: '#3F72AF', margin: 16, paddingVertical: 12, borderRadius: 8, alignItems: 'center' },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
