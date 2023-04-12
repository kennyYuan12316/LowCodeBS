<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="供应商编号">
              <el-input v-model="query.F_SupplierNo" placeholder="供应商编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="供应商名称">
              <el-input v-model="query.F_SupplierName" placeholder="供应商名称" clearable />
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
            <el-button type="text" icon="el-icon-download" @click="exportForm">导出</el-button>
            <el-button type="text" icon="el-icon-upload2" @click="uploadForm">导入</el-button>
          </div>
          <div class="HSZ-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
            </el-tooltip>
            <screenfull isContainer />
          </div>
        </div>
        <HSZ-table v-loading="listLoading" :data="list" :columnData="columnList">

          <el-table-column prop="F_SupplierNo" label="供应商编号" sortable align="left" />
          <el-table-column prop="F_SupplierName" label="供应商名称" align="left" width="250" />
          <el-table-column prop="F_CreateUser" label="创建者" align="left" />
          <el-table-column label="创建时间" sortable align="left">
            <template slot-scope="scope">
              {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column prop="F_ModifiedUser" label="最后修改者" align="left" />
          <el-table-column label="最后修改时间" sortable align="left">
            <template slot-scope="scope">
              {{ scope.row.F_ModifiedTime | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="addOrUpdateHandle(scope.row.F_Id)">编辑
              </el-button>
              <el-button size="mini" type="text" class="HSZ-table-delBtn" @click="handleDel(scope.row.F_Id)">删除
              </el-button>
            </template>
          </el-table-column>
        </HSZ-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <HSZ-Form v-if="formVisible" ref="HSZForm" @refresh="refresh" />
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
    <ImportForm v-if="importFormVisible" ref="importForm" @refresh="reset()" />
    <ExportForm v-if="exportFormVisible" ref="exportForm" />

  </div>
</template>
<script>
  import request from '@/utils/request'
  import {
    getDictionaryDataSelector
  } from '@/api/systemData/dictionary'
  import HSZForm from './Form'
  import ImportForm from './ImportForm'
  import ExportBox from './ExportBox'
  import ExportForm from './ExportBox'
  import {
    getDataInterfaceRes
  } from '@/api/systemData/dataInterface'
  export default {
    components: {
      HSZForm,
      ExportBox,
      ImportForm,
      ExportForm
    },
    data() {
      return {
        query: {
          F_SupplierNo: undefined,
          F_SupplierName: undefined,
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
        importFormVisible: false,
        exportFormVisible: false,
        columnList: [{
            prop: 'F_SupplierNo',
            label: '供应商编号'
          },
          {
            prop: 'F_SupplierName',
            label: '供应商名称'
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
            prop: 'F_ModifiedUser',
            label: '最后修改者'
          },
          {
            prop: 'F_ModifiedTime',
            label: '最后修改时间'
          },
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
          url: `/api/wms/BaseSupplier`,
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
            url: `/api/wms/BaseSupplier/${id}`,
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
      addOrUpdateHandle(id, isDetail) {
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.HSZForm.init(id, isDetail)
        })
      },
      TheImport() {
        this.importFormVisible = true
        this.$nextTick(() => {
          this.$refs.importForm.init()
        })
      },
      exportForm() {
        this.exportFormVisible = true
        this.$nextTick(() => {
          this.$refs.exportForm.init(this.listQuery)
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
      uploadForm() {
        this.importFormVisible = true
        this.$nextTick(() => {
          this.$refs.importForm.init()
        })
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
