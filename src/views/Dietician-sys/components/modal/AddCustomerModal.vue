<template>
  <a-modal
    title="设置VIP"
    :width="640"
    :visible="visible"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    @cancel="closeModal"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="检索客户" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <div class="search">
            <div class="phone">
              <a-input-search placeholder="请输入手机号" v-model="phone" style="width: 200px" />
              <a-button type="primary" @click="getCustomerByPhone" class="search">搜索</a-button>
            </div>
          </div>
        </a-form-item>
      </a-form>
      <div class="tb">
        <ul class="title">
          <li></li>
          <li>姓名</li>
          <li>性别</li>
          <li>城市</li>
          <li>手机</li>
        </ul>
        <ul class="data" v-if="userInfo['userId']">
          <li><a-checkbox @change="selectUser"></a-checkbox></li>
          <li
            v-for="k in Object.keys(userInfo).filter(
              item =>
                item != 'userId' && item != 'province' && item != 'age' && item != 'initWeight' && item != 'initHeight'
            )"
            :key="k"
          >
            {{ userInfo[k] }}
          </li>
        </ul>
        <ul class="nodata" v-if="!userInfo['userId']">
          <li>暂无数据！</li>
        </ul>
      </div>
      <div class="form" v-if="userId">
        <a-form :form="form">
          <a-form-item label="姓名" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              value="xxx"
              class="num-input"
              v-decorator="[
                'name',
                { rules: [{ required: true, message: '请输入客户姓名' }], initialValue: this.userInfo.userName }
              ]"
              placeholder="请输入客户姓名"
            />
          </a-form-item>
          <a-form-item label="年龄" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input-number
              :min="10"
              class="num-input"
              v-decorator="[
                'age',
                { rules: [{ required: true, message: '请输入客户年龄' }], initialValue: this.userInfo.age }
              ]"
              placeholder="请输入客户年龄"
            />
          </a-form-item>
          <a-form-item label="省" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              v-decorator="[
                'province',
                { rules: [{ required: true, message: '请输入客户所在省' }], initialValue: this.userInfo.province }
              ]"
              placeholder="请输入客户所在省"
            />
          </a-form-item>
          <a-form-item label="市" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              v-decorator="[
                'city',
                { rules: [{ required: true, message: '请输入客户所在市' }], initialValue: this.userInfo.city }
              ]"
              placeholder="请输入客户所在市"
            />
          </a-form-item>
          <a-form-item label="初始体重" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input-number
              :min="0"
              class="num-input"
              v-decorator="[
                'weight',
                { rules: [{ required: true, message: '请输入客户初始体重' }], initialValue: this.userInfo.initWeight }
              ]"
              placeholder="请输入初始体重"
            />
          </a-form-item>
          <a-form-item label="身高" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input-number
              :min="0"
              class="num-input"
              v-decorator="[
                'height',
                { rules: [{ required: true, message: '请输入客户身高' }], initialValue: this.userInfo.initHeight }
              ]"
              placeholder="请输入客户身高"
            />
          </a-form-item>
          <a-form-item label="工作名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              v-decorator="['job', { rules: [{ required: true, message: '请输入客户工作名称' }] }]"
              placeholder="请输入客户工作名称"
            />
          </a-form-item>
          <a-form-item label="工作强度" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-radio-group v-decorator="['intensity']" defaultValue="1" buttonStyle="solid">
              <a-radio-button value="1">极轻</a-radio-button>
              <a-radio-button value="2">轻</a-radio-button>
              <a-radio-button value="3">中</a-radio-button>
              <a-radio-button value="4">重</a-radio-button>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="类别" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-select
              v-decorator="['type', { rules: [{ required: true, message: '请选择客户类别' }] }]"
              placeholder="请选客户类别"
            >
              <a-select-option v-for="item in serviceType" :key="item.oid" :value="item.oid">
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="归属客服" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-select
              v-decorator="['service', { rules: [{ required: true, message: '请选择归属客服' }] }]"
              placeholder="请选择归属客服"
            >
              <a-select-option v-for="item in supporterList" :value="item.oid" :key="item.oid">
                {{ item.userName }}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="归属代理" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-select
              v-decorator="['agency', { rules: [{ required: true, message: '请选择归属代理' }] }]"
              placeholder="请选择归属代理"
            >
              <a-select-option v-for="item in agenterList" :key="item.oid" :value="item.oid">
                {{ item.userName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-form>
      </div>
    </a-spin>
    <template slot="footer">
      <a-button key="cancel" :style="{ float: 'left' }" @click="closeModal">取消</a-button>
      <a-button key="confirm" @click="saveData">确认</a-button>
    </template>
  </a-modal>
</template>

<script>
import { originalCustomer, agenterList, supporterList, serviceList } from '@/api/manage'
export default {
  name: 'FormModal',
  data() {
    return {
      bakUser: {},
      formLayout: 'horizontal',
      form: this.$form.createForm(this),
      userPhone: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      currentStep: 0,
      mdl: {},
      userInfo: {},
      userId: '',
      form: this.$form.createForm(this),
      phone: '',
      serviceType: [],
      supporterList: [],
      agenterList: []
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
    getCustomerByPhone() {
      this.userId = ''
      this.userInfo = { userId: '', userName: '', sex: '', city: '', cellphone: '' }
      originalCustomer(this.phone).then(res => {
        if (res.success) {
          console.log('点击拿数据')

          let data = res.response
          this.userInfo.userId = data.oid
          this.userInfo.userName = data.userName
          this.userInfo.sex = data.sex == 1 ? '男' : '女'
          this.userInfo.city = data.city
          this.userInfo.cellphone = data.cellphone
          this.userInfo.initHeight = data.initHeight
          this.userInfo.initWeight = data.initWeight
          this.userInfo.province = data.province

          console.log('确认拿到数据', this.userInfo)

          // 拿出完整数据备用
          this.bakUser = data
        }
      })
    },
    selectUser(e) {
      e.target.checked && this.userInfo.userId != '' ? (this.userId = this.userInfo.userId) : (this.userId = '')
    },
    openModal() {
      this.visible = true
    },
    closeModal() {
      this.visible = false
    },
    refresh() {
      this.form.validateFields((error, values) => {
        error ? console.log('清空数据时报错', error) : (values = {})
      })
    },
    saveData() {
      this.form.validateFields((error, values) => {
        values.intensity == undefined ? (this.bakUser.jobStrength = '1') : (this.bakUser.jobStrength = values.intensity)
        this.bakUser.initHeight = values.height
        this.bakUser.initWeight = values.weight
        this.bakUser.jobName = values.job
        error ? console.log('新用户保存出错', error) : this.$emit('save', Object.assign(this.bakUser, values))
      })
    }
  }
}
</script>
<style lang="less" scoped>
.form {
  margin: 40px auto;
  padding-left: 90px;
}
.num-input {
  width: 100%;
}
ul {
  padding: 0;
  li {
    list-style: none;
  }
}
.tb {
  .title,
  .data {
    min-width: 400px;
    display: flex;
    align-items: center;
    height: 26px;
    li {
      width: 23%;
    }
    li:first-child {
      width: 8%;
      padding-left: 15px;
    }
  }
  .title {
    background: #fafafa;

    border-bottom: 1px solid #e8e8e8;
  }
  .data {
    border-bottom: 1px solid #e8e8e8;
    padding-bottom: 15px;
  }
  .nodata {
    min-width: 400px;
    li {
      width: 100%;
      text-align: center;
    }
  }
}
.search {
  margin-left: 8px;
}
</style>
