<template>
  <div>
    <a-modal :title="title" v-model="visible" @ok="hideModal" okText="确认" cancelText="取消">
      <p>确认要删除这条{{ title }}吗？</p>
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
  props: {
    title: String,
    isShow: Boolean
  },
  methods: {
    showModal() {
      this.visible = true
    },
    hideModal() {
      this.$emit('doDelete', this.title)
      this.visible = this.isShow
    }
  },
  watch: {
    isShow(val) {
      !val ? (this.visible = val) : ''
    }
  }
}
</script>
