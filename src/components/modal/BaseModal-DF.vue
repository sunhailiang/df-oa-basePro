<template>
  <div class="base-modal">
    <div class="modal-container">
      <div class="df-basemodal-header">{{ title }}</div>
      <div class="df-basemodal-body"></div>
      <div class="df-basemodal-footer"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BaseModal',
  props: {
    title: {
      type: String,
      default: '滇峰Modal'
    },
    cancelTxt: {
      type: String,
      default: '取消'
    },
    okTxt: {
      type: String,
      default: '确定'
    }
  }
}
</script>
<style lang="less" scoped></style>
