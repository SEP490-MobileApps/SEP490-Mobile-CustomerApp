import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {
  Input,
  Button,
  VStack,
  Box,
  Text,
  Badge,
  Alert,
  HStack,
  Icon,
  CloseIcon,
  Toast,
} from 'native-base';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useAuth } from '@/hooks/useAuth';
import { Apartment } from '@/models/Apartment';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const { fetchApartments, handleRegister } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cmT_CCCD, setCmT_CCCD] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [formattedDob, setFormattedDob] = useState('');
  const [areaId, setAreaId] = useState('');
  const [roomIds, setRoomIds] = useState<string[]>([]);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [rooms, setRooms] = useState<string[]>([]);
  const [apartmentSearchText, setApartmentSearchText] = useState('');
  const [filteredApartments, setFilteredApartments] = useState<Apartment[]>([]);
  const [roomSearchText, setRoomSearchText] = useState('');
  const [filteredRooms, setFilteredRooms] = useState<string[]>([]);
  const [isApartmentModalVisible, setApartmentModalVisible] = useState(false);
  const [isRoomModalVisible, setRoomModalVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [errors, setErrors] = useState<{
    fullName: string;
    email: string;
    phoneNumber: string;
    cmT_CCCD: string;
    password: string;
    confirmPassword: string;
    dateOfBirth: string;
    areaId?: string;
    roomIds: string;
  }>({
    fullName: '',
    email: '',
    phoneNumber: '',
    cmT_CCCD: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    areaId: '',
    roomIds: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setPhoneNumber('');
    setCmT_CCCD('');
    setDateOfBirth('');
    setFormattedDob('');
    setAreaId('');
    setRoomIds([]);
    setSelectedApartment(null);
    setApartmentSearchText('');
    setRoomSearchText('');
    setFilteredRooms([]);
    setErrors({
      fullName: '',
      email: '',
      phoneNumber: '',
      cmT_CCCD: '',
      password: '',
      confirmPassword: '',
      dateOfBirth: '',
      areaId: '',
      roomIds: '',
    });
  };


  useEffect(() => {
    resetForm();
    const loadApartments = async () => {
      const data = await fetchApartments();
      setApartments(data);
      setFilteredApartments(data);
    };
    loadApartments();
  }, []);

  const handleApartmentSearch = (text: string) => {
    setApartmentSearchText(text);
    const filtered = apartments.filter((apartment) =>
      apartment.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredApartments(filtered);
  };

  const handleApartmentSelect = (apartment: Apartment) => {
    if (apartment.areaId !== areaId) {
      setRoomIds([]);
      setFilteredRooms([]);
    }
    setSelectedApartment(apartment);
    setAreaId(apartment?.areaId);
    setRooms(apartment.roomIds || []);
    setFilteredRooms(apartment.roomIds || []);
  };

  const handleConfirmApartment = () => {
    setApartmentModalVisible(false);
  };

  const handleRoomSearch = (text: string) => {
    setRoomSearchText(text);
    const filtered = rooms.filter((room) =>
      room.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredRooms(filtered);
  };

  const handleRoomToggle = (roomId: string) => {
    if (roomIds.includes(roomId)) {
      setRoomIds((prev) => prev.filter((id) => id !== roomId));
    } else {
      setRoomIds((prev) => [...prev, roomId]);
    }
  };

  const handleConfirmRooms = () => {
    setRoomModalVisible(false);
  };

  const handleDateConfirm = (date: Date) => {
    date.setHours(12, 0, 0, 0);
    const isoDate = date.toISOString().split('T')[0];
    const [year, month, day] = isoDate.split('-');
    setDateOfBirth(isoDate);
    setFormattedDob(`${day}-${month}-${year}`);
    setDatePickerVisible(false);
  };

  const handleCancelApartment = () => {
    setSelectedApartment(null);
    setAreaId('');
    setRooms([]);
    setRoomIds([]);
    setApartmentModalVisible(false);
  };


  const handleCancelRooms = () => {
    setRoomIds([]);
    setRoomModalVisible(false);
  };

  const validateFields = (): boolean => {
    let valid = true;
    const newErrors: any = {};

    if (!fullName.trim() || fullName.length < 3) {
      newErrors.fullName = 'Tên đầy đủ phải có ít nhất 3 ký tự.';
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = 'Email không hợp lệ.';
      valid = false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại phải có 10 số.';
      valid = false;
    }

    const cmtRegex = /^\d{9}$|^\d{12}$/;
    if (!cmT_CCCD || !cmtRegex.test(cmT_CCCD)) {
      newErrors.cmT_CCCD = 'Số CMT/CCCD phải có 9 hoặc 12 số.';
      valid = false;
    }

    if (!password || password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự.';
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng nhập xác nhận mật khẩu.';
      valid = false;
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu không trùng khớp.';
      valid = false;
    }

    if (!dateOfBirth) {
      newErrors.dateOfBirth = 'Vui lòng chọn ngày sinh.';
      valid = false;
    }

    if (!areaId) {
      newErrors.areaId = 'Vui lòng chọn chung cư.';
      valid = false;
    }

    if (roomIds.length === 0) {
      newErrors.roomIds = 'Vui lòng chọn ít nhất một căn hộ.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validateAndSubmit = async () => {
    if (!validateFields()) return;

    const success = await handleRegister({
      cmT_CCCD,
      fullName,
      email,
      phoneNumber,
      password,
      dateOfBirth,
      areaId,
      roomIds,
    });

    if (success) {
      Toast.show({
        render: () => (
          <Box bg="emerald.500" px="4" py="3" rounded="md" shadow={2} mt={10}>
            <HStack space={2} alignItems="center">
              <Icon as={FontAwesome} name="check-circle" size="lg" color="white" />
              <Text color="white" fontWeight="bold">
                Đăng ký thành công!
              </Text>
            </HStack>
          </Box>
        ),
        placement: 'top',
        duration: 2000,
      });
      resetForm();
      setTimeout(() => {
        router.back();
      }, 2000);
    } else {
      Toast.show({
        render: () => (
          <Box bg="red.500" px="4" py="3" rounded="md" shadow={2} mt={10}>
            <HStack space={2} alignItems="center">
              <Icon as={MaterialIcons} name="error" size="lg" color="white" />
              <Text color="white" fontWeight="bold">
                Đăng ký không thành công.
              </Text>
            </HStack>
          </Box>
        ),
        placement: 'top',
        duration: 2000,
      });
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.introText}>
        Đăng ký tài khoản để tận hưởng các dịch vụ tốt nhất của chúng tôi!
      </Text>

      {successMessage && (
        <Alert w="100%" status="success" variant="top-accent" mt={4}>
          <HStack space={2}>
            <Icon as={FontAwesome} name="check-circle" size="lg" color="emerald.500" />
            <Text>{successMessage}</Text>
            <CloseIcon onPress={() => setSuccessMessage('')} />
          </HStack>
        </Alert>
      )}
      {errorMessage && (
        <Alert w="100%" status="error" variant="top-accent" mt={4}>
          <HStack space={2}>
            <Icon as={MaterialIcons} name="error" size="lg" color="red.500" />
            <Text>{errorMessage}</Text>
            <CloseIcon onPress={() => setErrorMessage('')} />
          </HStack>
        </Alert>
      )}

      <VStack space={4}>
        <Text>Tên đầy đủ (*)</Text>
        <Input
          value={fullName}
          onChangeText={setFullName}
          isInvalid={!!errors.fullName}
          placeholder="Nhập tên đầy đủ"
        />
        {!!errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

        <Text>Email</Text>
        <Input
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          isInvalid={!!errors.email}
          placeholder="Nhập email"
        />
        {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        <Text>Số điện thoại (*)</Text>
        <Input
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          isInvalid={!!errors.phoneNumber}
          placeholder="Nhập số điện thoại"
        />
        {!!errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

        <Text>Số CMT/CCCD (*)</Text>
        <Input
          value={cmT_CCCD}
          onChangeText={setCmT_CCCD}
          isInvalid={!!errors.cmT_CCCD}
          placeholder="Nhập số CMT/CCCD"
        />
        {!!errors.cmT_CCCD && <Text style={styles.errorText}>{errors.cmT_CCCD}</Text>}

        <Text>Mật khẩu (*)</Text>
        <Input
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          isInvalid={!!errors.password}
          placeholder="Nhập mật khẩu"
        />
        {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        <Text>Xác nhận mật khẩu (*)</Text>
        <Input
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          isInvalid={!!errors.confirmPassword}
          placeholder="Nhập lại mật khẩu"
        />
        {!!errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword}</Text>
        )}

        <Text>Ngày sinh (*)</Text>
        <View style={styles.dateContainer}>
          <View style={styles.dateDisplay}>
            <Text>{formattedDob || 'Chọn ngày sinh'}</Text>
          </View>
          <TouchableOpacity onPress={() => setDatePickerVisible(true)}>
            <MaterialIcons name="calendar-today" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleDateConfirm}
          onCancel={() => setDatePickerVisible(false)}
          maximumDate={new Date()}
        />

        <Button
          onPress={() => setApartmentModalVisible(true)}
          style={styles.button_register}
        >
          Chọn chung cư (*)
        </Button>


        {selectedApartment && (
          <Box style={styles.selectedApartmentInfo}>
            <Image source={{ uri: selectedApartment.avatarUrl }} style={styles.apartmentImageLarge} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.selectedApartmentName}>{selectedApartment.name}</Text>
              <Text style={styles.selectedApartmentAddress}>{selectedApartment.address}</Text>
            </View>
          </Box>
        )}



        <Modal visible={isApartmentModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm chung cư"
              value={apartmentSearchText}
              onChangeText={handleApartmentSearch}
            />
            <FlatList
              data={filteredApartments}
              keyExtractor={(item) => item?.areaId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.apartmentItem,
                    item?.areaId === areaId && styles.selectedApartmentItem,
                  ]}
                  onPress={() => handleApartmentSelect(item)}
                >
                  <Image source={{ uri: item.avatarUrl }} style={styles.apartmentImage} />
                  <View>
                    <Text style={styles.apartmentName}>{item.name}</Text>
                    <Text style={styles.apartmentAddress}>{item.address}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
            <View style={styles.modalActions}>
              <Button style={styles.button_delete} onPress={handleCancelApartment}>Hủy</Button>
              <Button style={styles.button_confirm} onPress={handleConfirmApartment}>Xác nhận</Button>
            </View>
          </View>
        </Modal>

        {/* Nút chọn căn hộ */}
        <Button
          onPress={() => {
            if (areaId) {
              setRoomModalVisible(true);
            }
          }}
          isDisabled={!areaId}
          backgroundColor={!areaId ? '#ccc' : '#3F72AF'}
        >
          {roomIds.length > 0 ? `Đã chọn ${roomIds.length} căn hộ` : 'Chọn căn hộ (*)'}
        </Button>

        <Modal visible={isRoomModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm căn hộ"
              value={roomSearchText}
              onChangeText={handleRoomSearch}
            />
            <FlatList
              data={filteredRooms}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.roomItem,
                    roomIds.includes(item) && styles.selectedRoomItem,
                  ]}
                  onPress={() => handleRoomToggle(item)}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <View style={styles.modalActions}>
              <Button style={styles.button_delete} onPress={handleCancelRooms}>Hủy</Button>
              <Button style={styles.button_confirm} onPress={handleConfirmRooms}>Xác nhận</Button>
            </View>
          </View>
        </Modal>


        <Box flexWrap="wrap" flexDirection="row" marginTop={2}>
          {roomIds.map((roomId) => (
            <Badge key={roomId} colorScheme="success" marginRight={2} marginBottom={2}>
              {roomId}
            </Badge>
          ))}
        </Box>

        <Button onPress={validateAndSubmit} style={styles.button_register}>
          Đăng ký
        </Button>
      </VStack>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button_register: {
    marginTop: 10,
    backgroundColor: '#3F72AF'
  },
  button_delete: {
    marginTop: 10,
    width: '48%',
    backgroundColor: '#d9534f'
  },
  button_confirm: {
    marginTop: 10,
    width: '48%',
    backgroundColor: '#3F72AF'
  },
  container: { flexGrow: 1, padding: 16, backgroundColor: '#F9F7F7' },
  logo: { width: 100, height: 100, alignSelf: 'center', borderRadius: 50, marginBottom: 10 },
  introText: { textAlign: 'center', fontSize: 16, color: '#6c757d', marginBottom: 20 },
  dateContainer: { flexDirection: 'row', alignItems: 'center' },
  dateDisplay: { flex: 1, padding: 12, backgroundColor: '#f0f0f0', borderRadius: 4 },
  errorText: { color: '#d9534f', marginTop: 4 },
  modalContainer: { flex: 1, padding: 16, backgroundColor: 'white' },
  searchInput: { marginBottom: 16, padding: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 4 },
  apartmentItem: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#eee' },
  selectedApartmentItem: { backgroundColor: '#e6f7ff' },
  apartmentImage: { width: 50, height: 50, marginRight: 10, borderRadius: 4 },
  apartmentName: { fontWeight: 'bold' },
  apartmentAddress: { color: '#6c757d' },
  modalActions: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  roomItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },

  selectedRoomItem: {
    backgroundColor: '#e6f7ff',
    borderLeftWidth: 4,
    borderLeftColor: '#3F72AF',
  },
  selectedApartmentInfo: {
    flexDirection: 'row',
    marginTop: 10,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  apartmentImageLarge: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  selectedApartmentName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  selectedApartmentAddress: {
    color: '#6c757d',
    fontSize: 14,
  },
});
