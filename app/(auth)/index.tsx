// app/(auth)/index.tsx
import React from "react";
import { View, Text, TextInput, StyleSheet, Alert, TouchableOpacity, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Button, Checkbox, Spinner, HStack } from "native-base";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../contexts/GlobalProvider";

export default function LoginScreen() {
  const router = useRouter();
  const { handleLogin } = useAuth();
  const { loading, setLoading } = useGlobalState();
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: { emailOrPhone: string; password: string }) => {
    Keyboard.dismiss(); // Ẩn bàn phím khi bắt đầu đăng nhập
    setLoading(true);
    const isLoginSuccessful = await handleLogin(data.emailOrPhone, data.password);

    if (isLoginSuccessful) {
      router.replace("/(tabs)"); // Chỉ điều hướng khi đăng nhập thành công và vai trò là CUSTOMER
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xin chào!</Text>
      <Controller
        name="emailOrPhone"
        control={control}
        rules={{
          required: "Email hoặc SĐT không được để trống",
          pattern: {
            value: /^\S+@\S+$/i,
            message: "Địa chỉ email không hợp lệ",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Email hoặc SĐT"
              onChangeText={onChange}
              value={value}
            />
            {errors.emailOrPhone && <Text style={styles.error}>{errors.emailOrPhone.message}</Text>}
          </View>
        )}
      />
      <Controller
        name="password"
        control={control}
        rules={{
          required: "Mật khẩu không được để trống",
          minLength: { value: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
        }}
        render={({ field: { onChange, value } }) => (
          <View>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              secureTextEntry
              onChangeText={onChange}
              value={value}
            />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
          </View>
        )}
      />
      <Checkbox value="rememberMe" accessibilityLabel="Ghi nhớ đăng nhập">
        Ghi nhớ đăng nhập
      </Checkbox>
      <Button onPress={handleSubmit(onSubmit)} isDisabled={loading} style={styles.loginButton}>
        <HStack space={2} alignItems="center">
          {loading && <Spinner size="sm" color="white" />}
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </HStack>
      </Button>
      <TouchableOpacity onPress={() => router.push("/(auth)/ForgotPasswordScreen")}>
        <Text style={styles.link}>Quên mật khẩu?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/(auth)/RegisterScreen")}>
        <Text style={styles.link}>Chưa có tài khoản? Đăng ký ngay!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  input: { width: '100%', height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 12, paddingHorizontal: 10, borderRadius: 5 },
  error: { color: "red", fontSize: 12 },
  loginButton: { width: '100%', marginTop: 20 },
  buttonText: { color: "white", fontWeight: "bold" },
  link: { color: '#3F72AF', textDecorationLine: 'underline', marginTop: 10 },
});
