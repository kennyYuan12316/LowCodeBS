<template>
	<div class="HSZ-common-layout">
		<div class="HSZ-common-layout-center">
			<el-row class="HSZ-common-search-box" :gutter="16">
				<el-form @submit.native.prevent>
                    <el-col :span="4">
						<el-form-item label="设备Id">
							<el-input v-model="query.DeviceID" placeholder="设备Id" clearable />	
						</el-form-item>
					</el-col>
                    <el-col :span="4">
						<el-form-item label="PlcID">
							<el-input v-model="query.PlcID" placeholder="PlcID" clearable />	
						</el-form-item>
					</el-col>
                    <el-col :span="4">
						<el-form-item label="设备分组">
							<el-input v-model="query.StackerGroup" placeholder="设备分组" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="区域">
							<el-select v-model="query.Region" placeholder="区域" clearable >
								<el-option v-for="(item, index) in regionOptions" :key="index" :label="item.fullName" :value="item.enCode"  />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="DB">
							<num-range v-model="query.Db"></num-range>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item>
							<el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
							<el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
						</el-form-item>
					</el-col>
				</el-form>
			</el-row>
			<div class="HSZ-common-layout-main HSZ-flex-main">
				<div class="HSZ-common-head">
					<div>
						<el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
					</div>
					<div class="HSZ-common-head-right">
						<el-tooltip effect="dark" content="刷新" placement="top">
							<el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
						</el-tooltip>
						<screenfull isContainer />
					</div>
				</div>
                <HSZ-table v-loading="listLoading" :data="list">
                    <el-table-column prop="DeviceID" label="设备ID" align="left" />
					<el-table-column label="区域" prop="region" align="left">
							<template slot-scope="scope">{{ scope.row.Region | dynamicTextByenCode(regionOptions) }}</template>
					</el-table-column>
					<el-table-column prop="Db" label="DB" align="left" />
					<el-table-column prop="Start" label="起点" align="left" />
					<el-table-column prop="Length" label="长度" align="left" />
					<el-table-column prop="ObjType" label="对象名称" align="left" />
					<el-table-column prop="ObjValue" label="对象json" align="left" show-overflow-tooltip="true" />
					<el-table-column label="读写类型" prop="packType" align="left">
							<template slot-scope="scope">{{ scope.row.PackType | dynamicTextByenCode(packTypeOptions) }}</template>
					</el-table-column>
					<el-table-column prop="PackSize" label="Plc包大小" align="left" />
                    <el-table-column prop="PlcPointID" label="Plc点位" align="left" />
					<el-table-column prop="PlcID" label="Plc ID" align="left" />
                    <el-table-column prop="StackerGroup" label="设备分组" align="left" />
					<el-table-column prop="Descrip" label="描述" align="left" />
					<el-table-column label="操作" fixed="right" width="150">
							<template slot-scope="scope">
							<el-button type="text" @click="lookPlcToJson(scope.row.DeviceID)" >查看</el-button>
							<el-button type="text" @click="addOrUpdateHandle(scope.row.PlcObjID)" >编辑</el-button>
							<el-button type="text" @click="handleDel(scope.row.PlcObjID)" class='HSZ-table-delBtn' >删除</el-button>
						</template>
					</el-table-column>
				</HSZ-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
        </div>
		<HSZ-Form v-if="formVisible" ref="HSZForm" @refresh="refresh" />
		<ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
		<JsonViewer v-if="JsonViewerVisible" ref="JsonViewer"/>

	</div>
</template>
<script>
	import request from '@/utils/request'
	import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
	import HSZForm from './Form'
	import ExportBox from './ExportBox'
	import JsonViewer from './JsonViewer'
	import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
	export default {
	    components: { HSZForm, ExportBox,JsonViewer },
	    data() {
	        return {
	        query: {
	                Region:undefined,
	                Db:undefined,
                    DeviceID:undefined,
                    StackerGroup:undefined,
                    PlcID:undefined,
				},
                list: [],
                listLoading: true,
                multipleSelection: [], 
				total: 0,
                listQuery: {
                    currentPage: 1,
                    pageSize: 20,
					sort: "desc",
                    sidx: "",
                },
                formVisible: false,
                exportBoxVisible: false,
                JsonViewerVisible:false,
                jsonData:{},
                columnList: [
                    { prop: 'Region', label: '区域' },
                    { prop: 'PlcPointID', label: 'Plc点位' },
                    { prop: 'PlcID', label: 'Plc设备' },
                    { prop: 'Db', label: 'DB' },
                    { prop: 'Start', label: '起点' },
                    { prop: 'Length', label: '长度' },
                    { prop: 'ObjType', label: '对象名称' },
                    { prop: 'ObjValue', label: '对象json' },
                    { prop: 'PackType', label: '读写类型' },
                    { prop: 'PackSize', label: 'Plc包大小' },
                    { prop: 'DeviceID', label: '设备ID' },
                    { prop: 'Descrip', label: '描述' },
				],
				regionOptions : [],
				packTypeOptions:[{'fullName':"READ",'id':"READ"},{'fullName':"WRITE",'id':"WRITE"},{'fullName':"STATUS",'id':"STATUS"}],
			}
        },
		computed: {},
		created() {
			this.initData()
			this.getregionOptions();
		},
		methods: {
			getregionOptions(){
				getDictionaryDataSelector('343037780953138437').then(res => {
					this.regionOptions = res.data.list
				});
			},
			initData() {
                this.listLoading = true;
                let _query = {
                    ...this.listQuery,
                    ...this.query
                };
                let query = {}
                for (let key in _query) {
                    if (Array.isArray(_query[key])) {
                        query[key] = _query[key].join()
                    } else {
                        query[key] = _query[key]
                    }
                }
                request({
                    url: `/api/wms/ZjnWcsPlcObject`,
                    method: 'GET',
                    data: query
                }).then(res => {
                    this.list = res.data.list
                    this.total = res.data.pagination.total
                    this.listLoading = false
                })
            },
			handleDel(id) {
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                    type: 'warning'
                }).then(() => {
                    request({
                        url: `/api/wms/ZjnWcsPlcObject/${id}`,
                        method: 'DELETE'
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.msg,
                            onClose: () => {
                                this.initData()
                            }
                        });
                    })
                }).catch(() => {
                });
            },
			addOrUpdateHandle(id, isDetail) {
                this.formVisible = true
                this.$nextTick(() => {
                    this.$refs.HSZForm.init(id, isDetail)
                })
            },
            lookPlcToJson(id) {
                if(!id){
                    this.$message({
                            type: 'error',
                            message: "设备id不存在",
                            onClose: () => {
                                
                            }
                        });
                        return;
                }
                this.JsonViewerVisible = true
                this.$nextTick(() => {
                    this.$refs.JsonViewer.init(id)
                })
               
        
                // this.$nextTick(() => {
                //     this.$refs.JsonViewer.init(id, isDetail)
                // })
            },

			search() {
                this.listQuery = {
                    currentPage: 1,
                    pageSize: 20,
                    sort: "desc",
                    sidx: "PlcObjID",
                }
                this.initData()
            },
            refresh(isrRefresh) {
                this.formVisible = false
                if (isrRefresh) this.reset()
            },
            reset() {
                for (let key in this.query) {
                    this.query[key] = undefined
                }
                this.listQuery = {
                    currentPage: 1,
                    pageSize: 20,
                    sort: "desc",
                    sidx: "PlcObjID",
                }
                this.initData()
            }
		}
    }
</script>