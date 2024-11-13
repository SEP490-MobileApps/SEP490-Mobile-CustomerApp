import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Modal, Button, Radio, Divider, IconButton, Icon, useToast, HStack } from 'native-base';
import { AntDesign } from '@expo/vector-icons';
import { router } from 'expo-router';

interface PaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMethod: string;
  setSelectedMethod: (method: string) => void;
}

const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  isOpen,
  onClose,
  selectedMethod,
  setSelectedMethod,
}) => {
  const toast = useToast();

  const handleConfirm = () => {
    if (selectedMethod === 'payos') {
      toast.show({
        render: () => (
          <HStack space={2} alignItems="center" bg="green.500" px={4} py={2} rounded="sm" mb={5}>
            <Icon as={<AntDesign name="checkcircle" />} color="white" size="sm" />
            <Text>
              Thanh toán thành công, sẽ có 1 worker đưa hợp đồng cho bạn ký !!!
            </Text>
          </HStack>
        ),
        placement: 'top',
        duration: 10000,
      });
    } else if (selectedMethod === 'cash') {
      toast.show({
        render: () => (
          <HStack space={2} alignItems="center" bg="blue.500" px={4} py={2} rounded="sm" mb={5}>
            <Icon as={<AntDesign name="infocirlce" />} color="white" size="sm" />
            <Text>
              Sẽ có 1 worker đưa hợp đồng cho bạn ký,bạn sẽ thanh toán sau !!!
            </Text>
          </HStack>
        ),
        placement: 'top',
        duration: 10000,
      });
    }
    onClose(); // Close the modal
    router.replace("/(tabs)"); // Navigate back to home screen (change 'HomeScreen' to your screen name)
  };

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
            onChange={(nextValue) => setSelectedMethod(nextValue)}
          >
            <View style={styles.paymentOptionContainer}>
              <Image source={require('../../assets/images/cash.png')} style={styles.paymentImage} />
              <Text style={styles.paymentText}>Bằng tiền mặt</Text>
              <Radio
                value="cash"
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
                value="payos"
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
