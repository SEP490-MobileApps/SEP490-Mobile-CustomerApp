// CustomButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'cancel';
  style?: ViewStyle;
  textStyle?: TextStyle; // Thêm prop cho style của chữ
}

const CustomButton: React.FC<CustomButtonProps> = ({ title, onPress, variant = 'primary', style, textStyle }) => {
  const backgroundColor = variantStyles[variant] || variantStyles.primary;

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor }, style]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const variantStyles = {
  primary: '#3F72AF',
  secondary: '#DBE2EF',
  danger: '#FF5F40',
  cancel: '#D9534F',
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomButton;
