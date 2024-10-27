// components/home/CustomerReviews.tsx
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Box, Progress } from 'native-base';
import { reviews } from '../../constants/Datas';
import { Review } from '../../models/Review';
import NoDataComponent from '../ui/NoDataComponent';

function CustomerReviews(): React.JSX.Element {
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1) : '0';
  const ratingsCount = [5, 4, 3, 2, 1].map((star) => {
    return reviews.filter((review) => review.rating === star).length;
  });

  return (
    <View>
      <Text style={styles.title}>ĐÁNH GIÁ TỪ KHÁCH HÀNG</Text>
      {totalReviews > 0 ? (
        <>
          <View style={styles.ratingSummary}>
            <View style={styles.progressBars}>
              {[5, 4, 3, 2, 1].map((star, index) => (
                <View key={star} style={styles.progressBarContainer}>
                  <Text style={{ color: '#3F72AF' }}>{star} ★</Text>
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
                <Image source={review.avatarUrl} style={styles.reviewAvatar} />
                <View>
                  <Text style={styles.reviewName}>{review.userName}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    {[...Array(5)].map((_, i) => (
                      <Text key={i} style={{ fontSize: 14, color: i < review.rating ? '#3F72AF' : '#CCC' }}>★</Text>
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText}>{review.comment}</Text>
              <View style={styles.reviewDivider} />
            </Box>
          ))}
        </>
      ) : (
        <NoDataComponent
          imageUrl={require('../../assets/images/no-review.png')}
          title="Không có đánh giá"
          description="Hiện tại chưa có đánh giá nào cho dịch vụ này."
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
    color: '#3F72AF', // màu cho ngôi sao trung bình
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
export default CustomerReviews;
