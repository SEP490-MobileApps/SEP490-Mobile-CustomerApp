import React, { useState } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { Icon, Spinner, ChevronRightIcon } from 'native-base';
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
  const [showGuideModal, setShowGuideModal] = useState(false);

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

      <Modal isOpen={showGuideModal} onClose={() => setShowGuideModal(false)} size="lg">
        <Modal.Content>
          <Modal.Header bg="#3F72AF">
            <Text style={{ fontWeight: 'bold', color: '#F9F7F7', textAlign: 'center', width: '100%', fontSize: 18 }}>
              Hướng dẫn tạo yêu cầu
            </Text>
          </Modal.Header>
          <Modal.Body bg="#DBE2EF" p={4}>
            <ScrollView>
              <Text style={{ fontStyle: 'italic', marginBottom: 10 }}>
                Vui lòng mô tả chi tiết vấn đề bạn gặp phải. Một mô tả tốt nên bao gồm:
              </Text>

              <View style={{ marginLeft: 10, gap: 12 }}>
                <View>
                  <Text style={{ fontWeight: 'bold' }}>1. Vấn đề cụ thể:</Text>
                  <Text>Điều gì đang xảy ra? (Ví dụ: Nước chảy yếu, đèn không sáng)</Text>
                </View>

                <View>
                  <Text style={{ fontWeight: 'bold' }}>2. Vị trí xảy ra sự cố:</Text>
                  <Text>Sự cố xảy ra ở đâu? (Ví dụ: Vòi nước phòng bếp, công tắc đèn phòng ngủ)</Text>
                </View>

                <View>
                  <Text style={{ fontWeight: 'bold' }}>3. Thời gian bắt đầu sự cố:</Text>
                  <Text>Khi nào vấn đề bắt đầu? (Ví dụ: Từ sáng nay, đã xảy ra 3 ngày)</Text>
                </View>

                <View>
                  <Text style={{ fontWeight: 'bold' }}>4. Hiện tượng bạn quan sát thấy:</Text>
                  <Text>Bạn nhận thấy gì bất thường? (Ví dụ: Có tiếng rò rỉ, đèn nhấp nháy)</Text>
                </View>

                <View>
                  <Text style={{ fontWeight: 'bold' }}>5. Bất kỳ thông tin nào khác có thể hữu ích:</Text>
                  <Text>(Ví dụ: Bạn đã thử khắc phục gì chưa?)</Text>
                </View>
              </View>

              <Text style={{ fontStyle: 'italic', marginTop: 16 }}>
                Ví dụ: "Vòi nước trong phòng bếp không chảy nước kể từ sáng nay. Tôi nghe tiếng rò rỉ từ đường ống dưới bồn rửa."
              </Text>
            </ScrollView>
          </Modal.Body>
          <Modal.Footer>
            <Button
              bg="#3F72AF"
              _text={{ color: '#F9F7F7' }}
              onPress={() => setShowGuideModal(false)}
              width="100%"
            >
              Đã hiểu
            </Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal>

      <Modal isOpen={isCreateRequestOpen} onClose={() => setCreateRequestOpen(false)} size="lg" closeOnOverlayClick={false}>
        <Modal.Content>
          <Modal.Header bg="#3F72AF">
            <Text style={{ fontWeight: 'bold', color: '#F9F7F7', textAlign: 'center', width: '100%', fontSize: 18 }}>
              Tạo yêu cầu sửa chữa
            </Text>
          </Modal.Header>
          <Modal.Body bg="#DBE2EF" p={4}>
            <View style={{ gap: 16 }}>
              <Button
                onPress={() => setShowGuideModal(true)}
                variant="subtle"
                bg="#e3f2fd" // Màu xanh nhạt
                _pressed={{ bg: '#bbdefb' }} // Màu xanh đậm hơn khi nhấn
                leftIcon={<Icon as={MaterialIcons} name="help-outline" size="md" color="#2196f3" />} // Icon trợ giúp
                rightIcon={<ChevronRightIcon size="sm" color="#1565c0" />} // Chevron icon màu xanh đậm
                py={2}
                px={3}
                alignItems="center"
                style={{
                  elevation: 3,
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  alignSelf: 'flex-start',
                  borderRadius: 8,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <Text
                  style={{
                    color: '#1565c0', // Màu xanh đậm cho text
                    fontSize: 14,
                    marginHorizontal: 8,
                  }}
                >
                  Hướng dẫn tạo yêu cầu
                </Text>
              </Button>


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
});

export default HomeScreen;
