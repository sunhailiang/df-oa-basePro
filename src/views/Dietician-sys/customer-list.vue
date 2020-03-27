<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="姓名">
              <a-input v-model="queryParam.customerName" placeholder />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="手机">
              <a-input v-model="queryParam.cellphone" placeholder />
            </a-form-item>
          </a-col>
          <template v-if="advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="服务类别">
                <a-select v-model="queryParam.serviceOid" placeholder="请选择" default-value="0">
                  <a-select-option v-for="item in serviceType" :key="item.oid" :value="item.oid">
                    {{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="归属客服">
                <a-select v-model="queryParam.supporterOid" placeholder="请选择" default-value="0">
                  <a-select-option v-for="item in supporterList" :value="item.oid" :key="item.oid">
                    {{ item.userName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="归属代理">
                <a-select v-model="queryParam.agenterOid" placeholder="请选择" default-value="0">
                  <a-select-option v-for="item in agenterList" :key="item.oid" :value="item.oid">
                    {{ item.userName }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="(!advanced && 8) || 24" :sm="24">
            <span
              class="table-page-search-submitButtons"
              :style="(advanced && { float: 'right', overflow: 'hidden' }) || {}"
            >
              <a-button type="primary" @click="loadDataCondition">查询</a-button>
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
      rowKey="id"
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
          <a @click="handleEdit(record.oid)">详情</a>
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
    Ellipsis,
    CreateForm,
    AddCustomerModal
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
  mounted() {
    agenterList().then(res => {
      res.response != 'null' ? (this.agenterList = res.response) : ''
    })
    supporterList().then(res => {
      res.response != 'null' ? (this.supporterList = res.response) : ''
    })
    serviceList().then(res => {
      res.response != 'null' ? (this.serviceType = res.response) : ''
    })
  },
  methods: {
    loadDataCondition() {
      this.loadData = parameter => {
        return getServiceListCondition(Object.assign(parameter, this.queryParam)).then(res => {
          if (res.response) {
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
      }
    },
    getDom(el) {
      console.log('el', el)
    },
    handlePanelChange(isShow) {
      if (isShow) {
        setTimeout(console.log(document.getElementsByClassName('ant-calendar-input-wrap')[0]), 2000)
      }
    },
    saveUser(values) {
      this.userInfo.oid = values.oid
      this.userInfo.userName = values.userName
      this.userInfo.sex = parseInt(values.sex)
      this.userInfo.age = parseInt(values.age)
      this.userInfo.province = values.province == null ? '' : values.province
      this.userInfo.city = values.city
      this.userInfo.initHeight = parseFloat(values.initHeight)
      this.userInfo.initWeight = parseFloat(values.initWeight)
      this.userInfo.supporterOid = values.service
      this.userInfo.jobName = values.jobName
      this.userInfo.jobStrength = values.jobStrength
      this.userInfo.serviceOid = values.type
      this.userInfo.agenterOid = values.agency
      addCustomer(this.userInfo).then(res => {
        if (res.success) {
          setTimeout(() => {
            this.$notification.success({
              message: '新增成功'
            })
          }, 1500)
          this.loadDataCondition()
          this.$refs.addUserModal.closeModal()
        } else {
          this.$notification['error']({
            message: '错误',
            description: res.message + ':' + res.response,
            duration: 4
          })
        }
      })
    },
    CreateUser(id) {
      this.$refs.addUserModal.openModal()
    },
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
