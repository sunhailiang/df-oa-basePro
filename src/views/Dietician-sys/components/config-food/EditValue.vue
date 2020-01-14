<template>
  <div>
    <a-modal
      title="修改食材重量"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-input v-model="oldVal" :addonBefore="type" />
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'EditValue',
  data() {
    return {
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false,
      oldVal: '0',
      type: ''
    }
  },
  props: {},
  methods: {
    showModal(v) {
      this.oldVal = v.value
      this.type = v.type
      this.visible = true
    },
    handleOk(e) {
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 2000)
    },
    handleCancel(e) {
      console.log('Clicked cancel button')
      this.visible = false
    }
  }
}
</script>
