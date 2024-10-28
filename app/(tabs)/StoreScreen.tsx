// app/(tabs)/StoreScreen.tsx
import React from 'react';
import { Text, View, TextInput, StyleSheet, FlatList } from 'react-native';
import { IconButton, Actionsheet, useDisclose, Icon } from 'native-base';
import { FontAwesome5 } from '@expo/vector-icons';
import ProductListItem from '../../components/store/ProductListItem';
import { products } from '../../constants/Datas';
import NoDataComponent from '../../components/ui/NoDataComponent';
import { useRouter } from 'expo-router';

export default function StoreScreen() {
  const { isOpen, onOpen, onClose } = useDisclose();
  const router = useRouter();

  const handleProductPress = (productId: string) => {
    router.push(`/ProductDetail/${productId}`);
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
          />
        </View>
        <IconButton
          icon={<FontAwesome5 name="filter" size={20} color="white" />}
          onPress={onOpen}
          style={styles.filterButtonContainer}
        />
      </View>

      {/* Kiểm tra nếu có sản phẩm hoặc hiển thị NoDataComponent */}
      {products.length > 0 ? (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <ProductListItem
              product={item}
              onPress={() => handleProductPress(item.ProductId)}
            />
          )}
          keyExtractor={(item) => item.ProductId}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
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
          <Actionsheet.Item>
            <Text>Giá: Từ thấp đến cao</Text>
          </Actionsheet.Item>
          <Actionsheet.Item>
            <Text>Giá: Từ cao đến thấp</Text>
          </Actionsheet.Item>
          <Actionsheet.Item>
            <Text>Mới nhất</Text>
          </Actionsheet.Item>
          <Actionsheet.Item>
            <Text>Bán chạy</Text>
          </Actionsheet.Item>
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
});
