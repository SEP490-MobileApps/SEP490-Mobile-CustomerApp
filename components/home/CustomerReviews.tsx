// components/home/CustomerReviews.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Box, Progress } from 'native-base';
import { Feedback } from '../../models/Feedback';

interface Props {
  feedbacks: Feedback[];
}

const ITEMS_PER_PAGE = 2; // Số lượng phản hồi mỗi trang

function CustomerReviews({ feedbacks }: Props): React.JSX.Element {
  const [currentPage, setCurrentPage] = useState(1);
  const totalReviews = feedbacks.length;
  const totalPages = Math.ceil(totalReviews / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedFeedbacks = feedbacks.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const averageRating = totalReviews > 0 ? (feedbacks.reduce((acc, curr) => acc + curr.rate, 0) / totalReviews).toFixed(1) : '0';
  const ratingsCount = [5, 4, 3, 2, 1].map((star) => {
    return feedbacks.filter((feedback) => feedback.rate === star).length;
  });

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <View>
      <Text style={styles.title}>ĐÁNH GIÁ TỪ KHÁCH HÀNG</Text>
      {totalReviews > 0 && (
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
              <Text style={styles.totalReviews}>{totalReviews} Đánh giá</Text>
            </View>
          </View>
          {displayedFeedbacks.map((feedback) => (
            <Box key={feedback.feedbackId} style={styles.reviewContainer}>
              <View style={styles.reviewHeader}>
                <Image source={{ uri: feedback.avatarUrl }} style={styles.reviewAvatar} />
                <View>
                  <Text style={styles.reviewName}>{feedback.customerName}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    {[...Array(5)].map((_, i) => (
                      <Text key={i} style={{ fontSize: 14, color: i < feedback.rate ? '#3F72AF' : '#CCC' }}>★</Text>
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText}>{feedback.content}</Text>
              <View style={styles.reviewDivider} />
            </Box>
          ))}
          {/* Phân trang */}
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              onPress={handlePrevPage}
              disabled={currentPage === 1}
              style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
            >
              <Text style={styles.pageButtonText}>◀</Text>
            </TouchableOpacity>
            <Text style={styles.pageIndicator}>{`${currentPage} / ${totalPages}`}</Text>
            <TouchableOpacity
              onPress={handleNextPage}
              disabled={currentPage === totalPages}
              style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
            >
              <Text style={styles.pageButtonText}>▶</Text>
            </TouchableOpacity>
          </View>
        </>
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
    color: '#3F72AF',
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

export default CustomerReviews;
