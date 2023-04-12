<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="操作类型">
              <el-select v-model="query.F_Type" placeholder="操作类型" clearable>
                <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.fullName" :value="item.enCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作路径">
              <el-select v-model="query.F_WorkPath" placeholder="操作路径" clearable>
                <el-option v-for="(item, index) in WorkPathOptions" :key="index" :label="item.fullName" :value="item.enCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="操作描述">
              <el-input v-model="query.F_Describe" placeholder="操作描述" clearable />
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
            <el-button type="primary" icon="el-icon-download" @click="exportData()">导出</el-button>
          </div>
          <div class="HSZ-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
            </el-tooltip>
            <screenfull is-container />
          </div>
        </div>
        <HSZ-table v-loading="listLoading" :data="list" @sort-change="sortChange">
          <el-table-column label="操作类型" prop="F_Type" sortable="custom" align="left">
            <template slot-scope="scope">{{ scope.row.F_Type | dynamicTextByenCode(typeOptions) }}</template>
          </el-table-column>
          <el-table-column prop="F_Describe" label="操作描述" sortable="custom" align="left" />
          <el-table-column label="操作路径" prop="F_WorkPath" sortable="custom" align="left">
            <template slot-scope="scope">{{ scope.row.F_WorkPath | dynamicTextByenCode(WorkPathOptions) }}</template>
          </el-table-column>
          <el-table-column prop="F_BeforeDate" label="操作前数据" align="left" />
          <el-table-column prop="F_AfterDate" label="操作后数据" align="left" />
          <el-table-column prop="F_CreateUser" label="操作人" sortable="custom" align="left" />
          <el-table-column prop="F_CreateTime" label="操作时间" sortable="custom" align="left" width="140">
            <template slot-scope="scope">
              {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
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
	                F_Type: undefined,
	                F_WorkPath: undefined,
	                F_Describe: undefined
      },
      list: [],
      typeOptions: [],
      listLoading: true,
      multipleSelection: [],
      WorkPathOptions: [],
      total: 0,
      listQuery: {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: ''
      },
      formVisible: false,
      exportBoxVisible: false,
      columnList: [
        { prop: 'F_Type', label: '操作类型' },
        { prop: 'F_Describe', label: '操作描述（描述在哪个业务执行）' },
        { prop: 'F_WorkPath', label: '操作路径' },
        { prop: 'F_BeforeDate', label: '操作前数据' },
        { prop: 'F_AfterDate', label: '操作后数据' },
        { prop: 'F_CreateUser', label: '操作人' },
        { prop: 'F_CreateTime', label: '操作时间' }
      ]
    }
  },
  computed: {},
  created() {
    this.initData(),
    this.gettypeOptions(),
    this.GetWorkPathOptions()
  },
  methods: {
    gettypeOptions() {
      getDictionaryDataSelector('332683110074287365').then(res => {
        this.typeOptions = res.data.list
      })
    },
    GetWorkPathOptions() {
      getDictionaryDataSelector('332685211055686917').then(res => {
        this.WorkPathOptions = res.data.list
      })
    },
    sortChange({ column, prop, order }) {
      this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
      this.listQuery.sidx = !order ? '' : prop
      this.initData()
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
        url: `/api/wms/ZjnPlaneOperationLog`,
        method: 'GET',
        data: query
      }).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    addOrUpdateHandle(id, isDetail) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.HSZForm.init(id, isDetail)
      })
    },
    exportData() {
      alert("正在修复,暂不可用");
      return;
      this.exportBoxVisible = true
      this.$nextTick(() => {
        this.$refs.ExportBox.init(this.columnList)
      })
    },
    download(data) {
      const query = { ...data, ...this.listQuery, ...this.query }
      request({
        url: `/api/wms/ZjnPlaneOperationLog/Actions/Export`,
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
        sidx: 'F_Id'
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
        sidx: 'F_Id'
      }
      this.initData()
    }
  }
}
</script>
