<template>
	<el-dialog title="详情" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
		<el-row :gutter="15" class="" >
				<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right">
					<el-col :span="24">
						<el-form-item label="托盘编号" label-width="100px">
							<p>{{dataForm.trayNo}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="托盘类型" prop="type">
							<el-select v-model='dataForm.type' placeholder='请选择' disabled clearable required :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in typeOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>

					</el-col>
					<el-col :span="24">
						<el-form-item label="托盘状态" prop="trayState">
							<el-select v-model='dataForm.trayState' placeholder='请选择' disabled required :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in trayStateOptions" :key="index" :label="item.fullName" :value="item.enCode" ></el-option>
							</el-select>
						</el-form-item>
					</el-col>

					<el-col :span="24">
						<el-form-item label="禁用原因" label-width="100px">
							<p>{{dataForm.disableMark}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="创建时间" label-width="100px">
							<p>{{dataForm.createTime}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="创建人" label-width="100px">
							<p>{{dataForm.createUser}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="修改时间" label-width="100px">
							<p>{{dataForm.lastModifyTime}}</p>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="修改人" label-width="100px">
							<p>{{dataForm.lastModifyUserId}}</p>
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
				typeOptions:false,
				trayStateOptions:false,
				dataForm: {
					id:'',
					trayNo:undefined,
					type:"2",
					trayState:"1",
					isDelete:undefined,
					disableMark:undefined,
					createTime:undefined,
					createUser:undefined,
					lastModifyTime:undefined,
					lastModifyUserId:undefined,
				},
			}
		},
		created() {

		  this.gettypeOptions();
		  this.gettrayStateOptions();
		},
		mounted() {
        },
		methods: {
			gettrayStateOptions(){
				getDictionaryDataSelector('332412309932606725').then(res => {
					this.trayStateOptions = res.data.list
				});
			},
			gettypeOptions(){
				getDictionaryDataSelector('332411089230759173').then(res => {
					this.typeOptions = res.data.list
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
							url: '/api/wms/ZjnPlaneTray/' + this.dataForm.id,
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
