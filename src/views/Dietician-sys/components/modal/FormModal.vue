<template>
  <a-modal
    title="废弃配餐？"
    :width="640"
    :visible="visible"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    @cancel="closeModal"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="废弃原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-model="cause"
            v-decorator="['cause', { initialValue: 0, rules: [{ required: true }] }]"
            style="width: 100%"
          >
            <a-select-option :value="0">配餐有误</a-select-option>
            <a-select-option :value="1">客户不喜欢</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-if="cause === 1" label="不喜欢哪些食品(逗号分割)" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-textarea :rows="4" v-decorator="['desc', { rules: [{ required: true }] }]"></a-textarea>
        </a-form-item>
      </a-form>
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
      cause: 0,
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

      form: this.$form.createForm(this)
    }
  },
  methods: {
    openModal(id) {
      this.visible = true
      console.log('存储数据', id)

      this.$nextTick(() => {
        // setFieldsValue(pick(record, []))
      })
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
