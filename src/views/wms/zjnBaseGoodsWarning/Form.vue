<template>
	<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
					<el-col :span="24">
						<el-form-item label-width="0">
							<HSZ-Text value="库存预警" :textStyle='{"color":"#000000","text-align":"center","font-weight":"bold","font-style":"normal","text-decoration":"none","line-height":32,"font-size":20}' :style='{"width":"100%"}'></HSZ-Text>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="32位批次号" prop="batch">
							<el-input v-model='dataForm.batch' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="物料编码" prop="productsCode">
							<el-input v-model='dataForm.productsCode' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="库存上限" prop="inventoryMax">
							<el-input-number v-model='dataForm.inventoryMax' placeholder='数字文本' required :step='1' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="库存下限" prop="inventoryMin">
							<el-input-number v-model='dataForm.inventoryMin' placeholder='数字文本' required :step='1' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="物料名称" prop="productsName">
							<el-input v-model='dataForm.productsName' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="物料数量" prop="productsQuantity">
							<el-input-number v-model='dataForm.productsQuantity' placeholder='数字文本' :step='1' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="物料单位" prop="productsUnit">
							<el-input v-model='dataForm.productsUnit' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="入库时间" prop="entryTime">
							<el-date-picker v-model='dataForm.entryTime' placeholder='请选择' clearable :style='{"width":"100%"}' type='datetime' format='yyyy-MM-dd HH:mm:ss' value-format='timestamp' >
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="物料类型" prop="productsType">
							<el-input v-model='dataForm.productsType' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="供应商" prop="productsSupplier">
							<el-input v-model='dataForm.productsSupplier' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="保质期" prop="expirationDate">
							<el-input v-model='dataForm.expirationDate' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="生产时间" prop="productionTime">
							<el-date-picker v-model='dataForm.productionTime' placeholder='请选择' clearable :style='{"width":"100%"}' type='datetime' format='yyyy-MM-dd HH:mm:ss' value-format='timestamp' >
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="失效时间" prop="failureTime">
							<el-date-picker v-model='dataForm.failureTime' placeholder='请选择' clearable :style='{"width":"100%"}' type='datetime' format='yyyy-MM-dd HH:mm:ss' value-format='timestamp' >
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="预警周期" prop="warningCycle">
							<el-input v-model='dataForm.warningCycle' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="预警原因" prop="warningResult">
							<el-input v-model='dataForm.warningResult' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="保质期预警" prop="warningTime">
							<el-date-picker v-model='dataForm.warningTime' placeholder='请选择' clearable :style='{"width":"100%"}' type='datetime' format='yyyy-MM-dd HH:mm:ss' value-format='timestamp' >
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
						<el-form-item label="更新时间" prop="createTime">
							<el-input v-model='dataForm.createTime' placeholder='系统自动生成' readonly >
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
					batch:undefined,
					productsCode:undefined,
					inventoryMax:undefined,
					inventoryMin:undefined,
					productsName:undefined,
					productsQuantity:undefined,
					productsUnit:undefined,
					entryTime:undefined,
					productsType:undefined,
					productsSupplier:undefined,
					expirationDate:undefined,
					productionTime:undefined,
					failureTime:undefined,
					warningCycle:undefined,
					warningResult:undefined,
					warningTime:undefined,
					description:undefined,
					createTime:undefined,
				},
				rules: {
					batch:[
						{
							required:true,
							message:'请输入32位批次号',
							trigger:'blur'
						},
					],
					productsCode:[
						{
							required:true,
							message:'请输入物料编码',
							trigger:'blur'
						},
					],
					inventoryMax:[
						{
							required:true,
							message:'请输入库存上限',
							trigger:["blur","change"]
						},
					],
					inventoryMin:[
						{
							required:true,
							message:'请输入库存下限',
							trigger:["blur","change"]
						},
					],
				},
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
							url: '/api/wms/ZjnBaseGoodsWarning/' + this.dataForm.id,
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
                                url: `/api/wms/ZjnBaseGoodsWarning`,
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
                                url: '/api/wms/ZjnBaseGoodsWarning/' + this.dataForm.id,
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
