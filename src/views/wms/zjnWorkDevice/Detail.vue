<template>
	<transition name="el-zoom-in-center">
		<div class="HSZ-preview-main">
			<div class="HSZ-common-page-header">
				<el-page-header @back="goBack" content="详情" />
				<div class="options">
					<el-button @click="goBack">取 消</el-button>
				</div>
			</div>

			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<!-- 设备信息 -->
				<el-tab-pane label="设备信息" name="first">

					<div :style="{margin: '0 auto',width:'100%'}">
						<el-row :gutter="15" class=" main">
							<el-form ref="elForm" :model="dataForm" size="small" label-width="100px"
								label-position="right">
								<el-col :span="8">
									<el-form-item label="设备编号" label-width="100px">
										<p>{{dataForm.deviceId}}</p>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="设备名称" label-width="100px">
										<p>{{dataForm.caption}}</p>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="设备类型" prop="deviceType">
										<el-select v-model='dataForm.deviceType' placeholder='请选择' disabled
											:style='{"width":"100%"}'>
											<el-option v-for="(item, index) in goodsTypeOptions" :key="index"
												:label="item.fullName" :value="item.enCode"></el-option>
										</el-select>
									</el-form-item>

								</el-col>
								<el-col :span="8">
									<el-form-item label="区域类型" prop="region">
										<el-select v-model='dataForm.region' placeholder='请选择' disabled required
											:style='{"width":"100%"}' filterable>
											<el-option v-for="(item, index) in unitOptions" :key="index"
												:label="item.fullName" :value="item.enCode"></el-option>
										</el-select>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="PLC编号" label-width="100px">
										<p>{{dataForm.plcID}}</p>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="控制器类型" label-width="100px">
										<p>{{dataForm.controllerType}}</p>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="有效" prop="isActive">
										<el-switch v-model="dataForm.isActive" :active-value="1" :inactive-value="0">
										</el-switch>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="是否控制器" prop="isController">
										<el-switch v-model="dataForm.isController" :active-value="1"
											:inactive-value="0">
										</el-switch>
									</el-form-item>
								</el-col>

								<el-col :span="8">
									<el-form-item label="是否为双叉" prop="isAlone">
										<el-switch v-model="dataForm.isAlone" :active-value="1" :inactive-value="0">
										</el-switch>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="叉号" prop="threadGroup">
										<el-input v-model="dataForm.threadGroup" placeholder="请输入" clearable
											:style="{ width: '100%' }">
										</el-input>
									</el-form-item>
								</el-col>
								<el-col :span="8">
									<el-form-item label="描述" prop="descrip">
										<el-input v-model="dataForm.descrip" placeholder="请输入" show-word-limit
											:style="{ width: '100%' }" type="textarea"
											:autosize="{ minRows: 4, maxRows: 4 }">
										</el-input>
									</el-form-item>
								</el-col>
							</el-form>
						</el-row>
					</div>

				</el-tab-pane>

				<!-- plc信息 -->
				<el-tab-pane label="plc信息" name="second">plc信息</el-tab-pane>

				<!-- plc读 -->
				<el-tab-pane label="plc读" name="third">plc读</el-tab-pane>

				<!-- plc写 -->
				<el-tab-pane label="plc写" name="fourth">plc写</el-tab-pane>

				<!-- plc状态 -->
				<el-tab-pane label="plc状态" name="five">plc状态</el-tab-pane>

			</el-tabs>



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
			activeName: 'first',
			loading: false,
			visible: false,
			goodsTypeOptions: false,
			goodsStateOptions: false,
			unitOptions: false,
			checkTypeOptions: false,
			dataForm: {
				id: '',
				caption: undefined,
				deviceId: undefined,
				isActive: undefined,
				region: undefined,
				isController: undefined,
				controllerType: undefined,
				isAlone: undefined,
				threadGroup: undefined,
				descrip: undefined,
				deviceType:undefined,
				plcID: undefined,
				
			},
			goodsTypeOptions: [],
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
		handleClick(item) {
			console.log(item);

		},
		getcheckTypeOptions() {
			getDictionaryDataSelector('325448312364729605').then(res => {
				this.checkTypeOptions = res.data.list
			});
		},
		getgoodsStateOptions() {
			getDictionaryDataSelector('326590282281780485').then(res => {
				this.goodsStateOptions = res.data.list
			});
		},
		getunitOptions() {
			getDictionaryDataSelector('326384591566800133').then(res => {
				this.unitOptions = res.data.list
			});
		},
		getgoodsTypeOptions() {
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
				var query = {
					id: this.dataForm.id
				};
				if (this.dataForm.id) {
					console.log("转入参数：" + query.id);
					request({
						url: "/api/wms/ZjnWcsWorkDevice/" + this.dataForm.id,
						method: "Get",
						data: this.dataForm
					}).then(res => {
						this.dataForm = res.data;
						console.log(res.data);
					})
				}
			})
		},
	}
}
</script>
