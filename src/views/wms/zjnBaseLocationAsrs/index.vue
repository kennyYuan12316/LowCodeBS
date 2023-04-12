<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="货位编号">
              <el-input v-model="query.F_LocationNo" placeholder="货位编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="行">
              <num-range v-model="query.F_Row" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="列">
              <num-range v-model="query.F_Cell" />
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="层">
                <num-range v-model="query.F_Layer" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="托盘编号">
                <el-input v-model="query.F_TrayNo" placeholder="托盘编号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="仓库编号">
                <el-input v-model="query.F_ByWarehouse" placeholder="仓库编号" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="设备编号">
                <el-input v-model="query.F_DeviceNo" placeholder="设备编号" clearable />
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
              <el-button v-if="!showAll" type="text" icon="el-icon-arrow-down" @click="showAll=true">展开</el-button>
              <el-button v-else type="text" icon="el-icon-arrow-up" @click="showAll=false">收起</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="HSZ-common-layout-main HSZ-flex-main">
        <div class="HSZ-common-head">
          <div>
            <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">新增</el-button>
            <el-button type="text" icon="el-icon-download" @click="exportData()">导出</el-button>
            <el-button type="text" icon="el-icon-delete" @click="handleBatchRemoveDel()">批量删除</el-button>
            <el-button type="text" icon="el-icon-upload2" @click="uploadForm">导入</el-button>
          </div>
          <div class="HSZ-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
            </el-tooltip>
            <screenfull is-container />
          </div>
        </div>
        <HSZ-table v-loading="listLoading" :data="list" has-c @selection-change="handleSelectionChange">
          <el-table-column prop="F_LocationNo" label="货位编号" align="left" />
          <el-table-column prop="F_type" label="货位类型" align="left" >
            <template slot-scope="scope">{{ scope.row.F_type | dynamicTextByenCode(TestTypeOptions) }}</template>
          </el-table-column>
          <el-table-column prop="F_ByWarehouse" label="仓库编号" align="left" />
          <el-table-column prop="F_Legion" label="区域" align="left" />          
          <el-table-column prop="F_DeviceNo" label="设备编号" align="left" />
          <el-table-column prop="F_Row" label="行" align="left" />
          <el-table-column prop="F_Cell" label="列" align="left" />
          <el-table-column prop="F_Layer" label="层" align="left" />
          <el-table-column prop="F_Depth" label="深" align="left" />
          <el-table-column prop="F_TrayNo" label="托盘编号" align="left" />
          <el-table-column prop="F_LastStatus" label="上次货位状态" align="left" />
          <el-table-column prop="F_LocationStatus" label="货位状态" align="left" />
          <el-table-column prop="F_EnabledMark" label="有效标志" align="left">
            <template slot-scope="scope">
              <el-tag :type="scope.row.F_EnabledMark=='启用'?'success':'warning'">
                {{ scope.row.F_EnabledMark }}
              </el-tag>

            </template>
          </el-table-column>
          <el-table-column prop="F_CreateUser" label="创建者" align="left" />
          <el-table-column prop="F_CreateTime" label="创建时间" align="left" />
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.F_Id)">编辑</el-button>
              <el-button type="text" class="HSZ-table-delBtn" @click="handleDel(scope.row.F_Id)">删除</el-button>
              
            </template>
          </el-table-column>
        </HSZ-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <HSZ-Form v-if="formVisible" ref="HSZForm" @refresh="refresh" />
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
    <ImportForm
      v-if="importFormVisible"
      ref="importForm"
      @refresh="reset()"
    />
  </div>
</template>
<script>
import request from '@/utils/request'
import ImportForm from './ImportForm'
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
import HSZForm from './Form'
import ExportBox from './ExportBox'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
export default {
	    components: { HSZForm, ExportBox, ImportForm },
	    data() {
	        return {
	            showAll: false,
	        query: {
	                F_LocationNo: undefined,
	                F_Row: undefined,
	                F_Cell: undefined,
	                F_Layer: undefined,
	                F_TrayNo: undefined,
	                F_ByWarehouse: undefined,
	                F_DeviceNo: undefined
      },
      list: [],
      listLoading: true,
      multipleSelection: [],
      total: 0,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      },
      formVisible: false,
      importFormVisible: false,
      exportBoxVisible: false,
      columnList: [
        { prop: 'F_LocationNo', label: '货位编号' },
        { prop: 'F_type', label: '货位类型' },
        { prop: 'F_Legion', label: '仓库编号' },
        { prop: 'F_ByWarehouse', label: '仓库编号' },
        { prop: 'F_DeviceNo', label: '设备编号' },
        { prop: 'F_Row', label: '行' },
        { prop: 'F_Cell', label: '列' },
        { prop: 'F_Layer', label: '层' },
        { prop: 'F_Depth', label: '深' },
        { prop: 'F_TrayNo', label: '托盘编号' },
        { prop: 'F_LastStatus', label: '上次货位状态' },
        { prop: 'F_LocationStatus', label: '货位状态' },
        { prop: 'F_EnabledMark', label: '有效标志' },
        { prop: 'F_CreateUser', label: '创建者' },
        { prop: 'F_CreateTime', label: '创建时间' }
      ]
    }
  },
  computed: {},
  created() {
    this.initData();
    this.getTestTypeOptions();
  },
  methods: {
    uploadForm() {
      this.importFormVisible = true
      this.$nextTick(() => {
        this.$refs.importForm.init()
      })
    },
    initData() {
      this.listLoading = true
      const _query = {
        ...this.listQuery,
        ...this.query
      }
      const query = {}
      for (const key in _query) {
        if (Array.isArray(_query[key])) {
          query[key] = _query[key].join()
        } else {
          query[key] = _query[key]
        }
      }
      request({
        url: `/api/wms/ZjnBaseLocationAsrs`,
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
          url: `/api/wms/ZjnBaseLocationAsrs/${id}`,
          method: 'DELETE'
        }).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => {
      })
    },
    getTestTypeOptions() {
      getDictionaryDataSelector('344618366226400517').then(res => {
        this.TestTypeOptions = res.data.list
      })
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
          duration: 1500
        })
        return
      }
      const ids = this.multipleSelection
      this.$confirm('您确定要删除这些数据吗, 是否继续？', '提示', {
        type: 'warning'
      }).then(() => {
        request({
          url: `/api/wms/ZjnBaseLocationAsrs/batchRemove`,
          method: 'POST',
          data: ids
        }).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            onClose: () => {
              this.initData()
            }
          })
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
      const query = { ...data, ...this.listQuery, ...this.query }
      request({
        url: `/api/wms/ZjnBaseLocationAsrs/Actions/Export`,
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
        sort: 'desc',
        sidx: 'F_LocationNo'
      }
      this.initData()
    },
    refresh(isrRefresh) {
      this.formVisible = false
      if (isrRefresh) this.reset()
    },
    reset() {
      for (const key in this.query) {
        this.query[key] = undefined
      }
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: 'F_LocationNo'
      }
      this.initData()
    }
  }
}
</script>
