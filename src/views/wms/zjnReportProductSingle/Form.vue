<template>
	<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
					<el-col :span="24">
						<el-form-item label-width="0">
							<HSZ-Text value="成品库单体" :textStyle='{"color":"#000000","text-align":"center","font-weight":"bold","font-style":"normal","text-decoration":"none","line-height":32,"font-size":20}' :style='{"width":"100%"}'></HSZ-Text>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="所属托盘" prop="tray">
							<el-input v-model='dataForm.tray' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="电芯条码" prop="batteryCode">
							<el-input v-model='dataForm.batteryCode' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="生产单号" prop="productionOrder">
							<el-input v-model='dataForm.productionOrder' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="物料编码" prop="productsCode">
							<el-input v-model='dataForm.productsCode' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="物料名称" prop="productsName">
							<el-input v-model='dataForm.productsName' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="32位批次号" prop="batch">
							<el-input v-model='dataForm.batch' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="入库单" prop="entryOrder">
							<el-input v-model='dataForm.entryOrder' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					
					<el-col :span="24">
						<el-form-item label="首次入库时间" prop="entryTimeFitrst">
							<el-date-picker v-model='dataForm.entryTimeFitrst' placeholder='请选择' clearable :style='{"width":"100%"}' type='datetime' format='yyyy-MM-dd HH:mm:ss' value-format='timestamp' >
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="入库时间" prop="entryTime">
							<el-date-picker v-model='dataForm.entryTime' placeholder='请选择' clearable :style='{"width":"100%"}' type='datetime' format='yyyy-MM-dd HH:mm:ss' value-format='timestamp' >
							</el-date-picker>
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
						<el-form-item label="质量状态" prop="quality">
							<el-input v-model='dataForm.quality' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="产品标识" prop="productionMark">
							<el-input v-model='dataForm.productionMark' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="库存标识" prop="inventoryMark">
							<el-input v-model='dataForm.inventoryMark' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="等级标识" prop="classMark">
							<el-input v-model='dataForm.classMark' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="电压" prop="voltage">
							<el-input-number v-model='dataForm.voltage' placeholder='数字文本' :step='1' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="安时" prop="ah">
							<el-input-number v-model='dataForm.ah' placeholder='数字文本' :step='1' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="交流电阻" prop="acr">
							<el-input-number v-model='dataForm.acr' placeholder='数字文本' :step='1' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="直流电阻" prop="dcr">
							<el-input-number v-model='dataForm.dcr' placeholder='数字文本' :step='1' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="K值" prop="kValue">
							<el-input-number v-model='dataForm.kValue' placeholder='数字文本' :step='1' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="生产时间" prop="productionTime">
							<el-date-picker v-model='dataForm.productionTime' placeholder='请选择' clearable :style='{"width":"100%"}' type='datetime' format='yyyy-MM-dd HH:mm:ss' value-format='timestamp' >
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="生产线" prop="lineNum">
							<el-input v-model='dataForm.lineNum' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="生产线状态" prop="lineStatus">
							<el-input v-model='dataForm.lineStatus' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="通道号" prop="channelNum">
							<el-input-number v-model='dataForm.channelNum' placeholder='数字文本' :step='1' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="位置" prop="location">
							<el-input v-model='dataForm.location' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="10">
						<el-form-item label="是否冻结" prop="freeze">
							<el-input v-model='dataForm.freeze' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="14">
						<el-form-item label="冻结原因" prop="freezeResult">
							<el-input v-model='dataForm.freezeResult' placeholder='请输入' clearable :style='{"width":"100%"}' >
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
					tray:undefined,
					batteryCode:undefined,
					productionOrder:undefined,
					productsCode:undefined,
					productsName:undefined,
					batch:undefined,
					entryOrder:undefined,
					comboTime:undefined,
					entryTimeFitrst:undefined,
					entryTime:undefined,
					productsQuantity:undefined,
					productsUnit:undefined,
					quality:undefined,
					productionMark:undefined,
					inventoryMark:undefined,
					classMark:undefined,
					voltage:undefined,
					ah:undefined,
					acr:undefined,
					dcr:undefined,
					kValue:undefined,
					productionTime:undefined,
					lineNum:undefined,
					lineStatus:undefined,
					channelNum:undefined,
					location:undefined,
					freeze:undefined,
					freezeResult:undefined,
				},
				rules: {
					tray:[
						{
							required:true,
							message:'请输入所属托盘',
							trigger:'blur'
						},
					],
					batteryCode:[
						{
							required:true,
							message:'请输入电芯条码',
							trigger:'blur'
						},
					],
					batch:[
						{
							required:true,
							message:'请输入32位批次号',
							trigger:'blur'
						},
					],
					entryOrder:[
						{
							required:true,
							message:'请输入入库单',
							trigger:'blur'
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
							url: '/api/wms/ZjnReportProductSingle/' + this.dataForm.id,
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
                                url: `/api/wms/ZjnReportProductSingle`,
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
                                url: '/api/wms/ZjnReportProductSingle/' + this.dataForm.id,
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
