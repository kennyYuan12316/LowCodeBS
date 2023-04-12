<template>
	<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
					<el-col :span="24">
						<el-form-item label-width="0">
							<HSZ-Text value="盘点计划" :textStyle='{"color":"#000000","text-align":"center","font-weight":"bold","font-style":"normal","text-decoration":"none","line-height":32,"font-size":20}' :style='{"width":"100%"}'></HSZ-Text>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="盘点单据号" prop="inventoryNo">
							<el-input v-model='dataForm.inventoryNo' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="盘点类型" prop="inventoryType">
							<el-select v-model='dataForm.inventoryType' placeholder='请选择' clearable required :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in inventoryTypeOptions" :key="index" :label="item.fullName" :value="item.id" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="开始时间" prop="startTime">
							<el-date-picker v-model='dataForm.startTime' placeholder='请选择' clearable required :style='{"width":"100%"}' type='datetime' format='yyyy-MM-dd HH:mm:ss' value-format='timestamp' >
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="结束时间" prop="endTime">
							<el-date-picker v-model='dataForm.endTime' placeholder='请选择' clearable required :style='{"width":"100%"}' type='datetime' format='yyyy-MM-dd HH:mm:ss' value-format='timestamp' >
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="描述" prop="description">
							<el-input v-model='dataForm.description' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if='false' >
						<el-form-item label="创建用户" prop="createUser">
							<el-input v-model='dataForm.createUser' placeholder='系统自动生成' readonly >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if='false' >
						<el-form-item label="创建时间" prop="createTime">
							<el-input v-model='dataForm.createTime' placeholder='系统自动生成' readonly >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if='false' >
						<el-form-item label="修改用户" prop="lastModifyUserId">
							<el-input v-model='dataForm.lastModifyUserId' placeholder='系统自动生成' readonly >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if='false' >
						<el-form-item label="修改时间" prop="lastModifyTime">
							<el-input v-model='dataForm.lastModifyTime' placeholder='系统自动生成' readonly >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="有效标志" prop="enabledMark">
							<el-radio-group v-model='dataForm.enabledMark' required :style='{}' >
								<el-radio v-for="(item, index) in enabledMarkOptions" :key="index" :label="item.id"  >{{item.fullName}}</el-radio>
							</el-radio-group>
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
			return {
				btnLoading:false,
				loading: false,
				visible: false,
				isDetail: false,
				dataForm: {
					id:'',
					inventoryNo:undefined,
					inventoryType:undefined,
					startTime:undefined,
					endTime:undefined,
					description:undefined,
					createUser:undefined,
					createTime:undefined,
					lastModifyUserId:undefined,
					lastModifyTime:undefined,
					enabledMark:"1",
				},
				rules: {
					inventoryNo:[
						{
							required:true,
							message:'请输入盘点单据号',
							trigger:'blur'
						},
					],
					inventoryType:[
						{
							required:true,
							message:'请输入盘点类型',
							trigger:'change'
						},
					],
					startTime:[
						{
							required:true,
							message:'请输入开始时间',
							trigger:'change'
						},
					],
					endTime:[
						{
							required:true,
							message:'请输入结束时间',
							trigger:'change'
						},
					],
					enabledMark:[
						{
							required:true,
							message:'请输入有效标志',
							trigger:'change'
						},
					],
				},
				inventoryTypeOptions : [],
				enabledMarkOptions:[{'fullName':"禁用",'id':"0"},{'fullName':"启用",'id':"1"}],
			}
		},
		computed: {},
        watch: {},
        created() {
			this.getinventoryTypeOptions();
		},
		mounted() {
        },
		methods: {
			getinventoryTypeOptions(){
				getDictionaryDataSelector('327971490504901893').then(res => {
					this.inventoryTypeOptions = res.data.list
				});
			},
			goBack() {
                this.$emit('refresh')
            },
			init(id, isDetail) {
				this.dataForm.id = id || 0;
                this.visible = true;
                this.isDetail = isDetail || false;
				this.$nextTick(() => {
					this.$refs['elForm'].resetFields();
					if (this.dataForm.id) {
						request({
							url: '/api/wms/ZjnPlaneInventoryPlan/' + this.dataForm.id,
							method: 'get'
						}).then(res =>{
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
                        if (!this.dataForm.id) {
                            request({
                                url: `/api/wms/ZjnPlaneInventoryPlan`,
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
                                url: '/api/wms/ZjnPlaneInventoryPlan/' + this.dataForm.id,
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
