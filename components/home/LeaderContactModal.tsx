// components/home/LeaderContactModal.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Modal, Button } from 'native-base';
import { Linking, Alert } from 'react-native';

interface LeaderContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  leader: {
    accountId: string;
    fullName: string;
    email: string;
    password: string;
    phoneNumber: string;
    avatarUrl: string;
    dateOfBirth: Date;
  };
  onContactPress: () => void;
}

const LeaderContactModal: React.FC<LeaderContactModalProps> = ({
  isOpen,
  onClose,
  leader,
}) => {
  const handleCallPress = () => {
    if (leader.phoneNumber) {
      Linking.openURL(`tel:${leader.phoneNumber}`);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <Modal.Content style={styles.modalContent}>
        {/* Modal Title */}
        <Modal.Header style={styles.modalHeader}>
          <Text style={styles.headerText}>Yêu cầu sửa chữa</Text>
        </Modal.Header>

        <Modal.Body style={styles.modalBody}>
          {/* Avatar */}
          <Image source={{ uri: leader.avatarUrl }} style={styles.avatar} />

          {/* Leader's Name */}
          <Text style={styles.name}>{leader.fullName}</Text>

          {/* Leader's Phone Number */}
          <Text style={styles.phoneNumber}>{leader.phoneNumber}</Text>
        </Modal.Body>

        {/* Footer with Action Buttons */}
        <Modal.Footer style={styles.fullWidthFooter}>
          <Button variant="outline" onPress={onClose} style={styles.closeButton}>
            Đóng
          </Button>
          <Button onPress={handleCallPress} style={styles.contactButton}>
            Liên hệ ngay
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: '#DBE2EF',
    borderRadius: 12,
  },
  modalHeader: {
    backgroundColor: '#3F72AF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f9f7f7',
  },
  modalBody: {
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#112D4E',
    marginBottom: 8,
  },
  phoneNumber: {
    fontSize: 16,
    color: '#3F72AF',
    marginBottom: 16,
  },
  fullWidthFooter: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#F9F7F7',
    padding: 10,
  },
  closeButton: {
    borderColor: '#3F72AF',
    color: '#3F72AF',
    width: '48%',
  },
  contactButton: {
    backgroundColor: '#3F72AF',
    color: '#F9F7F7',
    width: '48%',
  },
});

export default LeaderContactModal;
