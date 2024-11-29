import { Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

const NoProduct = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
      <LottieView
        source={require('@/assets/animations/no-product.json')}
        autoPlay
        loop
        style={{ width: 380, height: 380 }}
      />
      <Text style={{ fontSize: 20, color: '#112D4E', fontWeight: 'bold' }}>
        Chưa có sản phẩm trong giỏ hàng
      </Text>
    </View>
  )
}

export default NoProduct