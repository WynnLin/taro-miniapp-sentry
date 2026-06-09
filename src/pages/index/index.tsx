import { View, Text, Button } from '@tarojs/components'
import { useLoad } from '@tarojs/taro'
import './index.scss'

export default function Index() {

  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <Text>Hello world!</Text>
      <Button onClick={() => {
        throw new Error('this is a test message')
      }}
      >Click Me!</Button>
    </View>
  )
}
