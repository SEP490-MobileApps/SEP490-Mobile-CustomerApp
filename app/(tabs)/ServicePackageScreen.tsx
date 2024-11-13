// app/(tabs)/ServicePackageScreen.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, ActivityIndicator, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import useServicePackages from '../../hooks/useServicePackage'; // Import custom hook
import ServicePackageItem from '../../components/home/ServicePackageItem'; // Import item component
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function ServicePackageScreen() {
  const [pageIndex, setPageIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { packages, totalCount, loading, fetchPackages } = useServicePackages();

  // Fetch packages when pageIndex or searchQuery changes
  useFocusEffect(
    useCallback(() => {
      fetchPackages(pageIndex, 6, searchQuery); // Adjusted to 6 items per page
    }, [pageIndex, searchQuery])
  );

  // Calculate total pages
  const totalPages = Math.ceil(totalCount / 8);

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
      {/* Search Bar */}
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

        {/* Pagination Controls (Moved here) */}
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
        <ActivityIndicator size="large" color="#3F72AF" />
      ) : packages.length > 0 ? (
        packages.map((packageItem) => (
          <ServicePackageItem key={packageItem.servicePackageId} packageItem={packageItem} />
        ))
      ) : (
        <Text>Không có dữ liệu</Text>
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
    marginTop: 10,
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
