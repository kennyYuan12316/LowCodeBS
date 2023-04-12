<template>
	<div class="HSZ-common-layout">
		<div class="HSZ-common-layout-center">
			<el-row class="HSZ-common-search-box" :gutter="16">
				<el-form @submit.native.prevent>
					<el-col :span="6">
						<el-form-item label="IP">
							<el-select v-model="query.F_PlcConnectionId" placeholder="下拉选择" clearable >
								<el-option v-for="(item, index) in plcConnectionIdOptions" :key="index" :label="item.F_IP" :value="item.F_Id"  />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="地址">
							<el-input v-model="query.F_Address" placeholder="地址" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="设备号">
							<el-input v-model="query.F_DeviceNo" placeholder="设备号" clearable />	
						</el-form-item>
					</el-col>
					<template v-if="showAll">
					<el-col :span="6">
						<el-form-item label="对象">
							<el-input v-model="query.F_ObjectType" placeholder="对象" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label="偏移量">
							<el-input v-model="query.F_Offset" placeholder="偏移量" clearable />	
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
					<el-table-column label="下拉选择" prop="plcConnectionId" align="left">
							<template slot-scope="scope">{{ scope.row.F_PlcConnectionId | dynamicText(plcConnectionIdOptions) }}</template>
					</el-table-column>
					<el-table-column prop="F_Address" label="地址" align="left" />
					<el-table-column prop="F_Offset" label="偏移量" align="left" />
					<el-table-column prop="F_DeviceNo" label="设备号" align="left" />
					<el-table-column prop="F_ObjectType" label="对象" align="left" />
					<el-table-column prop="F_Length" label="长度" align="left" />
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
	                F_PlcConnectionId:undefined,
	                F_Address:undefined,
	                F_DeviceNo:undefined,
	                F_ObjectType:undefined,
	                F_Offset:undefined,
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
                    { prop: 'F_PlcConnectionId', label: '下拉选择' },
                    { prop: 'F_Address', label: '地址' },
                    { prop: 'F_Offset', label: '偏移量' },
                    { prop: 'F_DeviceNo', label: '设备号' },
                    { prop: 'F_ObjectType', label: '对象' },
				],
				plcConnectionIdOptions : [],
			}
        },
		computed: {},
		created() {
			this.initData()
			this.getplcConnectionIdOptions();
		},
		methods: {
			getplcConnectionIdOptions(){
				getDataInterfaceRes('346218678938764549').then(res => {
					let data = this.hsz.interfaceDataHandler(res.data)
					this.plcConnectionIdOptions = data
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
                    url: `/api/wms/ZjnPlcWriteRequest`,
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
                        url: `/api/wms/ZjnPlcWriteRequest/${id}`,
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
                    url: `/api/wms/ZjnPlcWriteRequest/Actions/Export`,
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