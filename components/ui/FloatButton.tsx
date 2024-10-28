// components/ui/FloatButton.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Icon, IIconProps } from 'native-base';

interface FloatButtonProps {
  onPress: () => void;
  icon: React.ReactElement<IIconProps>; // Nhận icon bất kỳ qua props
}

const FloatButton: React.FC<FloatButtonProps> = ({ onPress, icon }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {/* Icon nhận từ props */}
      <Icon as={icon.props.as} name={icon.props.name} size={icon.props.size} color={icon.props.color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3F72AE', // Màu nền mặc định
    borderRadius: 30,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default FloatButton;
