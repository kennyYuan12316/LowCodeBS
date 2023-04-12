<template>
	<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
					<el-col :span="24">
						<el-form-item label="物料编码" prop="goodsCode">
							<popupSelect v-model='dataForm.goodsCode' field='goodsCode' placeholder='请选择' clearable required relationField='fullName' :columnOptions='goodsCodeOptions' hasPage :pageSize='20' propsValue='id' interfaceId='350075271526745349' popupType='dialog' popupTitle='选择数据' popupWidth='800px' >
							</popupSelect>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="最小承重" prop="min">
							<el-input-number v-model='dataForm.min' placeholder='数字文本' :step='1' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="最大承重" prop="max">
							<el-input-number v-model='dataForm.max' placeholder='数字文本' required :step='1' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="物料单位" prop="unit">
							<el-select v-model='dataForm.unit' placeholder='请选择' clearable :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in unitOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
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
					goodsCode:undefined,
					min:undefined,
					max:undefined,
					unit:undefined,
				},
				rules: {
					goodsCode:[
						{
							required:true,
							message:'请输入物料编码',
							trigger:'change'
						},
					],
					max:[
						{
							required:true,
							message:'请输入最大承重',
							trigger:["blur","change"]
						},
					],
				},
				goodsCodeOptions : [{"value":"id","label":"物料编码"},{"value":"fullName","label":"物料名称"},{"value":"unit","label":"单位"},{"value":"goodsState","label":"物料状态"},{"value":"goodsType","label":"物料类型"}],
				unitOptions : [],
			}
		},
		computed: {},
        watch: {},
        created() {
			this.getunitOptions();
		},
		mounted() {
        },
		methods: {
			getunitOptions(){
				getDictionaryDataSelector('326384591566800133').then(res => {
					this.unitOptions = res.data.list
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
							url: '/api/wms/ZjnWmsGoodsWeight/' + this.dataForm.id,
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
                                url: `/api/wms/ZjnWmsGoodsWeight`,
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
                                url: '/api/wms/ZjnWmsGoodsWeight/' + this.dataForm.id,
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
