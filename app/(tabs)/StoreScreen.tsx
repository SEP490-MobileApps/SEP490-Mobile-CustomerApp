// app/(tabs)/StoreScreen.tsx
import React, { useState, useCallback, useRef } from 'react';
import { Text, View, TextInput, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { IconButton, Actionsheet, useDisclose, Button, Radio, Box } from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import ProductListItem from '../../components/store/ProductListItem';
import NoDataComponent from '../../components/ui/NoDataComponent';
import useProducts from '../../hooks/useProduct';
import { useFocusEffect } from '@react-navigation/native';

let searchTimeout: NodeJS.Timeout;

export default function StoreScreen() {
  const { isOpen, onOpen, onClose } = useDisclose();
  const [pageIndex, setPageIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAscending, setSortAscending] = useState<null | boolean>(null); // Mặc định không có filter
  const [pendingSort, setPendingSort] = useState<null | boolean>(null); // State tạm thời cho sort chưa áp dụng
  const flatListRef = useRef<FlatList>(null);
  const { products, totalCount, loading } = useProducts(pageIndex, 8, searchQuery, sortAscending);

  // Dùng useFocusEffect để làm mới dữ liệu và xoá bộ lọc khi chuyển tab
  useFocusEffect(
    useCallback(() => {
      setPageIndex(1);
      setSortAscending(null); // Reset sorting khi quay lại tab
      setSearchQuery(''); // Reset tìm kiếm khi quay lại tab
    }, [])
  );

  const handleLoadMore = () => {
    if (products.length < totalCount && !loading) {
      setPageIndex((prev) => prev + 1);
    }
  };

  const scrollToTop = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  };

  // Hàm để xử lý tìm kiếm với debounce
  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setPageIndex(1);
    }, 2000);
  };

  // Hàm để áp dụng sắp xếp
  const handleApplySort = () => {
    setSortAscending(pendingSort);
    setPageIndex(1);
    onClose(); // Đóng Actionsheet
  };

  // Hàm để xóa bộ lọc
  const handleClearFilters = () => {
    setSortAscending(null);
    setSearchQuery('');
    setPageIndex(1);
    onClose();
  };

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
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

      {/* Danh sách sản phẩm */}
      {loading && pageIndex === 1 ? (
        <ActivityIndicator size="large" color="#3F72AF" />
      ) : products.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={products}
          renderItem={({ item }) => (
            <ProductListItem
              product={item}
            />
          )}
          keyExtractor={(item) => item.productId}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            loading && pageIndex > 1 && (
              <ActivityIndicator size="small" color="#3F72AF" style={{ marginVertical: 16 }} />
            )
          }
        />
      ) : (
        <NoDataComponent
          imageUrl={require('../../assets/images/no-product.png')}
          title="Không có sản phẩm"
          description="Hiện tại không có sản phẩm nào để hiển thị."
        />
      )}

      {/* ActionSheet Lọc */}
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content style={styles.actionSheetContent}>
          <View style={styles.filterContainer}>
            <Actionsheet.Item style={styles.filterItem}>
              <Radio.Group
                name="sortOptions"
                value={pendingSort === true ? 'asc' : pendingSort === false ? 'desc' : ''}
                onChange={(value) => setPendingSort(value === 'asc')}
              >
                <Radio value="asc" _text={{ color: '#3F72AF' }} my={1}>
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

      {/* Nút nổi để cuộn lên đầu */}
      <TouchableOpacity style={styles.scrollToTopButton} onPress={scrollToTop}>
        <FontAwesome5 name="arrow-up" size={24} color="white" />
      </TouchableOpacity>
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
  columnWrapper: {
    justifyContent: 'space-between',
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3F72AF',
    padding: 12,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  actionSheetContent: {
    backgroundColor: '#DBE2EF',
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
  filterContainer: {
    padding: 10,
  },
  filterItem: {
    backgroundColor: '#DBE2EF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  filterText: {
    fontSize: 16,
    color: '#333',
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
});
