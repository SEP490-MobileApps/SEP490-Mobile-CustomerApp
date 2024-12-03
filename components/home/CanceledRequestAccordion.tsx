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
      <View style={styles.row1}>
        <Text>Lý do hủy:</Text>
        <Button variant="link" onPress={() => setConclusionModalOpen(true)}>Chi tiết</Button>
      </View>

      {/* Modal hiện thông tin kết luận */}
      <Modal isOpen={isConclusionModalOpen} onClose={() => setConclusionModalOpen(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header style={{ backgroundColor: '#3F72AF' }}>
            <Text style={{ color: '#f9f7f7', fontWeight: 'bold', fontSize: 18 }}>Chi tiết lý do hủy </Text>
          </Modal.Header>
          <Modal.Body style={styles.modalBody}>
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
  link: {
    color: COLORS.link,
    paddingHorizontal: 10,
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

export default CanceledRequestAccordion;
