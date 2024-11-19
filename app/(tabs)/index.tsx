// app/(tabs)/index.tsx
import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Image } from 'react-native';
import { Box, Icon, Badge } from 'native-base';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import RecentRepairs from '../../components/home/RecentRepairs';
import CustomerReviews from '../../components/home/CustomerReviews';
import CustomerInUseContract from '../../components/home/CustomerInUseContract'; // Import component mới
import FloatButton from '../../components/ui/FloatButton';
import LeaderContactModal from '../../components/home/LeaderContactModal';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect
import useUser from '../../hooks/useUser';
import useRequest from '../../hooks/useRequest';
import useServicePackages from '../../hooks/useServicePackage'; // Import custom hook mới
import { useGlobalState } from '@/contexts/GlobalProvider';
import NoDataComponent from '@/components/ui/NoDataComponent';


function HomeScreen(): React.JSX.Element {
  const { user, leaderInfo, fetchUserAndLeader, loading: userLoading } = useUser();
  const { requests, feedbacks, fetchRecentRequests, fetchFeedbacks, loading: requestLoading } = useRequest();
  const { contracts, fetchCustomerContracts, loading: contractLoading } = useServicePackages();
  const [isModalOpen, setModalOpen] = useState(false);
  const { userInfo } = useGlobalState();

  useFocusEffect(
    React.useCallback(() => {
      // Fetch user and leader information
      fetchUserAndLeader();

      // Fetch recent requests
      fetchRecentRequests(3);

      // Fetch customer contracts if user accountId exists
      if (userInfo?.accountId) {
        fetchCustomerContracts(userInfo.accountId);
      }

      fetchFeedbacks();

    }, []) // No dependencies
  );

  const handleFloatButtonPress = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Khung chứa thông tin người dùng */}
        <Box style={styles.infoContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.avatarUrl || 'https://via.placeholder.com/50' }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{user?.fullName || 'Người dùng chưa xác định'}</Text>
          </View>
        </Box>

        {/* Ảnh chính */}
        <Image
          source={require('../../assets/images/home.png')}
          style={styles.homeImage}
          resizeMode="cover"
        />

        {/* Phần sửa chữa gần đây */}
        {requestLoading ? (
          <Text>Đang tải dữ liệu...</Text>
        ) : requests.length === 0 ? (
          <NoDataComponent
            imageUrl={require('../../assets/images/no-request.png')}
            title="Không có yêu cầu sửa chữa"
            description="Hiện tại bạn không có yêu cầu sửa chữa nào."
          />
        ) : (
          <RecentRepairs requests={requests} />
        )}

        {/* Đường kẻ phân cách */}
        <View style={styles.divider} />

        {/* Phần hợp đồng đang sử dụng */}
        <Text style={styles.title}>HỢP ĐỒNG ĐANG SỬ DỤNG</Text>
        {contractLoading ? (
          <Text>Đang tải dữ liệu hợp đồng...</Text>
        ) : contracts.filter(contract => contract.remainingNumOfRequests > 0).length === 0 ? (
          <NoDataComponent
            imageUrl={require('../../assets/images/no-contract.png')}
            title="Không có hợp đồng"
            description="Hiện tại bạn không có hợp đồng nào đang được sử dụng."
          />
        ) : (
          contracts
            .filter(contract => contract.remainingNumOfRequests > 0)
            .map(contract => (
              <CustomerInUseContract key={contract.contractId} contract={contract} />
            ))
        )}

        {/* Đường kẻ phân cách */}
        <View style={styles.divider} />

        {/* Phần đánh giá từ khách hàng */}
        <Text style={styles.title}>ĐÁNH GIÁ TỪ KHÁCH HÀNG</Text>
        {feedbacks.length === 0 ? (
          <NoDataComponent
            imageUrl={require('../../assets/images/no-review.png')}
            title="Không có đánh giá"
            description="Hiện tại chưa có đánh giá nào cho dịch vụ này."
          />
        ) : (
          <CustomerReviews feedbacks={feedbacks} />
        )}
      </ScrollView>

      {/* Nút Float Button với icon tùy chỉnh */}
      <FloatButton
        onPress={handleFloatButtonPress}
        icon={<Icon as={FontAwesome5} name="phone" size="md" color="#DBE2EF" />}
      />

      {/* Modal thông tin liên hệ */}
      {leaderInfo && (
        <LeaderContactModal
          isOpen={isModalOpen}
          onClose={closeModal}
          leader={leaderInfo}
          onContactPress={() => { }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F7F7',
  },
  scrollContent: {
    padding: 16,
    backgroundColor: '#F9F7F7',
  },
  infoContainer: {
    backgroundColor: '#DBE2EF',
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  homeImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#112D4E',
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#112D4E'
  }
});

export default HomeScreen;
