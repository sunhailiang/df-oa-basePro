import Vue from 'vue'
import router from './router'
import store from './store'
const whiteList = ['login', 'register', 'registerResult'] // no redirect whitelist
import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import notification from 'ant-design-vue/es/notification'
import { ACCESS_TOKEN } from '@/store/mutation-types'
const defaultRoutePath = '/'
NProgress.configure({ showSpinner: false }) // NProgress Configuration
router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') {
      next({ path: defaultRoutePath })
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      notification.error({
        message: '错误',
        description: '请求用户信息失败，请重试'
      })
      store.dispatch('Logout').then(() => {
        next({ path: '/user/login', query: { redirect: to.fullPath } })
      })
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
