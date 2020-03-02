<template>
  <div class="import-config" v-if="visible">
    <a-modal
      wrapClassName="import-config"
      title="精选配餐"
      :visible="visible"
      :destroyOnClose="true"
      @ok="handleOk"
      @cancel="handleCancel"
      :bodyStyle="setImportStyle()"
    >
      <template slot="footer">
        <a-button key="back" @click="handleCancel">取消</a-button>
        <a-button
          key="preview"
          type="primary"
          ref="preview-btn"
          :icon="!showImg ? 'picture' : ''"
          @click="showPreviewImg"
          >{{ showImgBtnTxt }}</a-button
        >
        <a-button key="submit" type="primary" :disabled="showImg" :loading="loading" @click="handleOk">
          确认并导出
        </a-button>
      </template>
      <img :src="imgUrl" alt="" v-if="showImg" />
      <div class="import-to-img" ref="importToImg" v-if="!showImg">
        <div class="config">
          <div class="type">
            <div class="type-name">早餐</div>
            <div class="food-name">
              <span class="tag" v-for="item of breakFast" :key="item.oid" closable @close="deleteFood" color="#108ee9"
                >{{ item.name }}({{ item.value }}g)</span
              >
            </div>
          </div>
          <div class="type">
            <div class="type-name">午餐</div>
            <div class="food-name">
              <span class="tag" v-for="item of lunch" :key="item.oid" closable @close="deleteFood" color="#108ee9"
                >{{ item.name }}({{ item.value }}g)</span
              >
            </div>
          </div>
          <div class="type">
            <div class="type-name last">晚餐</div>
            <div class="food-name ">
              <span class="tag" v-for="item of dinner" :key="item.oid" closable @close="deleteFood" color="#108ee9"
                >{{ item.name }}({{ item.value }}g)</span
              >
            </div>
          </div>
        </div>
        <div class="info">
          <div class="title">
            专属信息
          </div>
          <div class="config-info">
            <div class="configNum">配餐编号</div>
            <div class="configCode"><QrCode :text="this.guid()" /></div>
          </div>
          <div class="customer">
            <div class="customer-name">客户姓名</div>
            <div class="customer-name-value">{{ userDetail.userName }}</div>
            <div class="customer-name">客户性别</div>
            <div class="customer-name">{{ userDetail.sex === 1 ? '男' : '女' }}</div>
          </div>
          <div class="dietician">
            <div class="dieticianer">专属营养师</div>
            <div class="dieticianer">{{ userDetail.supporterName }}</div>
          </div>
        </div>
      </div>
      <div class="screen-capture">
        <div id="capture" ref="capture"></div>
      </div>
      <screen-capture ref="sc" :html="html" @getConfigImg="ConfigImg"></screen-capture>
    </a-modal>
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
import ScreenCapture from '../ScreenCapture'
import QrCode from '@/components/Utils/QrCode'
import { addDiet } from '@/api/manage'
export default {
  name: 'ImportConfig',
  props: {
    userDetail: Object,
    isShow: {
      type: Boolean,
      default: false
    },
    tb: {
      type: Object
    },
    recommendDailyFoodComponent: Object,
    resParams: {}
  },
  components: {
    ScreenCapture,
    QrCode
  },
  data() {
    return {
      qrcodeTxt: '配餐码：7823EADC-044D-4CBA-A2D5-3CF8395443FF',
      visible: false,
      loading: false,
      imgUrl: '',
      html: null,
      showImg: false,
      showImgBtnTxt: '预览图片',
      isPreview: false,
      shwoData: {},
      breakFast: [],
      lunch: [],
      dinner: []
    }
  },
  watch: {
    isShow(val) {
      this.visible = val
      val ? this.processingData(this.tb) : ''
    },
    imgUrl(val) {
      val && !this.isPreview && this.downLoadImg(val)
    }
  },
  updated() {
    this.html = this.$refs.importToImg
  },
  methods: {
    addDiet() {
      // 存储数据
      let arr = {
        mealList: [
          { name: 'Breakfast', food: [] },
          { name: 'Lunch', food: [] },
          { name: 'Dinner', food: [] }
        ]
      }
      for (let key in this.tb) {
        switch (key) {
          case 'breakfastP':
            for (let i = 0; i < this.tb[key].length; i++) {
              for (let j = 0; j < arr.mealList.length; j++) {
                arr.mealList[j].name == 'Breakfast'
                  ? arr.mealList[j].food.push(
                      JSON.stringify({
                        Breakfast: this.tb[key][i].name + '(' + this.tb[key][i].value + 'g' + ')',
                        oid: this.tb[key][i].oid
                      })
                    )
                  : ''
              }
            }
            break
          case 'breakfastF':
            for (let i = 0; i < this.tb[key].length; i++) {
              for (let j = 0; j < arr.mealList.length; j++) {
                arr.mealList[j].name == 'Breakfast'
                  ? arr.mealList[j].food.push(
                      JSON.stringify({
                        Breakfast: this.tb[key][i].name + '(' + this.tb[key][i].value + 'g' + ')',
                        oid: this.tb[key][i].oid
                      })
                    )
                  : ''
              }
            }
            break
          case 'breakfastC':
            for (let i = 0; i < this.tb[key].length; i++) {
              for (let j = 0; j < arr.mealList.length; j++) {
                arr.mealList[j].name == 'Breakfast'
                  ? arr.mealList[j].food.push(
                      JSON.stringify({
                        Breakfast: this.tb[key][i].name + '(' + this.tb[key][i].value + 'g' + ')',
                        oid: this.tb[key][i].oid
                      })
                    )
                  : ''
              }
            }
            break
          case 'lunchP':
            for (let i = 0; i < this.tb[key].length; i++) {
              for (let j = 0; j < arr.mealList.length; j++) {
                arr.mealList[j].name == 'Lunch'
                  ? arr.mealList[j].food.push(
                      JSON.stringify({
                        Lunch: this.tb[key][i].name + '(' + this.tb[key][i].value + 'g' + ')',
                        oid: this.tb[key][i].oid
                      })
                    )
                  : ''
              }
            }
            break
          case 'lunchF':
            for (let i = 0; i < this.tb[key].length; i++) {
              for (let j = 0; j < arr.mealList.length; j++) {
                arr.mealList[j].name == 'Lunch'
                  ? arr.mealList[j].food.push(
                      JSON.stringify({
                        Lunch: this.tb[key][i].name + '(' + this.tb[key][i].value + 'g' + ')',
                        oid: this.tb[key][i].oid
                      })
                    )
                  : ''
              }
            }
            break
          case 'lunchC':
            for (let i = 0; i < this.tb[key].length; i++) {
              for (let j = 0; j < arr.mealList.length; j++) {
                arr.mealList[j].name == 'Lunch'
                  ? arr.mealList[j].food.push(
                      JSON.stringify({
                        Lunch: this.tb[key][i].name + '(' + this.tb[key][i].value + 'g' + ')',
                        oid: this.tb[key][i].oid
                      })
                    )
                  : ''
              }
            }
            break
          case 'dinnerP':
            for (let i = 0; i < this.tb[key].length; i++) {
              for (let j = 0; j < arr.mealList.length; j++) {
                arr.mealList[j].name == 'Dinner'
                  ? arr.mealList[j].food.push(
                      JSON.stringify({
                        Dinner: this.tb[key][i].name + '(' + this.tb[key][i].value + 'g' + ')',
                        oid: this.tb[key][i].oid
                      })
                    )
                  : ''
              }
            }
            break
          case 'dinnerF':
            for (let i = 0; i < this.tb[key].length; i++) {
              for (let j = 0; j < arr.mealList.length; j++) {
                arr.mealList[j].name == 'Dinner'
                  ? arr.mealList[j].food.push(
                      JSON.stringify({
                        Dinner: this.tb[key][i].name + '(' + this.tb[key][i].value + 'g' + ')',
                        oid: this.tb[key][i].oid
                      })
                    )
                  : ''
              }
            }
            break
          case 'dinnerC':
            for (let i = 0; i < this.tb[key].length; i++) {
              for (let j = 0; j < arr.mealList.length; j++) {
                arr.mealList[j].name == 'Dinner'
                  ? arr.mealList[j].food.push(
                      JSON.stringify({
                        Dinner: this.tb[key][i].name + '(' + this.tb[key][i].value + 'g' + ')',
                        oid: this.tb[key][i].oid
                      })
                    )
                  : ''
              }
            }
            break
        }
      }

      for (let i = 0; i < arr.mealList.length; i++) {
        arr.mealList[i].food = arr.mealList[i].food.toString()
      }

      let currentUserOid = this.$store.state.userInfo.oid
      let customerOid = this.$route.params.id
      let serviceOid = this.userDetail.serviceOid
      let parameter = {
        dietOid: this.guid(),
        customerOid: customerOid,
        serviceOid: serviceOid,
        recommendDailyEnergy: this.resParams.recommendDailyEnergy,
        recommendDailyComponentPercentage: JSON.stringify(this.resParams.recommendDailyComponentPercentage),
        recommendDailyFoodComponent: JSON.stringify(this.recommendDailyFoodComponent),
        currentDailyEnergy: this.resParams.currentDailyEnergy,
        currentDailyComponentPercentage: this.resParams.currentRatioStr,
        currentDiet: JSON.stringify(arr),
        supporterOid: currentUserOid
      }

      addDiet(parameter).then(res => {
        if (res.success) {
          setTimeout(() => {
            this.$notification.success({
              message: '添加配餐成功'
            })
            this.$store.dispatch('changeActiveKey', '1')
            this.visible = false
          }, 1000)
        } else {
          this.$notification['error']({
            message: '请求出错',
            description: res.message + ':' + res.response,
            duration: 4
          })
        }
      })
    },
    processingData(data) {
      for (let key in data) {
        for (let i = 0; i < data[key].length; i++) {
          switch (key) {
            case 'breakfastP':
              this.breakFast.push(data[key][i])
              break
            case 'breakfastF':
              this.breakFast.push(data[key][i])
              break
            case 'breakfastC':
              this.breakFast.push(data[key][i])
              break
            case 'lunchP':
              this.lunch.push(data[key][i])
              break
            case 'lunchF':
              this.lunch.push(data[key][i])
              break
            case 'lunchC':
              this.lunch.push(data[key][i])
              break
            case 'dinnerP':
              this.dinner.push(data[key][i])
              break
            case 'dinnerF':
              this.dinner.push(data[key][i])
              break
            case 'dinnerC':
              this.dinner.push(data[key][i])
              break
            default:
          }
        }
      }
    },

    showPreviewImg() {
      if (!this.showImg) {
        this.getImg()
      }
      this.showImg = !this.showImg
      this.isPreview = !this.isPreview
      this.showImgBtnTxt = this.showImg ? '取消预览' : '预览图片'
      !this.isPreview && (this.imgUrl = '')
    },
    guid() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
      }
      return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
    },
    ConfigImg(src) {
      this.imgUrl = src
    },
    getImg() {
      this.$refs.sc.capture(!this.isPreview)
    },
    downLoadImg(url) {
      var a = document.createElement('a')
      var event = new MouseEvent('click')
      a.download = name || '推荐食谱'
      a.href = url
      a.dispatchEvent(event)
    },
    deleteFood() {
      console.log('删除配置食材')
    },
    setImportStyle() {
      return {
        padding: 0,
        minHeight: '450px'
      }
    },
    showModal() {
      this.visible = true
      this.$emit('setImportVisible', this.visible)
    },
    handleOk(e) {
      this.loading = true
      this.getImg() // 获取图片
      setTimeout(() => {
        this.visible = false
        this.breakFast = []
        this.lunch = []
        this.dinner = []
        this.$emit('setImportVisible', this.visible)
        this.addDiet()
        this.loading = false
      }, 1000)
    },
    handleCancel(e) {
      this.visible = false
      this.breakFast = []
      this.lunch = []
      this.dinner = []
      this.$emit('setImportVisible', this.visible)
    }
  }
}
</script>
<style lang="less" scoped>
.info {
  .title {
    padding: 16px 24px;
    border-bottom: 1px solid #e8e8e8;
    border-radius: 4px 4px 0 0;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    font-size: 16px;
  }
  .config-info,
  .customer,
  .dietician {
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    justify-content: space-around;
  }
}
.type {
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  justify-content: space-around;
  .type-name {
    width: 20%;
    text-align: center;
    min-height: 100px;
    line-height: 100px;
    border-right: 1px solid #e8e8e8;
  }
  .food-name {
    text-align: left;
    min-height: 100px;
    width: 80%;
    padding: 5px 0;
    border-bottom: 1px solid #e8e8e8;
  }
  .last {
    border-bottom: 1px solid #e8e8e8;
  }
  .tag {
    display: inline-block;
    padding: 4px;
  }
}
</style>
