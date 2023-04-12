<template>
	<el-dialog :title="!dataForm.id ? '新建' :  isDetail ? '详情':'编辑'" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="800px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
					<el-col :span="12">
						<el-form-item label="名称" prop="caption">
							<el-input v-model='dataForm.caption' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
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
						<el-form-item label="PlcId" prop="plcId">
							<popupSelect v-model='dataForm.plcId' field='plcId' placeholder='请选择' clearable relationField='PlcID' :columnOptions='plcIdOptions' :pageSize='20' propsValue='PlcID' interfaceId='348275272966997253' popupType='dialog' popupTitle='选择数据' popupWidth='800px' >
							</popupSelect>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="DB" prop="db">
							<el-input-number v-model='dataForm.db' placeholder='数字文本' :step='1' controls-position='right' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="起点" prop="start">
							<el-input-number v-model='dataForm.start' placeholder='数字文本' :step='1' controls-position='right' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="长度" prop="length">
							<el-input-number v-model='dataForm.length' placeholder='数字文本' :step='1' controls-position='right' >
							</el-input-number>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="List对象数量" prop="listCount">
							<el-input-number v-model='dataForm.listCount' placeholder='数字文本' :step='1' controls-position='right' >
							</el-input-number>
						</el-form-item>
					</el-col>
					
					
					<el-col :span="12">
						<el-form-item label="是否List对象" prop="isList">
							<el-switch v-model='dataForm.isList' :active-value='true' :inactive-value='false' >
							</el-switch>
						</el-form-item>
					</el-col>
					
					<el-col :span="12">
						<el-form-item label="对象名称" prop="objType">
							<el-input v-model='dataForm.objType' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="是否有效" prop="isActive">
							<el-switch v-model='dataForm.isActive' :active-value='true' :inactive-value='false' >
							</el-switch>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="值" prop="objValue">
							<el-input v-model='dataForm.objValue' placeholder='请输入' required show-word-limit :style='{"width":"100%"}' type='textarea' :autosize='{"minRows":4,"maxRows":4}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="包类型" prop="packType">
							<el-select v-model='dataForm.packType' placeholder='请选择' clearable :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in packTypeOptions" :key="index" :label="item.fullName" :value="item.id" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="包大小" prop="packSize">
							<el-input-number v-model='dataForm.packSize' placeholder='数字文本' :step='1' controls-position='right' >
							</el-input-number>
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
			return {
				btnLoading:false,
				loading: false,
				visible: false,
				isDetail: false,
				dataForm: {
					plcPointId:undefined,
					caption:undefined,
					region:undefined,
					plcId:undefined,
					db:undefined,
					start:undefined,
					length:undefined,
					objType:undefined,
					isActive:0,
					isList:0,
					listCount:undefined,
					objValue:undefined,
					packType:undefined,
					packSize:undefined,
					descrip:undefined,
				},
				rules: {
					db:[
						{
							required:true,
							message:'请输入db',
							trigger:'blur'
						},
					],
					start:[
						{
							required:true,
							message:'请输入start',
							trigger:'blur'
						},
					],
					packSize:[
						{
							required:true,
							message:'请输入包大小',
							trigger:'blur'
						},
					],
				},
				regionOptions : [],
				plcIdOptions : [{"value":"PlcID","label":"PlcID"},{"value":"Caption","label":"设备类型"},{"value":"Region","label":"区域"},{"value":"IP","label":"ip"}],
				packTypeOptions:[{'fullName':"READ",'id':"READ"},{'fullName':"WRITE",'id':"WRITE"},{'fullName':"STATUS",'id':"STATUS"}],
			}
		},
		computed: {},
        watch: {},
        created() {
			this.getregionOptions();
		},
		mounted() {
        },
		methods: {
			getregionOptions(){
				getDictionaryDataSelector('343037780953138437').then(res => {
					this.regionOptions = res.data.list
				});
			},
			goBack() {
                this.$emit('refresh')
            },
			init(id, isDetail) {
				this.dataForm.plcPointId = id || 0;
                this.visible = true;
                this.isDetail = isDetail || false;
				this.$nextTick(() => {
					this.$refs['elForm'].resetFields();
					if (this.dataForm.plcPointId) {
						request({
							url: '/api/wms/ZjnWcsPlcPoint/' + this.dataForm.plcPointId,
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
                        if (!this.dataForm.plcPointId) {
                            request({
                                url: `/api/wms/ZjnWcsPlcPoint`,
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
                                url: '/api/wms/ZjnWcsPlcPoint/' + this.dataForm.plcPointId,
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
