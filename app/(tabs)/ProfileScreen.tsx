// app/(tabs)/ProfileScreen.tsx
import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { FontAwesome, MaterialIcons, Fontisto,FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Divider, useToast } from 'native-base';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import SignOutModal from '../../components/profile/SignOutModal';
import { useAuth } from '../../hooks/useAuth';
import useUser from '../../hooks/useUser';
import { useFocusEffect } from '@react-navigation/native';

export default function ProfileScreen() {
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const { handleLogout } = useAuth();
  const { user, loading, fetchUserAndLeader, updateUserAvatar } = useUser();

  useFocusEffect(
    useCallback(() => {
      fetchUserAndLeader();
    }, [])
  );

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
      await updateUserAvatar(selectedImageUri); // Call the update API
      await fetchUserAndLeader(); // Refresh the user data to reflect the updated avatar
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
            <TouchableOpacity onPress={() => setIsImageModalOpen(true)}>
              <Image
                source={user?.avatarUrl ? { uri: user.avatarUrl } : require('../../assets/images/no-image.png')}
                style={styles.profileImage}
              />
            </TouchableOpacity>
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

        {/* Other sections omitted for brevity */}
        <View style={styles.sectionContainer}>
          {/* Profile detail navigation */}
          <TouchableOpacity style={styles.optionContainer} onPress={() => router.push("/ProfileDetailScreen")}>
            <FontAwesome name="user" size={24} color="#112D4E" />
            <Divider orientation="vertical" bg="#112D4E" mx={2} />
            <Text style={styles.optionText}>Thông tin cá nhân chi tiết</Text>
            <MaterialIcons name="navigate-next" size={24} color="#112D4E" />
          </TouchableOpacity>
          {/* History */}
          <TouchableOpacity style={styles.optionContainer} onPress={() => router.push("/HistoryScreen")}>
            <FontAwesome name="history" size={24} color="#112D4E" />
            <Divider orientation="vertical" bg="#112D4E" mx={2} />
            <Text style={styles.optionText}>Lịch sử</Text>
            <MaterialIcons name="navigate-next" size={24} color="#112D4E" />
          </TouchableOpacity>
          {/* Leader info */}
          <TouchableOpacity style={styles.optionContainer} onPress={() => router.push("/LeaderDetailScreen")}>
            <Fontisto name="person" size={24} color="#112D4E" />
            <Divider orientation="vertical" bg="#112D4E" mx={2} />
            <Text style={styles.optionText}>Coi thông tin Leader</Text>
            <MaterialIcons name="navigate-next" size={24} color="#112D4E" />
          </TouchableOpacity>
          {/* Contract requests */}
          <TouchableOpacity style={styles.optionContainer} onPress={() => router.push("/RequestListScreen")}>
          <MaterialIcons name="home-repair-service" size={24} color="#112D4E" />
            <Divider orientation="vertical" bg="#112D4E" mx={2} />
            <Text style={styles.optionText}>Các lần yêu cầu</Text>
            <MaterialIcons name="navigate-next" size={24} color="#112D4E" />
          </TouchableOpacity>
          {/* Pending contracts */}
          <TouchableOpacity style={styles.optionContainer} onPress={() => router.push("/PendingContractScreen")}>
          <FontAwesome5 name="file-contract" size={24} color="#112D4E" />
            <Divider orientation="vertical" bg="#112D4E" mx={2} />
            <Text style={styles.optionText}>Hợp đồng chờ duyệt</Text>
            <MaterialIcons name="navigate-next" size={24} color="#112D4E" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Image Modal for Viewing Full Image */}
      <Modal visible={isImageModalOpen} transparent={true}>
        <View style={styles.modalContainer}>
          <Image
            source={user?.avatarUrl ? { uri: user.avatarUrl } : require('../../assets/images/no-image.png')}
            style={styles.fullSizeImage}
          />
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsImageModalOpen(false)}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>

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
  container: {
    flex: 1,
    backgroundColor: '#F9F7F7',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  coverContainer: {
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: 200,
    opacity: 0.6,
  },
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
  personalInfoContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#112D4E',
    marginTop: 20,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6C757D',
  },
  sectionContainer: {
    backgroundColor: '#F9F7F7',
    paddingVertical: 8,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DBE2EF',
  },
  optionText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: '#112D4E',
  },
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
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  fullSizeImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  fullSizeImage: {
    width: '90%',
    height: '70%',
    borderRadius: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#3F72AF',
    borderRadius: 8,
  },
  closeButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Nền mờ đen để làm nổi bật ảnh
  },
});
