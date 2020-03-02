<template>
  <div class="page-header-index-wide">
    <page-view :avatar="avatar" :title="false">
      <detail-list slot="headerContent" size="small" :col="2" class="detail-layout">
        <detail-list-item
          v-for="item in Object.keys(usertails).filter(
            res => res != 'oid' && res != 'age' && res != 'initWeight' && res != 'city' && res != 'serviceName'
          )"
          :key="item.oid"
          :term="
            item == 'userName'
              ? '用户姓名'
              : item == 'sex'
              ? '性别'
              : item == 'cellphone'
              ? '联系方式'
              : item == 'supporterName'
              ? '归属客服'
              : item == 'agenterName'
              ? '归属代理'
              : item == 'initHeight'
              ? '身高'
              : item == 'jobName'
              ? '职业'
              : '地区'
          "
          >{{
            item == 'sex' && usertails[item] == 0
              ? '女'
              : item == 'sex' && usertails[item] == 1
              ? '男'
              : usertails[item]
          }}{{ activeKey }}</detail-list-item
        >
      </detail-list>
    </page-view>
    <a-row :gutter="40" class="chart">
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <a-card title="体重" style="margin-bottom: 24px" :bordered="false" :body-style="{ padding: 0 }">
          <div style="min-height: 400px;">
            <LineChart :arr="weight" />
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <a-card title="BMI" style="margin-bottom: 24px" :bordered="false" :body-style="{ padding: 0 }">
          <div style="min-height: 400px;">
            <LineChart :arr="bmi" />
          </div>
        </a-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="8" :style="{ marginBottom: '24px' }">
        <a-card title="体质测试" style="margin-bottom: 24px" :bordered="false" :body-style="{ padding: 0 }">
          <div style="min-height: 400px;">
            <radar :data="radarData" />
          </div>
        </a-card>
      </a-col>
    </a-row>

    <a-card :loading="loading" :bordered="false" :body-style="{ padding: '0' }">
      <div class="salesCard" style="min-height: 400px;">
        <a-tabs
          @change="setActiveKey"
          :activeKey="activeKey"
          size="large"
          :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }"
        >
          <div class="extra-wrapper" slot="tabBarExtraContent"></div>
          <a-tab-pane tab="配餐历史" key="1">
            <a-row>
              <a-col :xl="24" :lg="12" :md="12" :sm="24" :xs="24">
                <div v-if="activeKey === '1'">
                  <s-table
                    ref="table"
                    size="default"
                    rowKey="oid"
                    :columns="configFoodColumns"
                    :data="loadData"
                    showPagination="auto"
                  >
                    <span slot="action" slot-scope="text, record">
                      <template>
                        <a @click="openInvalidModal(record)">作废</a>
                        <Confirm ref="confirm" :isShow="isShow" :title="title" @doDelete="deleteRow(record)" />
                      </template>
                    </span>
                  </s-table>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane a-tab-pane loading="true" tab="快速配餐" key="2">
            <a-row>
              <a-col :xl="24" :lg="12" :md="12" :sm="24" :xs="24">
                <div v-if="activeKey === '2'" style="height:490px; position: relative; top:0; left:0">
                  <InitModal @currentStep="getCurrent" />
                  <ConfigFoodTable
                    v-if="ConfigFoodStep.step === 2"
                    :userDetail="usertails"
                    :resParams="this.resParams"
                    :step="ConfigFoodStep"
                  />
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane a-tab-pane loading="true" tab="客户忌口" key="3">
            <a-row>
              <a-col :xl="24" :lg="12" :md="12" :sm="24" :xs="24">
                <div v-if="activeKey === '3'" style=" position: relative; top:0; left:0">
                  <CustomerAvoid />
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane loading="true" tab="打卡历史" key="4">
            <a-row>
              <a-col :xl="24" :lg="12" :md="12" :sm="24" :xs="24">
                <div style="min-height: 400px;" v-if="activeKey === '4'">
                  <CardHistory
                    size="default"
                    rowKey="id"
                    :columns="cardHistoryColumns"
                    :data="loadCardHistory"
                    showPagination="auto"
                  >
                    <img style="width:80px;height:40px" slot="pic" slot-scope="text, record" :src="record.lunchImg" />
                    <span slot="action" slot-scope="text, record">
                      <template>
                        <!-- 已经采纳的可以删除，未采纳的可以作废 -->
                        <a @click="handleEdit({ record, type: 2 })">删除</a>
                        <Confirm :title="title" :isShow="isShow" ref="confirm" @doDelete="deleteRow(record)" />
                      </template>
                    </span>
                  </CardHistory>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane loading="true" tab="协助打卡" key="5">
            <a-row>
              <a-col :xl="24" :lg="12" :md="12" :sm="24" :xs="24">
                <div v-if="activeKey === '5'">
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
                        label="补卡日期"
                        v-decorator="['AssistDate', { rules: [{ required: true, message: '请输入昨日早餐' }] }]"
                        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                      >
                        <a-date-picker @change="getDate" style="width:33.3vw" />
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
                          v-decorator="['file']"
                          :beforeUpload="beforeUpload"
                          :showUploadList="false"
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
                        <a-radio-group v-model="isExtraFood">
                          <a-radio :value="1">没有</a-radio>
                          <a-radio :value="2">有</a-radio>
                        </a-radio-group>
                        <a-textarea
                          v-if="isExtraFood == 2"
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
                        <a-select
                          defaultValue="22:00~23:00"
                          style="width:33.33vw"
                          placeholder="请选择睡眠时间"
                          v-decorator="['sleepTime', { rules: [{ required: true, message: '请选择睡眠时间' }] }]"
                        >
                          <a-select-option value="0:00~1:00">0:00~1:00</a-select-option>
                          <a-select-option value="1:00~2:00">1:00~2:00</a-select-option>
                          <a-select-option value="2:00~3:00">2:00~3:00</a-select-option>
                          <a-select-option value="3:00~4:00">3:00~4:00</a-select-option>
                          <a-select-option value="4:00~5:00">4:00~5:00</a-select-option>
                          <a-select-option value="5:00~6:00">5:00~6:00</a-select-option>
                          <a-select-option value="6:00~7:00">6:00~7:00</a-select-option>
                          <a-select-option value="7:00~8:00">7:00~8:00</a-select-option>
                          <a-select-option value="8:00~9:00">8:00~9:00</a-select-option>
                          <a-select-option value="9:00~10:00">9:00~10:00</a-select-option>
                          <a-select-option value="10:00~11:00">10:00~11:00</a-select-option>
                          <a-select-option value="11:00~12:00">11:00~12:00</a-select-option>
                          <a-select-option value="12:00~13:00">12:00~13:00</a-select-option>
                          <a-select-option value="13:00~14:00">13:00~14:00</a-select-option>
                          <a-select-option value="14:00~15:00">14:00~15:00</a-select-option>
                          <a-select-option value="15:00~16:00">15:00~16:00</a-select-option>
                          <a-select-option value="16:00~17:00">16:00~17:00</a-select-option>
                          <a-select-option value="17:00~18:00">17:00~18:00</a-select-option>
                          <a-select-option value="18:00~19:00">18:00~19:00</a-select-option>
                          <a-select-option value="19:00~20:00">19:00~20:00</a-select-option>
                          <a-select-option value="20:00~21:00">20:00~21:00</a-select-option>
                          <a-select-option value="21:00~22:00">21:00~22:00</a-select-option>
                          <a-select-option value="22:00~23:00">22:00~23:00</a-select-option>
                        </a-select>
                      </a-form-item>
                      <a-form-item
                        label="饮水量"
                        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                      >
                        <a-input
                          v-decorator="['water', { rules: [{ required: true, message: '请输入饮水量' }] }]"
                          name="water"
                          placeholder="请输入饮水量(L)"
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
                      </a-form-item>
                    </a-form>
                  </a-card>
                </div>
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
import dateFormater from '@/utils/dateFormater'
import { mapState } from 'vuex'
import HeadInfo from '@/components/tools/HeadInfo'
import FormModal from './components/modal/FormModal'
import CardHistory from './components/table/CardHistoryList'
import { PageView } from '@/layouts'
import DetailList from '@/components/tools/DetailList'
import InitModal from './components/config-food/InitModal'
import ConfigFoodTable from './components/config-food/ConfigFoodTable'
import CustomerAvoid from './components/table/CustomerAvoid'
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
import {
  getDeployHistory,
  getCardHistory,
  getUserInfo,
  getBMI,
  getMecumery,
  getWeight,
  getDingList,
  getDietList,
  ding,
  dingImg,
  deleteDiet,
  deleteDing
} from '@/api/manage'
import LoginVue from '../user/Login.vue'
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

const formatter = val => {
  return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''
}

export default {
  name: 'Analysis',
  mixins: [mixinDevice],
  components: {
    CustomerAvoid,
    ConfigFoodTable,
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
      activeKey: '1',
      dingDate: '',
      uploadList: [],
      isShow: true,
      title: '',
      usertails: [],
      bmi: [],
      mecumery: [],
      weight: [],
      dinglist: [],
      getdietlist: [],
      ConfigFoodStep: {},
      resParams: {},
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
      isExtraFood: 1, // 是否加餐
      form: this.$form.createForm(this),
      cardHistoryColumns: [
        {
          title: '编号',
          dataIndex: 'id'
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
          title: '打卡日期',
          dataIndex: 'dingTime'
        },
        {
          title: '是否排便',
          dataIndex: 'isDefecate',
          customRender: val => {
            return val === 'right' ? '是' : '否'
          }
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
          dataIndex: 'lunchImg',
          scopedSlots: { customRender: 'pic' }
        },
        {
          title: '昨日晚餐',
          dataIndex: 'yesterdayDinner'
        },
        {
          title: '是否宵夜',
          dataIndex: 'isNightSnack',
          customRender: val => {
            return val === 'right' ? '是' : '否'
          }
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
        },
        {
          title: '操作',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: this.getData(),
      loadCardHistory: parameter => {
        const params = { pageIndex: parameter.pageNo, pageSize: parameter.pageSize, oid: this.$route.params.id }
        return getDingList(params).then(res => {
          if (res.success) {
            let list = res.response.dingList.data
            let temp = []
            Object.assign(temp, list)
            let arr = []
            for (let i = 0; i < temp.length; i++) {
              let obj = {}
              obj['id'] = temp[i].id
              obj['firstAnswerGuid'] = temp[i].firstAnswerGuid
              obj['dingTime'] = temp[i].dingTime
              for (let j = 0; j < temp[i].dingList.length; j++) {
                if (temp[i].dingList[j].question === '午餐拍照') {
                  temp[i].dingList[j].answer = JSON.parse(temp[i].dingList[j].answer)[0]
                }
                obj[this.getKey(temp[i].dingList[j].question)] = temp[i].dingList[j].answer
              }
              arr.push(obj)
            }
            Object.assign(res.response.dingList.data, arr)
            return res.response.dingList
          } else {
            return {
              pageIndex: 1,
              pageSize: 10,
              dataCount: 0,
              pageCount: 0,
              data: []
            }
          }
        })
      },
      configFoodColumns: [
        {
          title: '配餐',
          dataIndex: 'id'
        },
        {
          title: '早餐',
          dataIndex: 'Breakfast',
          customRender: val => {
            return this.splitStr(val, 'Breakfast')
          }
        },
        {
          title: '午餐',
          dataIndex: 'Lunch',
          customRender: val => {
            return this.splitStr(val, 'Lunch')
          }
        },
        {
          title: '晚餐',
          dataIndex: 'Dinner',
          customRender: val => {
            return this.splitStr(val, 'Dinner')
          }
        },
        {
          title: '配餐人',
          dataIndex: 'supporterName'
        },
        {
          title: '配餐状态',
          dataIndex: 'statusDescription'
        },
        {
          title: '日期',
          dataIndex: 'latOperateTime',
          scopedSlots: { customRender: 'latOperateTime' },
          render: this.formatter
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '150px',
          scopedSlots: { customRender: 'action' }
        }
      ],
      teams: [],
      radarLoading: true,
      radarData: [],
      user: {},
      timeFix: timeFix(),
      loading: true,
      rankList,
      // 搜索用户数
      searchUserData,
      searchUserScale,
      searchData,
      barData,
      barData2,
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
    setActiveKey(key) {
      this.$store.dispatch('changeActiveKey', key)
      this.activeKey = key
    },
    getDate(date, dateString) {
      this.dingDate = dateString
    },
    getData() {
      return parameter => {
        const params = { pageIndex: parameter.pageNo, pageSize: parameter.pageSize, oid: this.$route.params.id }
        return getDietList(params).then(res => {
          if (res.success) {
            let temp = {}
            Object.assign(temp, res.response)
            for (let i = 0; i < temp.dietList.data.length; i++) {
              let diets = JSON.parse(temp.dietList.data[i].currentDiet).mealList
              temp.dietList.data[i].latOperateTime = moment(temp.dietList.data[i].latOperateTime).format(
                // 日期转化
                'YYYY-MM-DD HH:mm:ss'
              )
              for (let j = 0; j < diets.length; j++) {
                temp.dietList.data[i][diets[j].name] = diets[j].food
              }
            }

            return res.response.dietList
          } else {
            return {
              pageIndex: 1,
              pageSize: 10,
              dataCount: 0,
              pageCount: 0,
              data: []
            }
          }
        })
      }
    },
    splitStr(val, type) {
      let strArr = val.split('}')
      let temp = []
      for (let i = 0; i < strArr.length - 1; i++) {
        strArr[i] += '}'
        if (strArr[i].charAt(0) === ',') {
          strArr[i] = strArr[i].substr(1)
        }
        temp.push(JSON.parse(strArr[i]))
      }
      let resStr = ''
      for (let i = 0; i < temp.length; i++) {
        switch (type) {
          case 'Breakfast':
            resStr += temp[i].Breakfast + ','
            break
          case 'Lunch':
            resStr += temp[i].Lunch + ','
            break
          case 'Dinner':
            resStr += temp[i].Dinner + ','
            break
          default:
            break
        }
      }
      return resStr.substring(0, resStr.length - 1)
    },
    getKey(val) {
      switch (val) {
        case 'id':
          return 'id'
          break
        case '请输入您的身高（CM）':
          return 'height'
          break
        case '请输入今日体重（KG）':
          return 'weight'
          break
        case '请输入您的年龄':
          return 'age'
          break
        case '排便后称重':
          return 'isDefecate'
          break
        case '昨日早餐':
          return 'yesterdayBreakfirst'
          break
        case '昨日午餐':
          return 'yesterdayLunch'
          break
        case '午餐拍照':
          return 'lunchImg'
          break
        case '昨日晚餐':
          return 'yesterdayDinner'
          break
        case '有加餐吗？':
          return 'isNightSnack'
          break
        case '加餐内容':
          return 'nightSnack'
          break
        case '入睡时间':
          return 'sleepTime'
          break
        case '饮水量（ML）':
          return 'water'
          break
        case '喝了多少颗小红杯':
          return 'cup'
          break
        default:
      }
    },
    getCurrent(step) {
      this.resParams = step.resParams
      this.ConfigFoodStep = step.stepData
    },
    handleEdit(param) {
      param.type == 1 ? (this.title = '删除配餐记录') : (this.title = '删除打卡记录')
      this.$refs.confirm.showModal()
    },
    deleteRow(data) {
      deleteDing({ firstAnswerGuid: data.firstAnswerGuid }).then(res => {
        if (res.success) {
          setTimeout(() => {
            this.$notification.success({
              message: res.message
            })
            this.activeKey = '0'
            this.$nextTick(() => {
              this.activeKey = '4'
            })
          }, 1000)
        } else {
          this.$notification['error']({
            message: '错误:',
            description: res.message + res.response,
            duration: 4
          })
        }
      })
      this.isShow = false
    },
    openInvalidModal(rowData) {
      this.$refs.modal.openModal(rowData)
    },
    handleOk(params) {
      let param = {
        oid: params.id,
        discardReason: params.cause,
        lastOperateOid: this.$store.state.userInfo.oid,
        dislikeList: params.dislike
      }
      deleteDiet(param).then(res => {
        if (res.success) {
          setTimeout(() => {
            this.$notification.success({
              message: res.message
            })
            this.activeKey = '0'
            this.$nextTick(() => {
              this.activeKey = '1'
            })
          }, 1000)
        } else {
          this.$notification['error']({
            message: '错误:',
            description: res.message + res.response,
            duration: 4
          })
        }
      })
      this.$refs.modal.closeModal()
    },
    beforeUpload(file) {
      const reader = new FileReader()
      // 把Array Buffer转化为blob 如果是base64不需要
      // 转化为base64
      reader.readAsDataURL(file)
      reader.onload = () => {
        this.options.img = reader.result
        this.uploadList.push(encodeURIComponent(this.options.img))
      }

      // 转化为blob
      // reader.readAsArrayBuffer(file)

      return false
    },
    setParams(values, imgArr) {
      let resArr = []
      const guid = {
        heightGuid: 'B180EAC0-127D-4ECB-BDB6-C2599D310BD4',
        weigtGuid: 'A9F3D741-A83D-40E9-A108-89F7FC743384',
        ageGuid: '39D4C746-53FC-44A9-8C93-4FF5AC2992B9',
        isToiletGuid: 'BC66AA2E-39E7-4725-BBB3-B32647D647A7',
        breakfast: '0C5AE0D5-79E4-4B3F-BCEA-AB829B10B8B9',
        lunch: '70E6739C-D888-4F40-9327-116AED7BFF83',
        file: 'B4C843BC-9EDF-4DD9-9119-B90CA0F0612B',
        dinner: '47522713-0697-443E-8799-48255AEF4AE4',
        isExtraFood: '7E074CB7-0C50-485C-8B9F-8C7FD0456CA0',
        extraFood: 'F5E6D750-1C45-4D73-AD0C-65A04BDAA212',
        sleepTime: '79704935-D89B-4469-AAA6-6D9039A21DF9',
        water: '83246766-A71C-4ABA-8770-8C761BBD0390',
        number: '99E3373A-6886-47CC-8364-94031A69EF42',
        Conclusion: 'E3159227-6EC9-49C4-B22E-CC77E5256636'
      }

      for (let key in values) {
        switch (key) {
          case 'weight':
            resArr.push({ questionOID: guid.weigtGuid, answerContent: values[key] })
            break
          case 'height':
            resArr.push({ questionOID: guid.heightGuid, answerContent: values[key] })
            break
          case 'breakfast':
            resArr.push({ questionOID: guid.breakfast, answerContent: values[key] })
            break
          case 'lunch':
            resArr.push({ questionOID: guid.lunch, answerContent: values[key] })
            break
          case 'file':
            resArr.push({
              questionOID: guid.file,
              answerContent: JSON.stringify(imgArr)
            })
            break
          case 'dinner':
            resArr.push({ questionOID: guid.dinner, answerContent: values[key] })
            break
          case 'sleepTime':
            resArr.push({ questionOID: guid.sleepTime, answerContent: values[key] })
            break
          case 'water':
            resArr.push({ questionOID: guid.water, answerContent: values[key] })
            break
          case 'number':
            resArr.push({ questionOID: guid.number, answerContent: values[key] })
            break
        }
      }
      resArr.push({ questionOID: guid.Conclusion, answerContent: '知道了' })
      resArr.push({
        questionOID: guid.isExtraFood,
        answerContent: this.extraFood === 1 ? '否' : '是'
      })
      this.isExtraFood != 1
        ? resArr.push({
            questionOID: guid.extraFood,
            answerContent: values.extraFood
          })
        : ''
      resArr.push({ questionOID: guid.isToiletGuid, answerContent: this.toilet === 1 ? '是' : '否' })
      let param = {
        customerOid: this.$route.params.id,
        supporterOid: this.$store.state.userInfo.oid,
        AssistDate: this.dingDate,
        assistDing: resArr
      }

      ding(JSON.stringify(param)).then(res => {
        if (res.success) {
          setTimeout(() => {
            this.$notification.success({
              message: res.message
            })
            this.$store.dispatch('changeActiveKey', '4')
          }, 1000)
        } else {
          this.$notification['error']({
            message: '错误',
            description: ((err.response || {}).data || {}).message,
            duration: 4
          })
        }
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          dingImg(JSON.stringify({ Base64Pic: this.uploadList })).then(res => {
            let imgArr = []
            if (res.success) {
              imgArr.push(res.response.dingPicList[0].remoteOid)
              setTimeout(() => {
                this.$notification.success({
                  message: res.message
                })
              }, 1000)
              this.setParams(values, imgArr)
            }
          })
        }
      })
    },
    initRadar() {
      const dv = new DataSet.View().source(this.mecumery)
      dv.transform({
        type: 'fold',
        fields: [
          '阳虚质',
          '阴虚质',
          '痰湿质',
          '气虚质',
          '湿热质',
          '血瘀质',
          '气郁质',
          '特禀质',
          '平和质',
          '倾向阳虚质',
          '倾向阴虚质',
          '倾向痰湿质',
          '倾向气虚质',
          '倾向湿热质',
          '倾向血瘀质',
          '倾向气郁质',
          '倾向特禀质',
          '倾向平和质'
        ],
        key: 'user',
        value: 'score'
      })
      this.radarData = dv.rows
    }
  },
  mounted() {
    getUserInfo(this.$route.params.id).then(res => {
      console.log('多出了字段', res.response)

      res.success ? (this.usertails = res.response) : ''
    })
    getBMI(this.$route.params.id).then(res => {
      let temp = res.response.bmiList
      let resArr = []
      if (res.success) {
        for (let i = 0; i < temp.length; i++) {
          let tempObj = {}
          tempObj.year = moment(temp[i].recordTime).format('YYYYMMDD')
          tempObj.value = temp[i].bmi
          resArr.push(tempObj)
        }
        this.bmi = resArr
      }
    })
    getMecumery(this.$route.params.id).then(res => {
      // this.radarLoading = true

      if (res.success) {
        let temp = []
        let data = res.response.customerPhysique.physique
        for (let i = 0; i < data.length; i++) {
          let obj = {}
          obj.item = data[i].title
          obj[data[i].title] = parseFloat(parseFloat(data[i].currentCent).toFixed(2))
          temp.push(obj)
        }
        this.mecumery = temp

        this.initRadar()
      }
      // this.radarLoading = false
    })
    getWeight(this.$route.params.id).then(res => {
      let temp = res.response.weightList
      let resArr = []
      if (res.success) {
        for (let i = 0; i < temp.length; i++) {
          let tempObj = {}
          tempObj.year = moment(temp[i].recordTime).format('YYYYMMDD')
          tempObj.value = temp[i].weight
          resArr.push(tempObj)
        }
        this.weight = resArr
      }

      console.log('拿到体重列表', this.weight)
    })
  },
  created() {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  computed: {
    getActiveKey() {
      console.log('变没变', this.$store.getters.getActiveKey)
      this.activeKey = this.$store.getters.getActiveKey

      return this.$store.getters.getActiveKey
    },
    userInfo() {
      return this.$store.state.userInfo
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
