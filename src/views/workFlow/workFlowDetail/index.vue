<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <div class="HSZ-common-layout-main HSZ-flex-main">
        <FlowBox v-if="formVisible"
                 ref="FlowBox"
                 @close="closeForm" />
        <el-empty description="暂无数据"
                  :image-size="120"
                  v-else></el-empty>
      </div>
    </div>
  </div>
</template>

<script>
import FlowBox from '../components/FlowBox'
const Base64 = require('js-base64').Base64
export default {
  name: 'workFlowDetail',
  components: { FlowBox },
  data () {
    return {
      formVisible: false
    }
  },
  created () {
    this.initData()
  },
  watch: {
    config: {
      handler (val) {
        this.toDetail()
      },
      deep: true
    },
  },
  computed: {
    config () {
      return this.$route.query.config
    }
  },
  methods: {
    initData () {
      this.toDetail()
    },
    toDetail () {
      // type 1-我发起的 2-代办 3-抄送
      if (!this.config) return this.formVisible = false
      let item = JSON.parse(Base64.decode(this.config))
      let data = {
        id: item.processId,
        enCode: item.enCode,
        flowId: item.flowId,
        formType: item.formType,
        opType: item.type == 1 ? 0 : item.type == 2 ? 1 : item.type,
        taskNodeId: item.taskNodeId,
        taskId: item.taskOperatorId,
        hideCancelBtn: true
      }
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.FlowBox.init(data)
      })
    },
    closeForm () {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.back()
    }
  }
}
</script>