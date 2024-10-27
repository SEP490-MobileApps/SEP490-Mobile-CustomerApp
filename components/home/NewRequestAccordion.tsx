import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge, Box } from 'native-base';
import { RepairRequest } from '../../models/RepairRequest';
import { COLORS } from '../../constants/Colors';

interface Props {
  request: RepairRequest;
}

const NewRequestAccordion: React.FC<Props> = ({ request }) => (
  <Box style={styles.container}>
    <View style={styles.row}>
      <Text>Loại sửa chữa</Text>
      <Badge style={[styles.badge, request.categoryRequest === 'pay' ? styles.pay : styles.free]}>
        {request.categoryRequest === 'pay' ? 'Tính Phí' : 'Miễn Phí'}
      </Badge>
    </View>
    <View style={styles.divider} />
    <View style={styles.row}>
      <Text>Yêu cầu chi tiết</Text>
      <Text style={styles.link}>chi tiết</Text>
    </View>
  </Box>
);

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

export default NewRequestAccordion;
