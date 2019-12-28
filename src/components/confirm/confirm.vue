<template>
  <div>
    <a-modal title="Modal" v-model="visible" @ok="hideModal" okText="确认" cancelText="取消">
      <p>确认要删除数据吗？</p>
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'Confirm',
  data() {
    return {
      visible: false
    }
  },

  methods: {
    showModal() {
      this.visible = true
    },
    hideModal() {
      this.visible = false
    }
  }
}
</script>
