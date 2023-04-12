<template>
	<div class="HSZ-common-layout">
		<div class="HSZ-common-layout-center">
			<el-row class="HSZ-common-search-box" :gutter="16">
				<el-form @submit.native.prevent>
					<el-col :span="6">
						<el-form-item label="厂区名称">
							<el-input v-model="query.e2" placeholder="厂区名称" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="厂区编码">
							<el-input v-model="query.e3" placeholder="厂区编码" clearable />	
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
					</div>
					<div class="HSZ-common-head-right">
						<el-tooltip effect="dark" content="刷新" placement="top">
							<el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
						</el-tooltip>
						<screenfull isContainer />
					</div>
				</div>
                <HSZ-table v-loading="listLoading" :data="list">
					<el-table-column prop="e1" label="编号" align="left" />
					<el-table-column prop="e2" label="厂区名称" align="left" />
					<el-table-column prop="e3" label="厂区编码" align="left" />
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
	        query: {
	                e2:undefined,
	                e3:undefined,
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
                    { prop: 'e1', label: '编号' },
                    { prop: 'e2', label: '厂区名称' },
                    { prop: 'e3', label: '厂区编码' },
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
                    url: `/api/wms/HltHrFactory`,
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
                        url: `/api/wms/HltHrFactory/${id}`,
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
                    url: `/api/wms/HltHrFactory/Actions/Export`,
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