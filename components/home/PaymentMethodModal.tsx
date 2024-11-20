// components/home/PaymentMethodModal.tsx

import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Modal, Button, Radio, Divider, IconButton, Icon } from 'native-base';
import { AntDesign } from '@expo/vector-icons';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
  handleConfirm: () => void; // Thêm hàm xử lý khi nhấn nút "Xác Nhận"
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  isOpen,
  onClose,
  selectedMethod,
  setSelectedMethod,
  handleConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
      <Modal.Content width="80%">
        <Modal.Header style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Chọn phương thức thanh toán</Text>
          <IconButton
            icon={<Icon as={AntDesign} name="close" color="white" size="sm" />}
            onPress={onClose}
            style={styles.customCloseButton}
          />
        </Modal.Header>
        <Modal.Body style={styles.modalBody}>
          <Radio.Group
            name="paymentMethodGroup"
            value={selectedMethod}
            onChange={(nextValue) => setSelectedMethod(nextValue)} // Cập nhật paymentMethod
          >
            <View style={styles.paymentOptionContainer}>
              <Image source={require('../../assets/images/cash.png')} style={styles.paymentImage} />
              <Text style={styles.paymentText}>Bằng tiền mặt</Text>
              <Radio
                value="cash" // Giá trị 'cash'
                colorScheme="blue"
                accessibilityLabel="Thanh toán bằng tiền mặt"
                style={styles.radioButton}
              />
            </View>

            <Divider my={2} bg="#CCC" />

            <View style={styles.paymentOptionContainer}>
              <Image source={require('../../assets/images/payos.png')} style={styles.paymentImage} />
              <Text style={styles.paymentText}>Bằng PayOS</Text>
              <Radio
                value="payos" // Giá trị 'payos'
                colorScheme="blue"
                accessibilityLabel="Thanh toán bằng PayOS"
                style={styles.radioButton}
              />
            </View>
          </Radio.Group>
        </Modal.Body>
        <Modal.Footer style={styles.modalFooter}>
          <Button onPress={onClose} variant="outline" style={styles.cancelButton}>
            Hủy
          </Button>
          <Button onPress={handleConfirm} style={styles.modalConfirmButton}>
            Xác Nhận
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalHeader: {
    backgroundColor: '#3F72AF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  customCloseButton: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalBody: {
    backgroundColor: '#DBE2EF',
    paddingVertical: 10,
  },
  modalFooter: {
    backgroundColor: '#F9F7F7',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  paymentOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  paymentText: {
    flex: 1,
  },
  paymentImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  radioButton: {
    marginRight: 0,
  },
  cancelButton: {
    borderColor: '#3F72AF',
    color: '#3F72AF',
    marginHorizontal: 10,
    fontWeight: 'bold',
    width: 120,
  },
  modalConfirmButton: {
    backgroundColor: '#3F72AF',
    paddingHorizontal: 20,
    width: 120,
  },
});

export default PaymentMethodModal;
