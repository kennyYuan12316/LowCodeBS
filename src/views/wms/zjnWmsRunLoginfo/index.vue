<template>
	<div class="HSZ-common-layout">
		<div class="HSZ-common-layout-center">
			<el-row class="HSZ-common-search-box" :gutter="16">
				<el-form @submit.native.prevent>
					<el-col :span="6">
						<el-form-item label="业务类型">
							<el-input v-model="query.F_TaskType" placeholder="业务类型" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="方法名">
							<el-input v-model="query.F_MethodName" placeholder="方法名" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="任务号">
							<el-input v-model="query.F_TaskNo" placeholder="任务号" clearable />	
						</el-form-item>
					</el-col>
					<template v-if="showAll">
					<el-col :span="6">
						<el-form-item label="设备号">
							<el-input v-model="query.F_DeviceNo" placeholder="设备号" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="托盘号">
							<el-input v-model="query.F_TrayNo" placeholder="托盘号" clearable />	
						</el-form-item>
					</el-col>
					</template>
					<el-col :span="6">
						<el-form-item>
							<el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
							<el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
							<el-button type="text" icon="el-icon-arrow-down" @click="showAll=true" v-if="!showAll">展开</el-button>
							<el-button type="text" icon="el-icon-arrow-up" @click="showAll=false" v-else>收起</el-button>
						</el-form-item>
					</el-col>
				</el-form>
			</el-row>
			<div class="HSZ-common-layout-main HSZ-flex-main">
				<div class="HSZ-common-head">
					<div>
						<el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()" v-show="false">新增</el-button>
						<el-button type="text" icon="el-icon-download" @click="exportData()">导出</el-button>
						<el-button type="text" icon="el-icon-delete" @click="handleBatchRemoveDel()" v-show="false">批量删除</el-button>
					</div>
					<div class="HSZ-common-head-right">
						<el-tooltip effect="dark" content="刷新" placement="top">
							<el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
						</el-tooltip>
						<screenfull isContainer />
					</div>
				</div>
                <HSZ-table v-loading="listLoading" :data="list" @sort-change='sortChange' @selection-change="handleSelectionChange">
					<el-table-column prop="F_TaskType" label="业务类型" align="left" sortable='custom' />
					<el-table-column prop="F_MethodName" label="方法名" align="left" sortable='custom' />
                    <el-table-column prop="F_MethodParmes" label="方法参数" align="left" show-overflow-tooltip min-width="200px" />

					<el-table-column prop="F_TaskNo" label="任务号" align="left" sortable='custom' />
					<el-table-column prop="F_DeviceNo" label="设备号" align="left" sortable='custom' />
					<el-table-column prop="F_TrayNo" label="托盘号" align="left" />
					<el-table-column prop="F_IsBug" label="是否报错" align="left" sortable='custom' >
                        <template slot-scope="scope">
                            <span>{{scope.row.F_IsBug==1?"是":scope.row.F_IsBug==0?"否":"否"}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="F_CreateTime" label="创建时间" align="left" sortable='custom'>
                        <template slot-scope="scope">
                        {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
                        </template>
                    </el-table-column>

					<el-table-column prop="F_Message" label="报错信息" align="left" show-overflow-tooltip min-width="200px" />
                    
					<el-table-column label="操作" fixed="right" width="150">
							<template slot-scope="scope">
							<el-button type="text" @click="addOrUpdateHandle(scope.row.F_Id)" v-show="false" >编辑</el-button>
							<el-button type="text" @click="handleDel(scope.row.F_Id)" class='HSZ-table-delBtn' v-show="false" >删除</el-button>
							<el-button type="text" @click="goDetail(scope.row.F_Id)" >详情</el-button>
						</template>
					</el-table-column>
				</HSZ-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
        </div>
		<HSZ-Form v-if="formVisible" ref="HSZForm" @refresh="refresh" />
		<ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
        <Detail v-if="detailVisible" ref="Detail" @refresh="detailVisible=false"/>
	</div>
</template>
<script>
	import request from '@/utils/request'
	import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
	import HSZForm from './Form'
	import ExportBox from './ExportBox'
	import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
	import Detail from './Detail'
	export default {
	    components: { HSZForm, ExportBox, Detail },
	    data() {
	        return {
                detailVisible: false,
	            showAll: false,
	        query: {
	                F_TaskType:undefined,
	                F_MethodName:undefined,
	                F_TaskNo:undefined,
	                F_DeviceNo:undefined,
	                F_TrayNo:undefined,
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
                columnList: [
                { prop: 'taskType', label: '业务类型' },
                { prop: 'methodName', label: '方法名' },
                // { prop: 'methodParmes', label: '方法参数' },
                { prop: 'taskNo', label: '任务号' },
                { prop: 'deviceNo', label: '设备号' },
                { prop: 'trayNo', label: '托盘号' },
                { prop: 'isBug', label: '是否报错' },
                { prop: 'createTime', label: '创建时间' },
                // { prop: 'message', label: '报错信息' },
                { prop: 'case1', label: '备注1' },
                { prop: 'case2', label: '备注2' },
                { prop: 'case3', label: '备注3' },
                { prop: 'case4', label: '备注4' },
                { prop: 'case5', label: '备注5' }
				],
			}
        },
		computed: {},
		created() {
			this.initData()
		},
		methods: {
            goDetail(id){
			    this.detailVisible = true
                this.$nextTick(() => {
                    this.$refs.Detail.init(id)
                })
			},
            sortChange({
                column,
                prop,
                order
            }) {
                this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
                this.listQuery.sidx = !order ? '' : prop
                this.initData()
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
                    url: `/api/wms/ZjnWmsRunLoginfo`,
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
                        url: `/api/wms/ZjnWmsRunLoginfo/${id}`,
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
			handleSelectionChange(val) {
                const res = val.map(item => item.F_Id)
                this.multipleSelection = res
            },
            handleBatchRemoveDel() {
                if (!this.multipleSelection.length) {
                    this.$message({
                        type: 'error',
                        message: '请选择一条数据',
                        duration: 1500,
                    })
                    return
                }
                const ids = this.multipleSelection
                this.$confirm('您确定要删除这些数据吗, 是否继续？', '提示', {
                    type: 'warning'
                }).then(() => {
                    request({
                        url: `/api/wms/ZjnWmsRunLoginfo/batchRemove`,
                        method: 'POST',
                        data: ids ,
                    }).then(res => {
                        this.$message({
                            type: 'success',
                            message: res.msg,
                            onClose: () => {
                                this.initData()
                            }
                        });
                    })
                }).catch(() => { })
            },
			addOrUpdateHandle(id, isDetail) {
                this.formVisible = true
                this.$nextTick(() => {
                    this.$refs.HSZForm.init(id, isDetail)
                })
            },
			exportData() {
                this.exportBoxVisible = true
                this.$nextTick(() => {
                    this.$refs.ExportBox.init(this.columnList)
                })
            },
            download(data) {
                let query = { ...data, ...this.listQuery, ...this.query }
                request({
                    url: `/api/wms/ZjnWmsRunLoginfo/Export`,
                    method: 'GET',
                    data: query
                }).then(res => {
                    if (!res.data.url) return
                    window.location.href = this.define.comUrl + res.data.url
                    this.$refs.ExportBox.visible = false
                    this.exportBoxVisible = false
                })
            },
			search() {
                this.listQuery = {
                    currentPage: 1,
                    pageSize: 20,
                    sort: "desc",
                    sidx: "F_TaskType",
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
                    sidx: "F_TaskType",
                }
                this.initData()
            }
		}
    }
</script>