<template>
  <div class="page-header-index-wide">
    <div id="fixed" v-if="jump && (getActiveKey === '5' || getActiveKey === '2')"></div>
    <page-view :avatar="avatar" :title="false">
      <detail-list slot="headerContent" size="small" :col="2" class="detail-layout">
        <detail-list-item
          v-for="item in Object.keys(usertails).filter(
            res =>
              res != 'oid' &&
              res != 'age' &&
              res != 'initWeight' &&
              res != 'city' &&
              res != 'serviceName' &&
              res != 'initHeight' &&
              res != 'serviceOid'
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
          }}</detail-list-item
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
      <div class="salesCard" id="anchor" style="min-height: 400px;">
        <a-tabs
          @change="setActiveKey"
          :activeKey="getActiveKey"
          size="large"
          :tab-bar-style="{ marginBottom: '24px', paddingLeft: '16px' }"
        >
          <div class="extra-wrapper" slot="tabBarExtraContent"></div>
          <a-tab-pane tab="配餐历史" key="1">
            <a-row>
              <a-col :xl="24" :lg="12" :md="12" :sm="24" :xs="24">
                <div v-if="getActiveKey === '1'">
                  <ImportConfigFood
                    @setImportVisible="setImportVisible"
                    :userDetail="usertails"
                    :tb="tableList"
                    :isShow="importShow"
                    :isReExport="isReExport"
                  />
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
                        |
                        <a @click="reExportConfig(record)">导出</a>
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
                <div v-if="getActiveKey === '2'" style="height:490px; position: relative; top:0; left:0">
                  <InitModal @currentStep="getCurrent" />
                  <ConfigFoodTable
                    v-if="ConfigFoodStep.step === 2"
                    :userDetail="usertails"
                    :resParams="this.resParams"
                    :step="ConfigFoodStep"
                    @setActiveKey="setActiveKey"
                  />
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane a-tab-pane loading="true" tab="客户忌口" key="3">
            <a-row>
              <a-col :xl="24" :lg="12" :md="12" :sm="24" :xs="24">
                <div v-if="getActiveKey === '3'" style=" position: relative; top:0; left:0">
                  <CustomerAvoid />
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
          <a-tab-pane loading="true" tab="打卡历史" key="4">
            <a-row>
              <a-col :xl="24" :lg="12" :md="12" :sm="24" :xs="24">
                <div style="min-height: 400px;" v-if="getActiveKey === '4'">
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
                <div v-if="getActiveKey === '5'">
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
                        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                      >
                        <a-date-picker
                          @change="getDate"
                          style="width:33.3vw"
                          v-decorator="['AssistDate', { rules: [{ required: true, message: '请选择补卡日期' }] }]"
                        />
                      </a-form-item>
                      <a-form-item
                        label="是否排便后称重"
                        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                        :required="false"
                      >
                        <a-radio-group v-model="toilet">
                          <a-radio :value="1">否</a-radio>
                          <a-radio :value="2">是</a-radio>
                        </a-radio-group>
                      </a-form-item>
                      <a-form-item
                        label="昨日早餐 "
                        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                      >
                        <a-textarea rows="3" placeholder="请输入昨日早餐" v-decorator="['breakfast']" />
                      </a-form-item>
                      <a-form-item
                        label="昨日午餐"
                        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                      >
                        <a-textarea rows="3" placeholder="请输入昨日午餐" v-decorator="['lunch']" />
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
                        <a-textarea rows="3" placeholder="请输入昨日晚餐" v-decorator="['dinner']" />
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
                          v-decorator="['extraFood']"
                        />
                      </a-form-item>
                      <a-form-item
                        label="饮水量"
                        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                      >
                        <a-input v-decorator="['water']" name="water" placeholder="请输入饮水量(杯)" />
                      </a-form-item>
                      <a-form-item
                        label="喝了多少小红杯"
                        :labelCol="{ lg: { span: 7 }, sm: { span: 7 } }"
                        :wrapperCol="{ lg: { span: 10 }, sm: { span: 17 } }"
                      >
                        <a-input v-decorator="['number']" name="number" placeholder="请输入小红杯食用数量(杯)" />
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
import ImportConfigFood from './components/config-food/ImportConfig'
import $ from 'jquery'
import { timeFix } from '@/utils/util'
import dateFormater from '@/utils/dateFormater'
import { mapState } from 'vuex'
import FormModal from './components/modal/FormModal'
import CardHistory from './components/table/CardHistoryList'
import { PageView } from '@/layouts'
import DetailList from '@/components/tools/DetailList'
import InitModal from './components/config-food/InitModal'
import ConfigFoodTable from './components/config-food/ConfigFoodTable'
import CustomerAvoid from './components/table/CustomerAvoid'
import { Confirm, STable, LineChart, Bar, Radar } from '@/components'
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

const DataSet = require('@antv/data-set')

const formatter = val => {
  return val ? moment(val).format('YYYY-MM-DD HH:mm:ss') : ''
}

export default {
  name: 'Analysis',
  components: {
    ImportConfigFood,
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
    Bar,
    PageView,
    LineChart
  },
  data() {
    return {
      isReExport: false,
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
      importShow: false,
      jump: false,
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
          dataIndex: 'lunchImg',
          scopedSlots: { customRender: 'pic' }
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
      // 搜索用户数
      searchUserData,
      searchUserScale,
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
    setImportVisible(visible) {
      // 重新导出完成后置空
      if (!visible) {
        this.tableList = {
          breakfastP: [],
          breakfastF: [],
          breakfastC: [],
          lunchP: [],
          lunchF: [],
          lunchC: [],
          dinnerP: [],
          dinnerF: [],
          dinnerC: []
        }
      }

      this.isReExport = visible // 重复导出
      this.importShow = visible
    },
    // 重新导出功能
    reExportConfig(record) {
      // 早餐
      let bfs = []
      for (let i = 0; i < record.Breakfast.split('}').length; i++) {
        bfs.push(i === 0 ? record.Breakfast.split('}')[i] + '}' : record.Breakfast.split('}')[i].substring(1) + '}')
      }
      bfs = bfs.splice(0, bfs.length - 1)
      for (let i = 0; i < bfs.length; i++) {
        console.log('早餐咋了？', bfs)

        let name = bfs[i]
          .split(',')[0]
          .split(':')[1]
          .split('"')[1]
          .split('(')[0]
        let value = bfs[i]
          .split(',')[0]
          .split(':')[1]
          .split('"')[1]
          .split('(')
        if (value.length > 2) {
          value = value[2].split('g')[0]
        } else {
          value = value[1].split('g')[0]
        }
        this.tableList.breakfastP.push({ name, value })
      }
      // 午餐
      let lunch = []
      for (let i = 0; i < record.Lunch.split('}').length; i++) {
        lunch.push(i === 0 ? record.Lunch.split('}')[i] + '}' : record.Lunch.split('}')[i].substring(1) + '}')
      }
      lunch = lunch.splice(0, lunch.length - 1)
      for (let i = 0; i < lunch.length; i++) {
        console.log('午餐咋了？', lunch)
        let name = lunch[i]
          .split(',')[0]
          .split(':')[1]
          .split('"')[1]
          .split('(')[0]
        let value = lunch[i]
          .split(',')[0]
          .split(':')[1]
          .split('"')[1]
          .split('(')
        if (value.length > 2) {
          value = value[2].split('g')[0]
        } else {
          value = value[1].split('g')[0]
        }
        this.tableList.lunchP.push({ name, value })
      }
      // 晚餐
      let dinner = []
      for (let i = 0; i < record.Dinner.split('}').length; i++) {
        dinner.push(i === 0 ? record.Dinner.split('}')[i] + '}' : record.Dinner.split('}')[i].substring(1) + '}')
      }
      dinner = dinner.splice(0, dinner.length - 1)
      for (let i = 0; i < dinner.length; i++) {
        let name = bfs[i]
          .split(',')[0]
          .split(':')[1]
          .split('"')[1]
          .split('(')[0]
        let value = bfs[i]
          .split(',')[0]
          .split(':')[1]
          .split('"')[1]
          .split('(')
        if (value.length > 2) {
          value = value[2].split('g')[0]
        } else {
          value = value[1].split('g')[0]
        }
        this.tableList.dinnerP.push({ name, value })
      }
      this.isReExport = true
      this.importShow = true
    },
    setActiveKey(key) {
      // this.activeKey = key
      this.$store.dispatch('changeActiveKey', key)
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
      param.type == 1 ? (this.title = '删除配餐记录') : (this.title = '打卡记录')
      this.$refs.confirm.showModal()
    },
    deleteRow(data) {
      deleteDing({ firstAnswerGuid: data.firstAnswerGuid }).then(res => {
        if (res.success) {
          setTimeout(() => {
            this.$notification.success({
              message: res.message
            })
            this.$store.dispatch('changeActiveKey', '1')
            this.$nextTick(() => {
              this.$store.dispatch('changeActiveKey', '4')
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
            this.$store.dispatch('changeActiveKey', '0')
            this.$nextTick(() => {
              this.$store.dispatch('changeActiveKey', '1')
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
        answerContent: this.isExtraFood == 1 ? '否' : '是'
      })
      this.isExtraFood != 1
        ? resArr.push({
            questionOID: guid.extraFood,
            answerContent: values.extraFood
          })
        : ''
      resArr.push({ questionOID: guid.isToiletGuid, answerContent: this.toilet == 1 ? '否' : '是' })
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
            this.$store.commit('resetTodoCount', true)
            this.toilet = 1 // 初始化选项
            this.isExtraFood = 1
            this.uploadList = []
          }, 1000)
        } else {
          this.$notification['error']({
            message: '错误',
            description: res.response,
            duration: 4
          })
        }
      })
    },
    async handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields(async (err, values) => {
        if (!err) {
          let imgArr = []
          console.log('有图了吧', this.uploadList.length)
          if (this.uploadList.length > 0) {
            await dingImg(JSON.stringify({ Base64Pic: this.uploadList })).then(res => {
              if (res.success) {
                console.log('A')
                imgArr.push(res.response.dingPicList[0].remoteOid)
                setTimeout(() => {
                  this.$notification.success({
                    message: res.message
                  })
                }, 1000)
              } else {
                this.$notification['error']({
                  message: '错误',
                  description: res.response,
                  duration: 4
                })
              }
            })
          }
          console.log('BBB')

          await this.setParams(values, imgArr)
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
    // this.$store.commit('setIntoStatus', 0)
    this.$store.dispatch('changeActiveKey', '1')
    if (this.$store.state.into === 1) {
      this.jump = true
      this.$nextTick(() => {
        setTimeout(() => {
          $('html,body').animate({ scrollTop: 800 }, 1600)
        }, 500)

        this.$store.dispatch('changeActiveKey', '5')
        this.jump = false
        this.$store.commit('setIntoStatus', 0)
      })
    }

    if (this.$store.state.into === 2) {
      this.jump = true
      this.$nextTick(() => {
        setTimeout(() => {
          $('html,body').animate({ scrollTop: 800 }, 1600)
        }, 800)

        this.$store.dispatch('changeActiveKey', '5')
        this.jump = false
        this.$store.commit('setIntoStatus', 0)
      })
    }

    if (this.$store.state.into === 3) {
      this.jump = true
      this.$nextTick(() => {
        setTimeout(() => {
          $('html,body').animate({ scrollTop: 800 }, 1600)
        }, 800)

        this.$store.dispatch('changeActiveKey', '2')
        this.jump = false
        this.$store.commit('setIntoStatus', 0)
      })
    }

    if (this.$store.state.into === 4) {
      this.jump = true
      this.$nextTick(() => {
        setTimeout(() => {
          $('html,body').animate({ scrollTop: 800 }, 1600)
        }, 800)

        this.$store.dispatch('changeActiveKey', '2')
        this.jump = false
        this.$store.commit('setIntoStatus', 0)
      })
    }

    getUserInfo(this.$route.params.id).then(res => {
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
    })
  },
  created() {
    this.user = this.userInfo
    this.avatar = this.userInfo.avatar
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  watch: {
    setIntoStatus(val) {
      if (val == 1 || val == 3) {
        // 跳转
        this.$router.push(`/customer/blank/${this.$store.state.toduUser.userOid}`)
      }
    }
  },
  computed: {
    setIntoStatus() {
      return this.$store.getters.setIntoStatus
    },
    getActiveKey() {
      return this.$store.getters.getActiveKey
    },
    userInfo() {
      return this.$store.state.userInfo
    }
  }
}
</script>

<style lang="less" scoped>
#fixed {
  z-index: 999;
  width: 5%;
  height: 10px;
  background-color: red;
  position: absolute;
  top: 160%;
  left: 60%;
}
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
