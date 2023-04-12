<template>
  <div :class="'hsz-button hsz-button-'+align">
    <el-button v-bind="$attrs" v-on="$listeners">{{buttonText}}</el-button>
  </div>
</template>
<script>
export default {
  props: {
    align: {
      default: 'left'
    },
    buttonText: {
      default: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.hsz-button {
  width: 100%;
  &.hsz-button-left {
    text-align: left;
  }
  &.hsz-button-center {
    text-align: center;
  }
  &.hsz-button-right {
    text-align: right;
  }
}
</style>