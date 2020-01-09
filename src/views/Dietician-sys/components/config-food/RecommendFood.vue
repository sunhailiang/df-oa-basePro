<template>
  <div class="recommend">
    <a-modal
      title="推荐食材"
      :visible="visible"
      :width="1400"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :keyboard="true"
      :destroyOnClose="true"
    >
      <div class="tb-list">
        <div v-for="(item, index) in tbData" :key="index" :style="setTbstyle()">
          <div class="tb-title">{{ item.type }}</div>
          <t-b :data="item.data" @getSelected="getrows" :tb-type="foodTypeEnum[item.type]" />
        </div>
      </div>
      <div class="re-recommend">
        <a-button type="primary" icon="reload" @click="reload">重新推荐</a-button>
      </div>
      <div class="selected" v-show="selectedList.length > 0">
        <a-card title="已选中" :headStyle="CardHeader()">
          <a-tag
            class="tag"
            closable
            @close="deleteFood"
            v-for="(item, index) in selectedList"
            :key="index"
            color="#108ee9"
            >{{ item.foodName }}({{ item.foodWeight }})</a-tag
          >
        </a-card>
      </div>
    </a-modal>
  </div>
</template>
<script>
import TB from './RecommendTable'
import { getRecommendRandom } from '@/api/manage'
import { foodTypeEnum } from '@/utils/enum'
export default {
  name: 'Recommend',
  data() {
    return {
      foodTypeEnum,
      visible: false,
      confirmLoading: false,
      typeNum: 0,
      tbData: [],
      selected: {},
      selectedNum: 0,
      selectedList: []
    }
  },
  components: {
    TB
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
    deleteFood() {
      console.log('删除食物')
    },
    reload() {
      console.log('重新推荐')
    },
    getrows(data) {
      this.selectedList = []
      const tbType = data.tbType
      const selectedRows = data.selectedRows
      this.selected[tbType] = selectedRows
      for (const key in this.selected) {
        for (const k in this.selected[key]) {
          this.selectedList.push(this.selected[key][k])
        }
      }
      this.selectedNum = this.selectedList.length
      console.log('选中多少个啊', this.selectedNum)
    },
    getTable() {
      return getRecommendRandom({ nutritionType: 'C', weight: 10 }).then(data => {
        if (data) {
          this.tbData = data
        }
      })
    },
    setTbstyle() {
      return {
        width: 1300 / this.typeNum + 'px'
      }
    },
    CardHeader() {
      return {
        color: 'slategray',
        fontSize: '18px'
      }
    },
    handleOk(e) {
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.$emit('setVisible', this.visible)
        this.confirmLoading = false
      }, 2000)
    },
    handleCancel(e) {
      this.visible = false
      this.$emit('setVisible', this.visible)
    }
  },
  mounted() {
    this.$emit('setVisible', this.visible)
    this.getTable()
  },
  watch: {
    isShow(val) {
      this.visible = val
    }
  }
}
</script>
<style lang="less" scoped>
.tb-list {
  border: 1px solid #e8e8e8;
  padding-bottom: 54px;
  padding-top: 30px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  .tb-title {
    text-align: center;
    font-size: 18px;
    margin-bottom: 10px;
    color: slategray;
  }
}
.re-recommend {
  text-align: right;
  padding-top: 10px;
  padding-bottom: 10px;
}
.tag {
  margin-top: 5px;
}
</style>
