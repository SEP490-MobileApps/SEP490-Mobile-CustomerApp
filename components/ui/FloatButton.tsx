import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Icon, IIconProps } from 'native-base';

interface FloatButtonProps {
  onPress: () => void;
  icon: React.ReactElement<IIconProps>;
  label?: string; // Thêm prop label dạng optional
}

const FloatButton: React.FC<FloatButtonProps> = ({ onPress, icon, label }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        label ? styles.buttonWithLabel : null // Thêm style khi có label
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Icon
          as={icon.props.as}
          name={icon.props.name}
          size={icon.props.size}
          color={icon.props.color}
        />
        {label && <Text style={styles.label}>{label}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#3F7233',
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
  buttonWithLabel: {
    width: 'auto', // Cho phép button mở rộng theo nội dung
    paddingHorizontal: 20, // Thêm padding cho label
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: '#DBE2EF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default FloatButton;