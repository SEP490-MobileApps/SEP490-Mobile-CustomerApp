import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Pressable } from 'native-base';
import { RepairRequest } from '../../models/RepairRequest';
import { COLORS } from '../../constants/Colors';
import { formatDate } from '../../utils/formatDate';

interface Props {
  request: RepairRequest;
}

const CanceledRequestAccordion: React.FC<Props> = ({ request }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Ngày hủy:</Text>
        <Text style={styles.value}>{formatDate(request.end || '')}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.label}>Lý do hủy:</Text>
        <Pressable>
          <Text style={styles.detailLink}>chi tiết</Text>
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

export default CanceledRequestAccordion;
