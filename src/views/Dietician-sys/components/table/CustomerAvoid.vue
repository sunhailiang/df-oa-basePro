<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="忌口食材">
              <a-input v-model="queryParam.customerName" placeholder />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <s-table ref="table" size="default" rowKey="id" :columns="columns" :data="loadData" showPagination="auto">
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <span slot="description" slot-scope="text">
        <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record.oid)">详情</a>
        </template>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import moment from 'moment'
import { Ellipsis } from '@/components'
import STable from './CustomerList'
import {
  getServiceList,
  getServiceListCondition,
  addCustomer,
  agenterList,
  supporterList,
  serviceList
} from '@/api/manage'

const statusMap = {
  0: {
    status: 'default',
    text: '女'
  },
  1: {
    status: 'processing',
    text: '男'
  }
}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis
  },

  data() {
    return {
      agenterList: [],
      supporterList: [],
      serviceType: [],
      // 新增用户
      userInfo: {
        oid: '',
        userName: '',
        sex: 0,
        age: 0,
        province: '',
        city: '',
        initHeight: 0,
        initWeight: 0,
        supporterOid: '',
        jobName: '',
        jobStrength: '',
        serviceOid: '',
        agenterOid: ''
      },
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '客户编号',
          dataIndex: 'oid'
        },
        {
          title: '姓名',
          dataIndex: 'userName'
        },
        {
          title: '性别',
          dataIndex: 'sex',
          customRender: val => {
            return val == 1 ? '男' : '女'
          }
        },
        {
          title: '年龄',
          dataIndex: 'age'
        },
        {
          title: '地区',
          dataIndex: 'city'
        },
        {
          title: '类别',
          dataIndex: 'serviceName'
        },
        {
          title: '归属客服',
          dataIndex: 'supporterName'
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getServiceList(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.response !== null) {
            return res.response.customerList
          } else {
            return {
              pageIndex: 1,
              pageSize: 10,
              dataCount: 0,
              pageCount: 0,
              data: []
            }
          }
        })
      },
      selectedRowKeys: [],
      selectedRows: [],
      optionAlertShow: false
    }
  },

  mounted() {},
  methods: {
    handleEdit(id) {
      this.$router.push(`/customer/detail/${id}`)
    },
    handleOk(values) {
      this.$refs.modal.closeModal()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    resetSearchForm() {
      this.queryParam = {
        date: moment(new Date())
      }
    }
  }
}
</script>

<style lang="less" scoped>
#dp {
  background: red;
}
.table-operator {
  padding: 1rem;
  padding-left: 0;
}
</style>
