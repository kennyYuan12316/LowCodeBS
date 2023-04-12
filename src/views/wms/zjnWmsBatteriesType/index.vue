<template>
	<div class="HSZ-common-layout">
		<div class="HSZ-common-layout-center">
			<el-row class="HSZ-common-search-box" :gutter="16">
				<el-form @submit.native.prevent>
					<el-col :span="6">
						<el-form-item label="电芯种类">
							<el-select v-model="query.F_BatteriesType" placeholder="电芯种类" clearable>
                                <el-option v-for="(item, index) in batteriesTypeOptions" :key="index" :label="item.fullName" :value="item.enCode" />
                            </el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="静置时间（小时）">
							<el-input v-model="query.F_StandingTime" placeholder="静置时间（小时）" clearable />	
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
					<el-table-column prop="F_BatteriesType" label="电芯种类" align="left">
                        <template slot-scope="scope">{{ scope.row.F_BatteriesType | dynamicTextByenCode(batteriesTypeOptions) }}</template>
                    </el-table-column>                   

					<el-table-column prop="F_StandingTime" label="静置时间（小时）" align="left" />
					<el-table-column prop="F_Description" label="描述" align="left" />
					<el-table-column label="创建时间" sortable align="left">
                        <template slot-scope="scope">
                        {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
                        </template>
                    </el-table-column>
					<el-table-column prop="F_EnabledMark" label="有效标志" align="left" />
					<el-table-column label="操作" fixed="right" width="100">
							<template slot-scope="scope">
							<el-button type="text" @click="addOrUpdateHandle(scope.row.F_Id)" >编辑</el-button>
							<el-button type="text" @click="handleDel(scope.row.F_Id)" class='HSZ-table-delBtn' >删除</el-button>
						</template>
					</el-table-column>
				</HSZ-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData" />
            </div>
        </div>
		<HSZ-Form v-if="formVisible" ref="HSZForm" @refresh="refresh" />
		<ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
	</div>
</template>
<script>
	import request from '@/utils/request'
	import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
	import HSZForm from './Form'
	import ExportBox from './ExportBox'
	import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
	export default {
	    components: { HSZForm, ExportBox },
	    data() {
	        return {
	        query: {
	                F_BatteriesType:undefined,
	                F_StandingTime:undefined,
				},
                list: [],
                listLoading: true,
                batteriesTypeOptions:[],
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
                    { prop: 'F_BatteriesType', label: '电池种类' },
                    { prop: 'F_StandingTime', label: '静置时间（小时）' },
                    { prop: 'F_Description', label: '描述' },
                    { prop: 'F_CreateTime', label: '创建时间' },
                    { prop: 'F_EnabledMark', label: '有效标志' },
				],
			}
        },
		computed: {},
		created() {
			this.initData()
            this.getbatteriesTypeOptions()
		},
		methods: {
            getbatteriesTypeOptions(){
				getDictionaryDataSelector('356947142322947333').then(res => {
					this.batteriesTypeOptions = res.data.list
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
                    url: `/api/wms/ZjnWmsBatteriesType`,
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
                        url: `/api/wms/ZjnWmsBatteriesType/${id}`,
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