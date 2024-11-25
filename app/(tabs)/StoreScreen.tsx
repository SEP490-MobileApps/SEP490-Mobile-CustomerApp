// app/(tabs)/StoreScreen.tsx
import React, { useState, useCallback } from 'react';
import { Text, View, TextInput, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { IconButton, Actionsheet, useDisclose, Button, Radio, Box } from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import ProductListItem from '../../components/store/ProductListItem';
import NoDataComponent from '../../components/ui/NoDataComponent';
import useProducts from '../../hooks/useProduct';
import { useFocusEffect } from '@react-navigation/native';
import Lottie from 'lottie-react-native';

let searchTimeout: NodeJS.Timeout;

export default function StoreScreen() {
  const { isOpen, onOpen, onClose } = useDisclose();
  const [pageIndex, setPageIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAscending, setSortAscending] = useState<null | boolean>(null); // Default: no sort
  const [pendingSort, setPendingSort] = useState<null | boolean>(null); // Temp state for unapplied sort
  const { products, totalCount, loading, fetchProducts, fetchCartItems} = useProducts();

  // Fetch products when pageIndex or searchQuery changes
  useFocusEffect(
    useCallback(() => {
      fetchProducts(pageIndex, 6, searchQuery, sortAscending);
      fetchCartItems();
    }, [pageIndex, searchQuery, sortAscending])
  );

  // Handle search with debounce
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setPageIndex(1);
    }, 2000);
  };

  // Handle sorting application
  const handleApplySort = () => {
    setSortAscending(pendingSort);
    setPageIndex(1);
    onClose(); // Close the actionsheet
  };

  // Handle clearing filters
  const handleClearFilters = () => {
    setSortAscending(null);
    setSearchQuery('');
    setPageIndex(1);
    onClose();
  };

  // Pagination logic
  const handlePrevPage = () => {
    if (pageIndex > 1) {
      setPageIndex((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(totalCount / 6);
    if (pageIndex < totalPages) {
      setPageIndex((prev) => prev + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Search and Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <FontAwesome5 name="search" size={20} color="#112D4E" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm"
            placeholderTextColor="#112D4E"
            value={searchQuery}
            onChangeText={handleSearchChange}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <FontAwesome5 name="times-circle" size={20} color="#112D4E" style={styles.clearIcon} />
            </TouchableOpacity>
          ) : null}
        </View>
        <IconButton
          icon={<FontAwesome5 name="filter" size={20} color="white" />}
          onPress={onOpen}
          style={styles.filterButtonContainer}
        />
      </View>

      {/* Pagination controls */}
      <View style={styles.paginationContainer}>
        <TouchableOpacity onPress={handlePrevPage} disabled={pageIndex === 1} style={styles.pageButton}>
          <Text style={styles.pageButtonText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>{`Trang ${pageIndex}`}</Text>
        <TouchableOpacity
          onPress={handleNextPage}
          disabled={products.length === 0 || products.length < 6}
          style={styles.pageButton}
        >
          <Text style={styles.pageButtonText}>▶</Text>
        </TouchableOpacity>
      </View>

      {/* Product list */}
      {loading && pageIndex === 1 ? (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
         <Lottie
           source={require('../../assets/animations/loading.json')} // Đường dẫn tới file animation
           autoPlay
           loop
           style={{ width: 150, height: 150 }}
         />
       </View>
      ) : products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={({ item }) => <ProductListItem product={item} />}
          keyExtractor={(item) => item.productId}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <NoDataComponent
          imageUrl={require('../../assets/images/no-product.png')}
          title="Không có sản phẩm"
          description="Hiện tại không có sản phẩm nào để hiển thị."
        />
      )}

      {/* ActionSheet for Filter */}
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content style={styles.actionSheetContent}>
          <View style={styles.filterContainer}>
            <Actionsheet.Item style={styles.filterItem}>
              <Radio.Group
                name="sortOptions"
                value={pendingSort === true ? 'asc' : pendingSort === false ? 'desc' : ''}
                onChange={(value) => setPendingSort(value === 'asc')}
              >
                <Radio value="asc" _text={{ color: '#3F72AF' }} my={5}>
                  Giá: Từ thấp đến cao
                </Radio>
                <Radio value="desc" _text={{ color: '#3F72AF' }} my={1}>
                  Giá: Từ cao đến thấp
                </Radio>
              </Radio.Group>
            </Actionsheet.Item>
            <View style={styles.filterButtonsContainer}>
              <Button onPress={handleClearFilters} colorScheme="red" flex={1} mr={2}>
                Xoá bộ lọc
              </Button>
              <Button onPress={handleApplySort} colorScheme="blue" flex={1}>
                Áp dụng
              </Button>
            </View>
          </View>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9F7F7',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  filterButtonContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#3F72AF',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  pageButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 4,
    backgroundColor: '#3F72AF',
    borderRadius: 5,
  },
  pageButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
  pageIndicator: {
    fontSize: 16,
    marginHorizontal: 10,
    color: '#3F72AF',
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  actionSheetContent: {
    backgroundColor: '#DBE2EF',
  },
  filterContainer: {
    padding: 10,
    width: '100%', 
  },
  filterItem: {
    backgroundColor: '#DBE2EF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  listContent: {
    // paddingBottom: 100,
    paddingBottom: 0,
  },
});
