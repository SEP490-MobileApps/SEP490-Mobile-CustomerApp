import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Image } from 'react-native';
import { Icon } from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import RecentRepairs from '@/components/home/RecentRepairs';
import CustomerReviews from '@/components/home/CustomerReviews';
import CustomerInUseContract from '@/components/home/CustomerInUseContract';
import FloatButton from '@/components/ui/FloatButton';
import LeaderContactModal from '@/components/home/LeaderContactModal';
import { useFocusEffect } from '@react-navigation/native';
import useUser from '@/hooks/useUser';
import useRequest from '@/hooks/useRequest';
import useServicePackages from '@/hooks/useServicePackage';
import { useGlobalState } from '@/contexts/GlobalProvider';
import LottieView from 'lottie-react-native';
import NoData from '@/components/ui/NoData';
import { SCREEN_WIDTH } from '@/constants/Device';

function HomeScreen(): React.JSX.Element {
  const { user, leaderInfo, fetchUserAndLeader } = useUser();
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
      fetchFeedbacks();
    }, [userInfo])
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
        <View style={styles.infoContainer}>
          <View style={styles.leftContainer}>
            <Text style={styles.welcomeText}>Chào mừng bạn quay lại,</Text>
            <Text style={styles.userName}>{user?.fullName || 'Đang tải...'}</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user?.avatarUrl || 'https://png.pngtree.com/png-clipart/20220726/original/pngtree-3d-loading-logo-png-image_8413023.png' }}
              style={styles.avatar}
            />
          </View>
        </View>

        <Image
          source={require('@/assets/images/home.png')}
          style={styles.homeImage}
          resizeMode="cover"
        />

        <Text style={styles.title}>NHỮNG LẦN SỬA CHỮA GẦN ĐÂY</Text>
        {requestLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
            <LottieView
              source={require('@/assets/animations/loading.json')} // Đường dẫn tới file animation
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
          </View>
        ) : requests.length === 0 ? (
          <NoData />
        ) : (
          <RecentRepairs requests={requests} />
        )}

        <View style={styles.divider} />

        <Text style={styles.title}>HỢP ĐỒNG ĐANG SỬ DỤNG</Text>
        {contractLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
            <LottieView
              source={require('../../assets/animations/loading.json')} // Đường dẫn tới file animation
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
          </View>
        ) : contracts.filter(contract => contract.remainingNumOfRequests > 0).length === 0 ? (
          <NoData />
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
            <LottieView
              source={require('../../assets/animations/loading.json')} // Đường dẫn tới file animation
              autoPlay
              loop
              style={{ width: 150, height: 150 }}
            />
          </View>
        ) : feedbacks.length === 0 ? (
          <NoData />
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
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  homeImage: {
    width: SCREEN_WIDTH,
    height: 230,
    marginLeft: -16,
    marginBottom: 16,
  },
  divider: {
    height: 2,
    backgroundColor: '#112D4E',
    marginVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#112D4E',
  },
  leftContainer: {
    flex: 1,
    gap: 3,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: '#A1A1A1',
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderColor: "#3F72AF",
    borderWidth: 3,
  },

});

export default HomeScreen;
