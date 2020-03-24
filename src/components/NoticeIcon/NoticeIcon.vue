<template>
  <div>
    <a-popover
      v-model="visible"
      trigger="click"
      placement="bottomRight"
      overlayClassName="header-notice-wrapper"
      :getPopupContainer="() => $refs.noticeRef.parentElement"
      :autoAdjustOverflow="true"
      :arrowPointAtCenter="true"
      :overlayStyle="{ width: '600px', top: '50px' }"
    >
      <template slot="content">
        <a-spin :spinning="loading">
          <a-tabs @change="setActiveKey" :activeKey="activeKey">
            <a-tab-pane tab="昨日待补卡" key="1">
              <div v-if="activeKey === '1'">
                <a-table
                  :columns="dingColumns"
                  :rowKey="record => record.userOid"
                  :dataSource="todoDingData"
                  :pagination="false"
                >
                  <template slot="operation" slot-scope="text, record">
                    <a href="javascript:;" @click="toDing(record, 0)">去补卡</a>
                  </template>
                </a-table>
                <MyPager
                  :pagination="dingPagination"
                  @changePageSize="onShowDingSizeChange"
                  @changePageIndex="changeDingPage"
                />
              </div>
            </a-tab-pane>
            <a-tab-pane tab="今日待配餐" key="2">
              <div v-if="activeKey === '2'">
                <a-table
                  :columns="dietColumns"
                  :rowKey="record => record.userOid"
                  :dataSource="todoDietData"
                  :pagination="false"
                >
                  <template slot="operation" slot-scope="text, record">
                    <a href="javascript:;" @click="toDiet(record, 1)">去配餐</a>
                  </template>
                </a-table>
                <MyPager
                  :pagination="DietPagination"
                  @changePageSize="onShowDietSizeChange"
                  @changePageIndex="changeDietPage"
                />
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-spin>
      </template>
      <span @click="fetchNotice" class="header-notice" ref="noticeRef" style="padding: 0 18px">
        <a-badge :count="count">
          <a-icon style="font-size: 16px; padding: 4px" type="bell" />
        </a-badge>
      </span>
    </a-popover>
  </div>
</template>

<script>
import { todoDietList, todoDietListCount, todoDingList, todoDingListCount } from '@/api/manage'
import { yesterday, today } from '@/utils/getDate'
import MyPager from '@/views/Dietician-sys/components/table/MyPager'
import { type } from 'mockjs2'
const dingColumns = [
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '25%'
  },
  {
    title: '手机号码',
    dataIndex: 'cellphone',
    width: '25%'
  },
  {
    title: '服务类型',
    dataIndex: 'serviceName',
    width: '25%'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
const dietColumns = [
  {
    title: '姓名',
    dataIndex: 'userName',
    width: '25%'
  },
  {
    title: '手机号码',
    dataIndex: 'cellphone',
    width: '25%'
  },
  {
    title: '服务类型',
    dataIndex: 'serviceName',
    width: '25%'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]
export default {
  name: 'HeaderNotice',
  components: {
    MyPager
  },
  data() {
    return {
      count: 0,
      activeKey: '1',
      dingPagination: {
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        current: 1,
        pageSize: 5,
        total: 0
      },
      DietPagination: {
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        current: 1,
        pageSize: 5,
        total: 0
      },
      todoDingData: [],
      todoDietData: [],
      dingColumns,
      dietColumns,
      yesterday: yesterday(),
      today: today(),
      oid: this.$store.state.userInfo.oid,
      loading: false,
      visible: false
    }
  },
  mounted() {
    this.getTodoDietListCount()
    this.getTodoDingListCount()
  },
  computed: {
    todoCount() {
      return this.$store.getters.resetTodoCount
    }
  },
  watch: {
    todoCount(val) {
      if (val) {
        console.log('嗯，重新来过')
        this.count = 0 // 归零，重新累加
        this.getTodoDietListCount()
        this.getTodoDingListCount()
        this.$store.commit('resetTodoCount', false)
      }
    }
  },
  methods: {
    toDing(param, type) {
      // console.log('判断当前地址', this.$route.path.indexOf('detail'))
      if (this.$route.path.indexOf('detail') > -1) {
        // 详情页
        this.$store.commit('setIntoStatus', 1)
        this.$store.commit('settoduUser', param)
        this.visible = false
      } else {
        // 列表页
        this.$store.commit('setIntoStatus', 2)
        this.$store.commit('settoduUser', param)
        this.$router.push(`/customer/detail/${param.userOid}`)
        this.visible = false
      }
    },
    toDiet(param, type) {
      // console.log('判断当前地址', this.$route.path.indexOf('detail'))
      if (this.$route.path.indexOf('detail') > -1) {
        // 详情页
        this.$store.commit('setIntoStatus', 3)
        this.$store.commit('settoduUser', param)
        this.visible = false
      } else {
        // 列表页
        this.$store.commit('setIntoStatus', 4)
        this.$store.commit('settoduUser', param)
        this.$router.push(`/customer/detail/${param.userOid}`)
        this.visible = false
      }
    },
    setActiveKey(key) {
      this.activeKey = key
    },
    getTodoDietList() {
      // 获取代办配餐
      const param = {
        pageIndex: this.DietPagination.current,
        pageSize: this.DietPagination.pageSize,
        oid: this.oid,
        dateTime: this.today
      }
      todoDietList(param).then(res => {
        if (res.success) {
          this.todoDietData = res.response.todoDietList.data
          this.DietPagination.total = res.response.todoDietList.dataCount
        }
      })
    },
    getTodoDietListCount() {
      // 获取代办配餐数量
      const param = {
        oid: this.oid,
        dateTime: this.today
      }
      todoDietListCount(param).then(res => {
        console.log('配餐代办数量', res)
        res.success ? (this.count += res.response.todoDietCount) : ''
      })
    },
    getTodoDingList() {
      // 获取昨日代办打卡
      const param = {
        pageIndex: this.dingPagination.current,
        pageSize: this.dingPagination.pageSize,
        oid: this.oid,
        dateTime: this.yesterday
      }
      todoDingList(param).then(res => {
        if (res.success) {
          this.todoDingData = res.response.todoDingList.data
          this.dingPagination.total = res.response.todoDingList.dataCount
        }
      })
    },
    getTodoDingListCount() {
      // 获取昨日代办打卡数量
      const param = {
        oid: this.oid,
        dateTime: this.yesterday
      }
      todoDingListCount(param).then(res => {
        console.log('打卡代待办数量', res)
        res.success ? (this.count += res.response.todoDingCount) : ''
      })
    },
    changeDingPage(val) {
      // 改变pageIndex
      this.pagination = val
      // this.getFoodList()
    },
    onShowDingSizeChange(val) {
      // 改变pageSize
      this.pagination = val
      // this.getFoodList()
    },
    changeDietPage(val) {
      // 改变pageIndex
      this.pagination = val
      // this.getFoodList()
    },
    onShowDietSizeChange(val) {
      // 改变pageSize
      this.pagination = val
      // this.getFoodList()
    },
    fetchNotice() {
      if (!this.visible) {
        this.loading = true
        this.getTodoDietList()
        this.getTodoDingList()
        setTimeout(() => {
          this.loading = false
        }, 1000)
      } else {
        this.loading = false
      }
      this.visible = !this.visible
    }
  }
}
</script>

<style lang="css">
.header-notice-wrapper {
  top: 50px !important;
}
</style>
<style lang="less" scoped>
.header-notice {
  display: inline-block;
  transition: all 0.3s;

  span {
    vertical-align: initial;
  }
}
</style>
