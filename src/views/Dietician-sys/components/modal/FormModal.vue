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
                  >{{ item }}</a-tag
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
                  {{ item }}</a-tag
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
                  >{{ item }}</a-tag
                >
              </div>
            </div>
          </div>
        </a-form-item>
        <a-form-item v-if="cause === 1" label="客户不喜欢:" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <div class="dislike-container">
            <a-tag
              v-for="(item, index) in dislike"
              closable
              @close="close(MealTimes.不喜欢, item)"
              :key="index"
              color="#108ee9"
              >{{ item.value }}</a-tag
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
      dislike: []
    }
  },
  methods: {
    close(type, value) {
      // 删除不喜欢的食材
      ;(type === 0 || type === 1 || type === 2) && this.dislike.push({ type, value })
      // 恢复食材
      type === 3 &&
        (value.type === 0
          ? this.breakfast.push(value.value)
          : value.type === 1
          ? this.lunch.push(value.value)
          : value.type === 2
          ? this.dinner.push(value.value)
          : '')
    },
    openModal(rowData) {
      if (rowData) {
        this.visible = true
        let tempBreakFirst = rowData['breakfast'].split(',')
        this.getArray(tempBreakFirst, this.breakfast) // 获取食材
        let tempLuch = rowData['lunch'].split(',')
        this.getArray(tempLuch, this.lunch)
        let dinnerTemp = rowData['dinner'].split(',')
        this.getArray(dinnerTemp, this.dinner)
      }
    },
    getArray(arr, resArr) {
      arr.forEach(el => {
        resArr.push(el.split('(')[0])
      })
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
      console.log(
        'value',
        this.form.validateFields((error, values) => {
          error ? console.log('这里有个错', error) : this.$emit('save', values)
        })
      )
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
