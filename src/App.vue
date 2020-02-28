<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'

export default {
  mixins: [AppDeviceEnquire],
  data() {
    return {
      locale: zhCN
    }
  },
  mounted() {},
  created() {
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('userInfo', JSON.stringify(this.$store.state))
    })
    if (sessionStorage.getItem('userInfo')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('userInfo'))))
    }
  }
}
</script>
<style>
#app {
  height: 100%;
}
</style>
