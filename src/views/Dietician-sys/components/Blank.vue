<template>
  <div></div>
</template>
<script>
export default {
  name: 'blank',
  created() {
    if (this.$store.state.into === 1 || this.$store.state.into === 3) {
      //打卡
      this.$router.push(`/customer/detail/${this.$route.params.id}`)
    }
  }
}
</script>
