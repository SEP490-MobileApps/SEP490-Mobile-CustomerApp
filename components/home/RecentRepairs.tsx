// components/home/RecentRepairs.tsx
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { MaterialIcons } from '@expo/vector-icons';
import NewRequestAccordion from './NewRequestAccordion';
import InProgressAccordion from './InProgressAccordion';
import CompletedRequestAccordion from './CompletedRequestAccordion';
import CanceledRequestAccordion from './CanceledRequestAccordion';
import { RepairRequest } from '@/models/RepairRequest';

interface RecentRepairsProps {
  requests: RepairRequest[];
}

const RecentRepairs: React.FC<RecentRepairsProps> = ({ requests }) => {
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  const sortedRequests = useMemo(() => {
    const sorted = [...requests].sort((a, b) => a.status - b.status);
    return sorted.slice(0, 3); // Get top 3 requests
  }, [requests]);

  const toggleAccordion = (requestId: string) => {
    setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
  };

  const renderAccordionContent = (request: RepairRequest) => {
    switch (request.status) {
      case 0: // requested
        return <NewRequestAccordion key={request.requestId} request={request} />;
      case 1: // processing
        return <InProgressAccordion key={request.requestId} request={request} />;
      case 2: // done
        return <CompletedRequestAccordion key={request.requestId} request={request} />;
      case 3: // canceled
        return <CanceledRequestAccordion key={request.requestId} request={request} />;
      default:
        return null;
    }
  };

  const renderBadge = (status: number) => {
    switch (status) {
      case 0:
        return <View style={[styles.badge, styles.newBadge]}><Text style={styles.badgeText}>Yêu Cầu Mới</Text></View>;
      case 1:
        return <View style={[styles.badge, styles.inProgressBadge]}><Text style={styles.badgeText}>Đang Thực Hiện</Text></View>;
      case 2:
        return <View style={[styles.badge, styles.completedBadge]}><Text style={styles.badgeText}>Hoàn Thành</Text></View>;
      case 3:
        return <View style={[styles.badge, styles.canceledBadge]}><Text style={styles.badgeText}>Hủy Bỏ</Text></View>;
      default:
        return null;
    }
  };

  return (
    <View>
      {sortedRequests.map((request) => (
        <View key={request.requestId} style={styles.accordionContainer}>
          <TouchableOpacity onPress={() => toggleAccordion(request.requestId)} style={styles.header}>
            <Text style={styles.headerDate}>Mã căn hộ: {request.roomId}</Text>
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
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#112D4E'
  },
  accordionContainer: {
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3F72AF',
    borderRadius: 8,
    // Thêm hiệu ứng bóng cho header
    shadowColor: '#000', // Màu bóng (đen)
    shadowOffset: { width: 0, height: 3 }, // Độ đậm của bóng
    shadowOpacity: 0.1, // Độ mờ của bóng
    shadowRadius: 4, // Bán kính bóng
    elevation: 5, // Chỉ áp dụng cho Android
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
    marginRight: 2,
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
