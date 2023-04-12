<template>
    <div class="HSZ-common-layout">
        <div class="HSZ-common-layout-center">
            <el-row class="HSZ-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="6">
                        <el-form-item label="线体编号">
                            <el-input v-model="query.F_LineNo" placeholder="线体编号" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="线体名称">
                            <el-input v-model="query.F_LineName" placeholder="线体名称" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="有效标志">
                            <el-select v-model="query.F_EnabledMark" placeholder="有效标志">
                                <el-option v-for="(item, index) in enabledMarkOptions" :key="index"
                                    :label="item.fullName" :value="item.id" />
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
                    </div>
                    <div class="HSZ-common-head-right">
                        <el-tooltip effect="dark" content="刷新" placement="top">
                            <el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false"
                                @click="reset()" />
                        </el-tooltip>
                        <screenfull isContainer />
                    </div>
                </div>
                <HSZ-table v-loading="listLoading" :data="list">
                    <el-table-column prop="F_LineNo" label="线体编号" align="left" />
                    <el-table-column prop="F_LineName" label="线体名称" align="left" />                    
                    <el-table-column label="电芯类型" prop="GoodsType" align="left">
						<template slot-scope="scope">{{ scope.row.F_GoodsTypeName  }}</template>
					</el-table-column>
                    <el-table-column prop="F_LineStart" label="线体缓存起点" align="left" />
                    <el-table-column prop="F_LineEnd" label="线体缓存终点" align="left" />
                    <el-table-column prop="F_LineLayer" label="线体层" align="left" />
                    <el-table-column prop="F_LineMaxWork" label="线体最大任务（缓存）数" align="left" />
                    <el-table-column prop="F_LineNowWork" label="当前任务（缓存）数量" align="left" />
                    <el-table-column prop="F_Description" label="线体描述" align="left" />
                    <el-table-column prop="F_EnabledMark" label="是否启用" align="left">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.F_EnabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                                {{scope.row.F_EnabledMark==1?'启用':'禁用'}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" width="180">
                        <template slot-scope="scope">
                            <el-button type="text" @click="addOrUpdateHandle(scope.row.F_Id)">编辑</el-button>
                            <el-button type="text" @click="lineDetails(scope.row.F_LineNo)">线体物料明细</el-button>
                            <el-button type="text" @click="handleDel(scope.row.F_Id)" class='HSZ-table-delBtn'>删除
                            </el-button>
                        </template>
                    </el-table-column>
                </HSZ-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData" />
            </div>
        </div>
        <el-dialog title="线体物料明细" :visible.sync="detailsVisible">
            <HSZ-table v-loading="detailsLoading" :data="detailslist">
                <el-table-column prop="F_LineNo" label="线体编号" align="left" />
                <el-table-column prop="F_LineName" label="线体名称" align="left" />
                <el-table-column label="物料类型" prop="goodsType" align="left" width="100"  >
                    <template slot-scope="scope">{{ scope.row.F_GoodsType | dynamicTextByenCode(goodsTypeOptions) }}</template>
                </el-table-column>
                <el-table-column prop="F_GoodsCode" label="物料编号" align="left" />
                <el-table-column prop="F_TrayNo" label="托盘编号" align="left" />
                <el-table-column prop="F_LineStart" label="线体缓存起点" align="left" />
                <el-table-column prop="F_LineEnd" label="线体缓存终点" align="left" />
                <el-table-column prop="F_LineLayer" label="线体层" align="left" />
                <el-table-column prop="F_LineMaxWork" label="线体最大任务数" align="left" />
                <el-table-column prop="F_LineNowWork" label="当前任务数量" align="left" />
                <el-table-column prop="F_Description" label="线体描述" align="left" />
                <el-table-column prop="F_Status" label="状态" align="left" >
                    <template slot-scope="scope">
                        <span>{{scope.row.F_Status==1?"在线":scope.row.F_Status==2?"已出":""}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="F_OutTime" label="出库时间" align="left" >
                    <template slot-scope="scope">
                        {{ scope.row.F_OutTime | toDate("yyyy-MM-dd hh:mm:ss") }}
                        </template>
                </el-table-column>
                <el-table-column prop="F_CreateTime" label="创建时间" align="left" >
                    <template slot-scope="scope">
                        {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
                        </template>
                </el-table-column>
      
              </HSZ-table>
              <pagination :total="detailstotal" :page.sync="detailsListQuery.currentPage" :limit.sync="detailsListQuery.pageSize"
                @pagination="lineDetails('')" />
          </el-dialog>
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
                F_LineNo: undefined,
                F_LineName: undefined,
                F_EnabledMark: undefined
            },
            detailsquery: {
                F_LineNo: undefined,
                Status:1,
            },
            list: [],
            detailslist: [],
            listLoading: true,
            detailsLoading: true,
            detailsVisible:false,
            multipleSelection: [],
            total: 0,
            detailstotal: 0,
            listQuery: {
                currentPage: 1,
                pageSize: 20,
                sort: "desc",
                sidx: "",
            },
            detailsListQuery: {
            currentPage: 1,
            pageSize: 20,
            sort: "desc",
            sidx: "",
            },
            formVisible: false,
            exportBoxVisible: false,
            columnList: [
                { prop: 'F_LineNo', label: '线体编号' },
                { prop: 'F_LineName', label: '线体名称' },
                { prop: 'F_GoodsType', label: '电芯类型' },
                { prop: 'F_LineStart', label: '线体缓存起点' },
                { prop: 'F_LineEnd', label: '线体缓存终点' },
                { prop: 'F_LineLayer', label: '线体层' },
                { prop: 'F_LineMaxWork', label: '线体最大任务（缓存）数' },
                { prop: 'F_LineNowWork', label: '当前任务（缓存）数量' },
                { prop: 'F_Description', label: '线体描述' },
                { prop: 'F_EnabledMark', label: '是否启用' },
            ],
            enabledMarkOptions: [{
                'fullName': "启用",
                'id': "1"
            }, {
                'fullName': "禁用",
                'id': "0"
            }],
            goodsTypeOptions: []
        }
    },
    computed: {},
    created() {
        this.initData();
        this.getgoodsTypeOptions();
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
                url: `/api/wms/ZjnWmsLineSetting`,
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
                    url: `/api/wms/ZjnWmsLineSetting/${id}`,
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
        },
        getgoodsTypeOptions() {
            getDictionaryDataSelector('325449144728552709').then(res => {
                this.goodsTypeOptions = res.data.list
            });
        },
        //线体物料明细
        lineDetails(lineNo){
            if(lineNo){
            this.detailsquery.F_LineNo=lineNo;
            }
            this.detailsVisible=true;
            this.detailsLoading = true;
            let _query = {
            ...this.detailsListQuery,
            ...this.detailsquery
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
            url: `/api/wms/ZjnWmsLineSettinglog`,
            method: 'GET',
            data: query
            }).then(res => {
            this.detailslist = res.data.list
            this.detailstotal = res.data.pagination.total
            this.detailsLoading = false
            })
        }
    }
}
</script>