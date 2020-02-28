<template>
  <div class="user-wrapper">
    <div class="content-box">
      <notice-icon class="action" />
      <a-dropdown>
        <span class="action ant-dropdown-link user-dropdown-menu">
          <a-avatar class="avatar" size="small" :src="avata" />
          <span class="user-name">营养师：{{ this.$store.state.userInfo.userName }}</span>
        </span>
        <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
          <a-menu-item key="3">
            <a href="javascript:;" @click="handleLogout">
              <a-icon type="logout" />
              <span>退出登录</span>
            </a>
          </a-menu-item>
        </a-menu>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import NoticeIcon from '@/components/NoticeIcon'
import { mapActions, mapGetters } from 'vuex'
import store from '@/store'
export default {
  name: 'UserMenu',
  components: {
    NoticeIcon
  },
  data() {
    return {
      avata: 'https://gw.alipayobjects.com/zos/rmsportal/ThXAXghbEsBCCSDihZxY.png'
    }
  },
  computed: {
    ...mapGetters(['nickname', 'avatar'])
  },
  methods: {
    ...mapActions(['Logout']),
    handleLogout() {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk: () => {
          store.dispatch('Logout').then(() => {
            console.log('登出')

            this.$router.push('/user/login')
          })
        },
        onCancel() {}
      })
    }
  }
}
</script>
<style lang="less" scoped>
.user-name {
  display: inline-block;
  padding-right: 14px;
  font-size: 17px;
}
.avatar {
  position: relative;
  top: -4px;
}
</style>
