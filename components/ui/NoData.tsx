import { Text, View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

const NoData = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F9F7F7' }}>
      <LottieView
        source={require('@/assets/animations/no-data.json')}
        autoPlay
        loop
        style={{ width: 300, height: 300 }}
      />
      <Text style={{ fontSize: 20, color: '#112D4E', fontWeight: 'bold' }}>
        Không có dữ liệu
      </Text>
    </View>
  )
}

export default NoData