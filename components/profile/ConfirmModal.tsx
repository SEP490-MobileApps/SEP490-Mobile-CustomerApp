import React from 'react';
import { Button, Modal, Text, VStack } from 'native-base';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm }: ConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Content maxWidth="400px">
        <Modal.CloseButton />
        <Modal.Header>Xác nhận</Modal.Header>
        <Modal.Body>
          <Text>Bạn có chắc chắn muốn lưu các thay đổi không?</Text>
        </Modal.Body>
        <Modal.Footer>
          <Button.Group space={2}>
            <Button variant="ghost" colorScheme="coolGray" onPress={onClose}>
              Hủy
            </Button>
            <Button colorScheme="primary" onPress={onConfirm}>
              Lưu
            </Button>
          </Button.Group>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
}
