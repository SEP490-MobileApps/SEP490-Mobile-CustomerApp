// components/home/InProgressAccordion.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge, Pressable, Modal, Button } from 'native-base';
import { RepairRequest } from '../../models/RepairRequest';
import { COLORS } from '../../constants/Colors';
import { formatDate } from '../../utils/formatDate';

interface Props {
  request: RepairRequest;
}

const InProgressAccordion: React.FC<Props> = ({ request }) => {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>Vấn đề:</Text>
        <Button size="xs" variant="link" onPress={() => setModalOpen(true)}>Chi tiết</Button>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text>Ngày bắt đầu:</Text>
        <Text>{formatDate(request.start)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text>Loại yêu cầu:</Text>
        <Badge style={[styles.badge, request.categoryRequest === 1 ? styles.pay : styles.free]}>
          {request.categoryRequest === 1 ? 'SỬA CHỮA' : 'BẢO HÀNH'}
        </Badge>
      </View>
      {request.fileUrl && (
        <>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text>Sản phẩm mua kèm:</Text>
            <Pressable onPress={() => console.log('Xem sản phẩm')}>
              <Text style={styles.link}>Chi tiết</Text>
            </Pressable>
          </View>
        </>
      )}

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
    </View>
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
  link: {
    color: COLORS.link,
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 5,
  },
});

export default InProgressAccordion;
