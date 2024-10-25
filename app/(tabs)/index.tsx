// app/(auth)/index.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import CustomButton from '../../components/ui/CustomButton';
import { Box, Badge, Icon, Progress } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { servicePackages, reviews } from '../../constants/Datas';
import { ServicePackage } from '../../models/ServicePackage';
import { Review } from '../../models/Review';
import NoDataComponent from '../../components/ui/NoDataComponent';

function HomeScreen(): React.JSX.Element {
  const router = useRouter();

  const handleServicePackagePress = (id: string) => {
    console.log(`Service Package ${id} pressed`);
  };

  const notificationsCount = 2;

  // Tính toán trung bình và số lượng đánh giá cho mỗi loại sao
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1) : '0';
  const ratingsCount = [5, 4, 3, 2, 1].map((star) => {
    return reviews.filter((review) => review.rating === star).length;
  });

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Khung chứa thông tin người dùng */}
        <Box style={styles.infoContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/50' }}
              style={styles.avatar}
            />
            <Text style={styles.userName}>Võ Hoàng Vũ</Text>
          </View>
          <View style={styles.notificationIconContainer}>
            <Icon as={MaterialIcons} name="notifications" size="lg" color="#3F72AF" />
            {notificationsCount > 0 && (
              <Badge
                colorScheme="danger"
                rounded="full"
                position="absolute"
                top={-5}
                right={-5}
                zIndex={1}
                variant="solid"
              >
                {notificationsCount}
              </Badge>
            )}
          </View>
        </Box>

        {/* Ảnh chính */}
        <Image
          source={require('../../assets/images/home.png')}
          style={styles.homeImage}
          resizeMode="cover"
        />

        <Text style={styles.title}>TẤT CẢ CÁC GÓI DỊCH VỤ</Text>

        {servicePackages.map((packageItem: ServicePackage) => (
          <Box key={packageItem.id} style={styles.packageContainer}>
            <Image source={packageItem.imageUrl} style={styles.packageImage} />
            <View style={styles.packageInfo}>
              <Text style={styles.packageName}>{packageItem.name}</Text>
              <Text style={styles.packagePrice}>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(packageItem.price)}
              </Text>
            </View>
            <CustomButton
              title="Chi Tiết"
              onPress={() => handleServicePackagePress(packageItem.id)}
              variant="secondary"
              style={styles.detailButton}
              textStyle={styles.detailButtonText}
            />
          </Box>
        ))}

        {/* Đường kẻ phân cách */}
        <View style={styles.divider} />

        {/* Phần đánh giá từ khách hàng */}
        <Text style={styles.title}>ĐÁNH GIÁ TỪ KHÁCH HÀNG</Text>

        {totalReviews > 0 ? (
          <>
            {/* Phần thống kê đánh giá */}
            <View style={styles.ratingSummary}>
              <View style={styles.progressBars}>
                {[5, 4, 3, 2, 1].map((star, index) => (
                  <View key={star} style={styles.progressBarContainer}>
                    <Text>{star} ★</Text>
                    <Progress
                      value={(ratingsCount[index] / totalReviews) * 100}
                      colorScheme="emerald"
                      style={styles.progressBar}
                    />
                  </View>
                ))}
              </View>
              <View style={styles.averageRating}>
                <Text style={styles.averageText}>{averageRating}</Text>
                <View style={styles.starsContainer}>
                  <Text style={styles.stars}>{'★'.repeat(Math.floor(Number(averageRating)))}</Text>
                  <Text style={styles.stars}>{"☆".repeat(5 - Math.floor(Number(averageRating)))}</Text>
                </View>
                <Text style={styles.totalReviews}>{totalReviews} Reviews</Text>
              </View>
            </View>

            {reviews.map((review: Review) => (
              <Box key={review.id} style={styles.reviewContainer}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: review.avatarUrl }} style={styles.reviewAvatar} />
                  <View>
                    <Text style={styles.reviewName}>{review.userName}</Text>
                    <Text style={styles.reviewStars}>{'★'.repeat(review.rating)}</Text>
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.comment}</Text>
                <View style={styles.reviewDivider} />
              </Box>
            ))}
          </>
        ) : (
          <NoDataComponent
            imageUrl={require('../../assets/images/no-review.png')} // Sử dụng require() thay vì đường dẫn chuỗi
            title="Không có đánh giá"
            description="Hiện tại chưa có đánh giá nào cho dịch vụ này."
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F7F7',
  },
  scrollContent: {
    padding: 16,
    backgroundColor: '#F9F7F7',
  },
  infoContainer: {
    backgroundColor: '#DBE2EF',
    padding: 10,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  userName: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  notificationIconContainer: {
    position: 'relative',
  },
  homeImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    marginBottom: 5,
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
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: '#000',
    marginVertical: 20,
  },
  ratingSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  progressBars: {
    flex: 1,
    paddingRight: 16,
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  progressBar: {
    flex: 1,
    marginLeft: 10,
    height: 6,
    borderRadius: 3,
  },
  averageRating: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  averageText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  starsContainer: {
    flexDirection: 'row',
  },
  stars: {
    fontSize: 20,
    color: '#FFD700',
  },
  totalReviews: {
    fontSize: 14,
    color: '#6c757d',
  },
  reviewContainer: {
    padding: 16,
    backgroundColor: '#F9F7F7',
    borderRadius: 8,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  reviewName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  reviewStars: {
    fontSize: 14,
    color: '#FFD700',
  },
  reviewText: {
    fontSize: 14,
    marginBottom: 10,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: '#000',
    marginTop: 10,
  },
});

export default HomeScreen;
