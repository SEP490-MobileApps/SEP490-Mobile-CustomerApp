import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGlobalState } from '@/contexts/GlobalProvider';
import useRequest from '@/hooks/useRequest';
import Collapsible from 'react-native-collapsible';
import { MaterialIcons } from '@expo/vector-icons';
import NewRequestAccordion from '@/components/home/NewRequestAccordion';
import InProgressAccordion from '@/components/home/InProgressAccordion';
import CompletedRequestAccordion from '@/components/home/CompletedRequestAccordion';
import CanceledRequestAccordion from '@/components/home/CanceledRequestAccordion';
import { RepairRequest } from '@/models/RepairRequest';
import Lottie from 'lottie-react-native';
import NoData from '@/components/ui/NoData';

const TABS = [
  { label: 'Yêu Cầu Mới', status: 0, color: '#DBE2EF' },
  { label: 'Đang Thực Hiện', status: 1, color: '#FFB74D' },
  { label: 'Hoàn Thành', status: 2, color: '#4CAF50' },
  { label: 'Hủy Bỏ', status: 3, color: '#E57373' },
];

const RequestListScreen = () => {
  const { allRequests, fetchAllRequests, loading } = useRequest();
  const { userInfo } = useGlobalState();
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<number>(0);

  React.useEffect(() => {
    if (userInfo?.accountId) {
      fetchAllRequests(userInfo.accountId, selectedTab);
    }
  }, [userInfo?.accountId, selectedTab]);

  const toggleAccordion = (requestId: string) => {
    setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
  };

  const renderAccordionContent = (request: RepairRequest) => {
    switch (request.status) {
      case 0:
        return <NewRequestAccordion request={request} />;
      case 1:
        return <InProgressAccordion request={request} />;
      case 2:
        return <CompletedRequestAccordion request={request} />;
      case 3:
        return <CanceledRequestAccordion request={request} />;
      default:
        return null;
    }
  };

  const renderBadge = (status: number) => {
    switch (status) {
      case 0:
        return (
          <View style={[styles.badge, styles.newBadge]}>
            <Text style={styles.badgeText}>Yêu Cầu Mới</Text>
          </View>
        );
      case 1:
        return (
          <View style={[styles.badge, styles.inProgressBadge]}>
            <Text style={styles.badgeText}>Đang Thực Hiện</Text>
          </View>
        );
      case 2:
        return (
          <View style={[styles.badge, styles.completedBadge]}>
            <Text style={styles.badgeText}>Hoàn Thành</Text>
          </View>
        );
      case 3:
        return (
          <View style={[styles.badge, styles.canceledBadge]}>
            <Text style={styles.badgeText}>Hủy Bỏ</Text>
          </View>
        );
      default:
        return null;
    }
  };

  const renderTabs = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScrollContainer}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.status}
          onPress={() => setSelectedTab(tab.status)}
          style={[styles.badgeContainer, selectedTab === tab.status && {
            backgroundColor: tab.color, borderWidth: 3, borderColor: '#112D4E'
          }]}
        >
          <Text style={[styles.badgeText, selectedTab === tab.status && { color: '#112D4E' }]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
        <Lottie
          source={require('@/assets/animations/loading.json')}
          autoPlay
          loop
          style={{ width: 150, height: 150 }}
        />
      </View>
    );
  }

  if (!allRequests || allRequests.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
        <NoData />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>{renderTabs()}</View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {allRequests.map((request) => (
          <View key={request.requestId} style={styles.accordionContainer}>
            <TouchableOpacity
              onPress={() => toggleAccordion(request.requestId)}
              style={styles.header}
            >
              <Text style={styles.headerText}>Mã căn hộ: {request.roomId}</Text>
              <View style={styles.rowContainer}>
                {renderBadge(request.status)}
                <MaterialIcons
                  name={
                    expandedRequestId === request.requestId
                      ? 'expand-less'
                      : 'expand-more'
                  }
                  size={24}
                  color="white"
                  style={styles.arrowIcon}
                />
              </View>
            </TouchableOpacity>
            <Collapsible collapsed={expandedRequestId !== request.requestId}>
              {renderAccordionContent(request)}
            </Collapsible>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F9F7F7' },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 5,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#3F72AF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#112D4E',
  },
  accordionContainer: { marginBottom: 10 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3F72AF',
    borderRadius: 8,
  },
  rowContainer: { flexDirection: 'row', alignItems: 'center' },
  headerText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 2 },
  newBadge: { backgroundColor: '#DBE2EF' },
  inProgressBadge: { backgroundColor: '#FFB74D' },
  completedBadge: { backgroundColor: '#4CAF50' },
  canceledBadge: { backgroundColor: '#E57373' },
  arrowIcon: { marginLeft: 2 },
  tabScrollContainer: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  badgeContainer: {
    marginHorizontal: 5,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#112D4E',
  },
  loadingAnimation: {
    width: 150,
    height: 150,
  },
});

export default RequestListScreen;
