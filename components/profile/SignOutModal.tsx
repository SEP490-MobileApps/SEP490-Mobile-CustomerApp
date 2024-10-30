import React from "react";
import { Modal, Button, VStack, Text, Image, HStack } from "native-base";

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
          <Image source={require("../../assets/images/signout.png")} alt="Sign Out" size="160" mb={4} />
          <Text fontSize="lg" fontWeight="bold" textAlign="center" mb={2}>
            BẠN ĐANG RỜI ĐI
          </Text>
          <Text fontSize="md" color="#6C757D" textAlign="center" mb={4}>
            Bạn có chắc muốn đăng xuất không?
          </Text>
          <HStack space={4} justifyContent="center" width="100%">
            <Button variant="outline" colorScheme="coolGray" flex={1} onPress={onClose}>
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
