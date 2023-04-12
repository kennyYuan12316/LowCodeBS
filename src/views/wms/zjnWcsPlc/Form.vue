<template>
	<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="800px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
					<el-col :span="12">
						<el-form-item label="plcId" prop="plcId">
							<el-input v-model='dataForm.plcId' :disabled="!!id" placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="设备类型" prop="caption">
							<el-select v-model='dataForm.caption' placeholder='请选择' clearable :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in captionOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="区域" prop="region">
							<el-select v-model='dataForm.region' placeholder='请选择' clearable :style='{"width":"100%"}' filterable >
								<el-option v-for="(item, index) in regionOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="cpu类型" prop="cpuType">
							<el-select v-model='dataForm.cpuType' placeholder='请选择' clearable :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in cpuTypeOptions" :key="index" :label="item.fullName" :value="item.id" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="ip" prop="ip">
							<el-input v-model='dataForm.ip' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="port" prop="port">
							<el-input-number v-model='dataForm.port' placeholder='数字文本' :step='1' controls-position='right' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="Plc读写超时MS" label-width="120px" prop="timeOut">
							<el-input-number v-model='dataForm.timeOut' placeholder='数字文本' required :step='1' controls-position='right' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="Plc Rack" prop="rack">
							<el-input-number v-model='dataForm.rack' placeholder='数字文本' :step='1' controls-position='right' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="Plc Sock" prop="sock">
							<el-input-number v-model='dataForm.sock' placeholder='数字文本' :step='1' controls-position='right' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="是否有效" prop="isActive">
							<el-switch v-model='dataForm.isActive' :active-value='true' :inactive-value='false' >
							</el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="连接状态" prop="isConnected">
							<el-switch v-model='dataForm.isConnected' :active-value='true' :inactive-value='false' >
							</el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="是否堆垛机" prop="isStacker">
							<el-switch v-model='dataForm.isStacker' :active-value='true' :inactive-value='false' >
							</el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="堆垛机Id" prop="stackerId">
							<el-input v-model='dataForm.stackerId' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="异常" prop="error">
							<el-input v-model='dataForm.error' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="描述" prop="descrip">
							<el-input v-model='dataForm.descrip' placeholder='请输入' show-word-limit :style='{"width":"100%"}' type='textarea' :autosize='{"minRows":4,"maxRows":4}' >
							</el-input>
						</el-form-item>
					</el-col>
				</el-form>
		</el-row>
		<span slot="footer" class="dialog-footer">
			<el-button @click="visible=false">取 消</el-button>
			<el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail" :loading="btnLoading">确 定</el-button>
		</span>
	</el-dialog>
</template>
<script>
	import request from '@/utils/request'
	import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
	import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
	export default {
		components: {},
		props: [],
		data() {
			var checkPlcId = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入plcId'))
      } else {
        if (!this.id) {
          request({
            url: `/api/wms/ZjnWcsPlc/ExistPlcId`,
            method: 'GET',
            data: { PlcId: value }
          }).then((res) => {
            if (res.data) {
              callback(new Error('plcId已存在！'))
            } else {
              callback()
            }
          })
        } else {
          callback()
        }
      }
    }
			return {
				btnLoading:false,
				loading: false,
				visible: false,
				isDetail: false,
				id:undefined,//判断新增/修改
				dataForm: {
					plcId:'',
					caption:undefined,
					region:undefined,
					cpuType:undefined,
					ip:undefined,
					port:undefined,
					timeOut:undefined,
					rack:undefined,
					sock:undefined,
					isActive:0,
					isConnected:0,
					isStacker:0,
					stackerId:undefined,
					error:undefined,
					descrip:undefined,
				},
				rules: {
					plcId:[
						{
							required:true,
                            // message: '请输入plcId',
                            trigger: 'blur',
                            validator: checkPlcId
						},
					],
					timeOut:[
						{
							required:true,
							message:'请输入Plc读写超时MS',
							trigger:["blur","change"]
						},
					],
				},
				captionOptions : [],
				regionOptions : [],
				cpuTypeOptions:[{'fullName':"S7-1500",'id':"40"},{'fullName':"S7-1200",'id':"30"},{'fullName':"S7-400",'id':"20"},{'fullName':"S7-300",'id':"10"},{'fullName':"S7-200",'id':"0"}],
			}
		},
		computed: {},
        watch: {},
        created() {
			this.getcaptionOptions();
			this.getregionOptions();
		},
		mounted() {
        },
		methods: {
			getcaptionOptions(){
				getDictionaryDataSelector('343042755552871685').then(res => {
					this.captionOptions = res.data.list
				});
			},
			getregionOptions(){
				getDictionaryDataSelector('343037780953138437').then(res => {
					this.regionOptions = res.data.list
				});
			},
			goBack() {
                this.$emit('refresh')
            },
			init(id, isDetail) {
				this.id = id || 0;
				this.dataForm.plcId=id;
                this.visible = true;
                this.isDetail = isDetail || false;
				this.$nextTick(() => {
					this.$refs['elForm'].resetFields();
					if (this.id) {
						request({
							url: '/api/wms/ZjnWcsPlc/' + this.dataForm.plcId,
							method: 'get'
						}).then(res =>{
							this.id=1;
							this.dataForm = res.data;
						})
					}
				});
				this.$store.commit('generator/UPDATE_RELATION_DATA', {})
			},
			dataFormSubmit() {
				this.$refs['elForm'].validate((valid) => {
                    if (valid) {
						this.btnLoading = true;
                        if (!this.id) {
                            request({
                                url: `/api/wms/ZjnWcsPlc`,
                                method: 'post',
                                data: this.dataForm,
                            }).then((res) => {
                                this.$message({
                                    message: res.msg,
                                    type: 'success',
                                    duration: 1000,
                                    onClose: () => {
										this.btnLoading = false;
                                        this.visible = false,
                                        this.$emit('refresh', true)
                                    }
                                })
                            })
                        } else {
                            request({
                                url: '/api/wms/ZjnWcsPlc/' + this.dataForm.plcId,
                                method: 'PUT',
                                data: this.dataForm
                            }).then((res) => {
                                this.$message({
                                    message: res.msg,
                                    type: 'success',
                                    duration: 1000,
                                    onClose: () => {
										this.btnLoading = false;
                                        this.visible = false
                                        this.$emit('refresh', true)
                                    }
                                })
                            })
                        }
                    }
                })
			},
		}
	}
</script>
