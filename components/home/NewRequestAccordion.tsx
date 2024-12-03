// components/home/NewRequestAccordion.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge, Box, Modal, Button } from 'native-base';
import { RepairRequest } from '@/models/RepairRequest';
import { COLORS } from '@/constants/Colors';

interface Props {
  request: RepairRequest;
}

const NewRequestAccordion: React.FC<Props> = ({ request }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <Box style={styles.container}>
      <View style={styles.row1}>
        <Text>Vấn đề:</Text>
        <Button variant="link" onPress={() => setModalOpen(true)}>Chi tiết</Button>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text>Loại yêu cầu:</Text>
        <Badge style={[styles.badge, request.categoryRequest === 1 ? styles.pay : styles.free]}>
          {request.categoryRequest === 1 ? 'SỬA CHỮA' : 'BẢO HÀNH'}
        </Badge>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text>Chi phí:</Text>
        <Badge style={[styles.badge, request.contractId ? styles.free : styles.pay]}>
          {request.contractId ? 'MIỄN PHÍ' : 'TRẢ PHÍ'}
        </Badge>
      </View>

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header style={{ backgroundColor: '#3F72AF' }}>
            <Text style={{ color: '#f9f7f7', fontWeight: 'bold', fontSize: 18 }}>Chi tiết vấn đề</Text>
          </Modal.Header>
          <Modal.Body style={styles.modalBody}>
            <Text>{request.customerProblem}</Text>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: COLORS.newRequest,
    borderRadius: 8,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  badge: {
    padding: 5,
    borderRadius: 12,
  },
  pay: {
    backgroundColor: COLORS.pay,
  },
  free: {
    backgroundColor: COLORS.free,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 5,
  },
  modalBody: {
    backgroundColor: '#DBE2EF',
  },
});

export default NewRequestAccordion;
