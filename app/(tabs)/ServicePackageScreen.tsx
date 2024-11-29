import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import useServicePackages from '@/hooks/useServicePackage'; // Import custom hook
import ServicePackageItem from '@/components/home/ServicePackageItem'; // Import item component
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import NoData from '@/components/ui/NoData';

export default function ServicePackageScreen() {
  const [pageIndex, setPageIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { packages, totalCount, loading, fetchPackages } = useServicePackages();

  useFocusEffect(
    useCallback(() => {
      fetchPackages(pageIndex, 6, searchQuery);
    }, [pageIndex, searchQuery])
  );

  const totalPages = Math.ceil(totalCount / 6);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setPageIndex(1);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setPageIndex(1);
  };

  const handleNextPage = () => {
    if (pageIndex < totalPages) {
      setPageIndex(pageIndex + 1);
    }
  };

  const handlePrevPage = () => {
    if (pageIndex > 1) {
      setPageIndex(pageIndex - 1);
    }
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#F9F7F7' }}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <FontAwesome5 name="search" size={20} color="#112D4E" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm gói dịch vụ"
            placeholderTextColor="#112D4E"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={clearSearch}>
              <FontAwesome5 name="times-circle" size={20} color="#112D4E" style={styles.clearIcon} />
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={styles.paginationContainer}>
          <TouchableOpacity
            onPress={handlePrevPage}
            disabled={pageIndex === 1}
            style={[styles.pageButton, pageIndex === 1 && styles.disabledButton]}
          >
            <Text style={styles.pageButtonText}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.pageIndicator}>{`${pageIndex} / ${totalPages}`}</Text>
          <TouchableOpacity
            onPress={handleNextPage}
            disabled={pageIndex === totalPages}
            style={[styles.pageButton, pageIndex === totalPages && styles.disabledButton]}
          >
            <Text style={styles.pageButtonText}>▶</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
          <LottieView
            source={require('@/assets/animations/loading.json')} // Đường dẫn tới file animation
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
          />
        </View>
      ) : packages.length > 0 ? (
        packages.map((packageItem) => (
          <ServicePackageItem key={packageItem.servicePackageId} packageItem={packageItem} />
        ))
      ) : (
        <NoData />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DBE2EF',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#112D4E',
  },
  clearIcon: {
    marginLeft: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 26,
  },
  pageButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 5,
    backgroundColor: '#3F72AF',
    borderRadius: 5,
  },
  disabledButton: {
    backgroundColor: '#CCC',
  },
  pageButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  pageIndicator: {
    fontSize: 16,
    color: '#3F72AF',
  },
});
