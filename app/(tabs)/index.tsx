import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Icon, Spinner, useToast } from 'native-base';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
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
import { Badge, Button, Modal, Radio, Select, TextArea } from 'native-base';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue
} from 'react-native-reanimated';
import { saveNotificationToFirestore } from '@/utils/PushNotification';

function HomeScreen(): React.JSX.Element {
  const { user, leaderInfo, fetchUserAndLeader } = useUser();
  const { requests, feedbacks, fetchRecentRequests, fetchFeedbacks, loading: requestLoading, createRequest } = useRequest();
  const { contracts, fetchCustomerContracts, loading: contractLoading } = useServicePackages();
  const [isModalOpen, setModalOpen] = useState(false);
  const { userInfo } = useGlobalState();
  const [isCreateRequestOpen, setCreateRequestOpen] = useState(false);
  const [showFloatMenu, setShowFloatMenu] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [requestType, setRequestType] = useState('warranty');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const menuAnimation = useSharedValue(0);

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

  const handleMenuPress = () => {
    menuAnimation.value = menuAnimation.value === 0 ? 1 : 0;
    setShowFloatMenu(!showFloatMenu);
  };

  const phoneButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: withSpring(menuAnimation.value ? -70 : 0) },
        { scale: withSpring(menuAnimation.value ? 1 : 0) }
      ],
      opacity: withSpring(menuAnimation.value ? 1 : 0)
    };
  });

  const cogButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: withSpring(menuAnimation.value ? -150 : 0) },
        { scale: withSpring(menuAnimation.value ? 1 : 0) }
      ],
      opacity: withSpring(menuAnimation.value ? 1 : 0)
    };
  });

  const handleConfirmPress = async () => {
    if (!selectedRoom.trim()) {
      setCreateRequestOpen(false);
      Alert.alert(
        "Thông báo",
        "Vui lòng chọn căn hộ cần sửa chữa"
      );
      return;
    }

    if (!description.trim()) {
      setCreateRequestOpen(false);
      Alert.alert(
        "Thông báo",
        "Vui lòng nhập mô tả yêu cầu sửa chữa"
      );
      return;
    }

    setIsSubmitting(true);
    const categoryRequestValue = requestType === 'warranty' ? '0' : '1';

    try {
      if (user) {
        const response = await createRequest(
          user.accountId,
          selectedRoom,
          description,
          parseInt(categoryRequestValue)
        );

        if (response && leaderInfo) {
          try {
            await saveNotificationToFirestore(
              {
                title: 'Nhận  một yêu cầu mới từ khách hàng',
                body: `Yêu cầu từ số căn hộ ${selectedRoom}`,
                data: { requestId: response },
              },
              leaderInfo.accountId
            );
            console.log('Push notification request sent successfully!');
          } catch (error) {
            console.error('Lỗi khi gửi push notification request', error);
          }
        }

        setCreateRequestOpen(false);
        setSelectedRoom('');
        setRequestType('warranty');
        setDescription('');
      }
    } catch (error) {
      console.error('Error creating request:', error);
    } finally {
      fetchRecentRequests(3);
      setIsSubmitting(false);
    }
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
              source={user?.avatarUrl ? { uri: `${user?.avatarUrl}&timestamp=${new Date().getTime()}` } : require('@/assets/images/no-image.png')}
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
              source={require('@/assets/animations/loading.json')}
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
              source={require('@/assets/animations/loading.json')}
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
              source={require('@/assets/animations/loading.json')}
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

      <>
        <Animated.View style={phoneButtonStyle}>
          <FloatButton
            onPress={handleFloatButtonPress}
            icon={<Icon as={FontAwesome5} name="phone" size="md" color="#DBE2EF" />}
            label="Liên hệ hỗ trợ"
          />
        </Animated.View>

        <Animated.View style={cogButtonStyle}>
          <FloatButton
            onPress={() => setCreateRequestOpen(true)}
            icon={<Icon as={FontAwesome5} name="cog" size="md" color="#DBE2EF" />}
            label="Tạo yêu cầu"
          />
        </Animated.View>

        <FloatButton
          onPress={handleMenuPress}
          icon={<Icon as={FontAwesome5} name="bars" size="md" color="#DBE2EF" />}
        />
      </>

      {leaderInfo && (
        <LeaderContactModal
          isOpen={isModalOpen}
          onClose={closeModal}
          leader={leaderInfo}
          onContactPress={() => { }}
        />
      )}

      <Modal isOpen={isCreateRequestOpen} onClose={() => setCreateRequestOpen(false)} size="lg" closeOnOverlayClick={false}>
        <Modal.Content>
          <Modal.Header bg="#3F72AF">
            <Text style={{ fontWeight: 'bold', color: '#F9F7F7', textAlign: 'center', width: '100%', fontSize: 18 }}>
              Tạo yêu cầu sửa chữa
            </Text>
          </Modal.Header>
          <Modal.Body bg="#DBE2EF" p={4}>
            <View style={{ gap: 16 }}>
              <View style={styles.warningContainer}>
                <Icon as={MaterialIcons} name="warning" size="md" color="#f0ad4e" />
                <Text style={styles.warningText}>
                  Vui lòng bổ sung đầy đủ thông tin căn hộ, mô tả yêu cầu cho yêu cầu sửa chữa.
                </Text>
              </View>

              <View>
                <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 16 }}>Căn hộ yêu cầu:</Text>
                <Select
                  style={{ marginLeft: 8 }}
                  placeholder="Chọn căn hộ cần yêu cầu sửa chữa"
                  selectedValue={selectedRoom}
                  onValueChange={value => setSelectedRoom(value)}
                >
                  {user?.rooms?.map(room => (
                    <Select.Item key={room} label={`Căn hộ ${room}`} value={room} />
                  ))}
                </Select>
              </View>

              <View>
                <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 16 }}>Loại yêu cầu:</Text>
                <Radio.Group
                  name="requestType"
                  value={requestType}
                  onChange={value => setRequestType(value)}
                >
                  <View style={{ gap: 12 }}>
                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Badge bg="#2196F3" style={{ borderRadius: 28 }}>
                        <Text style={{ color: '#112D4E' }}>Bảo hành</Text>
                      </Badge>
                      <Radio accessibilityLabel="Bảo hành" value="warranty" />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Badge bg="#FFEB3B" style={{ borderRadius: 28 }}>
                        <Text style={{ color: '#112D4E' }}>Sửa chữa</Text>
                      </Badge>
                      <Radio accessibilityLabel="Sửa chữa" value="repair" />
                    </View>
                  </View>
                </Radio.Group>
              </View>

              <View>
                <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 16 }}>Mô tả yêu cầu:</Text>
                <TextArea
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Nhập mô tả yêu cầu"
                  maxLength={200}
                  autoCompleteType={undefined}
                  h="100"
                />
              </View>
            </View>
          </Modal.Body>
          <Modal.Footer>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
              <Button
                style={{ borderWidth: 1, borderColor: '#3F72AF' }}
                bg="#F9F7F7"
                _text={{ color: '#3F72AF' }}
                width="48%"
                onPress={() => {
                  setSelectedRoom('');
                  setRequestType('warranty');
                  setDescription('');
                  setCreateRequestOpen(false);
                }}
              >
                Hủy
              </Button>
              <Button
                bg="#3F72AF"
                _text={{ color: '#F9F7F7' }}
                width="48%"
                onPress={handleConfirmPress}
                isDisabled={isSubmitting}
              >
                {isSubmitting ? <Spinner color="white" /> : "Xác nhận"}
              </Button>
            </View>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

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
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fcf8e3',
    padding: 15,
    borderRadius: 8,
    gap: 16,
  },
  warningText: {
    color: '#8a6d3b',
    flex: 1,
    fontSize: 14,
  },
});

export default HomeScreen;
