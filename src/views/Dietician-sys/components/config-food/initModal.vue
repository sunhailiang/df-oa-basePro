<template>
  <div class="container" v-if="step !== 2">
    <div class="step">
      <div class="title" v-if="step === 0">是否需要调整总量？</div>
      <div class="title" v-if="step === 1">是否需要调整营养比例？</div>
      <div class="setval" v-if="step === 0">
        <a-input addonBefore="卡路里" addonAfter="cal" defaultValue="0" size="small" />
      </div>
      <div class="setval" v-if="step === 1">
        <a-input addonBefore="C" addonAfter="cal" defaultValue="0" size="small" />
        <a-input addonBefore="F" addonAfter="cal" defaultValue="0" size="small" />
        <a-input addonBefore="P" addonAfter="cal" defaultValue="0" size="small" />
      </div>
      <div class="nextstep" v-if="step === 0">
        <a-button type="primary" size="small" @click="nextStep">下一步</a-button>
      </div>
      <div class="nextstep" v-if="step === 1">
        <a-button type="primary" size="small" @click="getConfigData">确定</a-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'InitModal',
  data() {
    return {
      step: 0
    }
  },
  methods: {
    nextStep() {
      this.step = 1
    },
    getConfigData() {
      this.step = 2
      const step = this.step
      this.$emit('currentStep', step)
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(192, 192, 192, 0.8);
  .step {
    width: 300px;
    background: white;
    margin: 100px auto;
    border-radius: 10px;
    .title {
      line-height: 40px;
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      border-bottom: 1px solid rgb(192, 192, 192);
      width: 80%;
      margin-left: 10%;
    }

    .setval {
      width: 70%;
      margin: 30px auto;
    }
    .nextstep {
      text-align: center;
      padding-bottom: 30px;
    }
  }
}
</style>
