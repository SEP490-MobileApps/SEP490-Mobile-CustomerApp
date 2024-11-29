import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking } from 'react-native';
import { Box, Divider } from 'native-base';
import { formatDate } from "@/utils/formatDate";

interface Props {
  contract: {
    imageUrl: string;
    name: string;
    priceByDate: number;
    purchaseTime: string;
    fileUrl: string;
    remainingNumOfRequests: number;
  };
}

const CustomerInUseContract: React.FC<Props> = ({ contract }) => {
  if (contract.remainingNumOfRequests <= 0) return null;

  const handleViewContract = () => {
    console.log(`Mở file PDF từ URL: ${contract.fileUrl}`);
  };

  return (
    <Box style={styles.cardContainer}>
      <View style={styles.row}>
        <Image source={{ uri: contract.imageUrl }} style={styles.image} />
        <Divider bg="#3F72AF" thickness="2" mx="3" orientation="vertical" />
        <View style={styles.contentContainer}>
          <Text style={styles.name}>{contract.name}</Text>
          <Text style={styles.price}>Giá: {contract.priceByDate} VND</Text>
          <Text style={styles.purchaseTime}>
            Ngày đăng ký: {formatDate(contract.purchaseTime)}
          </Text>
          <TouchableOpacity onPress={handleViewContract} style={styles.button}>
            <Text style={styles.buttonText} onPress={() => Linking.openURL(contract.fileUrl)}>Xem hợp đồng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Box>
  );
};


const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#DBE2EF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  contentContainer: {
    flex: 1,
    gap: 3
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 14,
    color: '#3F72AF',
  },
  purchaseTime: {
    marginBottom: 5,
  },
  button: {
    marginTop: 5,
    backgroundColor: '#3F72AF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default CustomerInUseContract;
