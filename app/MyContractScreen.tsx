import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { FormatPriceToVnd } from '../utils/PriceUtils'; // Hàm định dạng giá
import RecentRepairs from '../components/home/RecentRepairs'; // Component yêu cầu sửa chữa
import { MaterialIcons } from '@expo/vector-icons';

// Dữ liệu giả cho các hợp đồng
const mockContracts = [
  {
    contractId: 'C1',
    name: 'Gói sửa chữa điện nước',
    imageUrl: 'https://via.placeholder.com/100',
    priceByDate: 600000,
    numOfRequest: 5,
    requests: [],
  },
  {
    contractId: 'C2',
    name: 'Gói bảo trì định kỳ',
    imageUrl: 'https://via.placeholder.com/100',
    priceByDate: 300000,
    numOfRequest: 3,
    requests: [],
  },
];

const MyContractsScreen = () => {
  const [expandedContractId, setExpandedContractId] = useState<string | null>(null);

  const toggleContractExpansion = (contractId: string) => {
    setExpandedContractId(expandedContractId === contractId ? null : contractId);
  };

  return (
    <FlatList
      data={mockContracts}
      keyExtractor={(item) => item.contractId}
      renderItem={({ item }) => (
        <View style={styles.contractCard}>
          <TouchableOpacity onPress={() => toggleContractExpansion(item.contractId)} style={styles.contractHeader}>
            <View style={styles.contractInfo}>
              <Image source={{ uri: item.imageUrl }} style={styles.contractImage} />
              <View>
                <Text style={styles.contractName}>{item.name}</Text>
                <Text style={styles.contractPrice}>{FormatPriceToVnd(item.priceByDate)} VNĐ</Text>
                <Text style={styles.numOfRequests}>Còn lại: {item.numOfRequest}</Text>
              </View>
            </View>
            <MaterialIcons
              name={expandedContractId === item.contractId ? 'expand-less' : 'expand-more'}
              size={24}
              color="#3F72AF"
            />
          </TouchableOpacity>
          <Collapsible collapsed={expandedContractId !== item.contractId}>
            {/* Thay thế phần thông tin gói dịch vụ bằng nút */}
            <TouchableOpacity style={styles.detailButton}>
              <Text style={styles.detailButtonText}>XEM CHI TIẾT HỢP ĐỒNG</Text>
            </TouchableOpacity>
            {/* Thêm component RecentRepairs */}
            <View style={styles.divider} />
            <RecentRepairs />
          </Collapsible>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  contractCard: {
    backgroundColor: '#F9F7F7',
    marginVertical: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DBE2EF',
  },
  contractHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contractInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  contractImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  contractName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#112D4E',
  },
  contractPrice: {
    fontSize: 14,
    color: '#3F72AF',
  },
  numOfRequests: {
    fontSize: 14,
    color: '#3A9B7A',
  },
  collapsibleContent: {
    marginTop: 10,
  },
  detailButton: {
    backgroundColor: '#3F72AF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  detailButtonText: {
    color: '#F9F7F7',
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#DBE2EF',
    marginVertical: 10,
  },
});

export default MyContractsScreen;
