// app/(tabs)/ServicePackageScreen.tsx
import React, { useState, useCallback, useRef } from 'react';
import { View, Text, FlatList, ActivityIndicator, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import useServicePackages from '../../hooks/useServicePackage'; // Import custom hook
import ServicePackageItem from '../../components/home/ServicePackageItem'; // Import item component
import { FontAwesome5 } from '@expo/vector-icons';

let searchTimeout: NodeJS.Timeout;

export default function ServicePackageScreen() {
  const [pageIndex, setPageIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { packages, totalCount, loading } = useServicePackages(pageIndex, 8, searchQuery);
  const flatListRef = useRef<FlatList>(null);

  // Reset dữ liệu khi vào tab
  useFocusEffect(
    useCallback(() => {
      setPageIndex(1);
      setSearchQuery('');
    }, [])
  );

  const handleLoadMore = () => {
    if (packages.length < totalCount && !loading) {
      setPageIndex((prev) => prev + 1);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setPageIndex(1);
    }, 2000);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setPageIndex(1);
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
      </View>

      {loading && pageIndex === 1 ? (
        <ActivityIndicator size="large" color="#3F72AF" />
      ) : packages.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={packages}
          renderItem={({ item }) => <ServicePackageItem packageItem={item} />}
          keyExtractor={(item) => item.servicePackageId}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loading && pageIndex > 1 && (
              <ActivityIndicator size="small" color="#3F72AF" style={{ marginVertical: 16 }} />
            )
          }
        />
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
});
