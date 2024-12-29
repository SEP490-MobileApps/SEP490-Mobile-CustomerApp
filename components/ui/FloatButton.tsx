import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { Icon, IIconProps } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';

interface FloatButtonProps {
  onPress: () => void;
  icon: React.ReactElement<IIconProps>;
  label?: string;
}

const FloatButton: React.FC<FloatButtonProps> = ({ onPress, icon, label }) => {
  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        label ? styles.buttonWithLabel : null
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#DBE2EF', '#3F72AF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradient,
          label ? styles.gradientWithLabel : null
        ]}
      >
        <View style={styles.content}>
          <Icon
            as={icon.props.as}
            name={icon.props.name}
            size={icon.props.size}
            color="#112D4E"
          />
          {label && <Text style={styles.label}>{label}</Text>}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderRadius: 30,
  },
  buttonWithLabel: {
    width: 'auto',
  },
  gradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientWithLabel: {
    width: 'auto',
    paddingHorizontal: 20,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: '#112D4E',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default FloatButton;