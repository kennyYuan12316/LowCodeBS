<template>
	<div class="HSZ-common-layout">
		<div class="HSZ-common-layout-center">
			<el-row class="HSZ-common-search-box" :gutter="16">
				<el-form @submit.native.prevent>
					<el-col :span="6">
						<el-form-item label="业务编号">
							<el-input v-model="query.F_work_no" placeholder="业务编号" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="业务名称">
							<el-input v-model="query.F_work_name" placeholder="业务名称" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="业务类型">
							<el-select v-model="query.F_work_type" placeholder="业务类型" clearable >
								<el-option v-for="(item, index) in workTypeOptions" :key="index" :label="item.fullName" :value="item.enCode"  />
							</el-select>
						</el-form-item>
					</el-col>
					<template v-if="showAll">
					<el-col :span="6">
						<el-form-item label="起点工位">
							<el-select v-model="query.F_work_start" placeholder="起点工位" clearable >
								<el-option v-for="(item, index) in workStartOptions" :key="index" :label="item.Capion" :value="item.StationID"  />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="终点工位">
							<el-select v-model="query.F_work_end" placeholder="终点工位" clearable >
								<el-option v-for="(item, index) in workEndOptions" :key="index" :label="item.Capion" :value="item.StationID"  />
							</el-select>
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
					<el-table-column prop="F_work_no" label="业务编号" align="left" />
					<el-table-column prop="F_work_name" label="业务名称" align="left" />
					<el-table-column label="流程类型" prop="work_type" align="left">
							<template slot-scope="scope">{{ scope.row.F_work_typeName  }}</template>
					</el-table-column>
					<el-table-column label="物料类型" prop="GoodsType" align="left">
							<template slot-scope="scope">{{ scope.row.F_GoodsTypeName  }}</template>
					</el-table-column>
					<el-table-column label="所属库位" prop="work_warehouse" align="left">
							<template slot-scope="scope">{{ scope.row.F_work_warehouseName }}</template>
					</el-table-column>
					<el-table-column label="起点工位" prop="work_start" align="left">
							<template slot-scope="scope">{{ scope.row.F_work_startName  }}</template>
					</el-table-column>
					<el-table-column label="终点工位" prop="work_end" align="left">
							<template slot-scope="scope">{{ scope.row.F_work_endName  }}</template>
					</el-table-column>
					<el-table-column prop="F_work_nodes" label="是否存在动态站点" align="left" />
					<el-table-column prop="F_CreateUser" label="创建用户" align="left" />
					<el-table-column prop="F_CreateTime" label="创建时间" align="left">
					<template slot-scope="scope">
                        {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
                        </template>
                    </el-table-column>	
					<el-table-column prop="F_LastModifyUserId" label="修改用户" align="left" />
					<el-table-column prop="F_LastModifyTime" label="修改时间" align="left">
						<template slot-scope="scope">
                        {{ scope.row.F_LastModifyTime | toDate("yyyy-MM-dd hh:mm:ss") }}
                        </template>
                    </el-table-column>	
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
		<HSZ-Form v-if="formVisible" ref="HSZForm" @close="closeForm"/>
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
	                F_work_no:undefined,
	                F_work_name:undefined,
	                F_work_type:undefined,
	                F_work_start:undefined,
	                F_work_end:undefined,
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
                    { prop: 'F_work_no', label: '业务编号' },
                    { prop: 'F_work_name', label: '业务名称' },
                    { prop: 'F_work_type', label: '流程类型' },
                    { prop: 'F_GoodsType', label: '物料类型' },
                    { prop: 'F_work_warehouse', label: '所属库位' },
                    { prop: 'F_work_start', label: '起点工位' },
                    { prop: 'F_work_end', label: '终点工位' },
                    { prop: 'F_work_nodes', label: '是否存在动态站点' },
                    { prop: 'F_CreateUser', label: '创建用户' },
                    { prop: 'F_CreateTime', label: '创建时间' },
                    { prop: 'F_LastModifyUserId', label: '修改用户' },
                    { prop: 'F_LastModifyTime', label: '修改时间' },
				],
				workTypeOptions:[],
				workWarehouseOptions:[],
				workStartOptions : [],
				workEndOptions : [],
			}
        },
		computed: {},
		created() {
			this.initData()
			this.getworkTypeOptions();

			// this.getworkStartOptions();
			// this.getworkEndOptions();
			// this.getworkWarehouseOptions();

		},
		methods: {
			getworkTypeOptions(){
				getDictionaryDataSelector('349315174420710661').then(res => {
					this.workTypeOptions = res.data.list
				});
			},
			// getworkWarehouseOptions(){
			// 	getDataInterfaceRes('327591530430727429').then(res => {
			// 		let data = this.hsz.interfaceDataHandler(res.data)
			// 		this.workWarehouseOptions = data
			// 	});
			// },
			// getworkStartOptions(){
			// 	getDataInterfaceRes('343244101333812485').then(res => {
			// 		let data = this.hsz.interfaceDataHandler(res.data)
			// 		this.workStartOptions = data
			// 	});
			// },
			// getworkEndOptions(){
			// 	getDataInterfaceRes('343244101333812485').then(res => {
			// 		let data = this.hsz.interfaceDataHandler(res.data)
			// 		this.workEndOptions = data
			// 	});
			// },
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
                    url: `/api/wms/ZjnWcsProcessConfig`,
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
                        url: `/api/wms/ZjnWcsProcessConfig/${id}`,
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
            closeForm (isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.initData()
      }
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