<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="编号">
              <a-input v-model="queryParam.id" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="性别">
              <a-select v-model="queryParam.gender" placeholder="请选择" default-value="0">
                <a-select-option value="0">女</a-select-option>
                <a-select-option value="1">男</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="年龄">
                <a-input-number v-model="queryParam.age" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="地区">
                <a-date-picker v-model="queryParam.area" style="width: 100%" placeholder="请输入更新日期" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="类别">
                <a-select v-model="queryParam.type" placeholder="请选择" default-value="0">
                  <a-select-option value="0">控糖</a-select-option>
                  <a-select-option value="1">减肥</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="归属客服">
                <a-select v-model="queryParam.service" placeholder="请选择" default-value="0">
                  <a-select-option value="0">张三</a-select-option>
                  <a-select-option value="1">李四</a-select-option>
                  <a-select-option value="2">王五</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="(!advanced && 8) || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => (queryParam = {})">重置</a-button>
              <a @click="toggleAdvanced" style="margin-left: 8px">
                {{ advanced ? '收起' : '展开' }}
                <a-icon :type="advanced ? 'up' : 'down'" />
              </a>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="CreateUser()">新建</a-button>
    </div>
    <s-table
      ref="table"
      size="default"
      rowKey="key"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      :delete="options.delete"
      showPagination="auto"
    >
      <span slot="serial" slot-scope="text, record, index">{{ index + 1 }}</span>
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>
      <span slot="description" slot-scope="text">
        <ellipsis :length="4" tooltip>{{ text }}</ellipsis>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record.no)">详情</a>
        </template>
      </span>
    </s-table>
    <AddCustomerModal ref="addUserModal" @save="saveUser" />
  </a-card>
</template>

<script>
import moment from 'moment'
import { Ellipsis } from '@/components'
import STable from './components/table/CustomerList'
import AddCustomerModal from './components/modal/AddCustomerModal'
import CreateForm from './modules/CreateForm'
import { getRoleList, getServiceList } from '@/api/manage'

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
    Ellipsis,
    CreateForm,
    AddCustomerModal
  },

  data() {
    return {
      mdl: {},
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '客户编号',
          dataIndex: 'no'
        },
        {
          title: '姓名',
          dataIndex: 'customerName',
          scopedSlots: { customRender: 'customerName' }
        },
        {
          title: '性别',
          dataIndex: 'customerGender',
          sorter: true,
          // needTotal: true, // 不需要统计
          scopedSlots: { customerGender: 'customerGender' }
        },
        {
          title: '年龄',
          dataIndex: 'customerAge',
          scopedSlots: { customRender: 'customerAge' }
        },
        {
          title: '地区',
          dataIndex: 'customerArea',
          sorter: true
        },
        {
          title: '类别',
          dataIndex: 'customerCategory',
          sorter: true
        },
        {
          title: '归属客服',
          dataIndex: 'affiliation',
          sorter: true
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
        console.log('loadData.parameter', parameter)
        return getServiceList(Object.assign(parameter, this.queryParam)).then(res => {
          return res.result
        })
      },
      selectedRowKeys: [],
      selectedRows: [],

      // custom table alert & rowSelection
      options: {
        alert: {
          show: true,
          clear: () => {
            this.selectedRowKeys = []
          }
        },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        },
        delete: {
          show: true,
          delete: () => {
            console.log('什么鬼玩意儿？', this.selectedRowKeys)
          }
        }
      },
      optionAlertShow: false
    }
  },
  filters: {
    statusFilter(type) {
      return statusMap[type].text
    },
    statusTypeFilter(type) {
      return statusMap[type].status
    }
  },
  created() {
    getRoleList({ t: new Date() })
  },

  methods: {
    saveUser(values) {
      console.log('保存新用户啊', values)
    },
    CreateUser(id) {
      this.$refs.addUserModal.openModal()
      console.log('创建永华')
    },
    handleEdit(id) {
      this.$router.push(`/customer/detail/${id}`)
    },
    handleOk(values) {
      console.log('保存数据？？？？', values)

      this.$refs.modal.closeModal()
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      console.log('这是一行数据嘛？', selectedRows)

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
.table-operator {
  padding: 1rem;
  padding-left: 0;
}
</style>
