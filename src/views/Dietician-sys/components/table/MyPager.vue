<template>
  <div class="pager" v-if="this.pagination.total > 0">
    <Pagination
      :pageSizeOptions="this.pagination.pageSizeOptions"
      :total="this.pagination.total"
      showSizeChanger
      :pageSize="this.pagination.pageSize"
      v-model="this.pagination.current"
      @showSizeChange="onShowSizeChange"
      @change="changePage"
    >
      <template slot="buildOptionText" slot-scope="props">
        <span v-if="props.value !== '10'">{{ props.value }}条/页</span>
        <span v-if="props.value === '10'">全部</span>
      </template>
    </Pagination>
  </div>
</template>

<script>
import Pagination from 'ant-design-vue/es/pagination'
export default {
  name: 'MyPager',
  components: {
    Pagination
  },
  props: {
    pagination: {
      type: Object,
      default: () => {
        return {
          pageSizeOptions: ['5', '10', '15', '20', '25'],
          current: 1,
          pageSize: 10,
          total: 0
        }
      }
    }
  },
  methods: {
    changePage(val) {
      // 改变pageIndex
      this.pagination.current = val
      this.$emit('changePageIndex', this.pagination)
    },
    onShowSizeChange(current, pageSize) {
      // 改变pageSize
      this.pagination.pageSize = pageSize
      this.$emit('changePageSize', this.pagination)
    }
  }
}
</script>
<style lang="less" scoped>
.pager {
  text-align: right;
  padding: 20px 0;
}
</style>
