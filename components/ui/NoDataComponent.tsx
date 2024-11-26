// components/ui/NoDataComponent.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';

interface NoDataComponentProps {
  imageUrl: any;
  title: string;
  description: string;
}

const NoDataComponent: React.FC<NoDataComponentProps> = ({ imageUrl, title, description }) => {
  return (
    <View style={styles.container}>
      <Image source={imageUrl} style={styles.image} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1, // Chiếm toàn bộ không gian để căn giữa
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: width * 0.4, // Kích thước ảnh chiếm 40% chiều rộng màn hình
    height: width * 0.4,
    marginBottom: 20,
  },
  title: {
    fontSize: 24, // Tăng kích thước font cho tiêu đề
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center', // Căn giữa văn bản
    color: '#3F72AF',
  },
  description: {
    fontSize: 16, // Tăng kích thước font cho mô tả
    color: '#6c757d',
    textAlign: 'center', // Căn giữa văn bản
    width: '80%', // Giới hạn chiều rộng để tránh văn bản tràn ra ngoài
  },
});

export default NoDataComponent;
