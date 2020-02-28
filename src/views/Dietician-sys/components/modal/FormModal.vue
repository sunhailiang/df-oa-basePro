<template>
  <a-modal
    title="废弃配餐？"
    :width="640"
    :visible="visible"
    :destroyOnClose="true"
    :confirmLoading="confirmLoading"
    @cancel="closeModal"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="废弃原因" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-select
            v-model="cause"
            v-decorator="['cause', { initialValue: 0, rules: [{ required: true }] }]"
            style="width: 100%"
          >
            <a-select-option :value="0">配餐有误</a-select-option>
            <a-select-option :value="1">客户不喜欢</a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item v-if="cause === 1" label="配餐食材" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <div class="selectedFood">
            <div class="breakfast-container container">
              <div class="breakfast type">早餐</div>
              <div class="food">
                <a-tag
                  v-for="(item, index) in breakfast"
                  closable
                  @close="close(MealTimes.早餐, item)"
                  :key="index"
                  color="#108ee9"
                  >{{ item.name }}</a-tag
                >
              </div>
            </div>
            <div class="lunch-container container">
              <div class="lunch type">午餐</div>

              <div class="food">
                <a-tag
                  v-for="(item, index) in lunch"
                  closable
                  @close="close(MealTimes.午餐, item)"
                  :key="index"
                  color="#108ee9"
                >
                  {{ item.name }}</a-tag
                >
              </div>
            </div>
            <div class="diner-container container">
              <div class="dinner type">晚餐</div>

              <div class="food">
                <a-tag
                  v-for="(item, index) in dinner"
                  closable
                  @close="close(MealTimes.晚餐, item)"
                  :key="index"
                  color="#108ee9"
                  >{{ item.name }}</a-tag
                >
              </div>
            </div>
          </div>
        </a-form-item>
        <a-form-item v-if="cause === 1" label="客户不喜欢:" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <div class="dislike-container">
            <a-tag
              v-for="item in dislike"
              closable
              @close="close(MealTimes.不喜欢, item)"
              :key="item.value.oid"
              color="#108ee9"
              >{{ item.value.name }}</a-tag
            >
          </div>
        </a-form-item>
      </a-form>
    </a-spin>
    <template slot="footer">
      <a-button key="cancel" :style="{ float: 'left' }" @click="closeModal">取消</a-button>
      <a-button key="confirm" @click="saveData">确认</a-button>
    </template>
  </a-modal>
</template>

<script>
import { MealTimes } from '@/utils/enum.js'
export default {
  name: 'FormModal',
  data() {
    return {
      deleteId: '',
      cause: 0,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      currentStep: 0,
      mdl: {},
      MealTimes,
      form: this.$form.createForm(this),
      breakfast: [],
      lunch: [],
      dinner: [],
      dislike: [],
      newTemp: []
    }
  },
  methods: {
    close(type, value) {
      // 删除不喜欢的食材
      ;(type === 0 || type === 1 || type === 2) && this.dislike.push({ type, value })
      // 恢复食材
      type === 3 &&
        (value.type === 0
          ? this.breakfast.push(value.value) && this.delete(value)
          : value.type === 1
          ? this.lunch.push(value.value) && this.delete(value)
          : value.type === 2
          ? this.dinner.push(value.value) && this.delete(value)
          : '')
    },
    delete(obj) {
      for (let i = 0; i < this.dislike.length; i++) {
        if (this.dislike[i].value.oid === obj.value.oid) {
          this.dislike.splice(i, 1)
        }
      }
    },
    openModal(rowData) {
      // 要删除的id
      this.deleteId = rowData.oid
      if (rowData) {
        this.breakfast = []
        this.lunch = []
        this.dinner = []
        this.dislike = []
        this.visible = true
        this.getArray(rowData['Breakfast'], 'Breakfast')
        this.getArray(rowData['Lunch'], 'Lunch')
        this.getArray(rowData['Dinner'], 'Dinner')
      }
    },
    getArray(str, type) {
      let strArr = str.split('}')
      let temp = []
      for (let i = 0; i < strArr.length - 1; i++) {
        strArr[i] += '}'
        if (strArr[i].charAt(0) === ',') {
          strArr[i] = strArr[i].substr(1)
        }
        temp.push(JSON.parse(strArr[i]))
      }
      switch (type) {
        case 'Breakfast':
          for (let i = 0; i < temp.length; i++) {
            this.breakfast.push({ name: temp[i].Breakfast.split('(')[0], oid: temp[i].oid })
          }
          break
        case 'Lunch':
          for (let i = 0; i < temp.length; i++) {
            this.lunch.push({ name: temp[i].Lunch.split('(')[0], oid: temp[i].oid })
          }
          break
        case 'Dinner':
          for (let i = 0; i < temp.length; i++) {
            this.dinner.push({ name: temp[i].Dinner.split('(')[0], oid: temp[i].oid })
          }
          break
      }
    },

    closeModal() {
      this.visible = false
    },
    refresh() {
      this.form.validateFields((error, values) => {
        error ? console.log('清空数据时报错', error) : (values = {})
      })
    },
    saveData() {
      let cause = this.cause === 0 ? '配餐有误' : '客户不喜欢'
      let idArr = []
      // 取出id
      for (let i = 0; i < this.dislike.length; i++) {
        idArr.push({ foodOid: this.dislike[i].value.oid })
      }
      this.$emit('save', { id: this.deleteId, cause, dislike: idArr })
    }
  }
}
</script>
<style lang="less" scoped>
.dislike-container {
  border: 1px solid #d9d9d9;
  min-height: 40px;
  border-radius: 4px;
}
.selectedFood {
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  .container {
    border-bottom: 1px solid #d9d9d9;
    overflow: hidden;
    .type {
      width: 22%;
      text-align: center;
      float: left;
      border-right: 1px solid #d9d9d9;
      height: 80px;
      line-height: 80px;
    }
    .food {
      width: 77%;
      float: left;
      .ant-tag {
        float: left;
        margin: 4px;
      }
      height: 80px;
    }
  }
  .container:last-child {
    border-bottom: none;
  }
}
</style>
