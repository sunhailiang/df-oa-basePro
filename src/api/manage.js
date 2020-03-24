import { axios } from '@/utils/request'
import get from 'lodash.get'

const api = {
  user: '/user',
  role: '/role',
  service: '/CustomerList', // 客户列表
  serviceCondition: '/CustomerList/Condition', // 条件检索
  originalCustomer: '/Customer/OriginalCustomer/', // 检索指定客户
  agenterList: '/AgenterList', // 代理列表
  selectAgenterList: '/AgenterList/', //{agenterName} 查询代理列表
  supporterList: '/SupporterList', // 客服列表
  serviceList: '/ServiceList', // 服务列表
  customer: '/Customer/', // 获取客户信息+/{oid}
  bmi: '/Customer/BMIList/', // {oid} 获取用户的bmi
  mecumery: '/Customer/Physique/', //{oid} 获取用户的体质结果
  weight: '/Customer/WeightList/', //{oid} 获取用户体重
  dinglist: '/DingList/', //{oid} 获取打卡列表
  ding: '/Ding', //打卡
  dingImg: '/Ding/UploadBase64/Pic', // 上传打卡图片
  dietlist: '/DietList/', //{Oid} 食谱列表
  dailyEnergy: '/Customer/DailyEnergy/', // 获取配餐当前总能量
  componentPercentage: '/CompoundFood/ComponentPercentage', // 获取三大营养素比例
  dailyFoodComponent: '/CompoundFood/DailyFoodComponent/', // 推荐九宫格数据
  compoundFood: '/CompoundFood/Recommend/', // 获取推荐食材
  addDiet: '/Diet', // 新增配餐记录
  deleteDiet: '/Diet/Delete', // 删除一条配餐记录
  deleteDing: '/Ding/Delete', // 删除一条打卡记录
  getFoodList: '/FoodList/Condition/', //{oid}/{foodName} 获取带喜好标志的食物列表
  getDislikeFood: '/FoodList/Dislike/', // 获取用户不喜欢的食材列表 {oid}
  addDislike: '/FoodList/Dislike', // 新增不喜欢食材
  dislikeDelete: '/FoodList/Dislike/Delete', //删除不喜欢的食材
  todoDietList: '/Supporter/TodoDietList/', //指定客服指定日期的配餐代办事项 {supporterOid}/{dateTime}
  todoDietListCount: '/Supporter/TodoDietListCount/', //指定客服的指定日期待配餐总数{supporterOid}/{dateTime}
  todoDingList: '/Supporter/TodoDingList/', //指定客服指定日期的打卡代办事项 {supporterOid}/{dateTime},
  todoDingListCount: '/Supporter/TodoDingListCount/', //指定客服指定日期的待带卡代办总数{supporterOid}/{dateTime}
  isVip: '/Customer/IsVIP/', //{cellphone} 判断是否是vip -- 小程序
  dingToday: '/Ding/Today/', //{customerOid}判断用户是否可以执行打卡--小程序
  customerDing: '/Ding/Customer', // 新增用户打卡 --小程序
  weightList: '/Customer/Customer/WeightList/', //{oid}' 获取用户体重--小程序
  mecuryToday: '/Customer/Physique/Today/', //{cellphone} 今天是否可以做体质测试
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree',
  cardhistory: '/cardhistory'
  // recommendrandom: '/recommendrandom'
}

export default api

export function mecuryToday(parameter) {
  return axios({
    url: api.mecuryToday + parameter,
    method: 'get'
  })
}
export function weightList(parameter) {
  //获取体重列表--小程序
  return axios({
    url: api.weightList + parameter.oid,
    method: 'get',
    params: { dataCount: parameter.dataCount }
  })
}

export function customerDing(parameter) {
  // 客户打卡--小程序
  return axios({
    url: api.customerDing,
    method: 'post',
    data: parameter
  })
}
export function dingToday(parameter) {
  // 判断是否可以今日打卡 -- 小程序
  return axios({
    url: api.dingToday + parameter,
    method: 'get'
  })
}

export function isVip(parameter) {
  // 判断是否是vip--小程序
  return axios({
    url: api.isVip + parameter,
    method: 'get'
  })
}
export function selectAgenterList(parameter) {
  // 检索代理列表
  return axios({
    url: api.selectAgenterList + parameter,
    method: 'get'
  })
}

export function todoDietList(parameter) {
  //待办配餐列表
  return axios({
    url: api.todoDietList + parameter.oid + '/' + parameter.dateTime,
    method: 'get'
  })
}
export function todoDietListCount(parameter) {
  //待办配餐总数
  return axios({
    url: api.todoDietListCount + parameter.oid + '/' + parameter.dateTime,
    method: 'get'
  })
}
export function todoDingList(parameter) {
  //待办打卡列表
  return axios({
    url: api.todoDingList + parameter.oid + '/' + parameter.dateTime,
    method: 'get'
  })
}
export function todoDingListCount(parameter) {
  //待办打卡列表总数
  return axios({
    url: api.todoDingListCount + parameter.oid + '/' + parameter.dateTime,
    method: 'get'
  })
}
export function deleteDislikeFood(parameter) {
  // 删除不喜欢食材
  return axios({
    url: api.dislikeDelete,
    method: 'post',
    data: parameter
  })
}
export function addDislike(parameter) {
  //添加不喜欢的食材
  return axios({
    url: api.addDislike,
    method: 'post',
    data: parameter
  })
}
export function getDislikeFood(parameter) {
  // 获取用户不喜欢的食物列表
  return axios({
    url: api.getDislikeFood + parameter.oid,
    method: 'get',
    params: {
      pageIndex: parameter.pageIndex,
      pageSize: parameter.pageSize
    }
  })
}
export function getFoodList(parameter) {
  //获取带标识的食材列表
  return axios({
    url: api.getFoodList + parameter.oid + '/' + parameter.foodName,
    method: 'get',
    params: {
      pageIndex: parameter.pageIndex,
      pageSize: parameter.pageSize
    }
  })
}
export function deleteDing(parameter) {
  // 删除打卡记录
  return axios({
    url: api.deleteDing,
    method: 'post',
    data: parameter
  })
}
export function deleteDiet(parameter) {
  // 删除配餐记录
  return axios({
    url: api.deleteDiet,
    method: 'post',
    data: parameter
  })
}
export function ding(parameter) {
  // 代理打卡
  return axios({
    url: api.ding,
    method: 'post',
    data: parameter
  })
}
export function dingImg(parameter) {
  // 上传图片
  return axios({
    url: api.dingImg,
    method: 'post',
    data: parameter,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
}
export function addDiet(parameter) {
  // 添加配餐
  return axios({
    url: api.addDiet,
    method: 'post',
    data: JSON.stringify(parameter)
  })
}
export function getcompoundFood(parameter) {
  return axios({
    url: api.compoundFood + parameter.oid + '/' + parameter.NameCode + '/' + parameter.componentValue,
    methods: 'get'
  })
}
export function getdailyFoodComponent(parameter) {
  return axios({
    url: api.dailyFoodComponent + parameter.dailyEnergy,
    methods: 'get',
    params: { pValue: parameter.pValue, fValue: parameter.fValue, cValue: parameter.cValue }
  })
}
export function getComponentPercentage(parameter) {
  return axios({
    url: api.componentPercentage,
    methods: 'get'
  })
}
export function getDailyEnergy(parameter) {
  // 获取配餐总能量
  return axios({
    url: api.dailyEnergy + parameter,
    method: 'get'
  })
}
export function getUserInfo(parameter) {
  //获取客户信息
  return axios({
    url: api.customer + parameter,
    method: 'get'
  })
}
export function getBMI(parameter) {
  //获取用户的bmi
  return axios({
    url: api.bmi + parameter,
    method: 'get'
  })
}
export function getMecumery(parameter) {
  //获取用户的体质结果
  return axios({
    url: api.mecumery + parameter,
    method: 'get'
  })
}
export function getWeight(parameter) {
  //获取用户体重列表
  return axios({
    url: api.weight + parameter,
    method: 'get'
  })
}
export function getDingList(parameter) {
  // 获取打卡列表
  return axios({
    url: api.dinglist + parameter.oid,
    method: 'get',
    params: { pageIndex: parameter.pageIndex, pageSize: parameter.pageSize }
  })
}
export function getDietList(parameter) {
  // 配餐列表
  return axios({
    url: api.dietlist + parameter.oid,
    method: 'get',
    params: { pageIndex: parameter.pageIndex, pageSize: parameter.pageSize }
  })
}
export function addCustomer(parameter) {
  // 新增用户
  return axios({
    url: api.customer,
    method: 'post',
    data: JSON.stringify(parameter)
  })
}
export function getCustomer(parameter) {
  // 查询客户
  return axios({
    url: api.customer + '/' + params,
    method: 'get'
  })
}
export function agenterList() {
  //代理列表
  return axios({
    url: api.agenterList,
    method: 'get'
  })
}
export function supporterList() {
  //客服列表
  return axios({
    url: api.supporterList,
    method: 'get'
  })
}
export function serviceList() {
  //服务列表
  return axios({
    url: api.serviceList,
    method: 'get'
  })
}
export function getServiceList(parameter) {
  //获取用户列表
  return axios({
    url: api.service,
    method: 'get',
    params: parameter
  })
}
export function getServiceListCondition(parameter) {
  // 筛选用户列表
  return axios({
    url: api.serviceCondition,
    method: 'get',
    params: parameter
  })
}
export function originalCustomer(parameter) {
  // 筛选指定客户
  return axios({
    url: api.originalCustomer + parameter,
    method: 'get'
  })
}
// export function getRecommendRandom(parameter) {
//   return axios({
//     url: api.recommendrandom,
//     method: 'get',
//     params: parameter
//   })
// }

export function getUserList(parameter) {
  return axios({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getCardHistory(parameter) {
  return axios({
    url: api.cardhistory,
    method: 'get',
    params: parameter
  })
}

export function getRoleList(parameter) {
  return axios({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getPermissions(parameter) {
  return axios({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree(parameter) {
  return axios({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService(parameter) {
  return axios({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}
