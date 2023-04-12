<template>
	<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
					<el-col :span="24">
						<el-form-item label="客户编号" prop="customerNo">
							<el-input v-model='dataForm.customerNo' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="客户名称" prop="customerName">
							<el-input v-model='dataForm.customerName' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="联系地址" prop="customerAddress">
							<el-input v-model='dataForm.customerAddress' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="联系方式" prop="customerPhone">
							<el-input v-model='dataForm.customerPhone' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="联系人姓名" prop="contactName">
							<el-input v-model='dataForm.contactName' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="描述" prop="description">
							<el-input v-model='dataForm.description' placeholder='请输入' show-word-limit :style='{"width":"100%"}' type='textarea' :autosize='{"minRows":4,"maxRows":4}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="有效标志" prop="enabledMark">
							<el-radio-group v-model='dataForm.enabledMark' :style='{}'>
								<el-radio v-for="(item, index) in enabledMarkOptions" required :key="index" :label="item.id"  >{{item.fullName}}</el-radio>
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
					customerNo:undefined,
					customerName:undefined,
					customerAddress:undefined,
					customerPhone:undefined,
					contactName:undefined,
					description:undefined,
					enabledMark:"1",
				},
				rules: {
					customerNo:[
						{
							required:true,
							message:'请输入客户编号',
							trigger:'blur'
						},
					],
          enabledMark:[
          	{
          		required:true,
          		message:'请选择有效标志',
          		trigger:'blur'
          	},
          ],
					customerName:[
						{
							required:true,
							message:'请输入客户名称',
							trigger:'blur'
						},
					],
					customerAddress:[
						{
							required:true,
							message:'请输入联系地址',
							trigger:'blur'
						},
					],
					customerPhone:[
						{
							required:true,
							message:'请输入联系方式',
							trigger:'blur'
						},
					],
				},
				enabledMarkOptions:[{'fullName':"启用",'id':"1"},{'fullName':"禁用",'id':"0"}],
			}
		},
		computed: {},
        watch: {},
        created() {
		},
		mounted() {
        },
		methods: {
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
							url: '/api/wms/ZjnBaseCustomer/' + this.dataForm.id,
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
                                url: `/api/wms/ZjnBaseCustomer`,
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
                                url: '/api/wms/ZjnBaseCustomer/' + this.dataForm.id,
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
