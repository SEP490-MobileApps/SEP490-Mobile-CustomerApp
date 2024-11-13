// app/(tabs)/ProfileScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome, MaterialIcons, Fontisto } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Divider, useToast } from 'native-base';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import SignOutModal from '../../components/profile/SignOutModal';
import { useAuth } from '../../hooks/useAuth';
import useUser from '../../hooks/useUser';

export default function ProfileScreen() {
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { handleLogout } = useAuth();
  const { user, updateUserAvatar, loading } = useUser();

  const handleSignOut = async () => {
    await handleLogout();
    toast.show({
      description: "Đã đăng xuất thành công",
      duration: 3000,
    });
  };

  const handleAddOrEditImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Cần quyền truy cập thư viện ảnh để thay đổi ảnh đại diện.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImageUri = result.assets[0].uri;
      console.log('Selected Image URI:', selectedImageUri); // Kiểm tra URI ảnh được chọn
      await updateUserAvatar(selectedImageUri);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header Section with Cover Image */}
        <View style={styles.coverContainer}>
          <Image
            source={require('../../assets/images/home.png')}
            style={styles.coverImage}
          />
          <View style={styles.avatarContainer}>
            <Image
              source={user?.avatarUrl ? { uri: user.avatarUrl } : require('../../assets/images/no-image.png')}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.imageActionButton} onPress={handleAddOrEditImage}>
              <MaterialCommunityIcons
                name={user?.avatarUrl ? "image-edit" : "file-image-plus"}
                size={24}
                color="#F9F7F7"
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Info */}
        <View style={styles.personalInfoContainer}>
          <Text style={styles.profileName}>{user?.fullName || "Chưa có tên"}</Text>
          <Text style={styles.profileEmail}>{user?.email || "Chưa có email"}</Text>
        </View>

        {/* Section: Các mục chính */}
        <View style={styles.sectionContainer}>
          <TouchableOpacity style={styles.optionContainer} onPress={() => router.push("/ProfileDetailScreen")}>
            <FontAwesome name="user" size={24} color="#112D4E" />
            <Divider orientation="vertical" bg="#112D4E" mx={2} />
            <Text style={styles.optionText}>Thông tin cá nhân chi tiết</Text>
            <MaterialIcons name="navigate-next" size={24} color="#112D4E" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionContainer} onPress={() => router.push("/HistoryScreen")}>
            <FontAwesome name="history" size={24} color="#112D4E" />
            <Divider orientation="vertical" bg="#112D4E" mx={2} />
            <Text style={styles.optionText}>Lịch sử</Text>
            <MaterialIcons name="navigate-next" size={24} color="#112D4E" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionContainer} onPress={() => router.push("/LeaderDetailScreen")}>
            <Fontisto name="person" size={24} color="#112D4E" />
            <Divider orientation="vertical" bg="#112D4E" mx={2} />
            <Text style={styles.optionText}>Coi thông tin Leader</Text>
            <MaterialIcons name="navigate-next" size={24} color="#112D4E" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionContainer} onPress={() => router.push("/MyContractScreen")}>
            <FontAwesome name="file-text" size={24} color="#112D4E" />
            <Divider orientation="vertical" bg="#112D4E" mx={2} />
            <Text style={styles.optionText}>Các lần yêu cầu</Text>
            <MaterialIcons name="navigate-next" size={24} color="#112D4E" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Button */}
      <TouchableOpacity onPress={() => setIsSignOutModalOpen(true)} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>ĐĂNG XUẤT</Text>
      </TouchableOpacity>

      <SignOutModal
        isOpen={isSignOutModalOpen}
        onClose={() => setIsSignOutModalOpen(false)}
        onConfirm={handleSignOut}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F7F7' },
  scrollContent: { paddingBottom: 100 },
  coverContainer: { position: 'relative' },
  coverImage: { width: '100%', height: 200, opacity: 0.6 },
  avatarContainer: {
    position: 'absolute',
    bottom: -60,
    alignSelf: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    backgroundColor: '#F9F7F7',
    borderColor: '#3F72AF',
  },
  imageActionButton: {
    position: 'absolute',
    bottom: 0,
    right: -10,
    backgroundColor: '#3F72AF',
    borderRadius: 30,
    padding: 6,
    borderWidth: 3,
    borderColor: '#F9F7F7',
  },
  personalInfoContainer: { alignItems: 'center', marginTop: 50 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#112D4E', marginTop: 20 },
  profileEmail: { fontSize: 14, color: '#6C757D' },
  sectionContainer: { backgroundColor: '#F9F7F7', paddingVertical: 8 },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DBE2EF',
  },
  optionText: { flex: 1, marginLeft: 16, fontSize: 16, color: '#112D4E' },
  logoutButton: {
    backgroundColor: '#3F72AF',
    margin: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
