import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { View, Text, Button, VStack, Box, HStack, Icon, Toast } from 'native-base';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { handleForgotPassword } = useAuth(); // Sử dụng API trong useAuth
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      // Hiển thị thông báo lỗi nếu email không hợp lệ
      Toast.show({
        render: () => (
          <Box bg="red.500" px="4" py="3" rounded="md" shadow={2}>
            <HStack space={2} alignItems="center">
              <Icon as={FontAwesome} name="exclamation-circle" size="lg" color="white" />
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Vui lòng nhập email hợp lệ!
              </Text>
            </HStack>
          </Box>
        ),
        placement: 'top',
      });
      return;
    }

    try {
      const responseMessage = await handleForgotPassword(email);
      Toast.show({
        render: () => (
          <Box bg="green.500" px="4" py="3" rounded="md" shadow={2}>
            <HStack space={2} alignItems="center">
              <Icon as={FontAwesome} name="check-circle" size="lg" color="white" />
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{responseMessage}</Text>
            </HStack>
          </Box>
        ),
        placement: 'top',
      });
      router.replace('/(auth)'); // Quay lại trang đăng nhập sau khi gửi thành công
    } catch (error) {
      Toast.show({
        render: () => (
          <Box bg="red.500" px="4" py="3" rounded="md" shadow={2}>
            <HStack space={2} alignItems="center">
              <Icon as={FontAwesome} name="exclamation-circle" size="lg" color="white" />
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Không thể gửi yêu cầu. Vui lòng thử lại!
              </Text>
            </HStack>
          </Box>
        ),
        placement: 'top',
      });
    }
  };

  const handleBackToLogin = () => {
    router.back(); // Điều hướng quay lại trang đăng nhập
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quên Mật Khẩu</Text>
      <Text style={styles.description}>
        Vui lòng nhập email của bạn để nhận liên kết đặt lại mật khẩu.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button onPress={handleResetPassword} style={styles.button} colorScheme="primary">
        Gửi Yêu Cầu
      </Button>
      <TouchableOpacity onPress={handleBackToLogin}>
        <Text style={styles.linkText}>Quay lại trang đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3F72AF',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  linkText: {
    color: '#3F72AF',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});
