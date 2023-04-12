<template>
  <el-dialog v-bind="$attrs"
             :close-on-click-modal="false"
             :modal-append-to-body="false"
             v-on="$listeners"
             @open="onOpen"
             fullscreen
             lock-scroll
             class="HSZ-full-dialog"
             :show-close="false"
             :modal="false">
    <div class="HSZ-full-dialog-header">
      <div class="header-title">
        <img src="@/assets/images/hsz.png"
             class="header-logo" />
        <p class="header-txt"> · 门户预览</p>
      </div>
      <div class="options">
        <el-button @click="closeDialog()">{{$t('common.cancelButton')}}</el-button>
      </div>
    </div>
    <div class="main"
         style="padding:0">
      <PortalLayout :layout="layout"
                    mask />
    </div>
  </el-dialog>
</template>

<script>
import PortalLayout from '@/components/VisualPortal/Layout'
export default {
  props: ['layout'],
  components: { PortalLayout },
  data () {
    return {}
  },
  methods: {
    onOpen () { },
    closeDialog () {
      this.$emit('update:visible', false)
    }
  }
}
</script>