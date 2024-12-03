import React from "react";
import { Modal, Button, Text, HStack } from "native-base";
import { View } from "react-native";
import LottieView from "lottie-react-native";

interface SignOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const SignOutModal: React.FC<SignOutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content maxWidth="400px" bg="#DBE2EF">
        <Modal.Body alignItems="center">
          <View >
            <LottieView
              source={require('@/assets/animations/signout.json')} // Đường dẫn tới file animation
              autoPlay
              loop
              speed={1.6}
              style={{ width: 200, height: 200 }}
            />
          </View>
          <Text fontSize="lg" fontWeight="bold" textAlign="center" mb={2}>
            BẠN ĐANG RỜI ĐI
          </Text>
          <Text fontSize="md" color="#6C757D" textAlign="center" mb={4}>
            Bạn có chắc muốn đăng xuất không?
          </Text>
          <HStack space={4} justifyContent="center" width="100%">
            <Button variant="outline" colorScheme="coolGray" flex={1} onPress={onClose} style={{ borderColor: '#3F72AF', borderWidth: 2 }}>
              Huỷ
            </Button>
            <Button
              bg="#3F72AF"
              _text={{ color: "white" }}
              flex={1}
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              Có
            </Button>
          </HStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
};

export default SignOutModal;
