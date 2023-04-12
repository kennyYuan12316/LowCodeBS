<template>
	<div class="HSZ-common-layout">
		<div class="HSZ-common-layout-center">
			<el-row class="HSZ-common-search-box" :gutter="16">
				<el-form @submit.native.prevent>
					<el-col :span="4">
						<el-form-item label="plcId">
							<el-input v-model="query.plcId" placeholder="plcId" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="设备类型">
							<el-select v-model="query.Caption" placeholder="设备类型" clearable >
								<el-option v-for="(item, index) in captionOptions" :key="index" :label="item.fullName" :value="item.enCode"  />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="区域">
							<el-select v-model="query.Region" placeholder="区域" clearable >
								<el-option v-for="(item, index) in regionOptions" :key="index" :label="item.fullName" :value="item.enCode"  />
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="4">
						<el-form-item label="ip">
							<el-input v-model="query.IP" placeholder="ip" clearable />	
						</el-form-item>
					</el-col>
					<el-col :span="4">
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
					<el-table-column prop="PlcID" label="PlcID" align="left" />

					<el-table-column label="设备类型" prop="caption" width="120" align="left">
							<template slot-scope="scope">{{ scope.row.Caption | dynamicTextByenCode(captionOptions) }}</template>
					</el-table-column>
					<el-table-column label="区域" prop="region" width="100" align="left">
							<template slot-scope="scope">{{ scope.row.Region | dynamicTextByenCode(regionOptions) }}</template>
					</el-table-column>
					<el-table-column label="cpu类型" prop="cpuType" align="left">
							<template slot-scope="scope">{{ scope.row.CpuType | dynamicTextByenCode(cpuTypeOptions) }}</template>
					</el-table-column>
					<el-table-column prop="IsConnected" label="连接状态" align="left">
						<template slot-scope="scope">
							<el-switch v-model='scope.row.IsConnected' active-value='开' inactive-value='关' >
							</el-switch>
						</template>
				    </el-table-column>
					<el-table-column prop="IP" label="ip" align="left" width="100" />
					<el-table-column prop="Port" label="port" align="left" />
					<el-table-column prop="Rack" label="Plc Rack" align="left" />
					<el-table-column prop="Sock" label="Plc Sock" align="left" />
					<el-table-column prop="TimeOut" label="Plc读写超时MS" align="left" />
					<el-table-column prop="IsActive" label="是否有效" align="left">
						<template slot-scope="scope">
							<el-switch v-model='scope.row.IsActive' active-value='开' inactive-value='关' >
							</el-switch>
						</template>
				    </el-table-column>
					<el-table-column prop="IsStacker" label="是否堆垛机" align="left">
						<template slot-scope="scope">
							<el-switch v-model='scope.row.IsStacker' active-value='开' inactive-value='关' >
							</el-switch>
						</template>
				    </el-table-column>
					<el-table-column prop="Error" label="异常" align="left" />
					<el-table-column prop="StackerID" label="堆垛机Id" align="left" />
					<el-table-column prop="Descrip" label="描述" align="left" />
					<el-table-column label="操作" fixed="right" width="100">
							<template slot-scope="scope">
							<el-button type="text" @click="addOrUpdateHandle(scope.row.PlcID)" >编辑</el-button>
							<el-button type="text" @click="handleDel(scope.row.PlcID)" class='HSZ-table-delBtn' >删除</el-button>
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
	                Caption:undefined,
	                Region:undefined,
	                IP:undefined,
					plcId:undefined,
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
				    { prop: 'PlcID', label: 'PlcID' },
                    { prop: 'Caption', label: '设备类型' },
                    { prop: 'Region', label: '区域' },
                    { prop: 'CpuType', label: 'cpu类型' },
                    { prop: 'IsConnected', label: '连接状态' },
                    { prop: 'IP', label: 'ip' },
                    { prop: 'Port', label: 'port' },
                    { prop: 'Rack', label: 'Plc Rack' },
                    { prop: 'Sock', label: 'Plc Sock' },
                    { prop: 'TimeOut', label: 'Plc读写超时MS' },
                    { prop: 'IsActive', label: '是否有效' },
                    { prop: 'IsStacker', label: '是否堆垛机' },
                    { prop: 'Error', label: '异常' },
                    { prop: 'StackerID', label: 'stackerId' },
                    { prop: 'Descrip', label: '描述' },
				],
				captionOptions : [],
				regionOptions : [],
				cpuTypeOptions:[{'fullName':"1500",'id':"1500"},{'fullName':"1200",'id':"1200"}],
			}
        },
		computed: {},
		created() {
			this.initData()
			this.getcaptionOptions();
			this.getregionOptions();
		},
		methods: {
			getcaptionOptions(){
				getDictionaryDataSelector('343042755552871685').then(res => {
					this.captionOptions = res.data.list
				});
			},
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
                    url: `/api/wms/ZjnWcsPlc`,
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
                        url: `/api/wms/ZjnWcsPlc/${id}`,
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
                    sidx: "PlcID",
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
                    sidx: "PlcID",
                }
                this.initData()
            }
		}
    }
</script>