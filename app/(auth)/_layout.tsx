// app/(auth)/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ForgotPasswordScreen"
          options={{
            headerTitle: "Quên Mật Khẩu",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: '#3F72AF',
            },
          }}
        />
        <Stack.Screen
          name="RegisterScreen"
          options={{
            headerTitle: "Đăng Ký",
            headerTintColor: "white",
            headerStyle: {
              backgroundColor: '#3F72AF',
            },
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#161622" style="light" />
    </>
  );
};

export default AuthLayout;
