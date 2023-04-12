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
            <el-form-item label="货位状态">
              <el-select v-model="query.F_LocationStatus" placeholder="货位状态" clearable>
                <el-option v-for="(item, index) in locationStatusOptions" :key="index" :label="item.fullName"
                  :value="item.enCode" />
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
            <el-button type="text" icon="el-icon-upload2" @click="uploadForm">导入</el-button>
          </div>
          <div class="HSZ-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
            </el-tooltip>
            <screenfull isContainer />
          </div>
        </div>
        <HSZ-table v-loading="listLoading" :data="list">
          <el-table-column prop="F_LocationNo" label="货位编号" align="left" />
          <el-table-column prop="ByWarehouse" label="所属仓库" align="left" />
          <el-table-column label="货位状态" prop="locationStatus" align="center">
            <template
              slot-scope="scope">{{ scope.row.F_LocationStatus | dynamicTextByenCode(locationStatusOptions) }}</template>
          </el-table-column>
          <el-table-column prop="F_AisleNo" label="巷道编号" align="left" />
          <el-table-column prop="F_Row" label="行" align="left" />
          <el-table-column prop="F_Cell" label="列" align="left" />
          <el-table-column prop="F_Layer" label="层" align="left" />
          <el-table-column prop="F_Depth" label="深" align="left" />
          <el-table-column prop="F_TrayNo" label="托盘码" align="left" />
          <el-table-column prop="F_Description" label="描述" align="left" />

          <el-table-column prop="F_CreateUser" label="创建者" align="left" />
          <el-table-column label="创建时间" sortable align="left">
            <template slot-scope="scope">
              {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column label="有效标志" prop="F_EnabledMark" align="left">
            <!-- <template slot-scope="scope">{{ scope.row.F_EnabledMark | dynamicText(enabledMarkOptions) }}</template> -->

            <template slot-scope="scope">
              <el-tag :type="scope.row.F_EnabledMark == '启用' ? 'success' : 'danger'" disable-transitions>
                {{ scope.row.F_EnabledMark}}
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
    <ImportForm v-if="importFormVisible" ref="importForm" @refresh="reset()" />
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
  import ImportForm from './ImportForm'
  import {
    getDataInterfaceRes
  } from '@/api/systemData/dataInterface'
  export default {
    components: {
      HSZForm,
      ExportBox,
      ImportForm
    },
    data() {
      return {
        query: {
          F_LocationNo: undefined,
          F_AisleNo: undefined,
          F_LocationStatus: undefined,
          F_Row: undefined,
          F_Cell: undefined,
          F_Layer: undefined,
        },
        list: [],
        listLoading: true,
        importFormVisible: false,
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
            prop: 'F_LocationNo',
            label: '货位编号'
          },
          {
            prop: 'F_LocationStatus',
            label: '货位状态'
          },
          {
            prop: 'F_EnabledMark',
            label: '有效标志'
          },
          {
            prop: 'F_Description',
            label: '描述'
          },
          {
            prop: 'F_CreateUser',
            label: '创建者'
          },
          {
            prop: 'F_CreateTime',
            label: '创建时间'
          },
        ],
        locationStatusOptions: [],
      }
    },
    computed: {},
    created() {
      this.initData()
    },
    methods: {
      initData() {

        //获取货位状态的数据字典 id : 326208333797131525
        request({
          url: '/api/system/DictionaryData/343195269594088709',
          method: 'get'
        }).then(res => {
          this.locationStatusOptions = res.data.list;
        })

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
          url: `/api/wms/ZjnWmsLocation`,
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
            url: `/api/wms/ZjnWmsLocation/${id}`,
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
      uploadForm() {
        this.importFormVisible = true
        this.$nextTick(() => {
          this.$refs.importForm.init()
        })
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
