<template>
	<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
					<el-col :span="12">
						<el-form-item label="托盘编号" prop="trayNo">
							<el-input id="No" v-model='dataForm.trayNo' placeholder='请输入'  required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="托盘类型" prop="type">
							<el-select v-model='dataForm.type' placeholder='请选择' clearable required :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in typeOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="托盘状态" prop="trayState">
							<el-select v-model='dataForm.trayState' placeholder='请选择' required :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in trayStateOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="禁用原因" prop="disableMark">
							<el-input v-model='dataForm.disableMark' placeholder='请输入' clearable :style='{"width":"100%"}' >
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
			return {
				btnLoading:false,
				loading: false,
				visible: false,
				isDetail: false,
				
				dataForm: {
					id:'',
					trayNo:undefined,
					type:"2",
					trayState:"1",
					isDelete:undefined,
					disableMark:undefined,
					createTime:undefined,
					createUser:undefined,
					lastModifyTime:undefined,
					lastModifyUserId:undefined,
				},
				rules: {
					trayNo:[
						{
							required:true,
							message:'请输入托盘编号',
							trigger:'blur'
						},
					],
					type:[
						{
							required:true,
							message:'请输入托盘类型',
							trigger:'change'
						},
					],
					trayState:[
						{
							required:true,
							message:'请输入托盘状态',
							trigger:'change'
						},
					],
				},
				typeOptions : [],
				trayStateOptions : [],
			}
		},
		computed: {},
        watch: {},
        created() {
			this.gettypeOptions();
			this.gettrayStateOptions();
		},
		mounted() {
        },
		methods: {
			gettypeOptions(){
				getDictionaryDataSelector('332411089230759173').then(res => {
					this.typeOptions = res.data.list
				});
			},
			gettrayStateOptions(){
				getDictionaryDataSelector('332412309932606725').then(res => {
					this.trayStateOptions = res.data.list
				});
			},
			goBack() {
                this.$emit('refresh')
            },
			init(id, isDetail) {
				this.dataForm.id = id || 0;
                this.visible = true;
                this.isDetail = isDetail || false; 
		        var txt = document.getElementById('No');
				if(txt!=null){
				   console.log(txt);
                   txt.disabled = false;
				}       
				this.$nextTick(() => {
					this.$refs['elForm'].resetFields();
					if (this.dataForm.id) {
						request({
							url: '/api/wms/ZjnPlaneTray/' + this.dataForm.id,
							method: 'get'
						}).then(res =>{
							this.dataForm = res.data;
							var txts = document.getElementById('No');
							txts.disabled = true;   
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
                                url: `/api/wms/ZjnPlaneTray`,
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
                                url: '/api/wms/ZjnPlaneTray/' + this.dataForm.id,
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
