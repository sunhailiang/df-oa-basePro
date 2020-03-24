<template>
  <div class="recommend">
    <a-modal
      title="推荐食材"
      :visible="visible"
      :width="1800"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
      :keyboard="true"
      :destroyOnClose="true"
    >
      <div class="tb-list">
        <div class="loading"><a-spin size="large" :spinning="loading" /></div>
        <div v-for="(item, index) in tbData" :key="index" :style="setTbstyle()">
          <div class="tb-title">{{ item.classify }}</div>
          <t-b :data="item.foodList" @getSelected="getrows" :tb-type="foodTypeEnum[item.classify]" />
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
            @close="deleteFood(item)"
            v-for="item in selectedList"
            :key="item.oid"
            color="#108ee9"
            >{{ item.name }}({{ item.value }})</a-tag
          >
        </a-card>
      </div>
    </a-modal>
  </div>
</template>
<script>
import TB from './RecommendTable'
import { getcompoundFood } from '@/api/manage'
import { foodTypeEnum } from '@/utils/enum'
export default {
  name: 'Recommend',
  data() {
    return {
      deletedArr: [],
      loading: false,
      foodTypeEnum,
      visible: false,
      confirmLoading: false,
      typeNum: 0,
      tbData: [],
      selected: [],
      selectedNum: 0,
      selectedList: [],
      resData: {},
      tempList: [],
      flag: false,
      isReload: false
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
    deleteFood(item) {
      if (this.flag) {
        for (let i = 0; i < this.selectedList.length; i++) {
          if (this.selectedList[i].oid === item.oid) {
            this.selectedList.splice(i, 1)
          }
        }
        this.resData = { type: this.params.time + this.params.type, data: this.selectedList }
      } else {
        for (let i = 0; i < this.tempList.length; i++) {
          if (this.tempList[i].oid === item.oid) {
            this.tempList.splice(i, 1)
          }
        }
        this.resData = { type: this.params.time + this.params.type, data: this.tempList }
      }
    },
    reload() {
      this.isReload = true
      this.getTable()
    },
    getrows(data) {
      console.log('带过来了没?', data)

      if (data.tbType) {
        this.selectedList = this.tempList
        this.flag = true
        let flag = true
        for (let i = 0; i <= this.selected.length; i++) {
          if (this.selected[i] && this.selected[i].type === data.tbType) {
            if (this.isReload && this.selected[i].data.length > 0) {
              this.isReload = false
              for (let s = 0; s < data.selectedRows.length; s++) {
                this.selected[i].data.push(data.selectedRows[s])
              }
            } else {
              this.selected[i].data = data.selectedRows // 赋值
            }
            flag = false
          }
        }
        if (flag) {
          let obj = {}
          obj.type = data.tbType
          obj.data = data.selectedRows
          this.selected.push(obj)
        }
        this.selectedList = []
        for (let i = 0; i < this.selected.length; i++) {
          for (let j = 0; j < this.selected[i].data.length; j++) {
            this.selectedList.push(this.selected[i].data[j])
          }
        }
        this.setList(this.tempList)
      } else {
        this.selectedList = data
      }
    },
    setList(arr) {
      for (let i = 0; i < arr.length; i++) {
        this.selectedList.push(arr[i])
      }
    },
    getTable() {
      this.tbData = []
      this.loading = true
      let params = { oid: this.$route.params.id, NameCode: this.params.type, componentValue: this.params.weight }
      return getcompoundFood(params).then(res => {
        res.success ? (this.tbData = res.response.classifyFoodList) : ''
        this.loading = false
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

      this.resData = { type: this.params.time + this.params.type, data: this.selectedList }
      console.log('根上错没错', this.selectedList)
      setTimeout(() => {
        this.visible = false
        this.$emit('setVisible', this.visible)
        console.log('计算去', this.resData)

        this.$emit('setSelected', this.resData)
        this.selectedList = []
        this.confirmLoading = false
      }, 1000)
    },
    handleCancel(e) {
      this.visible = false
      this.$emit('setVisible', this.visible)
    }
  },
  mounted() {
    this.$emit('setVisible', this.visible)
  },
  watch: {
    isShow(val) {
      val ? this.getTable() : ''
      val ? (this.selected = []) : ''
      val ? (this.resData = {}) : ''
      this.tempList = this.params.currentObj
      this.selectedList = this.tempList
      this.visible = val
    }
  }
}
</script>
<style lang="less" scoped>
.tb-list {
  position: relative;
  min-height: 717px;
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
  .loading {
    margin: 0 auto;
    position: absolute;
    top: 350px;
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
