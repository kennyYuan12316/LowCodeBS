<template>
	<div class="HSZ-common-layout">
		<div class="HSZ-common-layout-center">
			<el-row class="HSZ-common-search-box" :gutter="16">
				<el-form @submit.native.prevent>
					<el-col :span="6">
						<el-form-item label="托盘编号">
							<el-input v-model="query.F_TrayNo" placeholder="托盘编号" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="托盘类型">
							<el-select v-model="query.F_Type" placeholder="托盘类型" clearable >
								<el-option v-for="(item, index) in typeOptions" :key="index" :label="item.fullName" :value="item.enCode"  />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="托盘状态">
							<el-select v-model="query.F_TrayState" placeholder="托盘状态" >
								<el-option v-for="(item, index) in trayStateOptions" :key="index" :label="item.fullName" :value="item.enCode"  />
							</el-select>
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
						<el-button type="text" icon="el-icon-download" @click="exportData()">导出</el-button>
                        <el-button type="text" icon="el-icon-upload2" @click="uploadForm">导入</el-button>
					</div>
					<div class="HSZ-common-head-right">
						<el-tooltip effect="dark" content="刷新" placement="top">
							<el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
						</el-tooltip>
						<screenfull isContainer />
					</div>
				</div>
				<HSZ-table v-loading="listLoading" :data="list" @sort-change='sortChange'>
					<el-table-column prop="F_TrayNo" label="托盘编号" sortable='custom' align="left" />
					<el-table-column label="托盘类型" prop="type" sortable='custom' align="left">
							<template slot-scope="scope">{{ scope.row.F_Type | dynamicTextByenCode(typeOptions) }}</template>
					</el-table-column>
					<el-table-column label="托盘状态" prop="trayState" sortable='custom' align="left">
							<template slot-scope="scope">{{ scope.row.F_TrayState | dynamicTextByenCode(trayStateOptions) }}</template>
					</el-table-column>					
					<el-table-column prop="F_DisableMark" label="禁用原因" align="left" />
                    <el-table-column prop="F_CreateTime" label="创建日期" sortable='custom' align="left" width="140">
                        <template slot-scope="scope">
                        {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
                        </template>
                    </el-table-column>
					<el-table-column prop="F_CreateUser" label="创建人" align="left" />
                    <el-table-column prop="F_LastModifyTime" label="修改时间" sortable='custom' align="left" width="140">
                        <template slot-scope="scope">
                        {{ scope.row.F_LastModifyTime | toDate("yyyy-MM-dd hh:mm:ss") }}
                        </template>
                    </el-table-column>					
					<el-table-column prop="F_LastModifyUserId" label="修改人" align="left" />
					<el-table-column label="操作" fixed="right" width="150">
							<template slot-scope="scope">
							<el-button type="text" @click="addOrUpdateHandle(scope.row.F_Id)" >编辑</el-button>
							<el-button type="text" @click="handleDel(scope.row.F_Id)" class='HSZ-table-delBtn' >删除</el-button>
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
        <ImportForm v-if="importFormVisible" ref="importForm" @refresh="reset()" />
	</div>
</template>
<script>
	import request from '@/utils/request'
	import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
	import HSZForm from './Form'
	import ExportBox from './ExportBox'
	import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
	import Detail from './Detail'
    import ImportForm from './ImportForm'
	export default {
	    components: { HSZForm, ExportBox, Detail,ImportForm },
	    data() {
	        return {
                detailVisible: false,
	            showAll: false,
	        query: {
	                F_TrayNo:undefined,
	                F_Type:undefined,
	                F_TrayState:undefined,
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
                importFormVisible:false,
                columnList: [
                    { prop: 'F_TrayNo', label: '托盘编号' },
                    { prop: 'F_Type', label: '托盘类型' },
                    { prop: 'F_TrayState', label: '托盘状态' },                    
                    { prop: 'F_DisableMark', label: '禁用原因' },
                    { prop: 'F_CreateTime', label: '创建时间' },
                    { prop: 'F_CreateUser', label: '创建人' },
                    { prop: 'F_LastModifyTime', label: '修改时间' },
                    { prop: 'F_LastModifyUserId', label: '修改人' },
				],
				typeOptions : [],
				trayStateOptions : [],
			}
        },
		computed: {},
		created() {
			this.initData()
			this.gettypeOptions();
			this.gettrayStateOptions();
		},
		methods: {
            uploadForm() {
                this.importFormVisible = true        
                this.$nextTick(() => {
                this.$refs.importForm.init()
                })
            },
            goDetail(id){
			    this.detailVisible = true
                this.$nextTick(() => {
                    this.$refs.Detail.init(id)
                })
			},
			gettypeOptions(){
				getDictionaryDataSelector('332411089230759173').then(res => {
					this.typeOptions = res.data.list
				});
			},
			gettrayStateOptions(){
				getDictionaryDataSelector('332412309932606725').then(res => {
					this.trayStateOptions = res.data.list
				});
			},
                sortChange({ column, prop, order }) {
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
                    url: `/api/wms/ZjnPlaneTray`,
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
                        url: `/api/wms/ZjnPlaneTray/${id}`,
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
			exportData() {
                this.exportBoxVisible = true
                this.$nextTick(() => {
                    this.$refs.ExportBox.init(this.columnList)
                })
            },
            download(data) {
                let query = { ...data, ...this.listQuery, ...this.query }
                request({
                    url: `/api/wms/ZjnPlaneTray/Actions/Export`,
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
                    sidx: "F_Id",
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
                    sidx: "F_Id",
                }
                this.initData()
            }
		}
    }
</script>