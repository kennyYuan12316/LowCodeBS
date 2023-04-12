<template>
	<el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="12">
						<el-form-item label="线体编号" label-width="100px">
							<p>{{dataForm.lineNo}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="线体名称" label-width="100px">
							<p>{{dataForm.lineName}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="物料类型" prop="goodsType">
							<el-select v-model='dataForm.goodsType' placeholder='请选择'   disabled :style='{"width":"100%"}'  >
								<el-option v-for="(item, index) in goodsTypeOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="物料编号" label-width="100px">
							<p>{{dataForm.goodsCode}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="托盘编号" label-width="100px">
							<p>{{dataForm.trayNo}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="线体缓存起点" label-width="100px">
							<p>{{dataForm.lineStart}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="线体缓存终点" label-width="100px">
							<p>{{dataForm.lineEnd}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="线体层" label-width="100px">
							<p>{{dataForm.lineLayer}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="线体最大任务数" label-width="100px">
							<p>{{dataForm.lineMaxWork}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="当前任务数量" label-width="100px">
							<p>{{dataForm.lineNowWork}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="线体描述" label-width="100px">
							<p>{{dataForm.description}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="预留字段" label-width="100px">
							<p>{{dataForm.expand}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态" label-width="100px">
							<p>{{dataForm.status==1?"在线":dataForm.status==2?"已出":""}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="出库时间" label-width="100px">
							<p>{{ dataForm.outTime | toDate("yyyy-MM-dd hh:mm:ss") }}</p>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="创建时间" label-width="100px">
							<p>{{ dataForm.createTime | toDate("yyyy-MM-dd hh:mm:ss") }}</p>
						</el-form-item>
					</el-col>
				</el-form>
		</el-row>
		<span slot="footer" class="dialog-footer">
			<el-button @click="visible=false">取 消</el-button>
		</span>
	</el-dialog>
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
				dataForm: {
					id:'',
					lineNo:undefined,
					lineName:undefined,
					goodsType:undefined,
					goodsCode:undefined,
					trayNo:undefined,
					lineStart:undefined,
					lineEnd:undefined,
					lineLayer:undefined,
					lineMaxWork:undefined,
					lineNowWork:undefined,
					description:undefined,
					expand:undefined,
					status:undefined,
					outTime:undefined,
					createTime:undefined,
				},
			}
		},
		created() {
          this.getgoodsTypeOptions();
		},
		methods: {
			goBack() {
                this.$emit('refresh')
            },
			getgoodsTypeOptions(){
				getDictionaryDataSelector('325449144728552709').then(res => {
					this.goodsTypeOptions = res.data.list
				});
			},
			init(id, isDetail) {
				this.dataForm.id = id || 0;
                this.visible = true;
                this.isDetail = isDetail || false;
				this.$nextTick(() => {
					this.$refs['elForm'].resetFields();
					if (this.dataForm.id) {
						request({
							url: '/api/wms/ZjnWmsLineSettinglog/' + this.dataForm.id,
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
