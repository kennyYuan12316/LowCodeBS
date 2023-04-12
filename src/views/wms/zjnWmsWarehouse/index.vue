<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="仓库编号">
              <el-input v-model="query.F_WarehouseNo" placeholder="仓库编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="仓库名称">
              <el-input v-model="query.F_WarehouseName" placeholder="仓库名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="有效标志">
              <el-select v-model="query.F_EnabledMark" placeholder="有效标志">
                <el-option v-for="(item, index) in enabledMarkOptions" :key="index" :label="item.fullName"
                  :value="item.id" />
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
          <el-table-column prop="F_WarehouseNo" label="仓库编号" align="center" />
          <el-table-column prop="F_WarehouseName" label="仓库名称" align="left" />
          <el-table-column prop="F_RegionName" label="所属区域" align="left" />
          <el-table-column prop="F_CreateUser" label="创建者" align="left" />
          <el-table-column label="创建时间" sortable align="left">
            <template slot-scope="scope">
              {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column label="有效标志" prop="enabledMark" align="left">
            <template slot-scope="scope">
              <el-tag :type="scope.row.F_EnabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{scope.row.F_EnabledMark==1?'启用':'禁用'}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.F_Id)">编辑</el-button>
              <el-button type="text" @click="handleDel(scope.row.F_Id)" class='HSZ-table-delBtn'>删除</el-button>
            </template>
          </el-table-column>
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
  import {
    getDictionaryDataSelector
  } from '@/api/systemData/dictionary'
  import HSZForm from './Form'
  import ExportBox from './ExportBox'
  import {
    getDataInterfaceRes
  } from '@/api/systemData/dataInterface'
  export default {
    components: {
      HSZForm,
      ExportBox
    },
    data() {
      return {
        showAll: false,
        query: {
          F_WarehouseNo: undefined,
          F_WarehouseName: undefined,
          F_RegionNo: undefined,
          F_EnabledMark: undefined,
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
            prop: 'F_WarehouseNo',
            label: '仓库编号'
          },
          {
            prop: 'F_WarehouseName',
            label: '仓库名称'
          },
          {
            prop: 'F_RegionName',
            label: '区域名称'
          },
          {
            prop: 'F_CreateUser',
            label: '创建者'
          },
          {
            prop: 'F_CreateTime',
            label: '创建时间'
          },
          {
            prop: 'F_EnabledMark',
            label: '有效标志'
          },
        ],
        regionNoOptions: [],
        enabledMarkOptions: [{
          'fullName': "启用",
          'id': "1"
        }, {
          'fullName': "禁用",
          'id': "0"
        }],
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
          url: `/api/wms/ZjnWmsWarehouse`,
          method: 'GET',
          data: query
        }).then(res => {
          console.log(res.data.list)
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
            url: `/api/wms/ZjnWmsWarehouse/${id}`,
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
            url: `/api/wms/ZjnWmsWarehouse/batchRemove`,
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
