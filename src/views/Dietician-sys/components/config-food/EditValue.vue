<template>
  <div>
    <a-modal
      title="修改食材重量"
      :visible="visible"
      @ok="handleOk"
      :confirmLoading="confirmLoading"
      @cancel="handleCancel"
    >
      <a-input v-model="newVal" :addonBefore="type" />
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'EditValue',
  data() {
    return {
      visible: false,
      confirmLoading: false,
      type: '',
      newVal: 0,
      oldVal: 0,
      obj: {},
      temp: {},
      oldObj: {
        oldE: 0,
        oldC: 0,
        oldP: 0,
        oldF: 0
      }
    }
  },
  methods: {
    showModal(v) {
      console.log('这样行得通么？', this.$store.state.editWeight)
      Object.assign(this.temp, v)
      const editWeight = this.$store.state.editWeight
      let has = false
      if (editWeight.length > 0) {
        for (let i = 0; i < editWeight.length; i++) {
          if (editWeight[i].oid === v.oid) {
            this.oldVal = editWeight[i].value
            has = true
          }
        }
        if (!has) {
          editWeight.push({ oid: v.oid, value: this.temp.value, isfirst: true })
          this.oldVal = this.temp.value
        }
      } else {
        editWeight.push({ oid: v.oid, value: this.temp.value, isfirst: true })
        this.oldVal = this.temp.value
      }

      this.obj = v
      this.newVal = this.obj.value
      this.type = this.obj.name
      this.visible = true
    },
    handleOk() {
      console.log('我丢', this.oldVal)

      for (let i = 0; i < this.temp.foodComponentList.length; i++) {
        switch (this.temp.foodComponentList[i].nameCode) {
          case 'C':
            this.oldObj.oldC += this.temp.foodComponentList[i].value
            break
          case 'F':
            this.oldObj.oldF += this.temp.foodComponentList[i].value
            break
          case 'P':
            this.oldObj.oldP += this.temp.foodComponentList[i].value
            break
          case 'E':
            this.oldObj.oldE += this.temp.foodComponentList[i].value
            break
          default:
            break
        }
      }
      console.log('没改成功?', this.oldObj)

      this.obj.value = this.newVal
      let res = parseFloat(parseFloat(this.newVal) / parseFloat(this.oldVal)).toFixed(1)
      this.$emit('reSetValue', { new: this.obj, old: this.oldObj, ratio: res })
      this.confirmLoading = true
      setTimeout(() => {
        this.visible = false
        this.confirmLoading = false
      }, 1000)
    },
    handleCancel(e) {
      console.log('Clicked cancel button')
      this.visible = false
    }
  }
}
</script>
