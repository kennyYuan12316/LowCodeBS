<template>
	<transition name="el-zoom-in-center">
		<div class="HSZ-preview-main">
			<div class="HSZ-common-page-header">
				<el-page-header @back="goBack" :content="!dataForm.id ? '新建' : isDetail ? '详情' : '编辑'"/>
				<div class="options">
					<el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail" :loading="btnLoading">确 定</el-button>
					<el-button @click="goBack">取 消</el-button>
				</div>
			</div>
			<div :style="{margin: '0 auto',width:'100%'}">
				<el-row :gutter="15" class=" main">
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right" :disabled="!!isDetail" :rules="rules">
					<el-col :span="8">
						<el-form-item label="物料编码" prop="goodsCode">
							<el-input id="No" v-model='dataForm.goodsCode' placeholder='请输入' required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="物料名称" prop="goodsName">
							<el-input v-model='dataForm.goodsName' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="物料类型" prop="goodsType">
							<el-select v-model='dataForm.goodsType' placeholder='请选择' clearable required :style='{"width":"100%"}' filterable >
								<el-option v-for="(item, index) in goodsTypeOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="物料单位" prop="unit">
							<el-select v-model='dataForm.unit' placeholder='请选择' clearable required :style='{"width":"100%"}' filterable >
								<el-option v-for="(item, index) in unitOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="物料状态" prop="goodsState">
							<el-select v-model='dataForm.goodsState' placeholder='请选择' clearable required :style='{"width":"100%"}' filterable >
								<el-option v-for="(item, index) in goodsStateOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="检验类型" prop="checkType">
							<el-select v-model='dataForm.checkType' placeholder='请选择' clearable required :style='{"width":"100%"}' filterable >
								<el-option v-for="(item, index) in checkTypeOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="物料规格" prop="specifications">
							<el-input v-model='dataForm.specifications' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="库存上限" prop="Ceiling">
							<el-input  v-model='dataForm.Ceiling' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="库存下限" prop="TheLowerLimit">
							<el-input  v-model='dataForm.TheLowerLimit' placeholder='请输入' clearable required :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="客户编码" prop="customerId">
							<el-input v-model='dataForm.customerId' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="供应商编码" prop="vendorId">
							<el-input v-model='dataForm.vendorId' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="保质期" prop="ShelfLife">
							<el-input v-model='dataForm.ShelfLife' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="预警周期(天)" prop="tellDate">
							<el-input v-model='dataForm.tellDate' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="16">
						<el-form-item label="禁用原因" prop="disableMark">
							<el-input v-model='dataForm.disableMark' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col>
				</el-form>
				</el-row>
			</div>
		</div>
	</transition>
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
					TheLowerLimit:undefined,
					Ceiling:undefined,
					goodsCode:undefined,
					goodsName:undefined,
					goodsType:undefined,
					unit:undefined,
					goodsState:"1",
					checkType:"0",
					specifications:undefined,
					customerId:undefined,
					vendorId:undefined,
					isFirstOut:"0",
					tellDate:undefined,
					disableMark:undefined,
					ShelfLife:undefined
				},
				rules: {
					goodsCode:[
						{
							required:true,
							message:'请输入物料编码',
							trigger:'blur'
						},
					],
					goodsName:[
						{
							required:true,
							message:'请输入物料名称',
							trigger:'blur'
						},
					],
					goodsType:[
						{
							required:true,
							message:'请输入物料类型',
							trigger:'change'
						},
					],
					unit:[
						{
							required:true,
							message:'请输入物料单位',
							trigger:'change'
						},
					],
					goodsState:[
						{
							required:true,
							message:'请输入物料状态',
							trigger:'change'
						},
					],					
					ShelfLife:[{
						required:true,
							message:'请输入保质期',
							trigger:'change'
					}]
				},
				goodsTypeOptions : [],
				unitOptions : [],
				goodsStateOptions : [],
				checkTypeOptions : [],
				isFirstOutOptions:[{'fullName':"是",'id':"1"},{'fullName':"否",'id':"0"}],
			}
		},
		computed: {},
        watch: {},
        created() {
			this.getgoodsTypeOptions();
			this.getunitOptions();
			this.getgoodsStateOptions();
			this.getcheckTypeOptions();
		},
		mounted() {
        },
		methods: {
			getgoodsTypeOptions(){
				getDictionaryDataSelector('325449144728552709').then(res => {
					this.goodsTypeOptions = res.data.list
				});
			},
			getunitOptions(){
				getDictionaryDataSelector('326384591566800133').then(res => {
					this.unitOptions = res.data.list
				});
			},
			getgoodsStateOptions(){
				getDictionaryDataSelector('326590282281780485').then(res => {
					this.goodsStateOptions = res.data.list
				});
			},
			getcheckTypeOptions(){
				getDictionaryDataSelector('325448312364729605').then(res => {
					this.checkTypeOptions = res.data.list
				});
			},
			goBack() {
                this.$emit('refresh')
            },
			init(id, isDetail) {
				console.log(isDetail);
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
							url: '/api/wms/ZjnWmsGoods/' + this.dataForm.id,
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
                                url: `/api/wms/ZjnWmsGoods`,
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
                                url: '/api/wms/ZjnWmsGoods/' + this.dataForm.id,
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
