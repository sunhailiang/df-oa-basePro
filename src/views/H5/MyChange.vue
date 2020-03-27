<template>
  <div>
    <div class="init">
      <div class="init-weight">
        <p class="weight">{{ initWeight }}KG</p>
        <p>初始体重</p>
      </div>
      <div class="lose-fat">
        <p class="weight" :style="loseWeight > 0 ? 'color: green;' : loseWeight < 0 ? 'color: red;' : 'color: orange;'">
          {{ loseWeight }}KG
        </p>
        <p>已减重</p>
      </div>
    </div>
    <div id="chart" class="chart"></div>
    <div class="info">
      <div class="current-status">
        <p class="status-title">状态描述</p>
        <p class="status-content" :style="trend === 0 ? 'color:green' : trend === 1 ? 'color:orange' : 'color:red'">
          {{ tips }}
        </p>
      </div>
      <div class="record">
        打卡记录
      </div>
      <div class="bar">
        <Slider id="test" :defaultValue="2" :max="15" @change="getDings" />
      </div>
      <div class="vip-servise">
        <a :href="'tel:' + phone"><a-icon type="phone" style="padding-right:0.3rem" />我的专属客服</a>
      </div>
    </div>
  </div>
</template>
<script>
import { weightList } from '@/api/manage'
import { Slider, Button } from 'ant-design-vue'
var echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
export default {
  name: 'MyChange',
  components: { Slider, Button },
  mounted() {
    // 获取数据
    this.weightList()
    // 统计图
  },
  data() {
    return {
      initWeight: 0,
      loseWeight: 0,
      disabled: false,
      chartData: [],
      trend: 0,
      tips: '加油哦',
      defaultNum: 2,
      nums: 2,
      phone: 0
    }
  },
  methods: {
    setChart() {
      var myChart = echarts.init(document.getElementById('chart'))
      var cvs = document.getElementById('zr_0')
      let option = {
        title: {
          text: 'Step Line'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['Step Start', 'Step Middle', 'Step End']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Step Start',
            type: 'line',
            step: 'start',
            data: this.chartData.reverse()
          }
        ]
      }

      myChart.setOption(option)
    },
    weightList() {
      console.log('每次都会触发吗')

      weightList({ oid: this.$route.params.id, dataCount: this.nums }).then(res => {
        // 置空
        this.chartData = []
        if (res.success) {
          this.initWeight = res.response.initWeight
          const lost = res.response.initWeight - res.response.weightList[0].weight
          this.loseWeight = parseFloat(lost).toFixed(1)
          //专属客服电话
          this.phone = res.response.cellphone
          //获取移动打卡的天数
          if (res.response.weightList.length > 1) {
            res.response.weightList[0].weight > res.response.weightList[1].weight
              ? (this.trend = 2)
              : res.response.weightList[0].weight < res.response.weightList[1].weight
              ? (this.trend = 0)
              : (this.trend = 1)
          }
          if (this.trend == 0) {
            this.tips = '您的减肥状态进展很棒哦，继续加油！'
          } else if (this.trend == 1) {
            this.tips = '您的今日体重没有降低，需要专属客服针对性辅导吗？'
          } else {
            this.tips = '您今日体重出现逆向增长,需要专属客服针对性辅导吗？ '
          }

          for (let i = 0; i < res.response.weightList.length; i++) {
            this.chartData.push(res.response.weightList[i].weight)
          }

          // 渲染体重折线图
          this.setChart()
        }
      })
    },
    getDings(v) {
      this.nums = v
      this.weightList()
    }
  }
}
</script>
<style lang="less" scoped>
.info {
  .bar {
    margin-top: 1.2rem;
  }
  position: relative;
  top: 1.6rem;
  .vip-servise {
    margin-top: 3rem;
    padding: 0 1rem 3rem 1rem;
    a {
      font-size: 1rem;
      display: inline-block;
      box-shadow: 2px 0 5px #91d5ff;
      width: 100%;
      height: 2.5rem;
      background-color: #91d5ff;
      border-radius: 1rem;
      text-align: center;
      line-height: 2.5rem;
      color: white;
    }
  }
  margin: 0 1rem;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  box-shadow: 0 -5px 10px #c0c0c0;
  padding: 1.4rem 1rem;
  .status-title,
  .record {
    font-size: 1rem;
    font-weight: bolder;
  }
  .record {
    margin-top: 1rem;
  }
}
.chart {
  height: 200px;
}
.init {
  position: relative;
  display: flex;
  justify-content: space-between;
  top: 1.5rem;
  p {
    margin: 0;
    padding: 0;
  }
  .init-weight {
    padding-left: 1rem;
    .weight {
      font-size: 1.4rem;
      font-weight: bolder;
    }
  }
  .lose-fat {
    padding-right: 1rem;
    .weight {
      font-size: 1.4rem;
      font-weight: bolder;
      color: green;
    }
  }
}
</style>
