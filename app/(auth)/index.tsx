/// app/(auth)/index.tsx
import React, { useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, Image } from "react-native";
import { useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { Button, Checkbox, Spinner, HStack, Icon, useToast, Box } from "native-base";
import { useAuth } from "../../hooks/useAuth";
import { useGlobalState } from "../../contexts/GlobalProvider";
import { MaterialIcons } from "@expo/vector-icons";
import { GetLatestPushNotificationRecordByLeaderId, InitializeFirestoreDb, sendPushNotification } from "@/utils/PushNotification";
import LottieView from "lottie-react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { handleLogin } = useAuth();
  const { loadingLogin, setLoadingLogin } = useGlobalState();
  const toast = useToast();
  const { control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (data: { emailOrPhone: string; password: string }) => {
    Keyboard.dismiss();
    setLoadingLogin(true);
    const isLoginSuccessful = await handleLogin(data.emailOrPhone, data.password);
    setLoadingLogin(false);

    if (isLoginSuccessful) {
      router.replace("/(tabs)");
      toast.show({
        duration: 2300,
        placement: 'top',
        render: () => {
          return <Box
            borderTopColor='#16a34a'
            borderTopWidth={5} bg="#bbf7d0"
            alignSelf='center'
            px="2"
            py="1"
            rounded="sm"
            mb={5}
            style={{ flexDirection: 'column', width: '98%', justifyContent: 'center' }}
          >
            <View style={{
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#bbf7d0',
              marginHorizontal: 30,
              flexDirection: 'row'
            }}>
              <LottieView
                source={require('@/assets/animations/success.json')}
                autoPlay
                loop
                style={{ width: 52, height: 52 }}
              />
              <Text
                style={{
                  fontSize: 18,
                  color: '#112D4E',
                  textAlign: 'center',
                  fontWeight: 'bold'
                }}>
                Đăng nhập thành công
              </Text>
            </View>
          </Box>;
        }
      });
    }
  };


  return (
    <View style={styles.container}>
      <Image source={require('@/assets/images/logo.png')} style={styles.logo} />
      <Text style={styles.title}>Xin Chào Bạn,</Text>
      <Text style={styles.subtitle}>Hãy Đăng Nhập Để Khám Phá Những Tính Năng Của Chúng Tôi</Text>

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
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ Email/Số điện thoại"
              onChangeText={onChange}
              value={value}
              placeholderTextColor="#B0B3B8"
            />
            <Icon as={MaterialIcons} name="email" size={5} color="#B0B3B8" style={styles.inputIcon} />
            {errors.emailOrPhone && <Text style={styles.error}>{errors.emailOrPhone.message}</Text>}
          </View>
        )}
      />

      <Controller
        name="password"
        control={control}
        rules={{
          required: "Mật khẩu không được để trống",
        }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              secureTextEntry
              onChangeText={onChange}
              value={value}
              placeholderTextColor="#B0B3B8"
            />
            <Icon as={MaterialIcons} name="lock" size={5} color="#B0B3B8" style={styles.inputIcon} />
            {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}
          </View>
        )}
      />

      <View style={styles.row}>
        <Checkbox value="rememberMe" accessibilityLabel="Ghi nhớ đăng nhập">
          Ghi nhớ đăng nhập
        </Checkbox>
        <TouchableOpacity onPress={() => router.push("/(auth)/ForgotPasswordScreen")}>
          <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>

      <Button onPress={handleSubmit(onSubmit)} isDisabled={loadingLogin} style={styles.loginButton}>
        <HStack space={2} alignItems="center">
          {loadingLogin && <Spinner size="sm" color="white" />}
          <Text style={styles.buttonText}>ĐĂNG NHẬP</Text>
        </HStack>
      </Button>

      <TouchableOpacity onPress={() => router.push("/(auth)/RegisterScreen")}>
        <Text style={styles.registerLink}>
          Bạn chưa có tài khoản? <Text style={styles.registerText}>Đăng ký tại đây!</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: { width: 200, height: 200, alignSelf: 'center', borderRadius: 200, marginTop: 100, marginBottom: 30 },
  container: { flex: 1, alignItems: 'center', padding: 16, backgroundColor: '#F9F7F7' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#6C757D', textAlign: 'center', marginBottom: 23 },
  inputContainer: { width: '100%', marginBottom: 15, position: 'relative' },
  input: { width: '100%', height: 50, borderColor: '#DBE2EF', borderWidth: 1, borderRadius: 10, paddingHorizontal: 40, backgroundColor: '#F0F4F8' },
  inputIcon: { position: 'absolute', left: 10, top: 15 },
  error: { color: "red", fontSize: 12, marginTop: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: 23 },
  forgotPassword: { color: '#3F72AF', textDecorationLine: 'underline' },
  loginButton: { width: '100%', height: 50, backgroundColor: '#3F72AF', justifyContent: 'center', borderRadius: 10 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  registerLink: { color: '#6C757D', marginTop: 20 },
  registerText: { color: '#3F72AF', fontWeight: 'bold' },
});

