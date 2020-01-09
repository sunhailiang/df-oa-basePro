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
        <a-button key="preview" type="primary" icon="picture" @click="showPreviewImg">预览图片</a-button>
        <a-button key="submit" type="primary" :loading="loading" @click="handleOk">
          确认并导出
        </a-button>
      </template>
      <img :src="imgUrl" alt="" v-if="showImg" />
      <div class="import-to-img" ref="importToImg" v-if="!showImg">
        <div class="config">
          <div class="type">
            <div class="type-name">早餐</div>
            <div class="food-name">
              <span class="tag" closable @close="deleteFood" color="#108ee9">玉米(300g)</span>
              <span class="tag" closable @close="deleteFood" color="#108ee9">牛奶(300g)</span>
            </div>
          </div>
          <div class="type">
            <div class="type-name">午餐</div>
            <div class="food-name">
              <span class="tag" closable @close="deleteFood" color="#108ee9">五花肉(300g)</span>
              <span class="tag" closable @close="deleteFood" color="#108ee9">米饭(270g)</span>
            </div>
          </div>
          <div class="type">
            <div class="type-name last">晚餐</div>
            <div class="food-name ">
              <span class="tag" closable @close="deleteFood" color="#108ee9">苹果(300g)</span>
              <span class="tag" closable @close="deleteFood" color="#108ee9">香蕉(200g)</span>
              <span class="tag" closable @close="deleteFood" color="#108ee9">苹果(300g)</span>
              <span class="tag" closable @close="deleteFood" color="#108ee9">香蕉(200g)</span>
              <span class="tag" closable @close="deleteFood" color="#108ee9">苹果(300g)</span>
              <span class="tag" closable @close="deleteFood" color="#108ee9">香蕉(200g)</span>
              <span class="tag" closable @close="deleteFood" color="#108ee9">苹果(300g)</span>
              <span class="tag" closable @close="deleteFood" color="#108ee9">香蕉(200g)</span>
              <span class="tag" closable @close="deleteFood" color="#108ee9">苹果(300g)</span>
              <span class="tag" closable @close="deleteFood" color="#108ee9">香蕉(200g)</span>
              <span class="tag" closable @close="deleteFood" color="#108ee9">苹果(300g)</span>
              <span class="tag" closable @close="deleteFood" color="#108ee9">香蕉(200g)</span>
            </div>
          </div>
        </div>
        <div class="info">
          <div class="title">
            专属信息
          </div>
          <div class="config-info">
            <div class="configNum">配餐编号</div>
            <div class="configCode"><QrCode :text="qrcodeTxt" /></div>
          </div>
          <div class="customer">
            <div class="customer-name">客户姓名</div>
            <div class="customer-name-value">张小凡</div>
            <div class="customer-name">客户性别</div>
            <div class="customer-name">男</div>
          </div>
          <div class="dietician">
            <div class="dieticianer">专属营养师</div>
            <div class="dieticianer">哮天犬</div>
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
export default {
  name: 'ImportConfig',
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
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
      showImg: false
    }
  },
  watch: {
    isShow(val) {
      this.visible = val
    }
  },
  updated() {
    this.html = this.$refs.importToImg
  },
  methods: {
    showPreviewImg() {
      this.getImg()
      this.showImg = !this.showImg
    },
    ConfigImg(src) {
      this.imgUrl = src
    },
    getImg() {
      this.$refs.sc.capture()
    },

    deleteFood() {
      console.log('删除配置食材')
    },
    setImportStyle() {
      return {
        padding: 0
      }
    },
    showModal() {
      this.visible = true
      this.$emit('setImportVisible', this.visible)
    },
    handleOk(e) {
      this.loading = true
      this.getImg()
      setTimeout(() => {
        this.visible = false
        this.$emit('setImportVisible', this.visible)
        this.loading = false
      }, 2000000)
    },
    handleCancel(e) {
      console.log('Clicked cancel button')
      this.visible = false
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
