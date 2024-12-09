import React, { useState, useCallback } from 'react';
import { Text, View, TextInput, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { IconButton, Actionsheet, useDisclose, Button, Radio } from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import ProductListItem from '@/components/store/ProductListItem';
import useProducts from '@/hooks/useProduct';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import NoData from '@/components/ui/NoData';

let searchTimeout: NodeJS.Timeout;

export default function StoreScreen() {
  const { isOpen, onOpen, onClose } = useDisclose();
  const [pageIndex, setPageIndex] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortAscending, setSortAscending] = useState<null | boolean>(null);
  const [pendingSort, setPendingSort] = useState<null | boolean>(null);
  const { products, totalCount, loading, fetchProducts, fetchCartItems } = useProducts();

  useFocusEffect(
    useCallback(() => {
      fetchProducts(pageIndex, 6, searchQuery, sortAscending);
      fetchCartItems();
    }, [pageIndex, searchQuery, sortAscending])
  );

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      setPageIndex(1);
    }, 2000);
  };

  const handleApplySort = () => {
    setSortAscending(pendingSort);
    setPageIndex(1);
    onClose();
  };

  const handleClearFilters = () => {
    setSortAscending(null);
    setSearchQuery('');
    setPageIndex(1);
    onClose();
  };

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

      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={handlePrevPage}
          disabled={pageIndex === 1}
          style={[styles.pageButton, pageIndex === 1 && styles.disabledButton]}
        >
          <Text style={styles.pageButtonText}>◀</Text>
        </TouchableOpacity>
        <Text style={styles.pageIndicator}>{`${pageIndex} / ${Math.ceil(totalCount / 6)}`}</Text>
        <TouchableOpacity
          onPress={handleNextPage}
          disabled={pageIndex === Math.ceil(totalCount / 6)}
          style={[styles.pageButton, pageIndex === Math.ceil(totalCount / 6) && styles.disabledButton]}
        >
          <Text style={styles.pageButtonText}>▶</Text>
        </TouchableOpacity>
      </View>

      {loading && pageIndex === 1 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
          <LottieView
            source={require('@/assets/animations/loading.json')}
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
        <NoData />
      )}

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
    paddingBottom: 0,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20
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
