// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, ScrollView, Image } from 'react-native';
import { Box, Icon, Badge } from 'native-base';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import RecentRepairs from '../../components/home/RecentRepairs';
import ServicePackages from '../../components/home/ServicePackages';
import CustomerReviews from '../../components/home/CustomerReviews';
import FloatButton from '../../components/ui/FloatButton';
import LeaderContactModal from '../../components/home/LeaderContactModal';

type LeaderInfo = {
  name: string;
  phoneNumber: string;
  avatarUrl: string;
};

// Giả sử lấy thông tin leader từ API
const fetchLeaderInfo = async (): Promise<LeaderInfo> => {
  return {
    name: "Võ Hoàng Vũ",
    phoneNumber: "0898901823",
    avatarUrl: "https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Photos.png",
  };
};

function HomeScreen(): React.JSX.Element {
  const notificationsCount = 2;
  const [isModalOpen, setModalOpen] = useState(false);
  const [leaderInfo, setLeaderInfo] = useState<LeaderInfo | null>(null);

  useEffect(() => {
    const getLeaderInfo = async () => {
      const data = await fetchLeaderInfo();
      setLeaderInfo(data);
    };
    getLeaderInfo();
  }, []);

  const handleFloatButtonPress = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleContactPress = () => {
    console.log('Liên hệ với leader');
    setModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Khung chứa thông tin người dùng */}
        <Box style={styles.infoContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/50' }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>Võ Hoàng Vũ</Text>
          </View>
          <View style={styles.notificationIconContainer}>
            <Icon as={MaterialIcons} name="notifications" size="8" color="#3F72AF" />
            {notificationsCount > 0 && (
              <Badge
                colorScheme="danger"
                rounded="full"
                position="absolute"
                top={-5}
                right={-5}
                zIndex={1}
                variant="solid"
              >
                {notificationsCount}
              </Badge>
            )}
          </View>
        </Box>

        {/* Ảnh chính */}
        <Image
          source={require('../../assets/images/home.png')}
          style={styles.homeImage}
          resizeMode="cover"
        />

        {/* Phần sửa chữa gần đây */}
        <RecentRepairs />

        {/* Đường kẻ phân cách */}
        <View style={styles.divider} />

        {/* Tất cả các gói dịch vụ */}
        <ServicePackages />

        {/* Đường kẻ phân cách */}
        <View style={styles.divider} />

        {/* Phần đánh giá từ khách hàng */}
        <CustomerReviews />
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
          onContactPress={handleContactPress}
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
  notificationIconContainer: {
    position: 'relative',
  },
  homeImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    marginVertical: 20,
  },
});

export default HomeScreen;
