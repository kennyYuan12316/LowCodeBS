<template>
    <transition name="el-zoom-in-center">
    <div class="HSZ-preview-main flow-form-main nohead">
      <div class="btns">
      
        <template v-if="setting.opType=='-1'">
          <el-button type="primary"
                     @click="eventLauncher('submit')"
                     >
            {{'提 交'}}</el-button>
         
        </template>
        <!-- <template v-if="setting.opType == 1">
          <el-button type="primary"
                     @click="eventLauncher('audit')"
                     :loading="candidateLoading"
                     v-if="properties.hasAuditBtn">{{properties.auditBtnText||'通 过'}}</el-button>
        </template>
        <template v-if="setting.opType == 0 && setting.status == 1">
          <el-button type="danger"
                     @click="revoke()"
                     v-if="properties.hasRevokeBtn || properties.hasRevokeBtn===undefined">
            {{properties.revokeBtnText||'撤 回'}}</el-button>
        </template>
        <el-button type="danger"
                   v-if="setting.opType == 2 && properties.hasRevokeBtn"
                   @click="recall()">{{properties.revokeBtnText||'撤 回'}}</el-button> -->
        <template v-if="setting.opType == 4">
          <el-button type="danger"
                     v-if="setting.status != 2 && setting.status != 5"
                     @click="cancel()">终 止</el-button>
        </template>
        <el-button @click="goBack()"
                   v-if="!setting.hideCancelBtn">{{$t('common.cancelButton')}}
        </el-button>
      </div>
      <!-- <div class="approve-result"
           v-if="(setting.opType==0||setting.opType==4) && activeTab==='0'">
        <div class="approve-result-img"
             :class="flowTaskInfo.status | flowStatus()"></div>
      </div> -->
      <el-tabs class="HSZ-el_tabs"
               v-model="activeTab">
        <el-tab-pane label="表单信息"
                     v-loading="loading">
          <span slot="label"
                :title="fullName+'-'+(thisStep?thisStep:'发起节点')">表单信息</span>
                <HSZ-Form  ref="HSZForm" @close="closeForm" @reset="reset"/>
        </el-tab-pane>
        <el-tab-pane label="流程信息"
                     v-loading="loading">
          <Process :conf="flowTemplateJson"
                   v-if="flowTemplateJson.nodeId" />
        </el-tab-pane>
       
      </el-tabs>



    </div>
  </transition>
</template>

<script>
import Process from '@/components/WmsTask/Preview'
import HSZForm from './Form'
import request from "@/utils/request";

export default {
    components: {Process, HSZForm},
    data () {
    return {
        activeTab: '0',
        loading: false,
        setting: {},
        formVisiblez:false,
        fullName: '',
      thisStep: '',
      flowTemplateJson: {},
    }
    },
    
  watch: {
    activeTab (val) {
      if (val === 'HSZForm') {
        this.$refs.HSZForm && this.$refs.HSZForm.init()
      }
    //   if (val === 'recordSummary') {
    //     this.$refs.recordSummary && this.$refs.recordSummary.init()
    //   }
    }
  },
  methods:{
    goBack (isRefresh) {
      this.$emit('close', isRefresh)
    },
    init (data) {
      this.loading = false
      this.activeTab = '0'
      this.setting = data
      console.log(data)
      /**
       * opType
       * -1 - 我发起的新建/编辑 
       * 0 - 我发起的详情
       * 1 - 待办事宜
       * 2 - 已办事宜
       * 3 - 抄送事宜
       * 4 - 流程监控
       */
       this.$nextTick(() => {
        console.log(data.flowId)
        if (data.id) {
          request({
            url: `/api/wms/ZjnWmsTask/taskData`,
            method: "Get",
            data:{id:data.id}
          }).then((res) => {
            console.log(res)
            this.flowTemplateJson = res.data.FlowTemplateJson ? JSON.parse(res.data.FlowTemplateJson) : null
            // this.flowTemplateJson.state = 'state-curr'
            this.$refs.HSZForm.init(res.data)

          })

        }
        else {
          request({
            url: `/api/wms/ZjnWcsProcessConfig/PathData`,
            method: "Get",
            data:{id:data.flowId}
          }).then((res) => {
            console.log(res)
            this.flowTemplateJson = res.data.FlowTemplateJson ? JSON.parse(res.data.FlowTemplateJson) : null
            this.flowTemplateJson.state = 'state-curr'
            this.$refs.HSZForm.init(res.data)

          })


        }

        
      })
    },
    eventLauncher (eventType) {
      this.$refs.HSZForm && this.$refs.HSZForm.dataFormSubmit()
    },
    closeForm(isVisible){
      this.$emit('close', isVisible)
    },
    reset(id){
      request({
            url: `/api/wms/ZjnWmsTask/taskData`,
            method: "Get",
            data:{id:id}
          }).then((res) => {
            console.log(res)
            this.flowTemplateJson = res.data.FlowTemplateJson ? JSON.parse(res.data.FlowTemplateJson) : null
            // this.flowTemplateJson.state = 'state-curr'
            this.$refs.HSZForm.init(res.data)

          })
    }

  }

}
</script>

<style>

</style>