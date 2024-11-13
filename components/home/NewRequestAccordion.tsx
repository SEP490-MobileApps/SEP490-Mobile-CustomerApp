// components/home/NewRequestAccordion.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge, Box, Modal, Button } from 'native-base';
import { RepairRequest } from '../../models/RepairRequest';
import { COLORS } from '../../constants/Colors';

interface Props {
  request: RepairRequest;
}

const NewRequestAccordion: React.FC<Props> = ({ request }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <Box style={styles.container}>
      <View style={styles.row}>
        <Text>Vấn đề:</Text>
        <Button size="xs" variant="link" onPress={() => setModalOpen(true)}>Chi tiết</Button>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text>Loại yêu cầu:</Text>
        <Badge style={[styles.badge, request.categoryRequest === 1 ? styles.pay : styles.free]}>
          {request.categoryRequest === 1 ? 'SỬA CHỮA' : 'BẢO HÀNH'}
        </Badge>
      </View>

      {/* Modal hiện thông tin chi tiết */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Chi tiết vấn đề</Modal.Header>
          <Modal.Body>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
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
});

export default NewRequestAccordion;
