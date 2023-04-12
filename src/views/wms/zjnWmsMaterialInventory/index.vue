<template>
    <div class="HSZ-common-layout">
        <div class="HSZ-common-layout-center">
            <el-row class="HSZ-common-search-box" :gutter="16">
                <el-form @submit.native.prevent>
                    <el-col :span="6">
                        <el-form-item label="物料编码">
                            <el-input v-model="query.F_ProductsCode" placeholder="物料编码" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="物料货位">
                            <el-input v-model="query.F_ProductsLocation" placeholder="物料货位" clearable />
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="物料容器">
                            <el-input v-model="query.F_ProductsContainer" placeholder="物料货位" clearable />
                        </el-form-item>
                    </el-col>
                    <template v-if="showAll">
                        <el-col :span="6">
                            <el-form-item label="物料名称">
                                <el-input v-model="query.F_ProductsName" placeholder="物料名称" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="物料状态">
                                <el-input v-model="query.F_ProductsState" placeholder="物料状态" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="物料批次">
                                <el-input v-model="query.F_ProductsBatch" placeholder="物料批次" clearable />
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="物料类型">
                                <el-input v-model="query.F_ProductsType" placeholder="物料类型" clearable />
                            </el-form-item>
                        </el-col>
                    </template>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
                            <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
                            <el-button type="text" icon="el-icon-arrow-down" @click="showAll=true" v-if="!showAll">展开
                            </el-button>
                            <el-button type="text" icon="el-icon-arrow-up" @click="showAll=false" v-else>收起</el-button>
                        </el-form-item>
                    </el-col>
                </el-form>
            </el-row>
            <div class="HSZ-common-layout-main HSZ-flex-main">
                <div class="HSZ-common-head">
                    <div>
                        <!-- <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button> -->
                        <el-button type="text" icon="el-icon-download" @click="exportData()">导出</el-button>
                        <!-- <el-button type="text" icon="el-icon-delete" @click="handleBatchRemoveDel()">批量删除</el-button> -->
                    </div>
                    <div class="HSZ-common-head-right">
                        <el-tooltip effect="dark" content="刷新" placement="top">
                            <el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false"
                                @click="reset()" />
                        </el-tooltip>
                        <screenfull isContainer />
                    </div>
                </div>
                <HSZ-table v-loading="listLoading" :data="list" @sort-change='sortChange' has-c
                    @selection-change="handleSelectionChange">
                    <el-table-column prop="F_ProductsCode" label="物料编码" sortable='custom' align="left" />
                    <el-table-column prop="F_ProductsLocation" label="物料货位" sortable='custom' align="left" />
                    <el-table-column prop="F_ProductsContainer" label="物料容器" sortable='custom' align="left" />
                    <el-table-column prop="F_ProductsName" label="物料名称" sortable='custom' align="left" />
                    <el-table-column prop="F_ProductsStyle" label="物料规格" sortable='custom' align="left" />
                    <el-table-column prop="F_ProductsQuantity" label="物料数量" sortable='custom' align="left" />
                    <el-table-column prop="F_ProductsUnit" label="物料单位" sortable='custom' align="left">
                        <template slot-scope="scope">{{ scope.row.F_ProductsUnit | dynamicTextByenCode(ProductsUnitList)
                        }}</template>
                    </el-table-column>

                    <el-table-column prop="F_ProductsType" label="物料类型" sortable='custom' align="left">
                        <template slot-scope="scope">{{ scope.row.F_ProductsType | dynamicTextByenCode(goodsTypeOptions)
                        }}</template>
                    </el-table-column>
                    <el-table-column label="物料等级" prop="F_ProductsGrade" align="left" width="120">
                        <template slot-scope="scope">{{ scope.row.F_ProductsGrade | dynamicTextByenCode(GradeOptions)
                        }}</template>
                    </el-table-column>
                    <!-- <el-table-column prop="F_ProductsState" label="物料状态" sortable='custom' align="left" /> -->
                    <el-table-column prop="F_ProductsBatch" label="物料批次" sortable='custom' align="left" />
                    <!-- <el-table-column label="操作" fixed="right" width="100">
							<template slot-scope="scope">
							<el-button type="text" @click="addOrUpdateHandle(scope.row.F_Id)" >编辑</el-button>
							<el-button type="text" @click="handleDel(scope.row.F_Id)" class='HSZ-table-delBtn' >删除</el-button>
						</template>
					</el-table-column> -->

                </HSZ-table>
                <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
                    @pagination="initData" />
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
                F_ProductsCode: undefined,
                F_ProductsName: undefined,
                F_ProductsUnit: undefined,
                F_ProductsState: undefined,
                F_ProductsLocation: undefined,
                F_ProductsContainer: undefined,
                F_ProductsBatch: undefined,
                F_ProductsType: undefined,
            },
            list: [],
            listLoading: true,
            multipleSelection: [],
            ProductsUnitList: [],
            GradeOptions: [],
            goodsTypeOptions: [],
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
                { prop: 'F_ProductsCode', label: '物料编码' },
                { prop: 'F_ProductsLocation', label: '物料货位' },
                { prop: 'F_ProductsContainer', label: '物料容器' },
                { prop: 'F_ProductsName', label: '物料名称' },
                { prop: 'F_ProductsStyle', label: '物料规格' },
                { prop: 'F_ProductsQuantity', label: '物料数量' },
                { prop: 'F_ProductsUnit', label: '物料单位' },
                { prop: 'F_ProductsType', label: '物料类型' },
                { prop: 'F_ProductsGrade', label: '物料等级' },
                { prop: 'F_ProductsState', label: '物料状态' },
                { prop: 'F_ProductsBatch', label: '物料批次' },
            ],
        }
    },
    computed: {},
    created() {
        this.initData();
        this.getunitOptions();
        this.getproductsGradeOptions();
        this.getgoodsTypeOptions();
    },
    methods: {
        getproductsGradeOptions() {
            getDictionaryDataSelector('326588657760732421').then(res => {
                this.GradeOptions = res.data.list
            })
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
                url: `/api/wms/zjnWmsMaterialInventory`,
                method: 'GET',
                data: query
            }).then(res => {
                this.list = res.data.list
                this.total = res.data.pagination.total
                this.listLoading = false
            })
        },
        getgoodsTypeOptions() {
            getDictionaryDataSelector('325449144728552709').then(res => {
                this.goodsTypeOptions = res.data.list
            });
        },
        handleDel(id) {
            this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                type: 'warning'
            }).then(() => {
                request({
                    url: `/api/wms/zjnWmsMaterialInventory/${id}`,
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

        getunitOptions() {
            getDictionaryDataSelector('326384591566800133').then(res => {
                this.ProductsUnitList = res.data.list
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
                    url: `/api/wms/zjnWmsMaterialInventory/batchRemove`,
                    method: 'POST',
                    data: ids,
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
                url: `/api/wms/zjnWmsMaterialInventory/Actions/Export`,
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
                sidx: "F_CreateTime",
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
                sidx: "F_CreateTime",
            }
            this.initData()
        }
    }
}
</script>