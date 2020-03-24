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
        <div class="carbohydrate" ref="breakfirstCarbohydrate">{{ parseInt(this.scaledData[0].data[0].value) }}g</div>
        <div class="fat" ref="breakfirstFat">{{ parseInt(this.scaledData[0].data[1].value) }}g</div>
        <div class="protein" ref="breakfirstProtein">{{ parseInt(this.scaledData[0].data[2].value) }}g</div>
      </div>
      <div class="weight">
        <div class="carbohydrate" ref="lunchCarbohydrate">{{ parseInt(this.scaledData[1].data[0].value) }}g</div>
        <div class="fat" ref="lunchFat">{{ parseInt(this.scaledData[1].data[1].value) }}g</div>
        <div class="protein" ref="lunchProtein">{{ parseInt(this.scaledData[1].data[2].value) }}g</div>
      </div>
      <div class="weight">
        <div class="carbohydrate" ref="dinnerCarbohydrate">{{ parseInt(this.scaledData[2].data[0].value) }}g</div>
        <div class="fat" ref="dinnerFat">{{ parseInt(this.scaledData[2].data[1].value) }}g</div>
        <div class="protein last-allot" ref="dinnerProtein">{{ parseInt(this.scaledData[2].data[2].value) }}g</div>
      </div>
    </div>
    <div class="right">
      <div class="food-type">选择食材</div>
      <div class="food">
        <div class="carbohydrateFood">
          <a-tag
            @click="showEdit('breakfast', item)"
            v-for="item in this.tableList.breakfastP"
            :key="item.oid"
            color="#108ee9"
            >{{ item.name }}({{ item.value + item.unit }})</a-tag
          >
        </div>
        <div class="fatFood">
          <a-tag
            @click="showEdit('breakfast', item)"
            v-for="item in this.tableList.breakfastF"
            :key="item.oid"
            color="#108ee9"
            >{{ item.name }}({{ item.value + item.unit }}))</a-tag
          >
        </div>
        <div class="proteinFood">
          <a-tag
            @click="showEdit('breakfast', item)"
            v-for="item in this.tableList.breakfastC"
            :key="item.oid"
            color="#108ee9"
            >{{ item.name }}({{ item.value + item.unit }})</a-tag
          >
        </div>
      </div>
      <div class="food">
        <div class="carbohydrateFood">
          <a-tag @click="showEdit('lunch', item)" v-for="item in this.tableList.lunchP" :key="item.oid" color="#108ee9"
            >{{ item.name }}({{ item.value + item.unit }})</a-tag
          >
        </div>
        <div class="fatFood">
          <a-tag @click="showEdit('lunch', item)" v-for="item in this.tableList.lunchF" :key="item.oid" color="#108ee9"
            >{{ item.name }}({{ item.value + item.unit }})</a-tag
          >
        </div>
        <div class="proteinFood">
          <a-tag @click="showEdit('lunch', item)" v-for="item in this.tableList.lunchC" :key="item.oid" color="#108ee9"
            >{{ item.name }}({{ item.value + item.unit }})</a-tag
          >
        </div>
      </div>
      <div class="food">
        <div class="carbohydrateFood">
          <a-tag
            @click="showEdit('dinner', item)"
            v-for="item in this.tableList.dinnerP"
            :key="item.oid"
            color="#108ee9"
            >{{ item.name }}({{ item.value + item.unit }})</a-tag
          >
        </div>
        <div class="fatFood">
          <a-tag
            @click="showEdit('dinner', item)"
            v-for="item in this.tableList.dinnerF"
            :key="item.oid"
            color="#108ee9"
            >{{ item.name }}({{ item.value + item.unit }})</a-tag
          >
        </div>
        <div class="proteinFood last-proteinFood">
          <a-tag
            @click="showEdit('dinner', item)"
            v-for="item in this.tableList.dinnerC"
            :key="item.oid"
            color="#108ee9"
          >
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
    <RecommendFood
      @setVisible="setVisible"
      @setSelected="setSelected"
      :isShow="show"
      :params="params"
      :recount="recount"
    />
    <!-- </div> -->

    <ImportConfigFood
      @setImportVisible="setImportVisible"
      :userDetail="userDetail"
      :tb="tableList"
      :recommendDailyFoodComponent="initSudokuData"
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
import LoginVue from '../../../user/Login.vue'
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
      recount: [], // 重新计算
      initSudokuData: {},
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
          type: 'Breakfast',
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
      ]
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
    deepClone(origin, target) {
      var target = target || {}
      for (var prop in target) {
        if (target.hasOwnProperty(prop)) {
          if (target[prop] !== null && typeof target[prop] === 'object') {
            origin[prop] = Object.prototype.toString.call(target[prop]) === '[object Array]' ? [] : {}
            this.deepClone(origin[prop], target[prop])
          } else {
            origin[prop] = target[prop]
          }
        }
      }
    },
    async reSetValue(obj) {
      // 修改食材重量
      await this.ratioCalculation(obj)
      await this.fit(obj)
    },
    fit(obj) {
      if (obj.type === 'breakfast') {
        for (let i = 0; i < this.scaledData.length; i++) {
          if (this.scaledData[i].type === 'Breakfast') {
            for (let j = 0; j < this.scaledData[i].data.length; j++) {
              switch (this.scaledData[i].data[j].nameCode) {
                case 'C':
                  for (let K = 0; K < obj.new.foodComponentList.length; K++) {
                    if (obj.new.foodComponentList[K].nameCode === 'C') {
                      this.scaledData[i].data[j].value += obj.new.foodComponentList[K].value
                    }
                  }

                  break
                case 'F':
                  for (let K = 0; K < obj.new.foodComponentList.length; K++) {
                    if (obj.new.foodComponentList[K].nameCode === 'F') {
                      // 后端返回复数，加等于
                      console.log('this.scaledData[i].data[j].value', this.scaledData[i].data[j].value)
                      this.scaledData[i].data[j].value += obj.new.foodComponentList[K].value
                    }
                  }
                  break
                case 'P':
                  for (let K = 0; K < obj.new.foodComponentList.length; K++) {
                    if (obj.new.foodComponentList[K].nameCode === 'P') {
                      this.scaledData[i].data[j].value += obj.new.foodComponentList[K].value
                    }
                  }
                  break
                default:
                  break
              }
            }
          }
        }
      }
      if (obj.type === 'lunch') {
        for (let i = 0; i < this.scaledData.length; i++) {
          if (this.scaledData[i].type === 'Lunch') {
            for (let j = 0; j < this.scaledData[i].data.length; j++) {
              switch (this.scaledData[i].data[j].nameCode) {
                case 'C':
                  for (let K = 0; K < obj.new.foodComponentList.length; K++) {
                    if (obj.new.foodComponentList[K].nameCode === 'C') {
                      this.scaledData[i].data[j].value += obj.new.foodComponentList[K].value
                    }
                  }

                  break
                case 'F':
                  for (let K = 0; K < obj.new.foodComponentList.length; K++) {
                    if (obj.new.foodComponentList[K].nameCode === 'F') {
                      this.scaledData[i].data[j].value += obj.new.foodComponentList[K].value
                    }
                  }
                  break
                case 'P':
                  for (let K = 0; K < obj.new.foodComponentList.length; K++) {
                    if (obj.new.foodComponentList[K].nameCode === 'P') {
                      this.scaledData[i].data[j].value += obj.new.foodComponentList[K].value
                    }
                  }
                  break
                default:
                  break
              }
            }
          }
        }
      }

      if (obj.type === 'dinner') {
        for (let i = 0; i < this.scaledData.length; i++) {
          if (this.scaledData[i].type === 'Dinner') {
            for (let j = 0; j < this.scaledData[i].data.length; j++) {
              switch (this.scaledData[i].data[j].nameCode) {
                case 'C':
                  for (let K = 0; K < obj.new.foodComponentList.length; K++) {
                    if (obj.new.foodComponentList[K].nameCode === 'C') {
                      console.log('正负数问题', obj.new.foodComponentList[K].value)

                      this.scaledData[i].data[j].value += obj.new.foodComponentList[K].value
                    }
                  }

                  break
                case 'F':
                  for (let K = 0; K < obj.new.foodComponentList.length; K++) {
                    if (obj.new.foodComponentList[K].nameCode === 'F') {
                      this.scaledData[i].data[j].value += obj.new.foodComponentList[K].value
                    }
                  }
                  break
                case 'P':
                  for (let K = 0; K < obj.new.foodComponentList.length; K++) {
                    if (obj.new.foodComponentList[K].nameCode === 'P') {
                      this.scaledData[i].data[j].value += obj.new.foodComponentList[K].value
                      // this.scaledData[i].data[j].value < 0
                      //   ? (this.scaledData[i].data[j].value -= obj.new.foodComponentList[K].value)
                      //   : (this.scaledData[i].data[j].value += obj.new.foodComponentList[K].value)
                    }
                  }
                  break
                default:
                  break
              }
            }
          }
        }
      }
    },
    // 按照新值得比例计算
    ratioCalculation(obj) {
      for (let i = 0; i < obj.new.foodComponentList.length; i++) {
        obj.ratio > 0
          ? (obj.new.foodComponentList[i].value *= obj.ratio)
          : (obj.new.foodComponentList[i].value *= obj.ratio)
      }
    },
    calculate(timeType, arr) {
      console.log('看下什么鬼', arr)
      // 初始化在计算的数据
      this.waitForCalculate = {
        E: 0,
        P: 0,
        C: 0,
        F: 0
      }
      // for (let i = 0; i < arr.length; i++) {
      //   for (let j = 0; j < arr[i].foodComponentList.length; j++) {
      //     switch (arr[i].foodComponentList[j].nameCode) {
      //       case 'E':
      //         this.waitForCalculate.E += Math.abs(arr[i].foodComponentList[j].value)
      //         break
      //       case 'C':
      //         this.waitForCalculate.C += Math.abs(arr[i].foodComponentList[j].value)
      //         break
      //       case 'F':
      //         this.waitForCalculate.F += Math.abs(arr[i].foodComponentList[j].value)
      //         break
      //       case 'P':
      //         this.waitForCalculate.P += Math.abs(arr[i].foodComponentList[j].value)
      //         break
      //       default:
      //         break
      //     }
      //   }
      // }
      console.log()

      if (timeType === 'breakfast') {
        let breakfirstArr = []
        for (let item in this.tableList) {
          if (item === 'breakfastP' || item === 'breakfastF' || item === 'breakfastC') {
            for (let n = 0; n < this.tableList[item].length; n++) {
              breakfirstArr.push(this.tableList[item][n])
            }
          }
        }
        let bc = 0 // 累加本次计算所有的C
        let bp = 0
        let bf = 0
        for (let key in this.initSudokuData.mealList) {
          if (this.initSudokuData.mealList[key].englishName === 'Breakfast') {
            for (let j = 0; j < this.initSudokuData.mealList[key].componentList.length; j++) {
              switch (this.initSudokuData.mealList[key].componentList[j].nameCode) {
                case 'C':
                  for (let a = 0; a < breakfirstArr.length; a++) {
                    for (let b = 0; b < breakfirstArr[a].foodComponentList.length; b++) {
                      if (breakfirstArr[a].foodComponentList[b].nameCode === 'C') {
                        bc += breakfirstArr[a].foodComponentList[b].value
                      }
                    }
                  }
                  // 重新计算
                  this.scaledData[0].data[2].value =
                    this.initSudokuData.mealList[key].componentList[j].value - parseInt(bc)
                  break
                case 'F':
                  for (let a = 0; a < breakfirstArr.length; a++) {
                    for (let b = 0; b < breakfirstArr[a].foodComponentList.length; b++) {
                      if (breakfirstArr[a].foodComponentList[b].nameCode === 'F') {
                        bf += breakfirstArr[a].foodComponentList[b].value
                      }
                    }
                  }
                  this.scaledData[0].data[1].value =
                    this.initSudokuData.mealList[key].componentList[j].value - parseInt(bf)

                  break
                case 'P':
                  for (let a = 0; a < breakfirstArr.length; a++) {
                    for (let b = 0; b < breakfirstArr[a].foodComponentList.length; b++) {
                      if (breakfirstArr[a].foodComponentList[b].nameCode === 'P') {
                        bp += breakfirstArr[a].foodComponentList[b].value
                      }
                    }
                  }

                  this.scaledData[0].data[0].value =
                    this.initSudokuData.mealList[key].componentList[j].value - parseInt(bp)
                  break
                default:
                  break
              }
            }
          }
        }
      }
      if (timeType === 'lunch') {
        let lunchArr = []
        for (let item in this.tableList) {
          if (item === 'lunchP' || item === 'lunchF' || item === 'lunchC') {
            for (let n = 0; n < this.tableList[item].length; n++) {
              lunchArr.push(this.tableList[item][n])
            }
          }
        }
        let lc = 0 // 累加本次计算所有的C
        let lp = 0
        let lf = 0
        for (let key in this.initSudokuData.mealList) {
          if (this.initSudokuData.mealList[key].englishName === 'Lunch') {
            for (let j = 0; j < this.initSudokuData.mealList[key].componentList.length; j++) {
              switch (this.initSudokuData.mealList[key].componentList[j].nameCode) {
                case 'C':
                  for (let a = 0; a < lunchArr.length; a++) {
                    for (let b = 0; b < lunchArr[a].foodComponentList.length; b++) {
                      if (lunchArr[a].foodComponentList[b].nameCode === 'C') {
                        lc += lunchArr[a].foodComponentList[b].value
                      }
                    }
                  }
                  // 重新计算
                  this.scaledData[1].data[2].value =
                    this.initSudokuData.mealList[key].componentList[j].value - parseInt(lc)
                  break
                case 'F':
                  for (let a = 0; a < lunchArr.length; a++) {
                    for (let b = 0; b < lunchArr[a].foodComponentList.length; b++) {
                      if (lunchArr[a].foodComponentList[b].nameCode === 'F') {
                        lf += lunchArr[a].foodComponentList[b].value
                      }
                    }
                  }
                  this.scaledData[1].data[1].value =
                    this.initSudokuData.mealList[key].componentList[j].value - parseInt(lf)

                  break
                case 'P':
                  for (let a = 0; a < lunchArr.length; a++) {
                    for (let b = 0; b < lunchArr[a].foodComponentList.length; b++) {
                      if (lunchArr[a].foodComponentList[b].nameCode === 'P') {
                        lp += lunchArr[a].foodComponentList[b].value
                      }
                    }
                  }

                  this.scaledData[1].data[0].value =
                    this.initSudokuData.mealList[key].componentList[j].value - parseInt(lp)
                  break
                default:
                  break
              }
            }
          }
        }
      }

      if (timeType === 'dinner') {
        let dinnerArr = []
        for (let item in this.tableList) {
          if (item === 'dinnerP' || item === 'dinnerF' || item === 'dinnerC') {
            for (let n = 0; n < this.tableList[item].length; n++) {
              dinnerArr.push(this.tableList[item][n])
            }
          }
        }
        let dc = 0 // 累加本次计算所有的C
        let dp = 0
        let df = 0
        for (let key in this.initSudokuData.mealList) {
          if (this.initSudokuData.mealList[key].englishName === 'Dinner') {
            for (let j = 0; j < this.initSudokuData.mealList[key].componentList.length; j++) {
              switch (this.initSudokuData.mealList[key].componentList[j].nameCode) {
                case 'C':
                  for (let a = 0; a < dinnerArr.length; a++) {
                    for (let b = 0; b < dinnerArr[a].foodComponentList.length; b++) {
                      if (dinnerArr[a].foodComponentList[b].nameCode === 'C') {
                        dc += dinnerArr[a].foodComponentList[b].value
                      }
                    }
                  }
                  // 重新计算
                  this.scaledData[2].data[2].value =
                    this.initSudokuData.mealList[key].componentList[j].value - parseInt(dc)
                  break
                case 'F':
                  for (let a = 0; a < dinnerArr.length; a++) {
                    for (let b = 0; b < dinnerArr[a].foodComponentList.length; b++) {
                      if (dinnerArr[a].foodComponentList[b].nameCode === 'F') {
                        df += dinnerArr[a].foodComponentList[b].value
                      }
                    }
                  }
                  this.scaledData[2].data[1].value =
                    this.initSudokuData.mealList[key].componentList[j].value - parseInt(df)

                  break
                case 'P':
                  for (let a = 0; a < dinnerArr.length; a++) {
                    for (let b = 0; b < dinnerArr[a].foodComponentList.length; b++) {
                      if (dinnerArr[a].foodComponentList[b].nameCode === 'P') {
                        dp += dinnerArr[a].foodComponentList[b].value
                      }
                    }
                  }

                  this.scaledData[2].data[0].value =
                    this.initSudokuData.mealList[key].componentList[j].value - parseInt(dp)
                  break
                default:
                  break
              }
            }
          }
        }
      }
    },
    setSelected(val) {
      // 如果有特殊需求，某营养素超标使用
      for (let i = 0; i < val.data.length; i++) {
        val.data[i].value = Math.abs(val.data[i].value)
      }

      switch (val.type) {
        case 'breakfastP':
          this.tableList.breakfastP = val.data
          this.calculate('breakfast', val.data)
          break
        case 'breakfastF':
          this.tableList.breakfastF = val.data
          this.calculate('breakfast', val.data)
          break
        case 'breakfastC':
          this.tableList.breakfastC = val.data
          this.calculate('breakfast', val.data)
          break
        case 'lunchP':
          this.tableList.lunchP = val.data
          this.calculate('lunch', val.data)
          break
        case 'lunchF':
          this.tableList.lunchF = val.data
          this.calculate('lunch', val.data)
          break
        case 'lunchC':
          this.tableList.lunchC = val.data
          this.calculate('lunch', val.data)
          break
        case 'dinnerP':
          this.tableList.dinnerP = val.data
          this.calculate('dinner', val.data)
          break
        case 'dinnerF':
          this.tableList.dinnerF = val.data
          this.calculate('dinner', val.data)
          break
        case 'dinnerC':
          this.tableList.dinnerC = val.data
          this.calculate('dinner', val.data)
          break
        default:
      }
    },
    calculatePercentage() {
      let data = this.step.arr

      let total = this.step.total
      // 参数
      let params = { dailyEnergy: total, pValue: data[0].value, fValue: data[1].value, cValue: data[2].value }
      getdailyFoodComponent(params).then(res => {
        if (res.success) {
          let data = res.response.mealList
          this.deepClone(this.initSudokuData, res.response) // 最初的数据
          console.log('这是默认或者调整过后的比例', this.initSudokuData)

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
    showEdit(type, item) {
      this.$refs.edit.showModal(type, item)
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
      this.recount = [] // 重新整体计算餐次数据的数组
      for (let key in this.tableList) {
        if (key === time + type) {
          this.params.currentObj = this.tableList[key]
        }
        if (key.indexOf(time) > -1) {
          console.log('找得到吧', this.tableList[key])
          for (let j = 0; j < this.tableList[key].length; j++) {
            this.recount.push(this.tableList[key][j])
          }
        }
      }
      console.log('应该是Ok的', this.recount)

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
