import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Badge, Pressable, Modal, Button, Image } from 'native-base';
import { RepairRequest } from '../../models/RepairRequest';
import { COLORS } from '../../constants/Colors';
import { formatDate } from '../../utils/formatDate';

interface Props {
  request: RepairRequest;
}

const InProgressAccordion: React.FC<Props> = ({ request }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [showPreRepairModal, setShowPreRepairModal] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.row1}>
        <Text>Vấn đề:</Text>
        <Button variant="link" onPress={() => setModalOpen(true)}>Chi tiết</Button>
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
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text>Chi phí:</Text>
        <Badge style={[styles.badge, request.contractId ? styles.free : styles.pay]}>
          {request.contractId ? 'MIỄN PHÍ' : 'TRẢ PHÍ'}
        </Badge>
      </View>

      <View style={styles.divider} />
      <View style={styles.row}>
        <Text>Bằng Chứng Trước Sửa Chữa:</Text>
        <Pressable onPress={() => setShowPreRepairModal(true)}>
          <Text style={styles.link}>Chi tiết</Text>
        </Pressable>
      </View>

      {request.fileUrl && (
        <>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text>Sản phẩm mua kèm:</Text>
            <Pressable onPress={() => Linking.openURL(request.fileUrl)}>
              <Text style={styles.link}>Chi tiết</Text>
            </Pressable>
          </View>
        </>
      )}

      {/* Modal hiện thông tin chi tiết */}
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

      <Modal
        isOpen={showPreRepairModal}
        onClose={() => setShowPreRepairModal(false)}
        size="full"
      >
        <Modal.Content style={{ width: '90%' }}>
          <Modal.CloseButton />
          <Modal.Header style={{ backgroundColor: '#3F72AF', alignItems: 'center' }}>
            Ảnh Bằng Chứng Trước Sửa Chữa
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: '#DBE2EF' }}>
            <Image
              source={{ uri: request.preRepairEvidenceUrl }}
              alt="Pre Repair Evidence"
              width="100%"
              height={300}
            />
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

export default InProgressAccordion;
