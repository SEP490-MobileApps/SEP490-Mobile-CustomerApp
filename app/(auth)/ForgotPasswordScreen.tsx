// app/(auth)/ForgotPasswordScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (email) {
      // Giả lập việc gửi email reset mật khẩu
      Alert.alert('Password Reset', 'A password reset link has been sent to your email.');
      router.replace('/(auth)'); // Quay về màn hình đăng nhập sau khi gửi thành công
    } else {
      Alert.alert('Error', 'Please enter a valid email.');
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
      <Button title="Gửi Yêu Cầu" onPress={handleResetPassword} />
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
  linkText: {
    color: '#3F72AF',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});
