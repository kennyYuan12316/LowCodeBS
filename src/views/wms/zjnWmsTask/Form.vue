<template>
	<div class="flow-form" v-loading="loading">
		<div class="com-title">
			<h1>主任务</h1>
			<!-- <span class="number">任务编码：{{""}}</span> -->
		</div>
		<el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right"
			:disabled="!!isDetail" :rules="rules">
			<el-col :span="6">
				<el-form-item label="任务号" prop="taskNo">
					<el-input v-model='dataForm.taskNo' :disabled="!dataForm.taskNo" placeholder='请输入' clearable :style='{"width":"100%"}'>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="6">
				<el-form-item label="任务名称" prop="taskName">
					<el-input v-model='dataForm.taskName' placeholder='请输入' clearable :style='{"width":"100%"}'>
					</el-input>
				</el-form-item>
			</el-col>



			<el-col :span="6">
				<el-form-item label="业务类型" prop="taskTypeName">
					<el-input v-model='dataForm.taskTypeName' placeholder='请输入' clearable :style='{"width":"100%"}'>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="6">
				<el-form-item label="任务状态描述" prop="taskDescribe">
					<el-input v-model='dataForm.taskDescribe' placeholder='请输入' clearable :style='{"width":"100%"}'>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="6">
				<el-form-item label="操作方向" prop="operationDirection">
					<el-select v-model='dataForm.operationDirection' placeholder='请选择' clearable required
						:style='{"width":"100%"}'>
						<el-option v-for="(item, index) in operationDirectionOptions" :key="index"
							:label="item.fullName" :value="item.enCode">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="6">
				<el-form-item v-if="dataForm.operationDirection=='Into'" label="起点工位" prop="positionFrom">
					<el-select v-model='dataForm.positionFrom' placeholder='请选择' filterable  clearable :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in workSiteOptions" :key="index" :label="item.Capion" :value="item.DeviceID" ></el-option>
							</el-select>
				
				</el-form-item>            
				<el-form-item v-else label="起点" prop="positionFrom">
						<popupSelect v-model="dataForm.positionFrom" field="Capion" placeholder="请选择起点站点" clearable
							required relationField="Capion#DeviceID" :columnOptions="deviceToOptions" :pageSize="20"
							:hasPage="true" propsValue="DeviceID" interfaceId="357306936955241733" popupType="dialog"
							popupTitle="选择数据" popupWidth="800px" @change="changeStart">
						</popupSelect>
					</el-form-item>
			</el-col>
			<el-col :span="6">
				<el-form-item v-if="dataForm.operationDirection=='Out'" label="终点工位" prop="positionTo">
					<el-select v-model='dataForm.positionTo' placeholder='请选择' filterable  clearable :style='{"width":"100%"}' >
								<el-option v-for="(item, index) in workEndSiteOptions" :key="index" :label="item.Capion" :value="item.DeviceID" ></el-option>
							</el-select>
				
				</el-form-item>            
				<el-form-item v-else label="终点工位" prop="positionToName">
					<el-input v-model='dataForm.positionToName' placeholder='请输入' clearable :style='{"width":"100%"}'>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="6">
				<el-form-item label="当前工位" prop="positionCurrentName">
					<el-input v-model='dataForm.positionCurrentName' placeholder='请输入' clearable
						:style='{"width":"100%"}'>
					</el-input>
				</el-form-item>
			</el-col>
			<!-- <el-col :span="12">
						<el-form-item label="路径编号" prop="routeNo">
							<el-input v-model='dataForm.routeNo' placeholder='请输入' clearable :style='{"width":"100%"}' >
							</el-input>
						</el-form-item>
					</el-col> -->
			<!-- <el-col :span="6">
				<el-form-item label="有效标志" prop="enabledMark">
					<el-input v-model='dataForm.enabledMark' placeholder='请输入' clearable :style='{"width":"100%"}'>
					</el-input>
				</el-form-item>
			</el-col> -->
			<el-col :span="6">
				<el-form-item label="操作类型" prop="operationType">
					<el-select v-model='dataForm.operationType' placeholder='请选择' clearable required
						:style='{"width":"100%"}'>
						<el-option v-for="(item, index) in operationTypeOptions" :key="index"
							:label="item.fullName" :value="item.enCode">
						</el-option>
					</el-select>
				</el-form-item>
			</el-col>
			<el-col :span="6">
				<el-form-item label="任务来源" prop="taskFrom">
					<el-input v-model='dataForm.taskFrom' placeholder='请输入' clearable :style='{"width":"100%"}'>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="6">
				<el-form-item label="任务状态" prop="taskState">
					<el-input v-model='dataForm.taskState' placeholder='请输入' clearable :style='{"width":"100%"}'>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="6" v-if='false'>
				<el-form-item label="创建时间" prop="createTime">
					<el-input v-model='dataForm.createTime' placeholder='系统自动生成' readonly>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="6" v-if='false'>
				<el-form-item label="创建者" prop="createUser">
					<el-input v-model='dataForm.createUser' placeholder='系统自动生成' readonly>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="6" v-if='false'>
				<el-form-item label="修改用户" prop="lastModifyUserId">
					<el-input v-model='dataForm.lastModifyUserId' placeholder='系统自动生成' readonly>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="6" v-if='false'>
				<el-form-item label="修改时间" prop="lastModifyTime">
					<el-input v-model='dataForm.lastModifyTime' placeholder='系统自动生成' readonly>
					</el-input>
				</el-form-item>
			</el-col>


			<el-col :span="24">
				<h5>物料信息</h5>
			</el-col>
			<el-col :span="6">
				<el-form-item label="单据指令" prop="orderNo">
					<el-input v-model='dataForm.orderNo' required placeholder='请输入' clearable :style='{"width":"100%"}'>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="6">
				<el-form-item label="托盘号" prop="trayNo">
					<el-input v-model='dataForm.trayNo' required placeholder='请输入' clearable :style='{"width":"100%"}'>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="6">
				<!-- <el-form-item label="物料编码" prop="materialCode">
					<el-input v-model='dataForm.materialCode' placeholder='请输入' clearable :style='{"width":"100%"}'>
					</el-input>
				</el-form-item> -->
				<el-form-item  label="物料编码" prop="materialCode">
						<popupSelect v-model="dataForm.materialCode" field="fullName" placeholder="请选择物料编码" clearable
							required relationField="fullName#id" :columnOptions="materialCodeOptions" :pageSize="20"
							:hasPage="true" propsValue="id" interfaceId="350075271526745349" popupType="dialog"
							popupTitle="选择物料编码" popupWidth="800px" @change="changeStart">
						</popupSelect>
					</el-form-item>
			</el-col>
			<el-col :span="6">
				<el-form-item label="数量" prop="quantity">
					<el-input v-model='dataForm.quantity' placeholder='请输入' clearable :style='{"width":"100%"}'>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="6">
				<el-form-item label="单据号" prop="billNo">
					<el-input v-model='dataForm.billNo' placeholder='请输入' clearable :style='{"width":"100%"}'>
					</el-input>
				</el-form-item>
			</el-col>
			<el-col :span="6">
				<el-form-item label="产品等级" prop="productLevel">
					<el-input v-model='dataForm.productLevel' placeholder='请输入' clearable :style='{"width":"100%"}'>
					</el-input>
				</el-form-item>
			</el-col>

		</el-form>
		<template>

			<el-tabs v-model="activeName">
				<!-- 1 子任务明细-->
				<el-tab-pane label="子任务明细" name="first">
					<div class="HSZ-common-title">
						<!-- <h2>子任务明细</h2> -->
					</div>
					<HSZ-table :data="dataForm.taskList">


						<!-- <el-table-column type="index" width="50" label="序号" align="center" /> -->

						<el-table-column prop="taskDetailsName" label="任务名称" align="left" />
						<el-table-column prop="workPathname" label="路径名称" align="left" />
						<el-table-column prop="taskDetailsStartName" label="起点工位" align="left">
							<template slot-scope="scope">
								<div> {{scope.row.taskDetailsStartName || scope.row.taskDetailsStart}}</div>

							</template>
						</el-table-column>

						<el-table-column prop="taskDetailsEndName" label="终点工位" align="left">
							<template slot-scope="scope">
								<div> {{scope.row.taskDetailsEndName || scope.row.taskDetailsEnd}}</div>

							</template>
						</el-table-column>


						<el-table-column prop="taskType" label="任务类型" align="left">
							<template slot-scope="scope">
								<div> {{scope.row.taskType | dynamicTextByenCode(taskTypeOptions)}}</div>
							</template>
						</el-table-column>

						<el-table-column prop="taskDetailsStates" label="任务状态" align="left">
							<template slot-scope="scope">
								<el-tag v-if="scope.row.taskDetailsStates==1" disable-transitions>
									{{scope.row.taskDetailsStates | dynamicTextByenCode(taskDetailsStatesOptions)}}
								</el-tag>
								<el-tag v-if="scope.row.taskDetailsStates==2" type="warning" disable-transitions>
									{{scope.row.taskDetailsStates | dynamicTextByenCode(taskDetailsStatesOptions)}}
								</el-tag>
								<el-tag v-if="scope.row.taskDetailsStates==3" type="success" disable-transitions>
									{{scope.row.taskDetailsStates | dynamicTextByenCode(taskDetailsStatesOptions)}}
								</el-tag>
								<el-tag v-if="scope.row.taskDetailsStates==4" type="info" disable-transitions>
									{{scope.row.taskDetailsStates | dynamicTextByenCode(taskDetailsStatesOptions)}}
								</el-tag>
							</template>
						</el-table-column>




						<!-- <el-table-column prop="taskDetailsName" label="任务名称">
							<template slot-scope="scope">
								<el-input v-model="scope.row.taskDetailsName" :disabled="true"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="workPathname" label="路径名称">
							<template slot-scope="scope">
								<el-input v-model="scope.row.workPathname" :disabled="true">
								</el-input>
							</template>
						</el-table-column> -->
						<!-- <el-table-column prop="taskDetailsNextId"
                         label="下个任务id">
          <template slot-scope="scope">
            <el-input v-model="scope.row.taskDetailsNextId"
                      :disabled="true"></el-input>
          </template>
        </el-table-column> -->
						<!-- <el-table-column prop="taskDetailsStartName" label="起点工位">
							<template slot-scope="scope">
								<el-input v-model="scope.row.taskDetailsStartName" :disabled="true"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="taskDetailsEndName" label="终点工位">
							<template slot-scope="scope">
								<el-input v-model="scope.row.taskDetailsEndName" :disabled="true"></el-input>
							</template>
						</el-table-column>
						<el-table-column prop="taskDetailsStates" label="任务状态">
							<template slot-scope="scope">
								<el-input
									:value="scope.row.taskDetailsStates | dynamicTextByenCode(taskDetailsStatesOptions)"
									:disabled="true"></el-input>
							</template>
						</el-table-column> -->
						<!-- <el-table-column prop="amount"
                         label="金额">
          <template slot-scope="scope">
            <el-input v-model="scope.row.amount"
                      readonly
                      :disabled="true">
            </el-input>
          </template>
        </el-table-column>
        <el-table-column prop="description"
                         label="备注">
          <template slot-scope="scope">
            <el-input v-model="scope.row.description"
                      :disabled="true">
            </el-input>
          </template>
        </el-table-column> -->
						<el-table-column label="操作" width="220" v-if="dataForm.id">
							<template slot-scope="scope">
								<!-- <el-button size="mini"
                       type="text"
                       class="HSZ-table-delBtn"
                       @click="handleDel(scope.$index)">删除</el-button> -->
					   <el-button size="mini" type="text" class="el-icon-edit"
									@click="upadteTask(scope.row)">编辑
								</el-button>

								<el-button size="mini" type="text" class="el-icon-refresh" @click="resetTask(scope.row)"
									:disabled="scope.row.taskDetailsStates==3">重置任务</el-button>

								<el-button size="mini" type="text" class="el-icon-edit"
									@click="upadteTaskSite(scope.row)" :disabled="scope.row.taskDetailsStates==3">修改目的地
								</el-button>

								<el-button size="mini" type="text" class="el-icon-edit"
									@click="upadteTaskFinish(scope.row)">上报完成(测试)
								</el-button>
							</template>
						</el-table-column>
					</HSZ-table>
					<div class="table-actions" @click="addHandle()" v-if="false">
						<el-button type="text" icon="el-icon-plus" :disabled="false">新增</el-button>
					</div>
				</el-tab-pane>
				<!-- 2 物料信息 -->
				<!-- <el-tab-pane label="物料信息" name="second">

					<el-form :model="dataForm">
						

					</el-form>


				</el-tab-pane> -->


			</el-tabs>



		</template>
		<!-- <span slot="footer" class="dialog-footer">
			<el-button @click="visible=false">取 消</el-button>
			<el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail" :loading="btnLoading">确 定</el-button>
		</span> -->

		<Site-Form v-if="siteformVisible" ref="SiteForm" @refresh="refresh" />
		<TaskDetailsForm v-if="TaskDetailsFormVisible" ref="TaskDetailsForm" @refresh="TaskDetailsFormrefresh" />

	</div>
</template>
<script>
import request from '@/utils/request'
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
import SiteForm from "./SiteForm";
import TaskDetailsForm from "./TaskDetailsForm";
import { forEach } from 'element-resize-detector/src/collection-utils';

export default {
	components: { SiteForm,TaskDetailsForm },
	props: [],
	data() {
		return {
			activeName: "first",
			btnLoading: false,
			loading: false,
			visible: false,
			isDetail: false,
			siteformVisible: false,
			TaskDetailsFormVisible: false,

			dataForm: {
				id: '',
				taskNo: undefined,
				taskName: undefined,
				taskTypeNum: undefined,
				taskDescribe: undefined,
				positionFrom: undefined,
				positionTo: undefined,
				positionCurrent: undefined,
				routeNo: undefined,
				enabledMark: undefined,
				taskFrom: undefined,
				taskState: undefined,
				createTime: undefined,
				createUser: undefined,
				lastModifyUserId: undefined,
				lastModifyTime: undefined,
				productLevel:undefined,

				positionCurrentName: undefined,
				positionFromName: undefined,
				positionToName: undefined,
				taskTypeName: undefined,
				taskList: [],

				orderNo:undefined,
				trayNo:undefined,
				operationDirection:undefined,
				operationType:undefined,
				// materialCode:"WL-001",

			},
			rules: {
				trayNo: [{
					required: true,
					message: '请输入托盘编号',
					trigger: 'blur'
				},],
				orderNo: [{
					required: true,
					message: '请输入单据指令',
					trigger: 'blur'
				},],
				positionFrom: [{
					required: true,
					message: '请输入起点工位',
					trigger: 'blur'
				},],
				operationDirection: [{
					required: true,
					message: '请输入操作方向',
					trigger: 'blur'
				},],
				operationType: [{
					required: true,
					message: '请输入操作类型',
					trigger: 'blur'
				},],
			},
			taskDetailsStatesOptions: [],
			taskTypeOptions: [],
			workSiteOptions:[],
			workEndSiteOptions:[],

			operationDirectionOptions: [
				{ enCode: "Into", fullName: "入库" },
				{ enCode: "Out", fullName: "出库" },
				{ enCode: "Move", fullName: "搬运" },
			],
			operationTypeOptions: [
				{ enCode: "emptyContainer", fullName: "空托" },
				{ enCode: "production", fullName: "产品" },
			],
			deviceToOptions: [
				{ value: "DeviceID", label: "站点编号" },
				{ value: "Capion", label: "站点名称" },
				{ value: "F_Row", label: "行" },
				{ value: "F_Cell", label: "列" },
				{ value: "F_Layer", label: "层" },

			],
			materialCodeOptions:[
			{ value: "id", label: "物料编号" },
			{ value: "fullName", label: "物料名称" },
			{ value: "goodsState", label: "状态" },
			{ value: "goodsType", label: "类型" },




			],
			// SiteOptions: [
			// 	{ value: "id", label: "工位" },
			// 	{ value: "fullName", label: "工位名称" },
			// ],

		}
	},
	computed: {
	},
	watch: {},
	created() {
		this.gettaskDetailsStatesOptions();
		this.gettaskTypeOptions();
	},
	computed: {

	},
	mounted() {
	},
	methods: {
		gettaskDetailsStatesOptions() {
			getDictionaryDataSelector('349416203686511877').then(res => {
				this.taskDetailsStatesOptions = res.data.list
			});
		},
		gettaskTypeOptions() {
			getDictionaryDataSelector('349394962401461509').then(res => {
				this.taskTypeOptions = res.data.list
			});
		},
		getworkSiteOptions(positionFrom){
				getDataInterfaceRes('343244101333812485').then(res => {
					let data = this.hsz.interfaceDataHandler(res.data)
					if(positionFrom.indexOf(',')>-1){
					 data=data.filter(x=>positionFrom.indexOf(x.DeviceID)>-1);	
					}
					else{
						data=data.filter(x=>x.DeviceID==positionFrom)						

					}						
					this.workSiteOptions = data
				});
			},
			getworkEndSiteOptions(positionTo){
				getDataInterfaceRes('343244101333812485').then(res => {
					let data = this.hsz.interfaceDataHandler(res.data)
					if(positionTo.indexOf(',')>-1){
					 data=data.filter(x=>positionTo.indexOf(x.DeviceID)>-1);	
					}
					else{
						data=data.filter(x=>x.DeviceID==positionTo)						

					}						
					this.workEndSiteOptions = data
				});
			},
		goBack() {
			// this.$emit('refresh')
		},
		init(data) {
			// this.dataForm.id = id || 0;
			this.visible = true;
			// this.isDetail = isDetail || false;
			this.$nextTick(() => {
				// this.$refs['elForm'].resetFields();
				this.dataForm = data.zjnTaskInfoOutput;
				this.dataForm.taskList = data.ZjnTaskListDetailsList;
		        this.getworkSiteOptions(data.zjnTaskInfoOutput.positionFrom);
		        this.getworkEndSiteOptions(data.zjnTaskInfoOutput.positionTo);
				this.dataForm.positionFrom=undefined;
				this.dataForm.positionTo=undefined;

				// if (this.dataForm.id) {
				// 	request({
				// 		url: '/api/wms/ZjnTaskList/' + this.dataForm.id,
				// 		method: 'get'
				// 	}).then(res =>{
				// 		this.dataForm = res.data;
				// 	})
				// }
			});
			this.$store.commit('generator/UPDATE_RELATION_DATA', {})
		},
		dataFormSubmit() {
			this.$refs['elForm'].validate((valid) => {
				if (valid) {
					this.btnLoading = true;
					if (!this.dataForm.id) {
						request({
							url: `/api/wms/ZjnWmsTask`,
							method: 'post',
							data: this.dataForm,
						}).then((res) => {
							this.$message({
								message: res.msg,
								type: 'success',
								duration: 1000,
								onClose: () => {
									this.btnLoading = false;
									this.visible = false
									this.$emit('close', true)
								}
							})
						})
					} else {
						request({
							url: '/api/wms/ZjnWmsTask/' + this.dataForm.id,
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
									this.$emit('close', true)

								}
							})
						})
					}
				}
			})
		},
		resetTask(data) {

			console.log(data, "resetTask")
			var taskDetailsId = data.taskDetailsId
			this.$confirm('此操作重置任务数据, 是否继续?', '提示', {
				type: 'warning'
			}).then(() => {
				request({
					url: '/api/wms/ZjnWmsTask/' + taskDetailsId + '/ResetTask/' + 1,
					method: 'PUT',
				}).then((res) => {
					this.$message({
						message: res.msg,
						type: 'success',
						duration: 1000,
						onClose: () => {
							// this.btnLoading = false;
							// this.visible = false
							// this.$emit('close', true)
							this.$emit('reset', this.dataForm.id)

						}
					})
				})

			}).catch(() => {
			});





		},
		upadteTaskSite(data) {
			console.log(data, "upadteTaskSite")
			var taskDetailsId = data.taskDetailsId
			var taskDetailsEnd = data.taskDetailsEnd
			this.siteformVisible = true;
			this.$nextTick(() => {
				this.$refs.SiteForm.init(taskDetailsId, taskDetailsEnd);
			});

		},
		upadteTask(data) {
			console.log(data, "upadteTask")
			var taskDetailsId = data.taskDetailsId
			this.TaskDetailsFormVisible = true;
			this.$nextTick(() => {
				this.$refs.TaskDetailsForm.init(data);
			});

		},
		upadteTaskFinish(data) {
			console.log(data, "upadteTaskFinish")
			
			var taskDetailsId = data.taskDetailsId
			this.$confirm('此操作上报任务数据, 是否继续?', '提示', {
				type: 'warning'
			}).then(() => {
				request({
					url: '/api/wms/ZjnWmsTask/' + taskDetailsId + '/FinishTaskDetails',
					method: 'PUT',
				}).then((res) => {
					this.$message({
						message: res.msg,
						type: 'success',
						duration: 1000,
						onClose: () => {
							// this.btnLoading = false;
							// this.visible = false
							// this.$emit('close', true)
							this.$emit('reset', this.dataForm.id)

						}
					})
				})

			}).catch(() => {
			});

		},
		refresh(isrRefresh) {
			this.siteformVisible = false;
			if (isrRefresh) this.$emit('reset', this.dataForm.id)

		},
		TaskDetailsFormrefresh(isrRefresh) {
			this.TaskDetailsFormVisible = false;
			if (isrRefresh) this.$emit('reset', this.dataForm.id)

		}


	}
}
</script>
