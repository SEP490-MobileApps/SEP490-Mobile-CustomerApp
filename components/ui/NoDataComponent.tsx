import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface NoDataComponentProps {
  imageUrl: any; // Để hỗ trợ require() hoặc URL từ Internet
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

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#6c757d',
  },
});

export default NoDataComponent;
