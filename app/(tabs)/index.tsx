// app/(tabs)/index.tsx
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Image } from 'react-native';
import { Box, Icon, Badge } from 'native-base';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import RecentRepairs from '../../components/home/RecentRepairs';
import CustomerReviews from '../../components/home/CustomerReviews';
import CustomerInUseContract from '../../components/home/CustomerInUseContract';
import FloatButton from '../../components/ui/FloatButton';
import LeaderContactModal from '../../components/home/LeaderContactModal';
import { useFocusEffect } from '@react-navigation/native';
import useUser from '../../hooks/useUser';
import useRequest from '../../hooks/useRequest';
import useServicePackages from '../../hooks/useServicePackage';
import { useGlobalState } from '@/contexts/GlobalProvider';
import NoDataComponent from '@/components/ui/NoDataComponent';
import { GetLatestPushNotificationRecordByLeaderId, InitializeFirestoreDb, sendPushNotification } from '@/utils/PushNotification';
import { User } from '@/models/User';
import { Leader } from '@/models/LeaderInfo';
import Lottie from 'lottie-react-native';

function HomeScreen(): React.JSX.Element {
  const { user, leaderInfo, fetchUserAndLeader, loading: userLoading } = useUser();
  const { requests, feedbacks, fetchRecentRequests, fetchFeedbacks, loading: requestLoading } = useRequest();
  const { contracts, fetchCustomerContracts, loading: contractLoading } = useServicePackages();
  const [isModalOpen, setModalOpen] = useState(false);
  const { userInfo } = useGlobalState();

  useFocusEffect(
    React.useCallback(() => {
      fetchUserAndLeader();
      fetchRecentRequests(3);

      if (userInfo?.accountId) {
        fetchCustomerContracts(userInfo.accountId);
      }

      // Reset feedbacks to default state
      fetchFeedbacks(); // Default without filters

    }, [userInfo])
  );

  const handleFloatButtonPress = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // const db = InitializeFirestoreDb();

  // const sendPushNotificationToLeader = async ({ leaderInfo, user }: { leaderInfo: Leader, user: User }) => {
  //   try {
  //     // Đảm bảo dữ liệu leaderInfo và user được tải
  //     // await fetchUserAndLeader().then(() => {
  //     //   if (!leaderInfo || !user) {
  //     //     console.error('LeaderInfo hoặc User không hợp lệ');
  //     //     return;
  //     //   }
  //     // }
  //     // );


  //     // Lấy bản ghi push notification mới nhất từ Firestore
  //     const result = await GetLatestPushNotificationRecordByLeaderId(
  //       db,
  //       leaderInfo.accountId
  //     );

  //     if (result && result.exponentPushToken) {
  //       const expoPushToken = result.exponentPushToken;

  //       // Lấy fullName của user và truyền cùng contractId
  //       const mockContractId = 'CT_20241122012345'; // Contract ID mẫu
  //       const fullName = user.fullName; // Lấy fullName từ user

  //       // Gửi push notification
  //       await sendPushNotification(expoPushToken, mockContractId, fullName);

  //       console.log('Push notification sent successfully!');
  //     } else {
  //       console.error('Không tìm thấy expoPushToken trong bản ghi Firestore.');
  //     }
  //   } catch (error) {
  //     console.error('Lỗi khi gửi push notification:', error);
  //   }
  // };

  // useEffect(() => {
  //   if (leaderInfo && user) {
  //     sendPushNotificationToLeader({ leaderInfo, user });// Gửi thông báo ngay khi vào màn hình
  //   }
  // }, [leaderInfo, user]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Box style={styles.infoContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.avatarUrl || 'https://via.placeholder.com/50' }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>{user?.fullName || 'Người dùng chưa xác định'}</Text>
          </View>
        </Box>

        <Image
          source={require('../../assets/images/home.png')}
          style={styles.homeImage}
          resizeMode="cover"
        />
 <Text style={styles.title}>NHỮNG LẦN SỬA CHỮA GẦN ĐÂY</Text>
        {requestLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
          <Lottie
            source={require('../../assets/animations/loading.json')} // Đường dẫn tới file animation
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
          />
        </View>
        ) : requests.length === 0 ? (
          <NoDataComponent
            imageUrl={require('../../assets/images/no-request.png')}
            title="Không có yêu cầu sửa chữa"
            description="Hiện tại bạn không có yêu cầu sửa chữa nào."
          />
        ) : (
          <RecentRepairs requests={requests} />
        )}

        <View style={styles.divider} />

        <Text style={styles.title}>HỢP ĐỒNG ĐANG SỬ DỤNG</Text>
        {contractLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
          <Lottie
            source={require('../../assets/animations/loading.json')} // Đường dẫn tới file animation
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
          />
        </View>
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

        <View style={styles.divider} />

        <Text style={styles.title}>ĐÁNH GIÁ TỪ KHÁCH HÀNG</Text>
        {requestLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
          <Lottie
            source={require('../../assets/animations/loading.json')} // Đường dẫn tới file animation
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
          />
        </View>
        ):feedbacks.length === 0 ? (
          <NoDataComponent
            imageUrl={require('../../assets/images/no-review.png')}
            title="Không có đánh giá"
            description="Hiện tại chưa có đánh giá nào cho dịch vụ này."
          />
        ) : (
          <CustomerReviews feedbacks={feedbacks} />
        )}
      </ScrollView>

      <FloatButton
        onPress={handleFloatButtonPress}
        icon={<Icon as={FontAwesome5} name="phone" size="md" color="#DBE2EF" />}
      />

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
    color: '#112D4E',
  },
});

export default HomeScreen;
