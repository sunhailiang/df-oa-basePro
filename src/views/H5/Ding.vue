<template>
  <div class="container">
    <div class="ding" v-if="isDing">
      <div class="card">
        <div class="form">
          <Form @submit="onSubmit">
            <div class="weight">
              <Field
                v-model="form.weight"
                type="number"
                name="weight"
                label="今日体重"
                placeholder="请输入今日体重(kg)"
                :rules="[{ required: true, message: '请输入今日体重' }]"
              />
            </div>
            <div class="height">
              <Field
                v-model="form.height"
                name="height"
                type="number"
                label="身高"
                placeholder="请输入身高(cm)"
                :rules="[{ required: true, message: '请输入身高' }]"
              />
            </div>
            <div class="tolit">
              <Field name="isTolit" label="如厕后称重">
                <template #input>
                  <RadioGroup v-model="form.isTolit" direction="horizontal">
                    <Radio checked-color="#e96a70" name="1">否</Radio>
                    <Radio checked-color="#e96a70" name="2">是</Radio>
                  </RadioGroup>
                </template>
              </Field>
            </div>
            <div class="breakfast">
              <Field v-model="form.breakfast" name="breakfast" label="早餐" placeholder="早餐内容" type="textarea" />
            </div>
            <div class="lunch">
              <Field v-model="form.lunch" name="lunch" label="午餐内容" placeholder="请输入午餐内容" type="textarea" />
            </div>
            <div class="lunchImg">
              <Field name="lunchImg" label="午餐照片">
                <template #input>
                  <Uploader :before-delete="deleteImg" v-model="form.lunchImg" />
                </template>
              </Field>
            </div>
            <div class="dinner">
              <Field
                v-model="form.dinner"
                name="dinner"
                label="晚餐内容"
                placeholder="请输入晚餐内容"
                type="textarea"
              />
            </div>
            <div class="extra">
              <Field name="isExtra" label="是否加餐">
                <template #input>
                  <RadioGroup v-model="form.isExtra" direction="horizontal">
                    <Radio checked-color="#e96a70" name="1">否</Radio>
                    <Radio checked-color="#e96a70" name="2">是</Radio>
                  </RadioGroup>
                </template>
              </Field>
            </div>
            <div v-if="form.isExtra === '2'" class="extra-meal">
              <Field
                v-model="form.extalMeal"
                name="extelMeal"
                label="加餐内容"
                placeholder="请输入加餐内容"
                type="textarea"
              />
            </div>
            <div class="sleep-time">
              <Field
                readonly
                clickable
                name="picker"
                :value="form.sleepTime"
                label="入睡时间"
                placeholder="选择入睡时间"
                @click="showPicker = true"
              />
              <Popup v-model="showPicker" position="bottom">
                <Picker show-toolbar :columns="columns" @confirm="selectSleepTime" @cancel="showPicker = false" />
              </Popup>
            </div>
            <div class="water">
              <Field v-model="form.water" name="water" label="饮水量" type="number" placeholder="饮水量(L)" />
            </div>
            <div class="cup">
              <Field v-model="form.cup" name="cup" type="number" label="小红杯" placeholder="小红杯数量(杯)" />
            </div>

            <div style="margin: 16px;">
              <Button class="subBtn" round block type="info" native-type="submit">
                提交
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
    <MyChange v-if="isMyChange" />
    <iframe
      v-if="isMecury"
      src="https://mercury.clarabeautynism.com"
      style="width:100%; height:200vh"
      frameborder="0"
      scrolling="no"
    />
    <Tabbar v-model="active" active-color="#DB626B" @change="changeTab" inactive-color="#676767">
      <TabbarItem icon="records">每日打卡</TabbarItem>
      <TabbarItem icon="manager-o">我的变化</TabbarItem>
      <TabbarItem icon="like-o">体质检测</TabbarItem>
    </Tabbar>
  </div>
</template>
<script>
import {
  Tabbar,
  TabbarItem,
  Form,
  Field,
  Button,
  Calendar,
  Cell,
  Radio,
  RadioGroup,
  Uploader,
  Popup,
  Picker,
  Dialog
} from 'vant'
import moment from 'moment'
import Tabs from './component/tabs'
import MyChange from './MyChange'
import { dingToday, customerDing, dingImg, isVip, mecuryToday } from '@/api/manage'
import { type } from 'mockjs2'
export default {
  name: 'Ding',
  components: {
    Dialog,
    MyChange,
    Tabs,
    TabbarItem,
    Tabbar,
    Picker,
    Popup,
    Form,
    Field,
    Button,
    Calendar,
    Cell,
    Radio,
    RadioGroup,
    Uploader
  },
  mounted() {
    this.isVip = this.$route.params.vip === 'true' ? true : false // 判断是否是vip
    this.oid = this.$route.params.id // 线上的
    this.userPhone = this.$route.params.phone //
    this.mecuryToday() // 判断今日是否可以体质测试
    this.dingToday() // 判断今日是否可以打卡
  },
  data() {
    return {
      guid: {
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
      },
      isVip: false,
      flag: false,
      imgArr: [],
      uploadImg: [],
      tabStatus: {
        ding: true,
        change: true,
        mecury: true
      },
      username: '',
      password: '',
      date: '',
      isMecury: false,
      isMyChange: false,
      isDing: true,
      show: false,
      columns: [
        '0:00~1:00',
        '1:00~2:00',
        '2:00~3:00',
        '3:00~4:00',
        '4:00~5:00',
        '5:00~6:00',
        '6:00~7:00',
        '7:00~8:00',
        '8:00~9:00',
        '9:00~10:00',
        '10:00~11:00',
        '11:00~12:00',
        '12:00~13:00',
        '13:00~14:00',
        '14:00~15:00',
        '15:00~16:00',
        '16:00~17:00',
        '17:00~18:00',
        '18:00~19:00',
        '19:00~20:00',
        '20:00~21:00',
        '21:00~22:00',
        '22:00~23:00',
        '23:00~00:00'
      ],
      showPicker: false,
      userPhone: '',
      oid: '',
      form: {
        dinner: '',
        weight: '',
        height: '',
        isTolit: '1',
        isExtra: '1',
        lunch: '',
        breakfast: '',
        lunchImg: [],
        extalMeal: '',
        sleepTime: '',
        water: '',
        cup: ''
      },
      active: 0
    }
  },
  methods: {
    deleteImg(file) {
      let constStr = file.url.split('/')
      let resStr = constStr[constStr.length - 1].split('.')[0]
      for (let i = 0; i < this.uploadImg.length; i++) {
        if (this.uploadImg[i] === resStr) {
          console.log('存在相同的', resStr)
          this.uploadImg.splice(resStr, 1)
        }
      }
      return true
    },
    mecuryToday() {
      mecuryToday(this.userPhone).then(res => {
        if (res.success && !this.isVip) {
          // 可以体质测试
          // 打卡完成，直接跳到我的信息页面
          this.active = 2
          this.isMyChange = false
          this.isDing = false
          this.tabStatus.ding = false
        } else if (res.success) {
        } else {
          // 不可以体质测试
          // 1.不在时间段点击不跳转
          this.tabStatus.mecury = false
        }
      })
    },
    dingToday() {
      //2dbc2ffd-6277-4b98-937d-2eab1521cc28 oid

      dingToday(this.oid).then(res => {
        if (this.isVip) {
          // 打卡完成，直接跳到我的信息页面
          this.active = 0
          this.isMyChange = false
          this.isDing = true
        } else {
          this.active = 2
          this.isDing = false
          this.isMecury = true
          this.isMyChange = false
        }

        let list = res.response.dingList
        if (res.success && list.length > 0) {
          for (const key in this.guid) {
            for (let i = 0; i < list.length; i++) {
              if (list[i].questionGuid.toUpperCase() == this.guid[key]) {
                this.setModal(key, list[i].answer)
              }
            }
          }
        }
      })
    },
    setModal(key, value) {
      switch (key) {
        case 'heightGuid':
          this.form.height = value === null ? '' : value
          break
        case 'weigtGuid':
          this.form.weight = value === null ? '' : value
          break
        case 'isToiletGuid':
          this.form.isTolit = value === '是' ? '2' : '1'
          break
        case 'breakfast':
          this.form.breakfast = value === null ? '' : value
          break
        case 'lunch':
          this.form.lunch = value === null ? '' : value
          break
        case 'file':
          let imgArr = JSON.parse(value)
          for (let i = 0; i < imgArr.length; i++) {
            let constStr = imgArr[i].split('/')
            let resStr = constStr[constStr.length - 1].split('.')[0]
            this.uploadImg.push(resStr)
            this.form.lunchImg.push({ url: imgArr[i] })
          }
          break
        case 'dinner':
          this.form.dinner = value === null ? '' : value
          break
        case 'isExtraFood':
          this.form.isExtra = value === '是' ? '2' : '1'
          break
        case 'extraFood':
          this.form.extalMeal = value === null ? '' : value
          break
        case 'sleepTime':
          this.form.sleepTime = value === null ? '' : value
          break
        case 'water':
          this.form.water = value === null ? '' : value
          break
        case 'number':
          this.form.number = value === null ? '' : value
          break
      }
    },
    changeTab(key) {
      switch (key) {
        case 0:
          if (!this.isVip) {
            // 非VIP
            Dialog.alert({
              title: '您好，尊贵的用户！',
              message: '请联系您的所属代理商，代您申请打卡权限后方可使用！'
            })
            this.active = 2
            this.isDing = false
            this.isMyChange = false
            this.isMecury = true
            return false
          } else {
            this.isDing = true
            this.isMecury = false
            this.isMyChange = false
          }

          break
        case 2:
          if (!this.tabStatus.mecury) {
            Dialog.alert({
              title: '晚上好小主！',
              message: '夜深了,明天再测试吧！'
            })
            if (this.isVip) {
              // 如果当前还可以打卡，就跳到打卡也
              this.active = 0
              this.isDing = true
              this.isMecury = false
              this.isMyChange = false
            }
          } else {
            this.isDing = false
            this.isMecury = true
            this.isMyChange = false
          }

          break
        case 1:
          if (!this.isVip) {
            // 非VIP
            Dialog.alert({
              title: '您好，尊贵的用户！',
              message: '请联系您的所属代理商，代您申请打卡权限后方可使用！'
            })
            this.active = 2
            this.isDing = false
            this.isMecury = true
            this.isMyChange = false
            return false
          }
          this.isDing = false
          this.isMecury = false
          this.isMyChange = true
          break
      }
    },
    selectSleepTime(value) {
      this.form.sleepTime = value
      this.showPicker = false
    },
    // 表单提交
    async onSubmit(values) {
      // this.btnDisable = true
      // setInterval(function() {
      //   this.btnDisable = false
      // }, 8000)
      // 是否如厕称重
      values.isTolit === '1' ? (values.isTolit = '否') : (values.isTolit = '是')
      // 是否加餐
      values.isExtra === '1' ? (values.isExtra = '否') : (values.isExtra = '是')
      console.log('submit', values)
      if (values.lunchImg.length > 0) {
        this.imgArr = []
        for (let i = 0; i < values.lunchImg.length; i++) {
          // 新上传的
          if (!values.lunchImg[i].url) {
            this.imgArr.push(encodeURIComponent(values.lunchImg[i].content))
          }
        }
        // 上传午餐图片
        await dingImg(JSON.stringify({ base64Pic: this.imgArr })).then(res => {
          if (res.success) {
            for (let i = 0; i < res.response.dingPicList.length; i++) {
              this.uploadImg.push(res.response.dingPicList[i].remoteOid)
            }
            setTimeout(() => {
              this.$notification.success({
                message: res.message
              })
            }, 1000)
          }
          // else {
          //   this.$notification['error']({
          //     message: '错误',
          //     description: res.message,
          //     duration: 2
          //   })
          // }
        })
      }

      await this.customerDing(values)
    },
    customerDing(values) {
      let resArr = []
      for (let key in values) {
        switch (key) {
          case 'weight':
            resArr.push({ questionOID: this.guid.weigtGuid, answerContent: values[key] })
            break
          case 'height':
            resArr.push({ questionOID: this.guid.heightGuid, answerContent: values[key] })
            break
          case 'breakfast':
            resArr.push({ questionOID: this.guid.breakfast, answerContent: values[key] })
            break
          case 'lunch':
            resArr.push({ questionOID: this.guid.lunch, answerContent: values[key] })
            break
          case 'lunchImg':
            resArr.push({
              questionOID: this.guid.file,
              answerContent: JSON.stringify(this.uploadImg)
            })
            break
          case 'dinner':
            resArr.push({ questionOID: this.guid.dinner, answerContent: values[key] })
            break
          case 'picker':
            resArr.push({ questionOID: this.guid.sleepTime, answerContent: values[key] })
            break
          case 'water':
            resArr.push({ questionOID: this.guid.water, answerContent: values[key] })
            break
          case 'cup':
            resArr.push({ questionOID: this.guid.number, answerContent: values[key] })
            break
        }
      }

      resArr.push({ questionOID: this.guid.Conclusion, answerContent: '知道了' })
      resArr.push({
        questionOID: this.guid.isExtraFood,
        answerContent: values.isExtra
      })
      values.isExtra != '否'
        ? resArr.push({
            questionOID: this.guid.extraFood,
            answerContent: values.extelMeal
          })
        : ''
      resArr.push({ questionOID: this.guid.isToiletGuid, answerContent: values.isTolit })
      let param = {
        customerOid: this.oid,
        middleDingList: resArr
      }
      customerDing(param).then(res => {
        this.active = 1
        this.isMyChange = true
        this.isDing = false
        this.tabStatus.ding = false
      })
    },

    //日期格式
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`
    },
    // 确定日期选择
    onConfirm(date) {
      this.show = false
      this.date = this.formatDate(date)
    }
  }
}
</script>
<style scoped lang="less">
input::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #c0c0c0 !important;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #c0c0c0 !important;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #c0c0c0 !important;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #c0c0c0 !important;
}

textarea::-webkit-input-placeholder {
  /* WebKit browsers */
  color: #c0c0c0 !important;
}
textarea:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #c0c0c0 !important;
}
textarea::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #c0c0c0 !important;
}
textarea:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  color: #c0c0c0 !important;
}

.ding {
  font-size: 20px;
  color: white;
  background: url(~@/assets/images/ding/ding_bg.jpg) no-repeat;
  background-size: 100% 100%;
  padding: 8.5rem 1.4rem 1.2rem;
  .card {
    background: url(~@/assets/images/ding/form_bg.png);
    background-size: 100% 100%;
    padding: 5rem 2.4rem 3rem;
  }
  .form {
    .subBtn {
      height: 2.4rem;
      line-height: 2.2rem;
      background-color: #e33b3e;
      width: 10rem;
      position: relative;
      border: #e33b3e;
      left: 2.8rem;
      top: 1.25rem;
      -moz-box-shadow: 2px 0 5px #e33b3e;
      -webkit-box-shadow: 2px 0 5px #e33b3e;
      box-shadow: 2px 0 5px #e33b3e;
    }
    .date {
      .van-calendar {
        background: white;
        color: gray;
        height: 94%;
        .van-calendar__body {
          .van-calendar__month {
            .van-calendar__day {
              height: 3.8rem;
            }
          }
        }
        .van-calendar__footer {
          clear: both;
          padding-left: 9.3%;
          y .van-button {
            width: 70vw;
          }
        }
      }
    }
    .sleep-time {
      .van-picker {
        .van-picker__cancel {
          position: relative;
          top: 0;
          left: 0;
        }
        .van-picker__confirm {
          position: relative;
          top: 0;
          left: 0;
        }
      }
    }
  }
}
</style>
