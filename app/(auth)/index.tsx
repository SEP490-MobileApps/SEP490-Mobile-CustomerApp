// app/(auth)/index.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Checkbox, Box } from 'native-base';
import CustomButton from '../../components/ui/CustomButton'; // Đường dẫn đến custom button của bạn

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = () => {
    if (email === '1@g.c' && password === '1') {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  const handleForgotPassword = () => {
    router.push('/(auth)/ForgotPasswordScreen');
  };

  const handleRegister = () => {
    router.push('/(auth)/RegisterScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xin Chào Bạn,</Text>
      <Text style={styles.subtitle}>Hãy Đăng Nhập Để Khám Phá Những Tính Năng Của Chúng Tôi</Text>
      <TextInput
        style={styles.input}
        placeholder="Địa chỉ Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Box style={styles.checkboxContainer}>
        <Checkbox
          value="rememberMe"
          isChecked={rememberMe}
          onChange={() => setRememberMe(!rememberMe)}
          accessibilityLabel="Ghi nhớ đăng nhập"
        >
          Ghi nhớ đăng nhập
        </Checkbox>
        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </Box>
      {/* Sử dụng CustomButton với variant 'primary' */}
      <CustomButton 
        title="ĐĂNG NHẬP" 
        onPress={handleLogin} 
        variant="primary" 
        style={styles.loginButton} 
      />
      <TouchableOpacity onPress={handleRegister}>
        <Text style={styles.register}>Bạn chưa có tài khoản? Đăng ký tại đây!</Text>
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 20,
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
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  forgotPassword: {
    color: '#3F72AF',
    textDecorationLine: 'underline',
  },
  register: {
    color: '#3F72AF',
    textDecorationLine: 'underline',
    marginTop: 20,
  },
  loginButton: {
    width: '100%',
    marginTop: 20,
  },
});
