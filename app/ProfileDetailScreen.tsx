import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform } from "react-native";
import { Input, Button, HStack, useToast, IconButton } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import ConfirmModal from "../components/profile/ConfirmModal";
import { formatDate } from "../utils/formatDate";
import { useRouter, useLocalSearchParams } from "expo-router";
import useUser from "../hooks/useUser";

export default function ProfileDetailScreen() {
  const { isEdit } = useLocalSearchParams();
  const router = useRouter();
  const toast = useToast();
  const { user } = useUser(); // Sử dụng dữ liệu từ useUser

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [profileImage, setProfileImage] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phoneNumber || "");
      setBirthDate(user.dateOfBirth ? new Date(user.dateOfBirth) : new Date());
      setProfileImage(user.avatarUrl || "");
    }
  }, [user]);

  useEffect(() => {
    setIsEditing(isEdit === "true");
  }, [isEdit]);

  const handleSave = () => setShowConfirmModal(true);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const onDateChange = (_: any, selectedDate: Date | undefined) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  if (!user) {
    return <Text>Đang tải...</Text>; // Hiển thị khi dữ liệu chưa có
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: profileImage || 'https://cdn-icons-png.flaticon.com/512/219/219983.png' }} // Sử dụng hình ảnh mặc định nếu profileImage không có giá trị
            style={styles.profileImage}
          />
          {isEditing && (
            <TouchableOpacity style={styles.cameraIcon} onPress={pickImage}>
              <FontAwesome name="camera" size={24} color="white" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Tên đầy đủ</Text>
          {isEditing ? (
            <Input value={name} onChangeText={setName} variant="outline" style={styles.input} />
          ) : (
            <Text style={styles.fieldValue}>{name}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          {isEditing ? (
            <Input value={email} onChangeText={setEmail} variant="outline" style={styles.input} keyboardType="email-address" />
          ) : (
            <Text style={styles.fieldValue}>{email}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Số điện thoại</Text>
          {isEditing ? (
            <Input value={phone} onChangeText={setPhone} variant="outline" style={styles.input} keyboardType="phone-pad" />
          ) : (
            <Text style={styles.fieldValue}>{phone}</Text>
          )}
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Ngày sinh</Text>
          {isEditing ? (
            <HStack alignItems="center" space={2}>
              <Input
                value={formatDate(birthDate)}
                isReadOnly
                variant="outline"
                style={styles.input}
                w="85%" // Điều chỉnh độ rộng để đủ chỗ cho biểu tượng lịch
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
            <Text style={styles.fieldValue}>{formatDate(birthDate)}</Text>
          )}
        </View>

        {isEditing && (
          <HStack justifyContent="center" space={4} mt={4}>
            <Button style={styles.saveButton} onPress={handleSave} flex={1}>
              LƯU
            </Button>
            <Button
              variant="outline"
              colorScheme="coolGray"
              onPress={() => {
                setIsEditing(false);
                router.back();
              }}
              flex={1}
            >
              HỦY
            </Button>
          </HStack>
        )}
      </View>

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={() => {
          setIsEditing(false);
          setShowConfirmModal(false);
          toast.show({
            description: "Thông tin đã được lưu thành công",
            duration: 3000,
          });
          router.replace("/ProfileScreen");
        }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F7F7", padding: 16 },
  section: { marginBottom: 24 },
  imageContainer: { position: "relative", alignItems: "center", marginBottom: 20 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  cameraIcon: { position: "absolute", bottom: 0, right: 0, backgroundColor: "#3F72AF", borderRadius: 20, padding: 5 },
  fieldContainer: { width: "100%", marginVertical: 10 },
  label: { fontSize: 16, fontWeight: "bold", color: "#112D4E" },
  fieldValue: { fontSize: 16, color: "#333", marginTop: 4 },
  input: { fontSize: 16, backgroundColor: "#fff" },
  dateText: { fontSize: 16, color: "#333", marginTop: 4 },
  saveButton: { backgroundColor: "#3F72AF" },
});
