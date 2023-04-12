<template>
	<div class="HSZ-common-layout">
		<div class="HSZ-common-layout-center">
			<el-row class="HSZ-common-search-box" :gutter="16">
				<el-form @submit.native.prevent>
					<el-col :span="6">
						<el-form-item label="32位批次号">
							<el-input v-model="query.F_Batch" placeholder="32位批次号" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="物料编码">
							<el-input v-model="query.F_ProductsCode" placeholder="物料编码" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="物料名称">
							<el-input v-model="query.F_ProductsName" placeholder="物料名称" clearable />	
						</el-form-item>
					</el-col>
					<template v-if="showAll">
					<el-col :span="6">
						<el-form-item label="入库时间">
							<el-date-picker v-model="query.F_EntryTime" type="datetimerange" value-format="timestamp" format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="物料类型">
							<el-input v-model="query.F_ProductsType" placeholder="物料类型" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="供应商">
							<el-input v-model="query.F_ProductsSupplier" placeholder="供应商" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="失效时间">
							<el-date-picker v-model="query.F_FailureTime" type="datetimerange" value-format="timestamp" format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="保质期预警">
							<el-date-picker v-model="query.F_WarningTime" type="datetimerange" value-format="timestamp" format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期">
							</el-date-picker>
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
					<el-table-column prop="F_Batch" label="32位批次号" align="left" />
					<el-table-column prop="F_ProductsCode" label="物料编码" align="left" />
					<el-table-column prop="F_ProductsName" label="物料名称" align="left" />
					<el-table-column prop="F_ProductsQuantity" label="物料数量" align="left" />
					<el-table-column prop="F_ProductsUnit" label="物料单位" align="left" />
					<el-table-column prop="F_EntryTime" label="入库时间" align="left">
                        <template slot-scope="scope">
                            {{scope.row.F_EntryTime|toDate("yyyy-MM-dd hh:mm:ss")}}
                        </template>
                    </el-table-column>
					<el-table-column prop="F_ProductsType" label="物料类型" align="left" />
					<el-table-column prop="F_ProductsSupplier" label="供应商" align="left" />
					<el-table-column prop="F_InventoryMax" label="库存上限" align="left" />
					<el-table-column prop="F_InventoryMin" label="库存下限" align="left" />
					<el-table-column prop="F_WarningResult" label="预警原因" align="left" />
					<el-table-column prop="F_ExpirationDate" label="保质期" align="left" />
					<el-table-column prop="F_ProductionTime" label="生产时间" align="left" >
						 <template slot-scope="scope">
                            {{scope.row.F_ProductionTime|toDate("yyyy-MM-dd hh:mm:ss")}}
                        </template>
					</el-table-column>
					<el-table-column prop="F_FailureTime" label="失效时间" align="left" >
						<template slot-scope="scope">
                            {{scope.row.F_FailureTime|toDate("yyyy-MM-dd hh:mm:ss")}}
                        </template>
					</el-table-column>
					<el-table-column prop="F_WarningCycle" label="预警周期" align="left" />
					<el-table-column prop="F_WarningTime" label="保质期预警" align="left" >
						<template slot-scope="scope">
                            {{scope.row.F_WarningTime|toDate("yyyy-MM-dd hh:mm:ss")}}
                        </template>
					</el-table-column>
					<el-table-column prop="F_Description" label="描述" align="left" />
					
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
	            showAll: false,
	        query: {
	                F_Batch:undefined,
	                F_ProductsCode:undefined,
	                F_ProductsName:undefined,
	                F_EntryTime:undefined,
	                F_ProductsType:undefined,
	                F_ProductsSupplier:undefined,
	                F_FailureTime:undefined,
	                F_WarningTime:undefined,
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
                    { prop: 'F_Batch', label: '32位批次号' },
                    { prop: 'F_ProductsCode', label: '物料编码' },
                    { prop: 'F_ProductsName', label: '物料名称' },
                    { prop: 'F_ProductsQuantity', label: '物料数量' },
                    { prop: 'F_ProductsUnit', label: '物料单位' },
                    { prop: 'F_EntryTime', label: '入库时间' },
                    { prop: 'F_ProductsType', label: '物料类型' },
                    { prop: 'F_ProductsSupplier', label: '供应商' },
                    { prop: 'F_InventoryMax', label: '库存上限' },
                    { prop: 'F_InventoryMin', label: '库存下限' },
                    { prop: 'F_WarningResult', label: '预警原因' },
                    { prop: 'F_ExpirationDate', label: '保质期' },
                    { prop: 'F_ProductionTime', label: '生产时间' },
                    { prop: 'F_FailureTime', label: '失效时间' },
                    { prop: 'F_WarningCycle', label: '预警周期' },
                    { prop: 'F_WarningTime', label: '保质期预警' },
                    { prop: 'F_Description', label: '描述' },
                    { prop: 'F_CreateTime', label: '更新时间' },
				],
			}
        },
		computed: {},
		created() {
			this.initData()
		},
		methods: {
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
                    url: `/api/wms/ZjnBaseGoodsWarning`,
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
                        url: `/api/wms/ZjnBaseGoodsWarning/${id}`,
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
                    sidx: "F_Batch",
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
                    sidx: "F_Batch",
                }
                this.initData()
            }
		}
    }
</script>