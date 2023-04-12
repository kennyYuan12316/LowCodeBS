<template>
	<transition name="el-zoom-in-center">
		<div class="HSZ-preview-main">
			<div class="HSZ-common-page-header">
				<el-page-header @back="goBack" content="详情"/>
				<div class="options">
					<el-button @click="goBack">取 消</el-button>
				</div>
			</div>
			<div :style="{margin: '0 auto',width:'100%'}">
				<el-row :gutter="15" class=" main">
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="8">
						<el-form-item label="物料编码" label-width="100px">
							<p>{{dataForm.goodsCode}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="物料名称" label-width="100px">
							<p>{{dataForm.goodsName}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="物料类型" prop="goodsType">
							<el-select v-model='dataForm.goodsType' placeholder='请选择'   disabled :style='{"width":"100%"}'  >
								<el-option v-for="(item, index) in goodsTypeOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
						
					</el-col>
					<el-col :span="8">
                    <el-form-item label="物料单位" prop="unit">
							<el-select v-model='dataForm.unit' placeholder='请选择' disabled required :style='{"width":"100%"}' filterable >
								<el-option v-for="(item, index) in unitOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="物料状态" prop="goodsState">
							<el-select v-model='dataForm.goodsState' placeholder='请选择' disabled required :style='{"width":"100%"}' filterable >
								<el-option v-for="(item, index) in goodsStateOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
						
					</el-col>
					<el-col :span="8">

						<el-form-item label="检验类型" prop="checkType">
							<el-select v-model='dataForm.checkType' placeholder='请选择' disabled clearable required :style='{"width":"100%"}' filterable >
								<el-option v-for="(item, index) in checkTypeOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
						
					</el-col>
					<el-col :span="8">
						<el-form-item label="物料规格" label-width="100px">
							<p>{{dataForm.specifications}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="库存上限" label-width="100px">
							<p>{{dataForm.Ceiling}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="库存下限" label-width="100px">
							<p>{{dataForm.TheLowerLimit}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="客户编码" label-width="100px">
							<p>{{dataForm.customerId}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="供应商编码" label-width="100px">
							<p>{{dataForm.vendorId}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="保质期" label-width="100px">
							<p>{{dataForm.ShelfLife}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="预警周期(天)" label-width="100px">
							<p>{{dataForm.tellDate}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="16">
						<el-form-item label="禁用原因" label-width="100px">
							<p>{{dataForm.disableMark}}</p>
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
	export default {
		props: [],
		data() {
			return {
				loading: false,
				visible: false,
				goodsTypeOptions:false,
				goodsStateOptions:false,
				unitOptions:false,
				checkTypeOptions:false,
				dataForm: {
					id:'',
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
				},
				goodsTypeOptions : [],
			}
		},
		created() {
          this.getgoodsTypeOptions();
          this.getunitOptions();
		  this.getgoodsStateOptions();
		  this.getcheckTypeOptions();
		},
		mounted() {
        },
		methods: {
			getcheckTypeOptions(){
				getDictionaryDataSelector('325448312364729605').then(res => {
					this.checkTypeOptions = res.data.list
				});
			},
			getgoodsStateOptions(){
				getDictionaryDataSelector('326590282281780485').then(res => {
					this.goodsStateOptions = res.data.list
				});
			},
			getunitOptions(){
				getDictionaryDataSelector('326384591566800133').then(res => {
					this.unitOptions = res.data.list
				});
			},
			getgoodsTypeOptions(){
				getDictionaryDataSelector('325449144728552709').then(res => {
					this.goodsTypeOptions = res.data.list
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
							url: '/api/wms/ZjnWmsGoods/' + this.dataForm.id,
							method: 'get'
						}).then(res =>{
							this.dataForm = res.data;
						})
					}
				})
			},
		}
	}
</script>
