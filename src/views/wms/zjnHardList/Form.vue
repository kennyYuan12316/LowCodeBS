<template>
	<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
					<el-col :span="24">
						<el-form-item label-width="0">
							<HSZ-Text value="设备信息" :textStyle='{"color":"#000000","text-align":"center","font-weight":"bold","font-style":"normal","text-decoration":"none","line-height":32,"font-size":32}' :style='{"width":"100%"}'></HSZ-Text>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="设备编号" prop="hardNo">
							<el-input v-model='dataForm.hardNo' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="设备名称" prop="hardName">
							<el-input v-model='dataForm.hardName' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="类型" prop="type">
							<el-select v-model='dataForm.type' placeholder='请选择' clearable required :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in typeOptions" :key="index" :label="item.fullName" :value="item.id" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="虚拟设备" prop="fictitiousHard">
							<el-radio-group v-model='dataForm.fictitiousHard' required :style='{}' >
								<el-radio v-for="(item, index) in fictitiousHardOptions" :key="index" :label="item.id"  >{{item.fullName}}</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if='false' >
						<el-form-item label="创建者" prop="createUser">
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
						<el-form-item label="状态" prop="status">
							<el-input v-model='dataForm.status' placeholder='请输入' clearable required :style='{"width":"100%"}' >
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
					hardNo:undefined,
					hardName:undefined,
					type:"1",
					fictitiousHard:"0",
					createUser:undefined,
					createTime:undefined,
					status:undefined,
				},
				rules: {
					hardNo:[
						{
							required:true,
							message:'请输入设备编号',
							trigger:'blur'
						},
					],
					hardName:[
						{
							required:true,
							message:'请输入设备名称',
							trigger:'blur'
						},
					],
					type:[
						{
							required:true,
							message:'请输入类型',
							trigger:'change'
						},
					],
					fictitiousHard:[
						{
							required:true,
							message:'请输入虚拟设备',
							trigger:'change'
						},
					],
					status:[
						{
							required:true,
							message:'请输入状态',
							trigger:'blur'
						},
					],
				},
				typeOptions:[{'fullName':"堆垛机",'id':"1"},{'fullName':"提升机",'id':"2"},{'fullName':"AGV",'id':"3"},{'fullName':"拆叠盘机",'id':"4"},{'fullName':"RGV",'id':""},{'fullName':"顶升机",'id':""}],
				fictitiousHardOptions:[{'fullName':"是",'id':"1"},{'fullName':"否",'id':"0"}],
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
							url: '/api/wms/ZjnHardList/' + this.dataForm.id,
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
                                url: `/api/wms/ZjnHardList`,
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
                                url: '/api/wms/ZjnHardList/' + this.dataForm.id,
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
