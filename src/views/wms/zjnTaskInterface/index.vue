<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="接口名称">
              <el-input v-model="query.F_NameInterface" placeholder="接口名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="通讯协议">
              <el-select v-model="query.F_Communication" placeholder="通讯协议">
                <el-option v-for="(item, index) in communicationOptions" :key="index" :label="item.fullName" :value="item.enCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="接口提供者">
              <el-input v-model="query.F_InterfaceProvide" placeholder="接口提供者" clearable />
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
            <el-button type="text" icon="el-icon-download" @click="exportData()">导出</el-button>
          </div>
          <div class="HSZ-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
            </el-tooltip>
            <screenfull is-container />
          </div>
        </div>
        <HSZ-table v-loading="listLoading" :data="list">
          <el-table-column prop="F_NameInterface" label="接口名称" align="left" />
          <el-table-column prop="F_CnInterface" label="中文" align="left" />
          <el-table-column prop="F_EnterParameter" label="入参" align="left" width="300" />
          <el-table-column prop="F_OutParameter" label="出参" align="left" width="300" />
          <el-table-column label="通讯协议" prop="communication" align="left">
            <template slot-scope="scope">{{ scope.row.F_Communication | dynamicText(communicationOptions) }}</template>
          </el-table-column>
          <el-table-column prop="F_Introduction" label="说明" align="left" />
          <el-table-column prop="F_InterfaceProvide" label="接口提供者" align="left" />
          <el-table-column prop="F_EnabledMark" label="开/关" align="left" />
          <el-table-column prop="F_CreateUser" label="创建者" align="left" />
          <el-table-column prop="F_CreateTime" label="创建时间" align="left">
            <template slot-scope="scope">
              {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.F_Id)">编辑</el-button>
              <el-button type="text" class="HSZ-table-delBtn" @click="handleDel(scope.row.F_Id)">删除</el-button>
              <el-button type="text" @click="goDetail(scope.row.F_Id)">详情</el-button>
            </template>
          </el-table-column>
        </HSZ-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize" @pagination="initData" />
      </div>
    </div>
    <HSZ-Form v-if="formVisible" ref="HSZForm" @refresh="refresh" />
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
    <Detail v-if="detailVisible" ref="Detail" @refresh="detailVisible=false" />
  </div>
</template>
<script>
import request from '@/utils/request'
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
import HSZForm from './Form'
import ExportBox from './ExportBox'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
import Detail from './Detail'
export default {
	    components: { HSZForm, ExportBox, Detail },
	    data() {
	        return {
      detailVisible: false,
	            showAll: false,
	        query: {
	                F_NameInterface: undefined,
	                F_Communication: undefined,
	                F_InterfaceProvide: undefined
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
      exportBoxVisible: false,
      columnList: [
        { prop: 'F_NameInterface', label: '接口名称' },
        { prop: 'F_CnInterface', label: '中文' },
        { prop: 'F_EnterParameter', label: '入参' },
        { prop: 'F_OutParameter', label: '出参' },
        { prop: 'F_Communication', label: '通讯协议' },
        { prop: 'F_Introduction', label: '说明' },
        { prop: 'F_InterfaceProvide', label: '接口提供者' },
        { prop: 'F_EnabledMark', label: '有效标志' },
        { prop: 'F_CreateUser', label: '创建者' },
        { prop: 'F_CreateTime', label: '创建时间' }
      ],
      communicationOptions: []
    }
  },
  computed: {},
  created() {
    this.initData()
    this.getcommunicationOptions()
  },
  methods: {
    goDetail(id) {
			    this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.Detail.init(id)
      })
    },
    getcommunicationOptions() {
      getDictionaryDataSelector('343645569845036293').then(res => {
        this.communicationOptions = res.data.list
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
        url: `/api/wms/ZjnTaskInterface`,
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
          url: `/api/wms/ZjnTaskInterface/${id}`,
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
        url: `/api/wms/ZjnTaskInterface/Actions/Export`,
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
