import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { RepairRequest } from '../../../models/RepairRequest';
import { MaterialIcons } from '@expo/vector-icons';

interface RequestAccordionProps {
  request: RepairRequest;
}

const RequestAccordion: React.FC<RequestAccordionProps> = ({ request }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleCollapse} style={styles.header}>
        <Text style={styles.title}>Mã yêu cầu: {request.requestId}</Text>
        <MaterialIcons name={isCollapsed ? 'expand-more' : 'expand-less'} size={24} color="#FFF" />
      </TouchableOpacity>
      <Collapsible collapsed={isCollapsed}>
        <View style={styles.content}>
          <Text>Vấn đề: {request.customerProblem}</Text>
          <Text>Phòng: {request.roomId}</Text>
          <Text>Trạng thái: {request.status}</Text>
          <Text>Bắt đầu: {request.start}</Text>
          <Text>Kết thúc: {request.end || 'Chưa hoàn thành'}</Text>
        </View>
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 10 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3F72AF',
    borderRadius: 8,
  },
  title: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  content: { padding: 10, backgroundColor: '#DBE2EF' },
});

export default RequestAccordion;
