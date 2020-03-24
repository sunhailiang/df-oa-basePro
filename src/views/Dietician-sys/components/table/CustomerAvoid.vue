<template>
  <div class="tb_content">
    <a-button type="primary" class="todislike" @click="toDislike" icon="double-right" />
    <a-button type="primary" class="tolike" @click="toNormal" icon="double-left" />
    <div class="search-dislike">
      <div style="text-align:center; padding:15px 0;">
        <a-input-search style="width:20vw" v-model="searchFood" placeholder="查询忌口食材" @search="onSearch" />
      </div>
      <div v-if="refreshData">
        <a-table
          :rowSelection="dislikeSelection"
          :columns="dislikeColumns"
          :rowKey="record => record.oid"
          :dataSource="foodData"
          :loading="loading"
          :pagination="false"
        >
        </a-table>
      </div>

      <MyPager :pagination="pagination" @changePageSize="onShowSizeChange" @changePageIndex="changePage" />
    </div>
    <div class="dislike">
      <div style="text-align:center; padding:15px 0; font-size:20px">
        客户不喜欢的食材
      </div>

      <a-table
        :columns="columns"
        :rowKey="record => record.oid"
        :rowSelection="rowSelection"
        :dataSource="dislikedata"
        :pagination="false"
      >
        <template slot="name" slot-scope="name"> {{ name.first }} {{ name.last }} </template>
      </a-table>
      <MyPager
        :pagination="dislikePagination"
        @changePageSize="onDislikeShowSizeChange"
        @changePageIndex="DislikechangePage"
      />
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: '45%'
  },
  {
    title: '食材名称',
    dataIndex: 'name',
    width: '45%'
  }
]
const dislikeColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    width: '45%'
  },
  {
    title: '食材名称',
    dataIndex: 'name',
    width: '45%'
  }
]
import { getFoodList, getDislikeFood, addDislike, deleteDislikeFood } from '@/api/manage'
import MyPager from './MyPager'
export default {
  name: 'CustomerAvoid',
  components: { MyPager },
  mounted() {},
  data() {
    return {
      refreshData: true,
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        current: 1,
        pageSize: 10,
        total: 0
      },
      dislikePagination: {
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        current: 1,
        pageSize: 10,
        total: 0
      },
      searchFood: '',
      foodData: [],
      dislikedata: [],
      loading: false,
      columns,
      dislikeColumns,
      selectedRowKeys: [],
      selectedDislike: [],
      toDisLikeData: [],
      toNormalData: []
    }
  },

  mounted() {
    this.getDislikeFoodList()
  },
  methods: {
    toDislike() {
      // 新增不喜欢
      let params = {
        customerOid: this.$route.params.id,
        operaterOid: this.$store.state.userInfo.oid,
        dislikeFoodList: this.toDisLikeData
      }
      addDislike(params).then(res => {
        // 刷新数据
        this.getFoodList()
        this.getDislikeFoodList()
        this.refreshData = false
        this.$nextTick(() => {
          this.refreshData = true
        })
      })
    },
    toNormal() {
      // 删除不喜欢
      let params = {
        customerOid: this.$route.params.id,
        dislikeFoodList: this.toNormalData
      }
      deleteDislikeFood(params).then(res => {
        console.log('sssss', res)

        this.getDislikeFoodList()
        if (this.searchFood != '') {
          this.getFoodList()
          this.refreshData = false
          this.$nextTick(() => {
            this.refreshData = true
          })
        }
      })
    },
    onDislikeShowSizeChange(val) {
      // 不喜欢列表分页
      this.dislikePagination = val
      this.getDislikeFoodList()
    },
    DislikechangePage(val) {
      // 不喜欢列表分页
      this.dislikePagination = val
      this.getDislikeFoodList()
    },
    changePage(val) {
      // 改变pageIndex
      this.pagination = val
      this.getFoodList()
    },
    onShowSizeChange(val) {
      // 改变pageSize
      this.pagination = val
      this.getFoodList()
    },
    getDislikeFoodList() {
      const param = {
        pageIndex: this.dislikePagination.current,
        pageSize: this.dislikePagination.pageSize,
        oid: this.$route.params.id
      }
      getDislikeFood(param).then(res => {
        if (res.success) {
          this.dislikedata = res.response.dislikeFoodList.data
          this.dislikePagination.total = res.response.dislikeFoodList.dataCount
        }
      })
    },
    getFoodList() {
      const param = {
        pageIndex: this.pagination.current,
        pageSize: this.pagination.pageSize,
        oid: this.$route.params.id,
        foodName: this.searchFood
      }

      getFoodList(param).then(res => {
        if (res.success) {
          this.foodData = res.response.foodList.data
          this.pagination.total = res.response.foodList.dataCount
        }
      })
    },
    onSearch(value) {
      this.getFoodList()
    }
  },
  computed: {
    dislikeSelection() {
      const { selectedRowKeys } = this
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          // 获取接口数据
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          this.toDisLikeData = selectedRowKeys
        },
        getCheckboxProps: record => ({
          props: {
            disabled: record.customerDislikeStatus === -1 // Column configuration not to be checked
          }
        })
      }
    },
    rowSelection() {
      const { selectedRowKeys } = this
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          this.toNormalData = selectedRowKeys
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
.tb_content {
  display: flex;
  justify-content: space-between;
  position: relative;
  .search-dislike {
    width: 48%;
  }
  .dislike {
    width: 48%;
  }
  .todislike,
  .tolike {
    position: absolute;
    left: 48.5%;
    top: 50%;
  }
  .tolike {
    top: 65%;
  }
}
</style>
