<template>
  <Tabbar v-model="active" active-color="#07c160" @change="changeTab" inactive-color="#000">
    <TabbarItem icon="home-o">每日打卡</TabbarItem>
    <TabbarItem icon="search">体质检测</TabbarItem>
    <TabbarItem icon="search">我的变化</TabbarItem>
  </Tabbar>
</template>
<script>
import { Tabbar, TabbarItem } from 'vant'
export default {
  name: 'Tabs',
  components: { Tabbar, TabbarItem },
  data() {
    return {
      active: 0
    }
  },
  methods: {
    changeTab(key) {
      switch (key) {
        case 0:
          this.$router.push('/ding')
          this.isMecury = false
          break
        case 1:
          this.isMecury = true
          break
        case 2:
          this.$router.push('/mychange')
          this.isMecury = false
          break
      }
    }
  }
}
</script>
