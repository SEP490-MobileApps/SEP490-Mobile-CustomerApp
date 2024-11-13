// components/home/CanceledRequestAccordion.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pressable, Modal, Button } from 'native-base';
import { RepairRequest } from '../../models/RepairRequest';
import { COLORS } from '../../constants/Colors';
import { formatDate } from '../../utils/formatDate';

interface Props {
  request: RepairRequest;
}

const CanceledRequestAccordion: React.FC<Props> = ({ request }) => {
  const [isConclusionModalOpen, setConclusionModalOpen] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text>Ngày hủy:</Text>
        <Text>{formatDate(request.end || '')}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text>Lý do hủy:</Text>
        <Button size="xs" variant="link" onPress={() => setConclusionModalOpen(true)}>Xem chi tiết</Button>
      </View>

      {/* Modal hiện thông tin kết luận */}
      <Modal isOpen={isConclusionModalOpen} onClose={() => setConclusionModalOpen(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header>Chi tiết lý do hủy</Modal.Header>
          <Modal.Body>
            <Text>{request.conclusion || 'Không có lý do'}</Text>
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

export default CanceledRequestAccordion;
