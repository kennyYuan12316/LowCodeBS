<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="盘点单据号">
              <el-input v-model="query.F_InventoryNo" placeholder="盘点单据号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="盘点类型">
              <el-select v-model="query.F_InventoryType" placeholder="盘点类型" clearable>
                <el-option v-for="(item, index) in inventoryTypeOptions" :key="index" :label="item.fullName"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="开始时间">
              <el-date-picker v-model="query.F_StartTime" type="datetimerange" value-format="timestamp"
                format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="结束时间">
                <el-date-picker v-model="query.F_EndTime" type="datetimerange" value-format="timestamp"
                  format="yyyy-MM-dd HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期">
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
            <el-button type="text" icon="el-icon-delete" @click="handleBatchRemoveDel()">批量删除</el-button>
          </div>
          <div class="HSZ-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
            </el-tooltip>
            <screenfull isContainer />
          </div>
        </div>
        <HSZ-table v-loading="listLoading" :data="list" has-c @selection-change="handleSelectionChange">
          <el-table-column prop="F_InventoryNo" label="盘点单据号" align="left" />
          <el-table-column label="盘点类型" prop="inventoryType" align="left">
            <template slot-scope="scope">{{ scope.row.F_InventoryType | dynamicText(inventoryTypeOptions) }}</template>
          </el-table-column>
          <el-table-column prop="F_StartTime" label="开始时间" align="left" width="160">
            <template slot-scope="scope">
              {{scope.row.F_StartTime|toDate("yyyy-MM-dd hh:mm:ss")}}
            </template>
          </el-table-column>
          <el-table-column prop="F_EndTime" label="结束时间" align="left" width="160">
            <template slot-scope="scope">
              {{scope.row.F_EndTime|toDate("yyyy-MM-dd hh:mm:ss")}}
            </template>
          </el-table-column>
          <el-table-column prop="F_Description" label="描述" align="left" />
          <el-table-column label="有效标志" prop="enabledMark" align="left">
            <template slot-scope="scope">
              <el-tag :type="scope.row.F_EnabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{scope.row.F_EnabledMark==1?'启用':'禁用'}}
              </el-tag>
            </template>
          </el-table-column>


          <el-table-column prop="F_CreateUser" label="创建用户" align="left" />
          <el-table-column prop="F_CreateTime" label="创建时间" align="left" width="160">
            <template slot-scope="scope">
              {{scope.row.F_CreateTime|toDate("yyyy-MM-dd hh:mm:ss")}}
            </template>
          </el-table-column>
          <el-table-column prop="F_LastModifyUserId" label="修改用户" align="left" />
          <el-table-column prop="F_LastModifyTime" label="修改时间" align="left" width="160">
            <template slot-scope="scope">
              {{scope.row.F_LastModifyTime|toDate("yyyy-MM-dd hh:mm:ss")}}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.F_Id)">编辑</el-button>
              <el-button type="text" @click="handleDel(scope.row.F_Id)" class='HSZ-table-delBtn'>删除</el-button>
              <!--<el-button type="text" @click="goDetail(scope.row.F_Id)" >详情</el-button>-->
            </template>
          </el-table-column>
        </HSZ-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <HSZ-Form v-if="formVisible" ref="HSZForm" @refresh="refresh" />
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
    <Detail v-if="detailVisible" ref="Detail" @refresh="detailVisible=false" />
  </div>
</template>
<script>
  import request from '@/utils/request'
  import {
    getDictionaryDataSelector
  } from '@/api/systemData/dictionary'
  import HSZForm from './Form'
  import ExportBox from './ExportBox'
  import {
    getDataInterfaceRes
  } from '@/api/systemData/dataInterface'
  import Detail from './Detail'
  export default {
    components: {
      HSZForm,
      ExportBox,
      Detail
    },
    data() {
      return {
        detailVisible: false,
        showAll: false,
        query: {
          F_InventoryNo: undefined,
          F_InventoryType: undefined,
          F_StartTime: undefined,
          F_EndTime: undefined,
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
        columnList: [{
            prop: 'F_InventoryNo',
            label: '盘点单据号'
          },
          {
            prop: 'F_InventoryType',
            label: '盘点类型'
          },
          {
            prop: 'F_StartTime',
            label: '开始时间'
          },
          {
            prop: 'F_EndTime',
            label: '结束时间'
          },
          {
            prop: 'F_Description',
            label: '描述'
          },
          {
            prop: 'F_EnabledMark',
            label: '有效标志'
          },
          {
            prop: 'F_CreateUser',
            label: '创建用户'
          },
          {
            prop: 'F_CreateTime',
            label: '创建时间'
          },
          {
            prop: 'F_LastModifyUserId',
            label: '修改用户'
          },
          {
            prop: 'F_LastModifyTime',
            label: '修改时间'
          },
        ],
        inventoryTypeOptions: [],
        enabledMarkOptions: [{
          'fullName': "禁用",
          'id': "0"
        }, {
          'fullName': "启用",
          'id': "1"
        }],
      }
    },
    computed: {},
    created() {
      this.initData()
      this.getinventoryTypeOptions();
    },
    methods: {
      goDetail(id) {
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.Detail.init(id)
        })
      },
      getinventoryTypeOptions() {
        getDictionaryDataSelector('327971490504901893').then(res => {
          this.inventoryTypeOptions = res.data.list
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
          url: `/api/wms/ZjnPlaneInventoryPlan`,
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
            url: `/api/wms/ZjnPlaneInventoryPlan/${id}`,
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
        }).catch(() => {});
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
            url: `/api/wms/ZjnPlaneInventoryPlan/batchRemove`,
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
        }).catch(() => {})
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
          sidx: "F_InventoryNo",
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
          sidx: "F_InventoryNo",
        }
        this.initData()
      }
    }
  }
</script>
