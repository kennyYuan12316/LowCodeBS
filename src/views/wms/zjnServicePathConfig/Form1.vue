<template>
	<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
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
						<el-form-item label="业务类型" prop="workType">
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
						<el-form-item label="起点工位" prop="workStart">
							<el-select v-model='dataForm.workStart' placeholder='请选择' clearable :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in workStartOptions" :key="index" :label="item.Capion" :value="item.StationID" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="终点工位" prop="workEnd">
							<el-select v-model='dataForm.workEnd' placeholder='请选择' clearable :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in workEndOptions" :key="index" :label="item.Capion" :value="item.StationID" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="是否存在动态站点" prop="workNodes">
							<el-switch v-model='dataForm.workNodes' :active-value='1' :inactive-value='0' >
							</el-switch>
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
					workNo:undefined,
					workName:undefined,
					workType:undefined,
					workWarehouse:undefined,
					workStart:undefined,
					workEnd:undefined,
					workNodes:0,
					createUser:undefined,
					createTime:undefined,
					lastModifyUserId:undefined,
					lastModifyTime:undefined,
				},
				rules: {
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
					workWarehouse:[
						{
							required:true,
							message:'请输入所属库位',
							trigger:'change'
						},
					],
				},
				workTypeOptions:[],
				workWarehouseOptions:[],
				workStartOptions : [],
				workEndOptions : [],
			}
		},
		computed: {},
        watch: {},
        created() {
			this.getworkStartOptions();
			this.getworkEndOptions();
			this.getworkTypeOptions();
			this.getworkWarehouseOptions();

		},
		mounted() {
        },
		methods: {
			getworkTypeOptions(){
				getDictionaryDataSelector('343644098072151301').then(res => {
					this.workTypeOptions = res.data.list
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
							url: '/api/wms/ZjnWcsProcessConfig/' + this.dataForm.id,
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
                                url: `/api/wms/ZjnWcsProcessConfig`,
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
                                url: '/api/wms/ZjnWcsProcessConfig/' + this.dataForm.id,
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
