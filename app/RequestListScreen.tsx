// app/RequestListScreen.tsx
import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobalState } from '../contexts/GlobalProvider';
import useRequest from '../hooks/useRequest';
import Collapsible from 'react-native-collapsible';
import { MaterialIcons } from '@expo/vector-icons';
import NewRequestAccordion from '../components/home/NewRequestAccordion';
import InProgressAccordion from '../components/home/InProgressAccordion';
import CompletedRequestAccordion from '../components/home/CompletedRequestAccordion';
import CanceledRequestAccordion from '../components/home/CanceledRequestAccordion';
import { RepairRequest } from '../models/RepairRequest';

const RequestListScreen = () => {
  const { allRequests, fetchAllRequests, loading } = useRequest();
  const { userInfo } = useGlobalState();
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);

  React.useEffect(() => {
    if (userInfo?.accountId) {
      fetchAllRequests(userInfo.accountId);
    }
  }, [userInfo?.accountId]);

  if (loading) {
    return <Text>Đang tải danh sách yêu cầu...</Text>;
  }

  if (!allRequests || allRequests.length === 0) {
    return <Text>Không có yêu cầu nào.</Text>;
  }

  const toggleAccordion = (requestId: string) => {
    setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
  };

  const renderAccordionContent = (request: RepairRequest) => {
    switch (request.status) {
      case 0: // New
        return <NewRequestAccordion request={request} />;
      case 1: // In Progress
        return <InProgressAccordion request={request} />;
      case 2: // Completed
        return <CompletedRequestAccordion request={request} />;
      case 3: // Canceled
        return <CanceledRequestAccordion request={request} />;
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
    <ScrollView style={styles.container}>
      {allRequests.map((request) => (
        <View key={request.requestId} style={styles.accordionContainer}>
          <TouchableOpacity onPress={() => toggleAccordion(request.requestId)} style={styles.header}>
            <Text style={styles.headerText}>Mã căn hộ: {request.roomId}</Text>
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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#F9F7F7' },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#112D4E' },
  accordionContainer: { marginBottom: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, backgroundColor: '#3F72AF', borderRadius: 8 },
  rowContainer: { flexDirection: 'row', alignItems: 'center' },
  headerText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 2 },
  badgeText: { color: '#112D4E', fontSize: 12, fontWeight: 'bold' },
  newBadge: { backgroundColor: '#DBE2EF' },
  inProgressBadge: { backgroundColor: '#FFB74D' },
  completedBadge: { backgroundColor: '#4CAF50' },
  canceledBadge: { backgroundColor: '#E57373' },
  arrowIcon: { marginLeft: 2 },
});

export default RequestListScreen;
