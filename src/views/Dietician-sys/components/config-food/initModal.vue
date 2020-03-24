<template>
  <div class="container" v-if="step !== 2">
    <div class="loading"><a-spin size="large" :spinning="loading" /></div>
    <div class="step">
      <div class="title" v-if="step === 0">是否需要调整总量？</div>
      <div class="title" v-if="step === 1">是否需要调整营养比例？</div>
      <div class="setval" v-if="step === 0">
        <a-input addonBefore="卡路里" addonAfter="kcal" defaultValue="0" v-model="total" size="small" />
      </div>
      <div class="setval" v-if="step === 1">
        <p>
          <a-input
            :addonBefore="stepData.arr[0].name"
            :addonAfter="stepData.arr[0].unit"
            v-model="stepData.arr[0].value"
            defaultValue="0"
            size="small"
          />
        </p>
        <p>
          <a-input
            :addonBefore="stepData.arr[1].name"
            :addonAfter="stepData.arr[1].unit"
            v-model="stepData.arr[1].value"
            defaultValue="0"
            size="small"
          />
        </p>
        <p>
          <a-input
            :addonBefore="stepData.arr[2].name"
            :addonAfter="stepData.arr[2].unit"
            v-model="stepData.arr[2].value"
            defaultValue="0"
            size="small"
          />
        </p>
      </div>
      <div class="nextstep" v-if="step === 0">
        <a-button type="primary" size="small" :disabled="total <= 0" @click="nextStep">下一步</a-button>
      </div>
      <div class="nextstep" v-if="step === 1">
        <a-button type="primary" size="small" @click="getConfigData">确定</a-button>
      </div>
    </div>
  </div>
</template>
<script>
import { getDailyEnergy, getComponentPercentage } from '@/api/manage'
export default {
  name: 'InitModal',
  data() {
    return {
      step: 0,
      total: 0,
      stepData: { arr: [] },
      loading: false,
      recommendDailyComponentPercentage: {},
      recommendDailyEnergy: '',
      currentDailyEnergy: '',
      currentRatioStr: ''
    }
  },
  mounted() {
    this.loading = true
    getDailyEnergy(this.$route.params.id).then(res => {
      if (res.success == true) {
        this.total = res.response.value
        this.recommendDailyEnergy = res.response.value + 'kcal'
        getComponentPercentage().then(res => {
          if (res.success) {
            Object.assign(this.recommendDailyComponentPercentage, res.response)
            this.stepData.total = this.total
            let list = res.response.componentList
            let tempArr = []
            for (let i = 0; i < list.length; i++) {
              tempArr.push(list[i])
            }
            this.stepData.arr = tempArr

            this.currentRatioStr += this.total + '?'
            for (let i = 0; i < this.stepData.arr.length; i++) {
              switch (this.stepData.arr[i].nameCode) {
                case 'P':
                  this.currentRatioStr +=
                    'pNameCode=' + this.stepData.arr[i].nameCode + '&' + 'pValue=' + this.stepData.arr[i].value
                  break
                case 'C':
                  this.currentRatioStr +=
                    'cNameCode=' + this.stepData.arr[i].nameCode + '&' + 'cValue=' + this.stepData.arr[i].value
                  break
                case 'F':
                  this.currentRatioStr +=
                    'fNameCode=' + this.stepData.arr[i].nameCode + '&' + 'fValue=' + this.stepData.arr[i].value
                  break
                default:
                  break
              }
            }

            this.loading = false
          }
        })
      }
    })
  },
  methods: {
    nextStep() {
      this.currentDailyEnergy = this.total + 'kcal'
      this.step = 1
    },
    getConfigData() {
      this.step = 2
      this.stepData.step = this.step
      let resObj = {
        stepData: this.stepData,
        resParams: {
          recommendDailyComponentPercentage: this.recommendDailyComponentPercentage,
          recommendDailyEnergy: this.recommendDailyEnergy,
          currentRatioStr: this.currentRatioStr,
          currentDailyEnergy: this.currentDailyEnergy
        }
      }
      this.$emit('currentStep', resObj)
    }
  }
}
</script>
<style lang="less" scoped>
.container {
  position: absolute;
  width: 100%;
  height: 100%;
  .loading {
    text-align: center;
    position: absolute;
    top: 34%;
    left: 49%;
    z-index: 999;
  }
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
