<template>
  <el-dialog :visible.sync="visible"
             fullscreen
             lock-scroll
             class="HSZ-full-dialog"
             :show-close="false"
             :modal="false"
             append-to-body>
    <div class="HSZ-full-dialog-header">
      <div class="header-title">
        <img src="@/assets/images/hsz.png"
             class="header-logo" />
        <p class="header-txt"> · 路径设计</p>
      </div>
      <el-steps :active="activeStep"
                finish-status="success"
                simple
                class="steps">
        <el-step title="基础信息"
                 @click.native="stepChick(0)" />
       
        <el-step title="路径设计"
                 @click.native="stepChick(1)" />
      </el-steps>
      <div class="options">
        <el-button @click="prev"
                   :disabled="activeStep<=0">{{$t('common.prev')}}</el-button>
        <el-button @click="next"
                   :disabled="activeStep>=1 || loading">{{$t('common.next')}}
        </el-button>
        <el-button type="primary"
                   @click="dataFormSubmit()"
                   :disabled="activeStep<1"
                   :loading="btnLoading">{{$t('common.confirmButton')}}</el-button>
        <el-button @click="closeDialog()">{{$t('common.cancelButton')}}</el-button>
      </div>
    </div>
    <div class="main"
         v-loading="loading">
      <el-row type="flex"
              justify="center"
              align="middle"
              v-if="!activeStep"
              class="basic-box">
        <el-col :xs="12"
                :sm="12"
                :md="12"
                :lg="12"
                :xl="10"
                class="basicForm">
          <el-form :model="dataForm"
                   :rules="dataRule"
                   ref="dataForm"
                   label-width="80px"
                   @submit.native.prevent
                   label-position="right">
                   <el-col :span="24">
						<el-form-item label="业务编号" prop="workNo">
							<el-input v-model='dataForm.workNo' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="业务名称" prop="workName">
							<el-input v-model='dataForm.workName' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
          <el-col :span="24">
						<el-form-item label="流程类型" prop="workType">
							<el-select v-model='dataForm.workType' placeholder='请选择' clearable required :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in workTypeOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
        
					<el-col :span="24">
						<el-form-item label="所属库位" prop="workWarehouse">
							<el-select v-model='dataForm.workWarehouse' placeholder='请选择' clearable required :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in workWarehouseOptions" :key="index" :label="item.F_WarehouseName" :value="item.F_WarehouseNo" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
          <el-col :span="24">
						<el-form-item label="物料类型" prop="GoodsType">
							<el-select v-model='dataForm.GoodsType' placeholder='请选择' clearable required :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in GoodsTypeOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="起点工位" prop="workStart">
							<el-select v-model='dataForm.workStart' placeholder='请选择' multiple filterable  clearable :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in workStartOptions" :key="index" :label="item.Capion" :value="item.StationID" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="终点工位" prop="workEnd">
							<el-select v-model='dataForm.workEnd' placeholder='请选择' multiple filterable  clearable :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in workEndOptions" :key="index" :label="item.Capion" :value="item.StationID" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
          <el-col :span="24">
          <el-form-item label="站点数" prop="workPathcount">
            <el-input-number v-model="dataForm.workPathcount" placeholder="数字文本" required :step="1" />
          </el-form-item>
        </el-col>
					<el-col :span="24">
						<el-form-item label="是否存在动态站点" prop="workNodes">
							<el-switch v-model='dataForm.workNodes' :active-value='1' :inactive-value='0' >
							</el-switch>
						</el-form-item>
					</el-col>


          </el-form>
        </el-col>
      </el-row>
      <template v-if="activeStep==1">
        <WmsTask ref="processDesign"
                 :conf="flowTemplateJson"
                 @startNodeChange="onStartChange"
                 :flowType="dataForm.type" />
      </template>
    </div>
    <icon-box :visible.sync="iconBoxVisible"
              ref="iconBox"
              :current="dataForm.icon"
              @choiceIcon="choiceIcon" />
    <TableForm :visible.sync="formVisible"
               ref="tableForm"
               @closeForm="closeForm"
               :dbLinkId="dataForm.dbLinkId" />
  </el-dialog>
</template>

<script>
import { GetInfo, Update, Create } from '@/api/wms/ZjnWcsProcessConfig'
import { getDataSourceListAll } from '@/api/systemData/dataSource'
import iconBox from '@/components/HSZ-iconBox'
import WmsTask from "@/components/WmsTask"
import Generator from '@/components/Generator/index/Home'
// import FieldForm from './FieldForm'
import TableForm from '@/views/generator/TableForm'
import mixin from '@/mixins/generator/common'
import { getDictionaryDataSelector } from "@/api/systemData/dictionary";
import { getDataInterfaceRes } from "@/api/systemData/dataInterface";

export default {
  mixins: [mixin],
  components: { iconBox, WmsTask, Generator, TableForm },
  data () {
    return {
      visible: false,
      activeStep: 0,
      dataForm: {
					id:'',
					workNo:undefined,//undefined
					workName:undefined,
					workType:undefined,
					workType:undefined,
					GoodsType:undefined,
					workWarehouse:undefined,
					workStart:undefined,
					workEnd:undefined,
					workNodes:0,
					createUser:undefined,
					createTime:undefined,
					lastModifyUserId:undefined,
					lastModifyTime:undefined,
          workPath:undefined,
          workPathcount:undefined,
				},
				dataRule: {
					workNo:[
						{
							required:true,
							message:'请输入业务编号',
							trigger:'blur'
						},
					],
					workName:[
						{
							required:true,
							message:'请输入业务名称',
							trigger:'blur'
						},
					],
					workType:[
						{
							required:true,
							message:'请输入业务类型',
							trigger:'change'
						},
					],
          // GoodsType:[
					// 	{
					// 		required:true,
					// 		message:'请输入物料类型',
					// 		trigger:'change'
					// 	},
					// ],
					workWarehouse:[
						{
							required:true,
							message:'请输入所属库位',
							trigger:'change'
						},
					],
				},
        workTypeOptions:[],
        GoodsTypeOptions:[],

				workWarehouseOptions:[],
				workStartOptions : [],
				workEndOptions : [],
      
      tables: [],
      formVisible: false,
      btnLoading: false,
      mainTableFields: [],
      relationTable: "",
      flowTemplateJson: {},
      formData: null,
      iconBoxVisible: false,
      loading: false,
      categoryList: [],
      formList: [],
      dbOptions: [],
      formType: '系统表单'

    }
  },
  created() {
			

		},
  methods: {
    getworkTypeOptions(){
				getDictionaryDataSelector('349315174420710661').then(res => {
					this.workTypeOptions = res.data.list
				});
			},
      getGoodsTypeOptions(){
				getDictionaryDataSelector('325449144728552709').then(res => {
					this.GoodsTypeOptions = res.data.list
				});
			},
			getworkWarehouseOptions(){
				getDataInterfaceRes('327591530430727429').then(res => {
					let data = this.hsz.interfaceDataHandler(res.data)
					this.workWarehouseOptions = data
				});
			},
			getworkStartOptions(){
				getDataInterfaceRes('343244101333812485').then(res => {
					let data = this.hsz.interfaceDataHandler(res.data)
					this.workStartOptions = data
				});
			},
			getworkEndOptions(){
				getDataInterfaceRes('343244101333812485').then(res => {
					let data = this.hsz.interfaceDataHandler(res.data)
					this.workEndOptions = data
				});
			},

    init (id) {
      this.getworkStartOptions();
			this.getworkEndOptions();
			this.getworkTypeOptions();
			this.getGoodsTypeOptions();

			this.getworkWarehouseOptions();

      // this.categoryList = categoryList
      this.activeStep = 0
      // this.tables = []
      this.dataForm.id = id || ''
      // this.getDbOptions()
      this.visible = true
      this.loading = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields();
        if (this.dataForm.id) {
          GetInfo(this.dataForm.id).then(res => {
            this.dataForm = res.data
            // this.formType = this.dataForm.formType == 1 ? '系统表单' : '自定义表单'
            this.dataForm.workPath && (this.flowTemplateJson = JSON.parse(this.dataForm.workPath))
            // this.dataForm.formData && (this.formData = JSON.parse(this.dataForm.formData))
            // this.tables = this.dataForm.tables && JSON.parse(this.dataForm.tables) || []
            this.dataForm.workStart=this.dataForm.workStart.split(',');
            this.dataForm.workEnd=this.dataForm.workEnd.split(',');
            this.updateFields()
            this.loading = false
          }).catch(() => { this.loading = false })
        } else {
          // this.dataForm.formType = formType
          // this.formType = formType == 1 ? '系统表单' : '自定义表单'
          this.loading = false
        }
      })
    },
    //确认
    dataFormSubmit () {
      //获取流程数据
      this.$refs['processDesign'].getData().then(res => {
        this.btnLoading = true
        this.flowTemplateJson = res.formData
        this.dataForm.workPath = JSON.stringify(this.flowTemplateJson)
        this.dataForm.workStart=this.dataForm.workStart.join();
        this.dataForm.workEnd=this.dataForm.workEnd.join();
        // this.dataForm.formData = JSON.stringify(this.formData)
        // this.dataForm.tables = JSON.stringify(this.tables)
        const formMethod = this.dataForm.id ? Update : Create
        formMethod(this.dataForm).then((res) => {
          this.$message({
            message: res.msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.btnLoading = false
              this.closeDialog(true)
            }
          })
        }).catch(() => { this.btnLoading = false })
      }).catch(err => {
        err.msg && this.$message.warning(err.msg)
      })
    },
    next () {
      if (this.activeStep < 1) {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // if (!this.tables.length) {
            //   this.$store.commit('generator/SET_TABLE', false)
            // } else {
            //   if (!this.exist()) return
            //   let subTable = this.tables.filter(o => o.typeId == '0')
            //   this.$store.commit('generator/UPDATE_SUB_TABLE', subTable)
            //   this.$store.commit('generator/SET_ALL_TABLE', this.tables)
            //   this.$store.commit('generator/SET_TABLE', true)
            //   this.$store.commit('generator/UPDATE_FORMITEM_LIST', this.mainTableFields)
            // }
            this.activeStep += 1
          }
        })
      } else {
        let model = ''
        if (this.dataForm.formType == 1) {
          model = 'fieldForm'
        } else {
          model = 'generator'
        }
        this.$refs[model].getData().then(res => {
          this.formData = res.formData
          this.activeStep += 1
        }).catch(err => {
          err.msg && this.$message.warning(err.msg)
        })
      }
    },
    typeChange (val) {
      // if (val == 1) {
      //   this.dataForm.icon = ''
      //   this.dataForm.iconBackground = '#008cff'
      // }
    },
    openIconBox () { this.iconBoxVisible = true },
    choiceIcon (value) {
      // this.dataForm.icon = value
    },
    onStartChange (node) {
      // console.log(node);
    }
  }
}
</script>