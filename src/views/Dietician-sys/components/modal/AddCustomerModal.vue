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
              <a-input-search placeholder="请输入手机号" style="width: 200px" />
              <a-button type="primary" class="search">搜索</a-button>
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
          <li v-for="item in Object.keys(userInfo).filter(item => item != 'userId')" :key="item">{{ item }}</li>
        </ul>
        <ul class="nodata" v-if="!userInfo['userId']">
          <li>暂无数据！</li>
        </ul>
      </div>
      <div class="form" v-if="userId">
        <a-form :form="form">
          <a-form-item label="初始体重" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input-number
              :min="0"
              class="num-input"
              v-decorator="['weight', { rules: [{ required: true, message: '请输入客户初始体重' }] }]"
              placeholder="请输入初始体重"
            />
          </a-form-item>
          <a-form-item label="身高" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input-number
              :min="0"
              class="num-input"
              v-decorator="['height', { rules: [{ required: true, message: '请输入客户身高' }] }]"
              placeholder="请输入客户身高"
            />
          </a-form-item>
          <a-form-item label="职业名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-input
              v-decorator="['job', { rules: [{ required: true, message: '请输入客户职业名称' }] }]"
              placeholder="请输入客户职业名称"
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
              <a-select-option value="1">
                控糖
              </a-select-option>
              <a-select-option value="2">
                减肥
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="归属客服" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-select
              v-decorator="['service', { rules: [{ required: true, message: '请选择归属客服' }] }]"
              placeholder="请选择归属客服"
            >
              <a-select-option value="oassa121sdf123">
                张三丰
              </a-select-option>
              <a-select-option value="hd4212d1a2d12a">
                菩提老祖
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="归属代理" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
            <a-select
              v-decorator="['agency', { rules: [{ required: true, message: '请选择归属代理' }] }]"
              placeholder="请选择归属代理"
            >
              <a-select-option value="asd434a3sd46a4d6">
                苏州姑苏区
              </a-select-option>
              <a-select-option value="zcsd545asd48d7as">
                杭州
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
export default {
  name: 'FormModal',
  data() {
    return {
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
      userInfo: {
        userId: 'xasdassgsdf',
        userName: '奥特曼',
        gender: '女',
        city: '大雷音寺',
        手机: '13333333333'
      },
      userId: '',
      form: this.$form.createForm(this)
    }
  },
  methods: {
    selectUser(e) {
      e.target.checked ? (this.userId = this.userInfo.userId) : (this.userId = '')
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
      console.log(
        'value',
        this.form.validateFields((error, values) => {
          error ? console.log('这里有个错', error) : this.$emit('save', values)
        })
      )
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
