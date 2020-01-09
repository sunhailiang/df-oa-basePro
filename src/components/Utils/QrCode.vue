<template>
  <div class="qr-code">
    <div id="qrCode" ref="qrCodeDiv"></div>
  </div>
</template>
<script>
import QRCode from 'qrcodejs2'
export default {
  name: 'QrCode',
  props: {
    text: {
      type: String,
      default: '二维码'
    },
    width: {
      type: Number,
      default: 50
    },
    height: {
      type: Number,
      default: 50
    },
    colorDark: {
      type: String,
      default: '#333333'
    },
    colorLight: {
      type: String,
      default: '#ffffff'
    }
  },
  mounted() {
    new QRCode(this.$refs.qrCodeDiv, {
      text: this.text,
      width: this.width,
      height: this.height,
      colorDark: this.colorDark, //二维码颜色
      colorLight: this.colorLight, //二维码背景色
      correctLevel: QRCode.CorrectLevel.L //容错率，L/M/H
    })
  }
}
</script>
