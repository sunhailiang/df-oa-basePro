<template>
  <div>
    <a-table :rowSelection="rowSelection" rowkey="oid" :pagination="false" :columns="columns" :dataSource="data">
    </a-table>
  </div>
</template>
<script>
const columns = [
  {
    title: '食材名称',
    dataIndex: 'name'
  },
  {
    title: '食材重量',
    dataIndex: 'value'
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
    },
    recount: Object
  },
  mounted() {},
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this
      const tbType = this.tbType
      return {
        onChange: (selectedRowKeys, selectedRows) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, '瞅瞅人家拿到的数据: ', selectedRows)
          this.$emit('getSelected', { tbType, selectedRows, recount: this.recount })
        }
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
