import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'
import dateFormater from '@/utils/dateFormater'

const totalCount = 5701

const recommendRandom = options => {
  const nutritionType = options.nutritionType
  const weight = options.weight
  const result = []

  result.push({
    type: '蔬菜类',
    data: [
      { key: 1, foodName: '白菜', foodWeight: '178g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 2, foodName: '洋葱', foodWeight: '220g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 3, foodName: '茄子', foodWeight: '170g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 4, foodName: '芹菜', foodWeight: '380g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 5, foodName: '冬瓜', foodWeight: '200g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 6, foodName: '红薯', foodWeight: '170g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 7, foodName: '蒜苗', foodWeight: '320g', nutrient: { C: 9, F: 3, P: 2 } }
    ]
  })
  result.push({
    type: '水果类',
    data: [
      { key: 1, foodName: '西瓜', foodWeight: '500g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 2, foodName: '苹果', foodWeight: '220g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 3, foodName: '百香果', foodWeight: '170g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 4, foodName: '哈密瓜', foodWeight: '380g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 5, foodName: '猕猴桃', foodWeight: '200g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 6, foodName: '橙子', foodWeight: '170g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 7, foodName: '波罗蜜', foodWeight: '120g', nutrient: { C: 9, F: 3, P: 2 } }
    ]
  })
  result.push({
    type: '谷薯类',
    data: [
      { key: 1, foodName: '粳米', foodWeight: '500g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 2, foodName: '糯米', foodWeight: '220g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 3, foodName: '粟米', foodWeight: '170g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 4, foodName: '小麦', foodWeight: '380g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 5, foodName: '燕麦', foodWeight: '200g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 6, foodName: '荞麦', foodWeight: '170g', nutrient: { C: 9, F: 3, P: 2 } },
      { key: 7, foodName: '玉米', foodWeight: '320g', nutrient: { C: 9, F: 3, P: 2 } }
    ]
  })

  return result
}

const serverList = options => {
  const parameters = getQueryParameters(options)
  const result = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? totalCount % pageSize : pageSize) + 1

  for (let i = 1; i < next; i++) {
    const tmpKey = key + i
    result.push({
      key: tmpKey,
      id: tmpKey,
      no: tmpKey,
      customerName: '张女士',
      customerGender: '女',
      customerAge: 32,
      customerArea: '上海',
      customerCategory: '减肥',
      affiliation: '托塔天王',
      editable: false
    })
  }

  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    data: result
  })
}

const deployHistory = options => {
  const parameters = getQueryParameters(options)

  const result = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? totalCount % pageSize : pageSize) + 1

  for (let i = 1; i < next; i++) {
    const date = dateFormater('YYYY-mm-dd HH:MM', new Date())
    const tmpKey = key + i
    result.push({
      key: tmpKey,
      id: tmpKey,
      no: tmpKey,
      breakfast: '牛奶(100g),香蕉(220g),水煮蛋(80g),番薯(200g),芋头(80g),豆浆(200g)',
      lunch: '水果沙拉(300g),牛排(180g),米饭(240g),蔬菜(240g),瓜子(80g),西瓜(200g)',
      dinner: '烤鱼(150g),牛奶(250g),芒果(240g),红枣(80g),蜂蜜(200g)',
      operator: '胡博森',
      historyStatus: '已采纳',
      date,
      editable: false
    })
  }

  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    data: result
  })
}

const cardHistory = options => {
  const parameters = getQueryParameters(options)

  const result = []
  const pageNo = parseInt(parameters.pageNo)
  const pageSize = parseInt(parameters.pageSize)
  const totalPage = Math.ceil(totalCount / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? totalCount % pageSize : pageSize) + 1

  for (let i = 1; i < next; i++) {
    const date = dateFormater('YYYY-mm-dd HH:MM', new Date())
    const tmpKey = key + i
    result.push({
      key: tmpKey,
      id: tmpKey,
      no: tmpKey,
      weight: '56kg',
      height: '160cm',
      age: 30,
      isDefecate: 0,
      yesterdayBreakfirst: '香蕉一根，牛奶300ml,鸡蛋2个，牛肉100g',
      yesterdayLunch: '米饭300g,青菜300g,猪肉200g,水果250g',
      lunchImg: '@/assets/images/clara.png',
      yesterdayDinner: '米粥300g,玉米1根，鸡蛋2个',
      isNightSnack: 0,
      nightSnack: '炸鸡,牛奶',
      sleepTime: '21：00',
      water: '1500ml',
      cup: '6杯',
      date,
      editable: false
    })
  }

  return builder({
    pageSize: pageSize,
    pageNo: pageNo,
    totalCount: totalCount,
    totalPage: totalPage,
    data: result
  })
}

const projects = () => {
  return builder({
    data: [
      {
        id: 1,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png',
        title: 'Alipay',
        description: '那是一种内在的东西， 他们到达不了，也无法触及的',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      },
      {
        id: 2,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png',
        title: 'Angular',
        description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      },
      {
        id: 3,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png',
        title: 'Ant Design',
        description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      },
      {
        id: 4,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png',
        title: '滇峰生物',
        description: '那时候我只会想自己想要什么，从不想自己拥有什么',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      },
      {
        id: 5,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png',
        title: 'Bootstrap',
        description: '凛冬将至',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      },
      {
        id: 6,
        cover: 'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png',
        title: 'Vue',
        description: '生命就像一盒巧克力，结果往往出人意料',
        status: 1,
        updatedAt: '2018-07-26 00:00:00'
      }
    ],
    pageSize: 10,
    pageNo: 0,
    totalPage: 6,
    totalCount: 57
  })
}

const activity = () => {
  return builder([
    {
      id: 1,
      user: {
        nickname: '@name',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
      },
      project: {
        name: '白鹭酱油开发组',
        action: '更新',
        event: '番组计划'
      },
      time: '2018-08-23 14:47:00'
    },
    {
      id: 1,
      user: {
        nickname: '蓝莓酱',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png'
      },
      project: {
        name: '白鹭酱油开发组',
        action: '更新',
        event: '番组计划'
      },
      time: '2018-08-23 09:35:37'
    },
    {
      id: 1,
      user: {
        nickname: '@name',
        avatar: '@image(64x64)'
      },
      project: {
        name: '白鹭酱油开发组',
        action: '创建',
        event: '番组计划'
      },
      time: '2017-05-27 00:00:00'
    },
    {
      id: 1,
      user: {
        nickname: '曲丽丽',
        avatar: '@image(64x64)'
      },
      project: {
        name: '高逼格设计天团',
        action: '更新',
        event: '六月迭代'
      },
      time: '2018-08-23 14:47:00'
    },
    {
      id: 1,
      user: {
        nickname: '@name',
        avatar: '@image(64x64)'
      },
      project: {
        name: '高逼格设计天团',
        action: 'created',
        event: '六月迭代'
      },
      time: '2018-08-23 14:47:00'
    },
    {
      id: 1,
      user: {
        nickname: '曲丽丽',
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
      },
      project: {
        name: '高逼格设计天团',
        action: 'created',
        event: '六月迭代'
      },
      time: '2018-08-23 14:47:00'
    }
  ])
}

const teams = () => {
  return builder([
    {
      id: 1,
      name: '科学搬砖组',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png'
    },
    {
      id: 2,
      name: '程序员日常',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png'
    },
    {
      id: 1,
      name: '设计天团',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png'
    },
    {
      id: 1,
      name: '中二少女团',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png'
    },
    {
      id: 1,
      name: '骗你学计算机',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png'
    }
  ])
}

const radar = () => {
  return builder([
    {
      item: '阳虚质',
      阳虚质: 70
    },
    {
      item: '阴虚质',
      阴虚质: 60
    },
    {
      item: '痰湿质',
      痰湿质: 50
    },
    {
      item: '气虚质',
      气虚质: 40
    },
    {
      item: '湿热质',
      湿热质: 60
    },
    {
      item: '血瘀质',
      血瘀质: 70
    },
    {
      item: '气郁质',
      气郁质: 70
    },
    {
      item: '特禀质',
      特禀质: 70
    },
    {
      item: '平和质',
      平和质: 70
    }
  ])
}

Mock.mock(/\/service/, 'get', serverList)
Mock.mock(/\/deployhistory/, 'get', deployHistory)
Mock.mock(/\/list\/search\/projects/, 'get', projects)
Mock.mock(/\/workplace\/activity/, 'get', activity)
Mock.mock(/\/workplace\/teams/, 'get', teams)
Mock.mock(/\/workplace\/radar/, 'get', radar)
Mock.mock(/\/cardhistory/, 'get', cardHistory)
Mock.mock(/\/recommendrandom/, 'get', recommendRandom)
