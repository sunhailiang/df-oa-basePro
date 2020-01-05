<template>
  <div class="container" v-if="step === 2">
    <div class="left">
      <div class="left-title">餐次</div>
      <div class="breakfirst">早餐</div>
      <div class="lunch">午餐</div>
      <div class="dinner">晚餐</div>
    </div>
    <div class="center">
      <div class="nutrition-type">营养素</div>
      <div class="nutrition">
        <div class="carbohydrate" @click="getRecommendData('breakfirst', 'C')">
          C
        </div>
        <div class="fat" @click="getRecommendData('breakfirst', 'F')">
          F
        </div>
        <div class="protein" @click="getRecommendData('breakfirst', 'P')">
          P
        </div>
      </div>
      <div class="nutrition">
        <div class="carbohydrate" @click="getRecommendData('lunch', 'C')">
          C
        </div>
        <div class="fat" @click="getRecommendData('lunch', 'F')">
          F
        </div>
        <div class="protein" @click="getRecommendData('lunch', 'P')">
          P
        </div>
      </div>
      <div class="nutrition">
        <div class="carbohydrate" @click="getRecommendData('dinner', 'C')">
          C
        </div>
        <div class="fat" @click="getRecommendData('dinner', 'F')">
          F
        </div>
        <div class="protein last-nutrition" @click="getRecommendData('dinner', 'P')">
          P
        </div>
      </div>
    </div>
    <div class="allot">
      <div class="allot-left">待分配</div>
      <div class="weight">
        <div class="carbohydrate" ref="breakfirstCarbohydrate">{{ weight }}g</div>
        <div class="fat" ref="breakfirstFat">{{ weight }}g</div>
        <div class="protein" ref="breakfirstProtein">{{ weight }}g</div>
      </div>
      <div class="weight">
        <div class="carbohydrate" ref="lunchCarbohydrate">{{ weight }}g</div>
        <div class="fat" ref="lunchFat">{{ weight }}g</div>
        <div class="protein" ref="lunchProtein">{{ weight }}g</div>
      </div>
      <div class="weight">
        <div class="carbohydrate" ref="dinnerCarbohydrate">{{ weight }}g</div>
        <div class="fat" ref="dinnerFat">{{ weight }}g</div>
        <div class="protein last-allot" ref="dinnerProtein">{{ weight }}g</div>
      </div>
    </div>
    <div class="right">
      <div class="food-type">选择食材</div>
      <div class="food">
        <div class="carbohydrateFood"><a-tag color="cyan">可乐</a-tag></div>
        <div class="fatFood"><a-tag color="cyan">五花肉</a-tag></div>
        <div class="proteinFood"><a-tag color="cyan">豆浆</a-tag></div>
      </div>
      <div class="food">
        <div class="carbohydrateFood"><a-tag color="cyan">可乐</a-tag></div>
        <div class="fatFood"><a-tag color="cyan">五花肉</a-tag></div>
        <div class="proteinFood"><a-tag color="cyan">豆浆</a-tag></div>
      </div>
      <div class="food">
        <div class="carbohydrateFood"><a-tag color="cyan">可乐</a-tag></div>
        <div class="fatFood"><a-tag color="cyan">五花肉</a-tag></div>
        <div class="proteinFood last-proteinFood"><a-tag color="cyan">豆浆</a-tag></div>
      </div>
    </div>
    <div class="to-img">
      <div class="food-import">导出配餐</div>
      <div>
        <a-badge count="5" class="import-btn">
          <a-icon type="shopping-cart" style="fontSize:30px;" />
        </a-badge>
      </div>
    </div>
    <RecommendFood @setVisible="setVisible" :isShow="show" :params="params" />
  </div>
</template>
<script>
import RecommendFood from './RecommendFood'
export default {
  name: 'ConfigFoodTable',
  props: {
    configData: { type: Object, default: Object },
    step: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      weight: 26,
      show: false,
      params: {
        type: '',
        weight: 0
      }
    }
  },
  components: {
    RecommendFood
  },
  methods: {
    setVisible(visible) {
      this.show = visible
    },
    getRecommendData(havaType, type) {
      console.log('获取推荐数据', havaType + '+' + type)
      this.params.type = type
      this.show = true
      switch (havaType + type) {
        case 'breakfirstC':
          console.log('早餐碳水化合物', this.$refs.breakfirstCarbohydrate.innerText)
          this.params.weight = this.$refs.breakfirstCarbohydrate.innerText
          break
        case 'breakfirstF':
          console.log('早餐脂肪', this.$refs.breakfirstFat.innerText)
          this.params.weight = this.$refs.breakfirstCarbohydrate.innerText
          break
        case 'breakfirstP':
          console.log('早餐蛋白质', this.$refs.breakfirstProtein.innerText)
          this.params.weight = this.$refs.breakfirstCarbohydrate.innerText
          break
        case 'lunchC':
          console.log('午餐碳水化合物', this.$refs.lunchCarbohydrate.innerText)
          this.params.weight = this.$refs.breakfirstCarbohydrate.innerText
          break
        case 'lunchF':
          console.log('午餐脂肪', this.$refs.lunchFat.innerText)
          this.params.weight = this.$refs.breakfirstCarbohydrate.innerText
          break
        case 'lunchP':
          console.log('午餐蛋白质', this.$refs.lunchProtein.innerText)
          this.params.weight = this.$refs.breakfirstCarbohydrate.innerText
          break
        case 'dinnerC':
          console.log('晚餐碳水化合物', this.$refs.dinnerCarbohydrate.innerText)
          this.params.weight = this.$refs.breakfirstCarbohydrate.innerText
          break
        case 'dinnerF':
          console.log('晚餐脂肪', this.$refs.dinnerCarbohydrate.innerText)
          this.params.weight = this.$refs.breakfirstCarbohydrate.innerText
          break
        case 'dinnerP':
          console.log('晚餐蛋白质', this.$refs.dinnerCarbohydrate.innerText)
          this.params.weight = this.$refs.breakfirstCarbohydrate.innerText
          break
        default:
          break
      }
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
