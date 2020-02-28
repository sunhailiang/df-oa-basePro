<template>
  <div class="line-chart">
    <v-chart :forceFit="true" :height="height" :data="arr" :scale="scale">
      <v-tooltip />
      <v-axis />
      <v-line position="year*value" />
      <v-point position="year*value" shape="circle" />
    </v-chart>
  </div>
</template>

<script>
const scale = [
  {
    dataKey: 'value',
    min: 0
  },
  {
    dataKey: 'year',
    min: 0,
    max: 1
  }
]

export default {
  name: 'LineChart',
  props: {
    arr: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {
      scale,
      height: 400
    }
  },
  mounted() {
    console.log('ARR', this.arr)
  }
}
</script>
<style lang="less" scoped>
.line-chart {
  position: relative;
  top: 20px;
  left: -30px;
}
</style>
