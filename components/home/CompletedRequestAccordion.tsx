import React, { useState } from 'react';
import { View, Text, StyleSheet, Linking } from 'react-native';
import { Badge, Pressable, Modal, Button, TextArea, Toast } from 'native-base';
import { RepairRequest } from '@/models/RepairRequest';
import { COLORS } from '@/constants/Colors';
import { formatDate } from '@/utils/formatDate';
import useRequest from '@/hooks/useRequest';

interface Props {
  request: RepairRequest;
}

const CompletedRequestAccordion: React.FC<Props> = ({ request }) => {
  const { submitFeedback, loading } = useRequest();
  const [isProblemModalOpen, setProblemModalOpen] = useState(false);
  const [isConclusionModalOpen, setConclusionModalOpen] = useState(false);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState<string>('');

  const feedbacks = request.feedback?.filter((feedback) => feedback.status) || [];

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Text
          key={i}
          style={{
            fontSize: 50,
            color: i <= rating ? '#3F72AF' : '#D1D1D1',
          }}
          onPress={() => setRating(i)}
        >
          ★
        </Text>
      );
    }
    return stars;
  };

  const handleFeedbackSubmit = () => {
    if (rating === 0 || content.trim().length === 0) {
      Toast.show({
        description: 'Vui lòng chọn số sao và nhập nội dung đánh giá.',
        duration: 3000,
        bg: 'red.500',
      });
      return;
    }
    submitFeedback(request.requestId, content, rating);
    setFeedbackModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row1}>
        <Text>Vấn đề:</Text>
        <Button variant="link" onPress={() => setProblemModalOpen(true)}>Chi tiết</Button>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text>Ngày bắt đầu:</Text>
        <Text>{formatDate(request.start)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text>Ngày hoàn thành:</Text>
        <Text>{request.end ? formatDate(request.end) : 'N/A'}</Text>
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
      {request.conclusion && (
        <>
          <View style={styles.divider} />
          <View style={styles.row1}>
            <Text>Kết luận:</Text>
            <Button variant="link" onPress={() => setConclusionModalOpen(true)}>Chi tiết</Button>
          </View>
        </>
      )}
      <View style={styles.divider} />
      <View>
        {feedbacks.length === 0 ? (
          <View style={styles.row1}>
            <Text>Đánh giá yêu cầu: (Chưa có)</Text>
            <Button style={styles.buttonfb} onPress={() => setFeedbackModalOpen(true)}>Đánh giá</Button>
          </View>
        ) : (
          <View style={styles.row1}>
            <Text>Đánh giá yêu cầu:</Text>
            <Button variant="link" onPress={() => setFeedbackModalOpen(true)}>Chi tiết</Button>
          </View>
        )}
      </View>

      <Modal isOpen={isFeedbackModalOpen} onClose={() => {
        setFeedbackModalOpen(false);
        setContent('');
        setRating(0);
      }}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header style={{ backgroundColor: '#3F72AF' }}>
            <Text style={{ color: '#f9f7f7', fontWeight: 'bold', fontSize: 18 }}>Đánh giá yêu cầu</Text>
          </Modal.Header>
          <Modal.Body style={styles.modalBody}>
            {feedbacks.length > 0 ? (
              <>
                <Text>{feedbacks[0].content}</Text>
                <View style={styles.starsContainer}>
                  {renderStars(feedbacks[0].rate)}
                </View>
              </>
            ) : (
              <>
                <TextArea
                  value={content}
                  fontSize={16}
                  onChangeText={setContent}
                  placeholder="Nhập phản hồi của bạn"
                  maxLength={200}
                  autoCompleteType="off"
                />

                <Text style={styles.starsContainer}>
                  {renderStars(rating)}
                </Text>
              </>
            )}
          </Modal.Body>
          {feedbacks.length === 0 && (
            <Modal.Footer style={styles.modalFooter}>
              <Button
                style={{ backgroundColor: '#d9534f', width: '48%' }}
                onPress={() => {
                  setFeedbackModalOpen(false);
                  setContent('');
                  setRating(0);
                }}
              >
                Hủy
              </Button>
              <Button
                isLoading={loading}
                style={{ backgroundColor: '#3F72AF', width: '48%' }}
                onPress={handleFeedbackSubmit}
              >
                Xác nhận
              </Button>
            </Modal.Footer>
          )}
        </Modal.Content>
      </Modal>


      <Modal isOpen={isProblemModalOpen} onClose={() => setProblemModalOpen(false)}>
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

      <Modal isOpen={isConclusionModalOpen} onClose={() => setConclusionModalOpen(false)}>
        <Modal.Content>
          <Modal.CloseButton />
          <Modal.Header style={{ backgroundColor: '#3F72AF' }}>
            <Text style={{ color: '#f9f7f7', fontWeight: 'bold', fontSize: 18 }}>Chi tiết kết luận</Text>
          </Modal.Header>
          <Modal.Body style={styles.modalBody}>
            <Text>{request.conclusion}</Text>
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
  buttonfb: {
    borderRadius: 12,
    backgroundColor: '#3F72AF',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
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
  starsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
});

export default CompletedRequestAccordion;
