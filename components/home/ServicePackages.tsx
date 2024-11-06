// components/home/ServicePackages.tsx
import React, { Dispatch, SetStateAction } from 'react';
import { View, Text, StyleSheet, Image, Button, TouchableOpacity } from 'react-native';
import { ServicePackage } from '../../models/ServicePackage'; // Import type
import CustomButton from '../ui/CustomButton';
import { FormatPriceToVnd } from '../../utils/PriceUtils';
import { useRouter } from 'expo-router';

interface ServicePackagesProps {
  servicePackages: ServicePackage[];
  loading: boolean;
  totalCount: number;
  currentPage: number;
  setPageIndex: Dispatch<SetStateAction<number>>;
}

function ServicePackages({
  servicePackages,
  loading,
  totalCount,
  currentPage,
  setPageIndex,
}: ServicePackagesProps): React.JSX.Element {
  const itemsPerPage = 2; // Number of items per page
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const router = useRouter();

  const handleServicePackagePress = (id: string) => {
    router.push(`/ServicePackage/${id}`);
  };

  const handlePageChange = (page: number) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      setPageIndex(page);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (!servicePackages.length) {
    return <Text>Không có dữ liệu</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TẤT CẢ CÁC GÓI DỊCH VỤ</Text>
      {servicePackages.map((packageItem) => (
        <View key={packageItem.servicePackageId} style={styles.packageContainer}>
          <Image source={{ uri: packageItem.imageUrl }} style={styles.packageImage} />
          <View style={styles.packageInfo}>
            <Text style={styles.packageName}>{packageItem.name}</Text>
            <Text style={styles.packagePrice}>{FormatPriceToVnd(packageItem.priceByDate)}</Text>
          </View>
          <CustomButton
            title="Chi Tiết"
            onPress={() => handleServicePackagePress(packageItem.servicePackageId)}
            variant="secondary"
            style={styles.detailButton}
            textStyle={styles.detailButtonText}
          />
        </View>
      ))}

      {/* Pagination */}
      <View style={styles.paginationContainer}>
        <Button
          title="<"
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {[...Array(totalPages)].map((_, index) => (
          <TouchableOpacity
            key={index + 1}
            onPress={() => handlePageChange(index + 1)}
            style={[
              styles.pageNumber,
              currentPage === index + 1 && styles.currentPage,
            ]}
          >
            <Text style={currentPage === index + 1 ? styles.currentPageText : undefined}>{index + 1}</Text>
          </TouchableOpacity>
        ))}
        <Button
          title=">"
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#112D4E',
    marginBottom: 10,
  },
  packageContainer: {
    backgroundColor: '#DBE2EF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 16,
  },
  packageInfo: {
    flex: 1,
  },
  packageName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  packagePrice: {
    fontSize: 14,
    color: '#3F72AF',
  },
  detailButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  detailButtonText: {
    color: '#5185C0',
    textDecorationLine: 'underline',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  pageNumber: {
    padding: 8,
    marginHorizontal: 4,
    backgroundColor: '#DBE2EF',
    borderRadius: 5,
  },
  currentPage: {
    backgroundColor: '#3F72AF',
  },
  currentPageText: {
    color: '#FFF',
  },
});

export default ServicePackages;
