import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import * as Sentry from 'sentry-miniapp'
import './app.scss'

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  release: SENTRY_RELEASE,
  environment: process.env.NODE_ENV ?? 'development',
  platform: 'wechat',
  sampleRate: 1,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.2 : 1,
})

function App({ children }: PropsWithChildren<any>) {

  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return children
}

export default App
