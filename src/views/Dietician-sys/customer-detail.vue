<template>
  <div class="page-header-index-wide">
    <page-view :avatar="avatar" :title="false">
      <detail-list slot="headerContent" size="small" :col="2" class="detail-layout">
        <detail-list-item term="客户姓名">张女士</detail-list-item>
        <detail-list-item term="性别">女</detail-list-item>
        <detail-list-item term="联系方式">188888888888</detail-list-item>
        <detail-list-item term="归属客服"><a>张经理</a></detail-list-item>
        <detail-list-item term="归属代理">张经理</detail-list-item>
        <detail-list-item term="身高">160</detail-list-item>
        <detail-list-item term="职业">金融白领</detail-list-item>
        <detail-list-item term="所在地区">上海</detail-list-item>
      </detail-list>
    </page-view>
    <a-row :gutter="40" class="chart">
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <a-card
          title="体重"
          style="margin-bottom: 24px"
          :loading="radarLoading"
          :bordered="false"
          :body-style="{ padding: 0 }"
        >
          <div style="min-height: 400px;">
            <LineChart :arr="lineData" />
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <a-card
          title="BMI"
          style="margin-bottom: 24px"
          :loading="radarLoading"
          :bordered="false"
          :body-style="{ padding: 0 }"
        >
          <div style="min-height: 400px;">
            <LineChart :arr="lineData" />
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <a-card
          title="体质测试"
          style="margin-bottom: 24px"
          :loading="radarLoading"
          :bordered="false"
          :body-style="{ padding: 0 }"
        >
          <div style="min-height: 400px;">
            <!-- :scale="scale" :axis1Opts="axis1Opts" :axis2Opts="axis2Opts"  -->
            <radar :data="radarData" />
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="salesCard" style="min-height: 400px;">
        <a-tabs default-active-key="1" size="large" :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }">
          <div class="extra-wrapper" slot="tabBarExtraContent"></div>
          <a-tab-pane tab="配餐历史" key="1">
            <a-row>
              <a-col :xl="24" :lg="12" :md="12" :sm="24" :xs="24">
                <div>
                  <s-table
                    ref="table"
                    size="default"
                    rowKey="key"
                    :columns="configFoodColumns"
                    :data="loadData"
                    showPagination="auto"
                  >
                    <span slot="action" slot-scope="text, record">
                      <template>
                        <!-- 已经采纳的可以删除，未采纳的可以作废 -->
                        <a @click="handleEdit(record)">删除</a> <a @click="openInvalidModal(record)">作废</a>
                        <Confirm ref="confirm" @hideModal="deleteRow(record)" />
                      </template>
                    </span>
                  </s-table>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane loading="true" tab="快速配餐" key="2">
            <a-row>
              <a-col :xl="24" :lg="12" :md="12" :sm="24" :xs="24">
                <div style="height:490px; position: relative; top:0; left:0">
                  <InitModal @currentStep="getCurrent" />
                  <ConfitFoodTable :step="ConfigFoodStep" />
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane loading="true" tab="打卡历史" key="3">
            <a-row>
              <a-col :xl="24" :lg="12" :md="12" :sm="24" :xs="24">
                <div style="min-height: 400px;">
                  <CardHistory
                    size="default"
                    rowKey="key"
                    :columns="cardHistoryColumns"
                    :data="loadCardHistory"
                    showPagination="auto"
                  >
                    <span slot="action" slot-scope="text, record">
                      <template>
                        <!-- 已经采纳的可以删除，未采纳的可以作废 -->
                        <a @click="handleEdit(record)">删除</a>
                        <Confirm ref="confirm" @hideModal="deleteRow(record)" />
                      </template>
                    </span>
                  </CardHistory>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane loading="true" tab="协助打卡" key="4">
            <a-row>
              <a-col :xl="24" :lg="12" :md="12" :sm="24" :xs="24">
                <a-card :body-style="{ padding: '24px 32px' }" :bordered="false">
                  <a-form @submit="handleSubmit" :form="form">
                    <a-form-item
                      label="今日体重"
                      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                    >
                      <a-input
                        v-decorator="['weight', { rules: [{ required: true, message: '请输入体重(kg)' }] }]"
                        name="weight"
                        placeholder="请输入体重(kg)"
                      />
                    </a-form-item>
                    <a-form-item
                      label="身高"
                      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                    >
                      <a-input
                        v-decorator="['height', { rules: [{ required: true, message: '请输入身高(cm)' }] }]"
                        name="height"
                        placeholder="请输入身高(cm)"
                      />
                    </a-form-item>
                    <a-form-item
                      label="年龄"
                      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                    >
                      <a-input
                        v-decorator="['age', { rules: [{ required: true, message: '请输入年龄' }] }]"
                        name="age"
                        placeholder="请输入年龄"
                      />
                    </a-form-item>
                    <a-form-item
                      label="是否排便后称重"
                      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                      :required="false"
                    >
                      <a-radio-group v-model="toilet">
                        <a-radio :value="1">是</a-radio>
                        <a-radio :value="2">否</a-radio>
                      </a-radio-group>
                    </a-form-item>
                    <a-form-item
                      label="昨日早餐 "
                      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                    >
                      <a-textarea
                        rows="3"
                        placeholder="请输入昨日早餐"
                        v-decorator="['breakfast', { rules: [{ required: true, message: '请输入昨日早餐' }] }]"
                      />
                    </a-form-item>
                    <a-form-item
                      label="昨日午餐"
                      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                    >
                      <a-textarea
                        rows="3"
                        placeholder="请输入昨日午餐"
                        v-decorator="['lunch', { rules: [{ required: true, message: '请输入昨日午餐' }] }]"
                      />
                    </a-form-item>
                    <a-form-item
                      label="午餐照片"
                      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                    >
                      <a-upload
                        name="file"
                        :beforeUpload="beforeUpload"
                        :showUploadList="false"
                        v-decorator="['file', { rules: [{ required: true, message: '请上传午餐照片' }] }]"
                      >
                        <a-button icon="upload">选择图片</a-button>
                      </a-upload>
                    </a-form-item>
                    <a-form-item
                      label="昨日晚餐"
                      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                    >
                      <a-textarea
                        rows="3"
                        placeholder="请输入昨日晚餐"
                        v-decorator="['dinner', { rules: [{ required: true, message: '请输入昨日晚餐' }] }]"
                      />
                    </a-form-item>

                    <a-form-item
                      label="是否有加餐？"
                      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                      :required="false"
                    >
                      <a-radio-group v-model="extraFood">
                        <a-radio :value="0">没有</a-radio>
                        <a-radio :value="1">有</a-radio>
                      </a-radio-group>
                      <a-textarea
                        v-if="extraFood == 1"
                        rows="3"
                        placeholder="请输入加餐食物"
                        v-decorator="['extraFood', { rules: [{ required: true, message: '请输入加餐食物' }] }]"
                      />
                    </a-form-item>
                    <a-form-item
                      label="入睡时间"
                      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                    >
                      <a-input
                        v-decorator="['sleepTime', { rules: [{ required: true, message: '请输入入睡时间' }] }]"
                        name="sleepTime"
                        placeholder="请输入入睡时间"
                      />
                    </a-form-item>
                    <a-form-item
                      label="饮水量"
                      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                    >
                      <a-input
                        v-decorator="['water', { rules: [{ required: true, message: '请输入饮水量' }] }]"
                        name="water"
                        placeholder="请输入饮水量(ml)"
                      />
                    </a-form-item>
                    <a-form-item
                      label="喝了多少小红杯"
                      :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                      :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                    >
                      <a-input
                        v-decorator="['number', { rules: [{ required: true, message: '请输入小红杯食用数量(杯)' }] }]"
                        name="number"
                        placeholder="请输入小红杯食用数量(杯)"
                      />
                    </a-form-item>

                    <a-form-item :wrapperCol="{ span: 24 }" style="text-align: center">
                      <a-button htmlType="submit" type="primary">提交</a-button>
                      <a-button style="margin-left: 8px">保存</a-button>
                    </a-form-item>
                  </a-form>
                </a-card>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
    <FormModal ref="modal" @save="handleOk" />
  </div>
</template>

<script>
import moment from 'moment'
import { timeFix } from '@/utils/util'
import { mapState } from 'vuex'
import HeadInfo from '@/components/tools/HeadInfo'
import FormModal from './components/modal/FormModal'
import CardHistory from './components/table/CardHistoryList'
import { PageView } from '@/layouts'
import DetailList from '@/components/tools/DetailList'
import InitModal from './components/config-food/InitModal'
import ConfitFoodTable from './components/config-food/ConfigFoodTable'
import {
  Confirm,
  STable,
  LineChart,
  ChartCard,
  MiniArea,
  MiniBar,
  MiniProgress,
  RankList,
  Bar,
  Trend,
  Radar,
  NumberInfo,
  MiniSmoothArea
} from '@/components'

import { mixinDevice } from '@/utils/mixin'
import { getDeployHistory, getCardHistory } from '@/api/manage'
const DetailListItem = DetailList.Item
const barData = []
const barData2 = []
for (let i = 0; i < 12; i += 1) {
  barData.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
  barData2.push({
    x: `${i + 1}月`,
    y: Math.floor(Math.random() * 1000) + 200
  })
}

const rankList = []
for (let i = 0; i < 7; i++) {
  rankList.push({
    name: '白鹭岛 ' + (i + 1) + ' 号店',
    total: 1234.56 - i * 100
  })
}

const searchUserData = []
for (let i = 0; i < 7; i++) {
  searchUserData.push({
    x: moment()
      .add(i, 'days')
      .format('YYYY-MM-DD'),
    y: Math.ceil(Math.random() * 10)
  })
}
const searchUserScale = [
  {
    dataKey: 'x',
    alias: '时间'
  },
  {
    dataKey: 'y',
    alias: '用户数',
    min: 0,
    max: 10
  }
]

const searchTableColumns = [
  {
    dataIndex: 'index',
    title: '排名',
    width: 90
  },
  {
    dataIndex: 'keyword',
    title: '搜索关键词'
  },
  {
    dataIndex: 'count',
    title: '用户数'
  },
  {
    dataIndex: 'range',
    title: '周涨幅',
    align: 'right',
    sorter: (a, b) => a.range - b.range,
    scopedSlots: { customRender: 'range' }
  }
]
const searchData = []
for (let i = 0; i < 50; i += 1) {
  searchData.push({
    index: i + 1,
    keyword: `搜索关键词-${i}`,
    count: Math.floor(Math.random() * 1000),
    range: Math.floor(Math.random() * 100),
    status: Math.floor((Math.random() * 10) % 2)
  })
}

const DataSet = require('@antv/data-set')

const sourceData = [
  { item: '家用电器', count: 32.2 },
  { item: '食用酒水', count: 21 },
  { item: '个护健康', count: 17 },
  { item: '服饰箱包', count: 13 },
  { item: '母婴产品', count: 9 },
  { item: '其他', count: 7.8 }
]

const pieScale = [
  {
    dataKey: 'percent',
    min: 0,
    formatter: '.0%'
  }
]

const dv = new DataSet.View().source(sourceData)
dv.transform({
  type: 'percent',
  field: 'count',
  dimension: 'item',
  as: 'percent'
})
const pieData = dv.rows

export default {
  name: 'Analysis',
  mixins: [mixinDevice],
  components: {
    ConfitFoodTable,
    InitModal,
    CardHistory,
    Confirm,
    FormModal,
    STable,
    Radar,
    DetailListItem,
    DetailList,
    ChartCard,
    MiniArea,
    MiniBar,
    MiniProgress,
    RankList,
    Bar,
    Trend,
    NumberInfo,
    MiniSmoothArea,
    HeadInfo,
    PageView,
    LineChart
  },
  data() {
    return {
      ConfigFoodStep: 0,
      // 表单
      options: {
        // 上传图片
        // img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        img: '',
        autoCrop: true,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true,
        alert: {
          show: true
        }
      },
      toilet: 1, // 是否如厕
      extraFood: 0, // 是否加餐
      form: this.$form.createForm(this),
      cardHistoryColumns: [
        {
          title: '配餐编号',
          dataIndex: 'no'
        },
        {
          title: '体重',
          dataIndex: 'weight'
        },
        {
          title: '身高',
          dataIndex: 'height'
        },
        {
          title: '年纪',
          dataIndex: 'age'
        },
        {
          title: '是否排便',
          dataIndex: 'isDefecate'
        },
        {
          title: '昨日早餐',
          dataIndex: 'yesterdayBreakfirst'
        },
        {
          title: '昨日午餐',
          dataIndex: 'yesterdayLunch'
        },
        {
          title: '午餐照片',
          dataIndex: 'lunchImg'
        },
        {
          title: '昨日晚餐',
          dataIndex: 'yesterdayDinner'
        },
        {
          title: '是否宵夜',
          dataIndex: 'isNightSnack'
        },
        {
          title: '宵夜',
          dataIndex: 'nightSnack'
        },
        {
          title: '睡眠时间',
          dataIndex: 'sleepTime'
        },
        {
          title: '饮水量',
          dataIndex: 'water'
        },
        {
          title: '小红杯数量',
          dataIndex: 'cup'
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getDeployHistory(Object.assign(parameter, this.queryParam)).then(res => {
          return res.result
        })
      },
      loadCardHistory: parameter => {
        return getCardHistory(Object.assign(parameter, this.queryParam)).then(res => {
          return res.result
        })
      },
      // custom table alert & rowSelection
      configFoodColumns: [
        {
          title: '配餐编号',
          dataIndex: 'no'
        },
        {
          title: '早餐',
          dataIndex: 'breakfast',
          scopedSlots: { customRender: 'breakfast' }
        },
        {
          title: '午餐',
          dataIndex: 'lunch',
          sorter: true,
          needTotal: true,
          scopedSlots: { customerGender: 'lunch' }
        },
        {
          title: '晚餐',
          dataIndex: 'dinner',
          scopedSlots: { customRender: 'dinner' }
        },
        {
          title: '配餐人',
          dataIndex: 'operator',
          scopedSlots: { customRender: 'operator' }
        },
        {
          title: '配餐状态',
          dataIndex: 'historyStatus',
          scopedSlots: { customRender: 'historyStatus' }
        },
        {
          title: '日期',
          dataIndex: 'date',
          scopedSlots: { customRender: 'date' }
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      lineData: [
        { year: '1991', value: 3 },
        { year: '1992', value: 4 },
        { year: '1993', value: 3.5 },
        { year: '1994', value: 5 },
        { year: '1995', value: 4.9 },
        { year: '1996', value: 6 },
        { year: '1997', value: 7 },
        { year: '1998', value: 9 },
        { year: '1999', value: 13 }
      ],
      teams: [],
      axisData: [
        { item: '阳虚质', a: 70, b: 30, c: 40 },
        { item: '阴虚质', a: 60, b: 70, c: 40 },
        { item: '痰湿质', a: 50, b: 60, c: 40 },
        { item: '气虚质', a: 40, b: 50, c: 40 },
        { item: '湿热质', a: 60, b: 70, c: 40 },
        { item: '血瘀质', a: 70, b: 50, c: 40 },
        { item: '气郁质', a: 70, b: 50, c: 40 },
        { item: '特禀质', a: 70, b: 50, c: 40 },
        { item: '平和质', a: 70, b: 50, c: 40 }
      ],
      radarLoading: true,
      radarData: [],
      user: {},
      timeFix: timeFix(),
      loading: true,
      rankList,

      // 搜索用户数
      searchUserData,
      searchUserScale,
      searchTableColumns,
      searchData,

      barData,
      barData2,

      //
      pieScale,
      pieData,
      sourceData,
      pieStyle: {
        stroke: '#fff',
        lineWidth: 1
      }
    }
  },
  filters: {
    defecateFilter(isDefecate) {
      const statusMap = {
        0: '否',
        1: '是'
      }
      return statusMap[isDefecate]
    },
    nightSnackFilter(isNightSnack) {
      const statusMap = {
        0: '否',
        1: '是'
      }
      return statusMap[isNightSnack]
    }
  },
  methods: {
    getCurrent(step) {
      this.ConfigFoodStep = step
    },
    handleEdit(id) {
      this.$refs.confirm.showModal()
    },
    deleteRow(id) {
      console.log('确认删除')
      this.$refs.confirm.hideModal()
    },
    openInvalidModal(id) {
      this.$refs.modal.openModal(id)
    },
    handleOk(values) {
      console.log('保存数据？？？？', values)
      this.$refs.modal.closeModal()
    },
    beforeUpload(file) {
      const reader = new FileReader()
      // 把Array Buffer转化为blob 如果是base64不需要
      // 转化为base64
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.options.img = reader.result
        console.log('快来看', this.options.img)
      }

      // 转化为blob
      // reader.readAsArrayBuffer(file)

      return false
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          // eslint-disable-next-line no-console
          console.log('Received values of form: ', values)
        }
      })
    },
    initRadar() {
      this.radarLoading = true
      this.$http.get('/workplace/radar').then(res => {
        console.log('what', res.result)

        const dv = new DataSet.View().source(res.result)
        dv.transform({
          type: 'fold',
          fields: ['阳虚质', '阴虚质', '痰湿质', '气虚质', '湿热质', '血瘀质', '气郁质', '特禀质', '平和质'],
          key: 'user',
          value: 'score'
        })
        this.radarData = dv.rows
        this.radarLoading = false
      })
    }
  },
  mounted() {
    this.initRadar()
  },
  created() {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  computed: {
    ...mapState({
      nickname: state => state.user.nickname,
      welcome: state => state.user.welcome
    }),
    userInfo() {
      return this.$store.getters.userInfo
    }
  }
}
</script>

<style lang="less" scoped>
.extra-wrapper {
  line-height: 55px;
  padding-right: 24px;

  .extra-item {
    display: inline-block;
    margin-right: 24px;

    a {
      margin-left: 24px;
    }
  }
}

.antd-pro-pages-dashboard-analysis-twoColLayout {
  position: relative;
  display: flex;
  display: block;
  flex-flow: row wrap;
}

.antd-pro-pages-dashboard-analysis-salesCard {
  height: calc(100% - 24px);
  /deep/ .ant-card-head {
    position: relative;
  }
}

.dashboard-analysis-iconGroup {
  i {
    margin-left: 16px;
    color: rgba(0, 0, 0, 0.45);
    cursor: pointer;
    transition: color 0.32s;
    color: black;
  }
}
.analysis-salesTypeRadio {
  position: absolute;
  right: 54px;
  bottom: 12px;
}
.headerContent .title .welcome-text {
  display: none;
}

.members {
  a {
    display: block;
    margin: 12px 0;
    line-height: 24px;
    height: 24px;
    .member {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      line-height: 24px;
      max-width: 100px;
      vertical-align: top;
      margin-left: 12px;
      transition: all 0.3s;
      display: inline-block;
    }
    &:hover {
      span {
        color: #1890ff;
      }
    }
  }
}
</style>
