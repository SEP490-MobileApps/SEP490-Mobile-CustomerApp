// ProfileDetailScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, Image, ScrollView, Platform } from "react-native";
import { Input, Button, HStack, IconButton } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import ConfirmModal from "../components/profile/ConfirmModal";
import { formatDate } from "../utils/formatDate";
import { useRouter, useLocalSearchParams } from "expo-router";
import useUser from "../hooks/useUser";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from '@/hooks/useAuth';
import Lottie from 'lottie-react-native';

export default function ProfileDetailScreen() {
  const { fetchApartments } = useAuth();
  const { isEdit } = useLocalSearchParams();
  const router = useRouter();
  const { user, fetchUserAndLeader, loading, updateUserInfo } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchUserAndLeader();
      fetchApartments();
    }, [])
  );

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.email || "");
      setBirthDate(user.dateOfBirth ? new Date(user.dateOfBirth) : new Date());
    }
  }, [user]);

  useEffect(() => {
    setIsEditing(isEdit === "true");
  }, [isEdit]);

  const handleSave = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    await updateUserInfo(name, email, birthDate.toISOString().split('T')[0]);
    setIsEditing(false);
    setShowConfirmModal(false);
  };

  const onDateChange = (_: any, selectedDate: Date | undefined) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  if (loading || !user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
        <Lottie
          source={require('../assets/animations/loading.json')} // Đường dẫn tới file animation
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        {/* Display Avatar without edit icon */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: user.avatarUrl || 'https://cdn-icons-png.flaticon.com/512/219/219983.png' }}
            style={styles.profileImage}
          />
        </View>

        {/* Personal Info Fields */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Tên đầy đủ</Text>
          {isEditing ? (
            <Input value={name} onChangeText={setName} variant="outline" bg="#DBE2EF" />
          ) : (
            <View style={styles.fieldView}>
              <Text style={styles.fieldValue}>{name}</Text>
            </View>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <Input value={email} onChangeText={setEmail} variant="outline" bg="#DBE2EF" keyboardType="email-address" />
          ) : (
            <View style={styles.fieldView}>
              <Text style={styles.fieldValue}>{email}</Text>
            </View>
          )}
        </View>

        <View style={isEditing ? styles.dateFieldContainer : styles.fieldContainer}>
          <Text style={styles.label}>Ngày sinh</Text>
          {isEditing ? (
            <HStack alignItems="center" space={2}>
              <Input
                value={formatDate(birthDate)}
                isReadOnly
                variant="outline"
                bg="#DBE2EF"
              />
              <IconButton
                icon={<FontAwesome name="calendar" size={24} color="#3F72AF" />}
                onPress={() => setShowDatePicker(true)}
              />
              {showDatePicker && (
                <DateTimePicker
                  value={birthDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </HStack>
          ) : (
            <View style={styles.fieldView}>
              <Text style={styles.fieldValue}>{formatDate(birthDate)}</Text>
            </View>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Chung cư</Text>
          <View style={styles.apartmentContainer}>
            <Image
              source={{ uri: user?.apartmentAvatarUrl || 'https://via.placeholder.com/100' }}
              style={styles.apartmentImage}
            />
            <View style={styles.apartmentInfo}>
              <Text style={styles.apartmentName}>{user?.apartmentName || "Không có thông tin"}</Text>
              <Text style={styles.apartmentAddress}>{user?.apartmentAddress || "Không có thông tin"}</Text>
            </View>
          </View>
        </View>

        {/* <View style={styles.fieldContainer}>
          <Text style={styles.label}>Căn hộ</Text>
          <View style={styles.fieldView}>
            <Text style={styles.fieldValue}>Room 115</Text>
          </View>
        </View> */}

        {isEditing && (
          <HStack justifyContent="space-between" mt={4}>
            <Button
              variant="outline"
              colorScheme="coolGray"
              onPress={() => setIsEditing(false)}
              flex={1}
              mr={2}
            >
              HỦY
            </Button>
            <Button style={styles.saveButton} onPress={handleSave} flex={1}>
              LƯU
            </Button>
          </HStack>
        )}
      </View>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSave}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F7F7", padding: 16 },
  section: { marginBottom: 24 },
  imageContainer: { alignItems: "center", marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  fieldContainer: { width: "100%", marginVertical: 10 },
  label: { fontSize: 16, fontWeight: "bold", color: "#112D4E", marginBottom: 4 },
  fieldView: {
    padding: 10,
    backgroundColor: "#DBE2EF",
    borderRadius: 8,
  },
  fieldValue: { fontSize: 16, color: "#333" },
  apartmentContainer: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  apartmentImage: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
  apartmentInfo: { flex: 1 },
  apartmentName: { fontSize: 16, fontWeight: "bold" },
  apartmentAddress: { fontSize: 14, color: "#6C757D" },
  saveButton: { backgroundColor: "#3F72AF" },
  dateFieldContainer: {
    width: "88%", // Điều chỉnh kích thước theo nhu cầu của bạn
    marginVertical: 10,
  },
});

