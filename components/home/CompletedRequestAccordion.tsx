import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge, Pressable } from 'native-base';
import { RepairRequest } from '../../models/RepairRequest';
import { COLORS } from '../../constants/Colors';
import { formatDate } from '../../utils/formatDate';

interface Props {
  request: RepairRequest;
}

const CompletedRequestAccordion: React.FC<Props> = ({ request }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Ngày thực hiện:</Text>
        <Text style={styles.value}>{formatDate(request.start)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>Ngày hoàn thành:</Text>
        <Text style={styles.value}>{request.end ? formatDate(request.end) : 'N/A'}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>Loại sửa chữa:</Text>
        <Badge style={[styles.badge, request.categoryRequest === 'pay' ? styles.pay : styles.free]}>
          {request.categoryRequest === 'pay' ? 'Tính Phí' : 'Miễn Phí'}
        </Badge>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>Sản phẩm mua kèm:</Text>
        <Pressable>
          <Text style={styles.detailLink}>chi tiết</Text>
        </Pressable>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>Đánh giá dịch vụ:</Text>
        <Pressable>
          <Text style={styles.detailLink}>xem đánh giá</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: COLORS.newRequest,
    borderRadius: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontWeight: '600',
  },
  value: {
    color: COLORS.primaryText,
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
  detailLink: {
    color: COLORS.link,
    textDecorationLine: 'underline',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 5,
  },
});

export default CompletedRequestAccordion;
