import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { repairRequests } from '../../constants/Datas';
import { MaterialIcons } from '@expo/vector-icons';
import NewRequestAccordion from './NewRequestAccordion';
import InProgressAccordion from './InProgressAccordion';
import CompletedRequestAccordion from './CompletedRequestAccordion';
import CanceledRequestAccordion from './CanceledRequestAccordion';
import { RepairRequest } from '../../models/RepairRequest';
import { formatDate } from '../../utils/formatDate';

function RecentRepairs(): React.JSX.Element {
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  const toggleAccordion = (requestId: string) => {
    setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
  };

  const renderAccordionContent = (request: RepairRequest) => {
    switch (request.status) {
      case 'requested':
        return <NewRequestAccordion key={request.requestId} request={request} />;
      case 'processing':
        return <InProgressAccordion key={request.requestId} request={request} />;
      case 'done':
        return <CompletedRequestAccordion key={request.requestId} request={request} />;
      case 'canceled':
        return <CanceledRequestAccordion key={request.requestId} request={request} />;
      default:
        return null;
    }
  };

  const renderBadge = (status: string) => {
    switch (status) {
      case 'requested':
        return <View style={[styles.badge, styles.newBadge]}><Text style={styles.badgeText}>Yêu Cầu Mới</Text></View>;
      case 'processing':
        return <View style={[styles.badge, styles.inProgressBadge]}><Text style={styles.badgeText}>Đang Thực Hiện</Text></View>;
      case 'done':
        return <View style={[styles.badge, styles.completedBadge]}><Text style={styles.badgeText}>Hoàn Thành</Text></View>;
      case 'canceled':
        return <View style={[styles.badge, styles.canceledBadge]}><Text style={styles.badgeText}>Hủy Bỏ</Text></View>;
      default:
        return null;
    }
  };

  return (
    <View>
      <Text style={styles.sectionTitle}>NHỮNG LẦN SỬA CHỮA GẦN ĐÂY</Text>
      {repairRequests.slice(0, 3).map((request) => (
        <View key={request.requestId} style={styles.accordionContainer}>
          <TouchableOpacity onPress={() => toggleAccordion(request.requestId)} style={styles.header}>
            <Text style={styles.headerDate}>Ngày: {formatDate(request.start)}</Text>
            <View style={styles.rowContainer}>
              {renderBadge(request.status)}
              <MaterialIcons name={expandedRequestId === request.requestId ? "expand-less" : "expand-more"} size={24} color="white" style={styles.arrowIcon} />
            </View>
          </TouchableOpacity>
          <Collapsible collapsed={expandedRequestId !== request.requestId}>
            {renderAccordionContent(request)}
          </Collapsible>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#112D4E'
  },
  accordionContainer: {
    marginBottom: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3F72AF',
    borderRadius: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerDate: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 2, // Khoảng cách giữa badge và mũi tên
  },
  badgeText: {
    color: '#112D4E',
    fontSize: 12,
    fontWeight: 'bold',
  },
  newBadge: {
    backgroundColor: '#DBE2EF',
  },
  inProgressBadge: {
    backgroundColor: '#FFB74D',
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
  },
  canceledBadge: {
    backgroundColor: '#E57373',
  },
  arrowIcon: {
    marginLeft: 2,
  },
});

export default RecentRepairs;
