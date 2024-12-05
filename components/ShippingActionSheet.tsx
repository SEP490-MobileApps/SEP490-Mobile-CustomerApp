import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Actionsheet, HStack, VStack, Image, Icon } from 'native-base';
import { Ionicons, FontAwesome5, MaterialCommunityIcons, Entypo, Foundation } from '@expo/vector-icons';
import LinearGradient from 'react-native-linear-gradient';


interface ShippingActionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  shipping?: {
    shippingOrder: {
      status?: number;
      shipmentDate: string;
      deliveriedDate: string | null;
    };
    workerInfo: {
      avatarUrl: string;
      fullName: string;
      phoneNumber: string;
    } | null;
  } | null;
  onRefresh: () => void;
}

const ShippingActionSheet: React.FC<ShippingActionSheetProps> = ({
  isOpen,
  onClose,
  shipping,
  onRefresh
}) => {
  const [progressStates, setProgressStates] = useState([false, false, false, false]);

  useEffect(() => {
    const newProgressStates = [false, false, false, false];

    if (shipping?.shippingOrder.status !== undefined) {
      for (let i = 0; i <= shipping.shippingOrder.status; i++) {
        newProgressStates[i] = true;
      }
    }

    setProgressStates(newProgressStates);
  }, [shipping?.shippingOrder.status]);

  const renderWorkerInfo = () => {
    if (shipping?.shippingOrder.status === 0) {
      return (
        <Text style={{
          color: '#112D4E',
          fontWeight: 'bold',
          textAlign: 'center',
          paddingVertical: 16
        }}>
          Chưa có nhân viên giao hàng nào được gán!
        </Text>
      );
    }

    if (shipping?.workerInfo) {
      return (
        <HStack
          alignItems="center"
          space={4}
          p={4}
          borderRadius={12}
        >
          <Image
            source={{ uri: shipping.workerInfo.avatarUrl }}
            alt="Worker Avatar"
            size="md"
            borderRadius="full"
          />
          <VStack>
            <Text style={{
              color: '#112D4E',
              fontWeight: 'bold',
              fontSize: 16
            }}>
              {shipping.workerInfo.fullName}
            </Text>
            <Text style={{ color: '#3F72AF' }}>
              {shipping.workerInfo.phoneNumber}
            </Text>
          </VStack>
          <TouchableOpacity
            onPress={() => Linking.openURL(`tel:${shipping?.workerInfo?.phoneNumber}`)}
            style={{
              marginLeft: 'auto',
              backgroundColor: '#3F72AF',
              padding: 10,
              borderRadius: 50,
              shadowColor: '#000',
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              shadowOffset: { width: 0, height: 2 },
              width: 50,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Icon
              as={Foundation}
              name="telephone"
              color="white"
              size={6}
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>
        </HStack>
      );
    }
    return null;
  };

  const renderProgressIcons = () => {
    const iconConfigs = [
      { Icon: FontAwesome5, name: 'box', activeStatus: 0 },
      { Icon: FontAwesome5, name: 'store', activeStatus: 1 },
      { Icon: MaterialCommunityIcons, name: 'truck-delivery', activeStatus: 2 },
      { Icon: Entypo, name: 'home', activeStatus: 3 }
    ];

    return (
      <HStack alignItems="center" space={2} px={4} py={4}>
        {iconConfigs.map((config, index) => (
          <React.Fragment key={config.name}>
            <View
              style={{
                padding: shipping?.shippingOrder.status === config.activeStatus || (shipping?.shippingOrder.status === 4 && config.name === 'truck-delivery') ? 10 : 0,
                backgroundColor: shipping?.shippingOrder.status === config.activeStatus || (shipping?.shippingOrder.status === 4 && config.name === 'truck-delivery')
                  ? 'rgba(63, 114, 175, 0.3)' : 'transparent',
                borderRadius: 10,
              }}
            >
              <config.Icon
                name={config.name}
                size={
                  config.name === 'home'
                    ? (shipping?.shippingOrder.status === config.activeStatus ? 40 : 24)
                    : (config.name === 'truck-delivery'
                      ? (shipping?.shippingOrder.status === config.activeStatus || shipping?.shippingOrder.status === 4 ? 48 : 30) // Thay đổi kích thước cho truck-delivery khi status = 4
                      : (shipping?.shippingOrder.status === config.activeStatus ? 32 : 20))
                }
                color="#3F72AF"
              />
            </View>
            {index < 3 && (
              <View
                style={{
                  flex: 1,
                  height: 4,
                  backgroundColor: progressStates[index] ? '#3F72AF' : '#888'
                }}
              />
            )}
          </React.Fragment>
        ))}
      </HStack>
    );
  };

  const renderAnimationSection = () => {
    let animationSource, primaryText, secondaryText, tertiaryText;

    switch (shipping?.shippingOrder.status) {
      case 0:
        animationSource = require('@/assets/images/ship-accepted.png');
        primaryText = "Đã thanh toán thành công";
        secondaryText = "Đang đợi để gán nhân viên giao hàng!";
        break;
      case 1:
        animationSource = require('@/assets/images/ship-assigned.png');
        primaryText = "Nhân viên giao hàng đã được gán";
        secondaryText = "Đơn hàng đang được đi lấy!";
        break;
      case 2:
        animationSource = require('@/assets/images/ship-delivering.png');
        primaryText = "Đơn hàng đang được giao";
        secondaryText = "Nếu có thắc mắc hay yêu cầu gì hãy liên hệ ở khung thông tin bên trên!";

        const shipmentDate = new Date(shipping?.shippingOrder.shipmentDate || '');

        const formattedDate = `${shipmentDate.getDate() < 10 ? '0' : ''}${shipmentDate.getDate()}/${shipmentDate.getMonth() + 1 < 10 ? '0' : ''
          }${shipmentDate.getMonth() + 1}/${shipmentDate.getFullYear()}`;

        const formattedTime = `${shipmentDate.getHours() < 10 ? '0' : ''}${shipmentDate.getHours()}:${shipmentDate.getMinutes() < 10 ? '0' : ''
          }${shipmentDate.getMinutes()}:${shipmentDate.getSeconds() < 10 ? '0' : ''}${shipmentDate.getSeconds()}`;

        tertiaryText = `Ngày giao: ${formattedDate} (${formattedTime})`;
        break;
      case 3:
        animationSource = require('@/assets/images/ship-delivered.png');
        primaryText = "Đơn hàng đã được giao thành công";

        const deliveryDate = new Date(shipping?.shippingOrder.deliveriedDate || '');
        const formattedDeliveryDate = `${deliveryDate.getDate() < 10 ? '0' : ''}${deliveryDate.getDate()}/${deliveryDate.getMonth() + 1 < 10 ? '0' : ''
          }${deliveryDate.getMonth() + 1}/${deliveryDate.getFullYear()}`;

        const formattedDeliveryTime = `${deliveryDate.getHours() < 10 ? '0' : ''}${deliveryDate.getHours()}:${deliveryDate.getMinutes() < 10 ? '0' : ''
          }${deliveryDate.getMinutes()}:${deliveryDate.getSeconds() < 10 ? '0' : ''}${deliveryDate.getSeconds()}`;

        tertiaryText = `Ngày nhận: ${formattedDeliveryDate} (${formattedDeliveryTime})`;
        break;

      case 4:
        animationSource = require('@/assets/images/ship-delayed.png');
        primaryText = "Đơn hàng đã bị hoãn";
        break;
      default:
        return null;
    }

    return (
      <VStack alignItems="center" space={2} py={4}>
        <Image
          source={animationSource}
          alt="Animation"
          size={200}
        />
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#112D4E'
        }}>
          {primaryText}
        </Text>
        {tertiaryText && (
          <Text style={{
            color: '#6C757D',
            textAlign: 'center'
          }}>
            {tertiaryText}
          </Text>
        )}
        {secondaryText && (
          <Text style={{
            color: '#112D4E',
            textAlign: 'center'
          }}>
            {secondaryText}
          </Text>
        )}

      </VStack>
    );
  };

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <Actionsheet.Content
        backgroundColor="#DBE2EF"
        _dragIndicator={{ bg: "#112D4E" }}
      >
        <HStack justifyContent="center" width="full" px={4} py={2} alignItems="center">
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#112D4E',
          }}>
            Chi tiết vận chuyển
          </Text>
          <TouchableOpacity onPress={onRefresh}>
            <Ionicons name="refresh-circle" size={32} color="#3F72AF" />
          </TouchableOpacity>
        </HStack>

        <LinearGradient
          colors={['#F9F7F7', '#DBE2EF', '#3F72AF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: '90%',
            borderRadius: 15,
            marginVertical: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
          }}
        >
          {renderWorkerInfo()}
        </LinearGradient>

        {renderProgressIcons()}
        {renderAnimationSection()}
      </Actionsheet.Content>
    </Actionsheet>
  );
};

export default ShippingActionSheet;