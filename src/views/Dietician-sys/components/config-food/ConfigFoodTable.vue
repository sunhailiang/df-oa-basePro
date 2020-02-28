<template>
  <div class="container" v-if="step.step === 2">
    <div class="left">
      <div class="left-title">餐次</div>
      <div class="breakfast">早餐</div>
      <div class="lunch">午餐</div>
      <div class="dinner">晚餐</div>
    </div>
    <div class="center">
      <div class="nutrition-type">营养素(点击)</div>
      <div class="nutrition">
        <div class="carbohydrate" @click="getRecommendData('breakfast', scaledData[0].data[0].value, 'P')">
          P
        </div>
        <div class="fat" @click="getRecommendData('breakfast', scaledData[0].data[1].value, 'F')">
          F
        </div>
        <div class="protein" @click="getRecommendData('breakfast', scaledData[0].data[2].value, 'C')">
          C
        </div>
      </div>
      <div class="nutrition">
        <div class="carbohydrate" @click="getRecommendData('lunch', scaledData[1].data[0].value, 'P')">
          P
        </div>
        <div class="fat" @click="getRecommendData('lunch', scaledData[1].data[1].value, 'F')">
          F
        </div>
        <div class="protein" @click="getRecommendData('lunch', scaledData[1].data[2].value, 'C')">
          C
        </div>
      </div>
      <div class="nutrition">
        <div class="carbohydrate" @click="getRecommendData('dinner', scaledData[2].data[0].value, 'P')">
          P
        </div>
        <div class="fat" @click="getRecommendData('dinner', scaledData[2].data[1].value, 'F')">
          F
        </div>
        <div class="protein last-nutrition" @click="getRecommendData('dinner', scaledData[2].data[2].value, 'C')">
          C
        </div>
      </div>
    </div>
    <div class="allot">
      <div class="allot-left">待分配</div>
      <div class="weight">
        <div class="carbohydrate" ref="breakfirstCarbohydrate">{{ this.scaledData[0].data[0].value }}g</div>
        <div class="fat" ref="breakfirstFat">{{ this.scaledData[0].data[1].value }}g</div>
        <div class="protein" ref="breakfirstProtein">{{ this.scaledData[0].data[2].value }}g</div>
      </div>
      <div class="weight">
        <div class="carbohydrate" ref="lunchCarbohydrate">{{ this.scaledData[1].data[0].value }}g</div>
        <div class="fat" ref="lunchFat">{{ this.scaledData[1].data[1].value }}g</div>
        <div class="protein" ref="lunchProtein">{{ this.scaledData[1].data[2].value }}g</div>
      </div>
      <div class="weight">
        <div class="carbohydrate" ref="dinnerCarbohydrate">{{ this.scaledData[2].data[0].value }}g</div>
        <div class="fat" ref="dinnerFat">{{ this.scaledData[2].data[1].value }}g</div>
        <div class="protein last-allot" ref="dinnerProtein">{{ this.scaledData[2].data[2].value }}g</div>
      </div>
    </div>
    <div class="right">
      <div class="food-type">选择食材</div>
      <div class="food">
        <div class="carbohydrateFood">
          <a-tag @click="showEdit(item)" v-for="item in this.tableList.breakfastP" :key="item.oid" color="#108ee9"
            >{{ item.name }}({{ item.value + item.unit }})</a-tag
          >
        </div>
        <div class="fatFood">
          <a-tag @click="showEdit(item)" v-for="item in this.tableList.breakfastF" :key="item.oid" color="#108ee9"
            >{{ item.name }}({{ item.value + item.unit }}))</a-tag
          >
        </div>
        <div class="proteinFood">
          <a-tag @click="showEdit(item)" v-for="item in this.tableList.breakfastC" :key="item.oid" color="#108ee9"
            >{{ item.name }}({{ item.value + item.unit }})</a-tag
          >
        </div>
      </div>
      <div class="food">
        <div class="carbohydrateFood">
          <a-tag @click="showEdit(item)" v-for="item in this.tableList.lunchP" :key="item.oid" color="#108ee9"
            >{{ item.name }}({{ item.value + item.unit }})</a-tag
          >
        </div>
        <div class="fatFood">
          <a-tag @click="showEdit(item)" v-for="item in this.tableList.lunchF" :key="item.oid" color="#108ee9"
            >{{ item.name }}({{ item.value + item.unit }})</a-tag
          >
        </div>
        <div class="proteinFood">
          <a-tag @click="showEdit(item)" v-for="item in this.tableList.lunchC" :key="item.oid" color="#108ee9"
            >{{ item.name }}({{ item.value + item.unit }})</a-tag
          >
        </div>
      </div>
      <div class="food">
        <div class="carbohydrateFood">
          <a-tag @click="showEdit(item)" v-for="item in this.tableList.dinnerP" :key="item.oid" color="#108ee9"
            >{{ item.name }}({{ item.value + item.unit }})</a-tag
          >
        </div>
        <div class="fatFood">
          <a-tag @click="showEdit(item)" v-for="item in this.tableList.dinnerF" :key="item.oid" color="#108ee9"
            >{{ item.name }}({{ item.value + item.unit }})</a-tag
          >
        </div>
        <div class="proteinFood last-proteinFood">
          <a-tag @click="showEdit(item)" v-for="item in this.tableList.dinnerC" :key="item.oid" color="#108ee9">
            {{ item.name }}({{ item.value + item.unit }})</a-tag
          >
        </div>
      </div>
    </div>
    <div class="to-img">
      <div class="food-import">导出配餐</div>
      <div>
        <a-badge :count="countData" @click="showImportConfig" class="import-btn">
          <a-icon type="shopping-cart" style="fontSize:30px;" />
        </a-badge>
      </div>
    </div>
    <!-- <div v-if="show"> -->
    <RecommendFood @setVisible="setVisible" @setSelected="setSelected" :isShow="show" :params="params" />
    <!-- </div> -->

    <ImportConfigFood
      @setImportVisible="setImportVisible"
      :userDetail="userDetail"
      :tb="tableList"
      :recommendDailyFoodComponent="recommendDailyFoodComponent"
      :resParams="resParams"
      :isShow="importShow"
    />
    <EditValue ref="edit" @reSetValue="reSetValue" />
  </div>
</template>
<script>
import RecommendFood from './RecommendFood'
import ImportConfigFood from './ImportConfig'
import EditValue from './EditValue'
import { getdailyFoodComponent, getcompoundFood } from '@/api/manage'
import { keys } from 'mockjs2'
export default {
  name: 'ConfigFoodTable',
  props: {
    userDetail: Object,
    configData: { type: Object, default: Object },
    step: {
      type: Object,
      default: () => {}
    },
    resParams: Object
  },
  data() {
    return {
      countData: 0,
      waitForCalculate: {
        E: 0,
        P: 0,
        C: 0,
        F: 0
      },
      weight: 26,
      show: false,
      importShow: false,
      recommends: [],
      tableList: {
        breakfastP: [],
        breakfastF: [],
        breakfastC: [],
        lunchP: [],
        lunchF: [],
        lunchC: [],
        dinnerP: [],
        dinnerF: [],
        dinnerC: []
      },
      params: {
        time: '',
        type: '',
        weight: 0
      },
      scaledData: [
        {
          type: '"Breakfast"',
          value: '',
          data: [
            { nameCode: 'P', value: '' },
            { nameCode: 'F', value: '' },
            { nameCode: 'C', value: '' }
          ]
        },
        {
          type: 'Lunch',
          value: '',
          data: [
            { nameCode: 'P', value: '' },
            { nameCode: 'F', value: '' },
            { nameCode: 'C', value: '' }
          ]
        },
        {
          type: 'Dinner',
          value: '',
          data: [
            { nameCode: 'P', value: '' },
            { nameCode: 'F', value: '' },
            { nameCode: 'C', value: '' }
          ]
        }
      ],
      recommendDailyFoodComponent: {}
    }
  },
  components: {
    RecommendFood,
    ImportConfigFood,
    EditValue
  },
  mounted() {
    this.calculatePercentage()
  },
  methods: {
    async reSetValue(obj) {
      await this.ratioCalculation(obj)
      await this.fit(obj)
    },
    fit(obj) {
      for (let i = 0; i < obj.new.foodComponentList.length; i++) {
        switch (obj.new.foodComponentList[i].nameCode) {
          case 'C':
            obj.old.oldC -= obj.new.foodComponentList[i].value
            break
          case 'P':
            obj.old.oldP -= obj.new.foodComponentList[i].value
            break
          case 'E':
            obj.old.oldE -= obj.new.foodComponentList[i].value
            break
          case 'F':
            obj.old.oldF -= obj.new.foodComponentList[i].value
            break
          default:
            break
        }
      }
      for (let i = 0; i < this.scaledData.length; i++) {
        for (let j = 0; j < this.scaledData[i].data.length; j++) {
          switch (this.scaledData[i].data[j].nameCode) {
            case 'C':
              this.scaledData[i].data[j].value += parseInt(obj.old.oldC / 3)
              break
            case 'F':
              this.scaledData[i].data[j].value += parseInt(obj.old.oldF / 3)
              break
            case 'P':
              this.scaledData[i].data[j].value += parseInt(obj.old.oldP / 3)
              break
            default:
              break
          }
        }
      }
    },
    ratioCalculation(obj) {
      for (let i = 0; i < obj.new.foodComponentList.length; i++) {
        obj.new.foodComponentList[i].value *= obj.ratio
      }
    },
    calculate(arr) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].foodComponentList.length; j++) {
          switch (arr[i].foodComponentList[j].nameCode) {
            case 'E':
              this.waitForCalculate.E += arr[i].foodComponentList[j].value
              break
            case 'C':
              this.waitForCalculate.C += arr[i].foodComponentList[j].value
              break
            case 'F':
              this.waitForCalculate.F += arr[i].foodComponentList[j].value
              break
            case 'P':
              this.waitForCalculate.P += arr[i].foodComponentList[j].value
              break
            default:
              break
          }
        }
      }
      for (let i = 0; i < this.scaledData.length; i++) {
        for (let j = 0; j < this.scaledData[i].data.length; j++) {
          switch (this.scaledData[i].data[j].nameCode) {
            case 'C':
              this.scaledData[i].data[j].value -= parseInt(this.waitForCalculate.C / 3)
              break
            case 'F':
              this.scaledData[i].data[j].value -= parseInt(this.waitForCalculate.F / 3)
              break
            case 'P':
              this.scaledData[i].data[j].value -= parseInt(this.waitForCalculate.P / 3)
              break
            default:
              break
          }
        }
      }
    },
    setSelected(val) {
      switch (val.type) {
        case 'breakfastP':
          console.log('AA')
          this.tableList.breakfastP = val.data
          this.calculate(val.data)
          break
        case 'breakfastF':
          console.log('BB')
          this.tableList.breakfastF = val.data
          this.calculate(val.data)
          break
        case 'breakfastC':
          console.log('CC')
          this.tableList.breakfastC = val.data
          this.calculate(val.data)
          break
        case 'lunchP':
          console.log('DD')
          this.tableList.lunchP = val.data
          this.calculate(val.data)
          break
        case 'lunchF':
          console.log('EE')
          this.tableList.lunchF = val.data
          this.calculate(val.data)
          break
        case 'lunchC':
          console.log('FF')
          this.tableList.lunchC = val.data
          this.calculate(val.data)
          break
        case 'dinnerP':
          console.log('GG')
          this.tableList.dinnerP = val.data
          this.calculate(val.data)
          break
        case 'dinnerF':
          console.log('HH')
          this.tableList.dinnerF = val.data
          this.calculate(val.data)
          break
        case 'dinnerC':
          console.log('II')
          this.tableList.dinnerC = val.data
          this.calculate(val.data)
          break
        default:
      }
      console.log('所有的数据', this.tableList)
    },
    calculatePercentage() {
      let data = this.step.arr
      let total = this.step.total
      let p = parseInt((total * data[0].value) / 100 / 3)
      let f = parseInt((total * data[1].value) / 100 / 3)
      let c = parseInt((total * data[2].value) / 100 / 3)
      console.log('p', p)
      console.log('f', f)
      console.log('c', c)

      // 早餐
      this.scaledData[0].data[0].value = p
      this.scaledData[0].data[1].value = c
      this.scaledData[0].data[2].value = f
      // 午餐
      this.scaledData[1].data[0].value = p
      this.scaledData[1].data[1].value = c
      this.scaledData[1].data[2].value = f
      // 晚餐
      this.scaledData[2].data[0].value = p
      this.scaledData[2].data[1].value = c
      this.scaledData[2].data[2].value = f
      // 参数
      let params = { dailyEnergy: total, pValue: data[0].value, fValue: data[1].value, cValue: data[2].value }
      getdailyFoodComponent(params).then(res => {
        if (res.success) {
          let data = res.response.mealList
          console.log('九宫格推荐数据', res.response)
          Object.assign(this.recommendDailyFoodComponent, res.response) // 存储推荐的营养数据

          for (let i = 0; i < data.length; i++) {
            if (data[i].englishName === 'Breakfast') {
              for (let obj in data[i].componentList) {
                let d = data[i].componentList[obj]
                this.scaledData[0].data[0].nameCode === d.nameCode
                  ? (this.scaledData[0].data[0].value = parseInt(d.value))
                  : ''
                this.scaledData[0].data[1].nameCode === d.nameCode
                  ? (this.scaledData[0].data[1].value = parseInt(d.value))
                  : ''
                this.scaledData[0].data[2].nameCode === d.nameCode
                  ? (this.scaledData[0].data[2].value = parseInt(d.value))
                  : ''
              }
            }
            if (data[i].englishName === 'Lunch') {
              for (let obj in data[i].componentList) {
                let d = data[i].componentList[obj]
                this.scaledData[1].data[0].nameCode === d.nameCode
                  ? (this.scaledData[1].data[0].value = parseInt(d.value))
                  : ''
                this.scaledData[1].data[1].nameCode === d.nameCode
                  ? (this.scaledData[1].data[1].value = parseInt(d.value))
                  : ''
                this.scaledData[1].data[2].nameCode === d.nameCode
                  ? (this.scaledData[1].data[2].value = parseInt(d.value))
                  : ''
              }
            }
            if (data[i].englishName === 'Dinner') {
              for (let obj in data[i].componentList) {
                let d = data[i].componentList[obj]
                this.scaledData[2].data[0].nameCode === d.nameCode
                  ? (this.scaledData[2].data[0].value = parseInt(d.value))
                  : ''
                this.scaledData[2].data[1].nameCode === d.nameCode
                  ? (this.scaledData[2].data[1].value = parseInt(d.value))
                  : ''
                this.scaledData[2].data[2].nameCode === d.nameCode
                  ? (this.scaledData[2].data[2].value = parseInt(d.value))
                  : ''
              }
            }
          }
        }
      })
    },
    showEdit(item) {
      this.$refs.edit.showModal(item)
    },
    deleteFood() {
      console.log('删除食物')
    },
    showImportConfig() {
      this.importShow = true
    },
    setVisible(visible) {
      this.show = visible
    },
    setImportVisible(visible) {
      this.importShow = visible
    },
    getRecommendData(time, value, type) {
      this.params.time = time
      this.params.type = type
      this.params.weight = value
      for (let key in this.tableList) {
        if (key === time + type) {
          this.params.currentObj = this.tableList[key]
        }
      }

      this.show = true
    }
  }
}
</script>

<style lang="less" scoped>
@border: 1px solid #e8e8e8;
.container {
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  height: 498px;
  border-top: @border;
  border-bottom: @border;
  .left,
  .center,
  .allot {
    float: left;
  }
  .allot {
    width: 5%;
    .allot-left {
      background-color: #e8e8e8;
      line-height: 40px;
      text-align: center;
    }
    .weight {
      height: 150px;
      .carbohydrate,
      .fat,
      .protein {
        box-sizing: border-box;
        text-align: center;
        line-height: 50px;
        height: 50px;
        border-bottom: @border;
        border-right: @border;
      }
      .protein:nth-child(2) {
        border-bottom: none;
      }
      .last-allot {
        border-bottom: none;
      }
    }
  }

  .left {
    width: 10%;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    div {
      box-sizing: border-box;
      height: 150px;
      line-height: 150px;
      text-align: center;
      border-right: @border;
      border-bottom: @border;
    }
    .left-title {
      background-color: #e8e8e8;
      line-height: 40px;
      height: 40px;
      text-align: center;
    }
    .dinner {
      border-bottom: none;
    }
  }
  .center {
    width: 5%;
    .nutrition {
      height: 150px;
      text-align: center;
      box-sizing: border-box;
      div {
        height: 50px;
        box-sizing: border-box;
        line-height: 50px;
        border-right: @border;
        border-bottom: @border;
      }
      div:hover {
        background-color: #e8e8e8;
        cursor: pointer;
        color: skyblue;
      }
      .last-nutrition {
        border-bottom: none;
      }
    }
    .nutrition-type {
      line-height: 40px;
      background-color: #e8e8e8;
      text-align: center;
    }
  }
  .right {
    width: 70%;
    float: left;
    text-align: center;
    .food {
      height: 150px;
      .carbohydrateFood,
      .fatFood,
      .proteinFood {
        box-sizing: border-box;
        height: 50px;
        line-height: 50px;
        border-right: @border;
        text-align: left;
        padding-left: 10px;
      }
      .carbohydrateFood,
      .fatFood,
      .proteinFood {
        border-bottom: @border;
      }
      .last-proteinFood {
        border-bottom: none;
      }
    }

    .food-type {
      line-height: 40px;
      background-color: #e8e8e8;
      text-align: center;
    }
  }
  .to-img {
    .import-btn {
      cursor: pointer;
    }
    width: 10%;
    float: right;
    text-align: center;
    .food-import {
      line-height: 40px;
      background-color: #e8e8e8;
      text-align: center;
    }
    line-height: 450px;
  }
}
</style>
