<template>
  <a-table :rowSelection="rowSelection" :pagination="false" :columns="columns" :dataSource="data"> </a-table>
</template>
<script>
const columns = [
  {
    title: '食材名称',
    dataIndex: 'foodName'
  },
  {
    title: '食材重量',
    dataIndex: 'foodWeight'
  }
]

export default {
  data() {
    return {
      columns
    }
  },
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    tbType: {
      type: Number,
      default: 0
    }
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      const tbType = this.tbType
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, '瞅瞅人家拿到的数据: ', selectedRows)
          this.$emit('getSelected', { tbType, selectedRows })
        }
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
