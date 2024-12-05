import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { View, Text, Button, VStack, Box, HStack, Icon, Toast } from 'native-base';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';
import LottieView from 'lottie-react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { handleForgotPassword } = useAuth();
  const [email, setEmail] = useState('');

  const handleResetPassword = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      Toast.show({
        duration: 1600,
        placement: 'top',
        render: () => {
          return <Box
            borderTopColor='#dc2626'
            borderTopWidth={5} bg="#fecaca"
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
              backgroundColor: '#fecaca',
              marginHorizontal: 30,
              flexDirection: 'row'
            }}>
              <LottieView
                source={require('@/assets/animations/error.json')}
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
                Vui lòng nhập địa chỉ email hợp lệ!
              </Text>
            </View>
          </Box>;
        }
      });
      return;
    }

    try {
      const responseMessage = await handleForgotPassword(email);
      if (responseMessage) {
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
        router.replace('/(auth)');
      }
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

  return (
    <View style={styles.container}>
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
      <Button onPress={handleResetPassword} style={styles.button}>
        Gửi Yêu Cầu
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f7f7',
  },
  title: {
    fontSize: 20,
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
    backgroundColor: '#3F72AF',
    marginTop: 10,
    width: '100%',
  },
  linkText: {
    color: '#3F72AF',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});
