<template>
  <div class="recommend">
    <a-modal
      title="推荐食材"
      :visible="visible"
      :width="900"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <p>{{ ModalText }}</p>
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'Recommend',
  data() {
    return {
      ModalText: 'Content of the modal',
      visible: false,
      confirmLoading: false
    }
  },
  props: {
    params: {
      type: Object,
      default: () => {
        return { type: '', weight: 0 }
      }
    },
    isShow: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    showModal() {
      this.visible = true
    },
    handleOk(e) {
      this.ModalText = 'The modal will be closed after two seconds'
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 2000)
    },
    handleCancel(e) {
      console.log('Clicked cancel button')
      this.visible = false
      this.$emit('setVisible', this.visible)
    }
  },
  mounted() {
    console.log('xxxx', this.isShow)

    this.$emit('setVisible', this.visible)
  },
  watch: {
    isShow(val) {
      this.visible = val
    }
  }
}
</script>
<style lang="less" scoped></style>
