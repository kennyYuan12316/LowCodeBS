<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="巷道编号">
              <el-input v-model="query.F_AisleNo" placeholder="巷道编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="巷道名称">
              <el-input v-model="query.F_AisleName" placeholder="巷道名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="区域编号">
              <el-select v-model="query.F_RegionNo" placeholder="区域编号" clearable>
                <el-option v-for="(item, index) in regionNoOptions" :key="index" :label="item.RegionName"
                  :value="item.RegionNo" />
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="仓库编号">
                <el-select v-model="query.F_WarehouseNo" placeholder="仓库编号" clearable>
                  <el-option v-for="(item, index) in warehouseNoOptions" :key="index" :label="item.WarehouseName"
                    :value="item.WarehouseNo" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="堆垛机编号">
                <el-select v-model="query.F_StackerNo" placeholder="堆垛机编号" clearable>
                  <el-option v-for="(item, index) in stackerNoOptions" :key="index" :label="item.DeviceName"
                    :value="item.DeviceId" />
                </el-select>
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
          <el-table-column prop="F_AisleNo" label="巷道编号" align="left" />
          <el-table-column prop="F_AisleName" label="巷道名称" align="left" />
          <el-table-column label="区域编号" prop="regionNo" align="left">
            <template slot-scope="scope">{{ scope.row.F_RegionNo | dynamicText(regionNoOptions) }}</template>
          </el-table-column>
          <el-table-column label="仓库编号" prop="warehouseNo" align="left">
            <template slot-scope="scope">{{ scope.row.F_WarehouseNo | dynamicText(warehouseNoOptions) }}</template>
          </el-table-column>
          <el-table-column label="堆垛机编号" prop="stackerNo" align="left">
            <template slot-scope="scope">{{ scope.row.F_StackerNo | dynamicText(stackerNoOptions) }}</template>
          </el-table-column>
          <el-table-column prop="F_CreateUser" label="创建者" align="left" />
          <el-table-column label="创建时间" sortable align="left">
            <template slot-scope="scope">
              {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column label="有效标志" prop="enabledMark" align="left">
            <template slot-scope="scope">{{ scope.row.F_EnabledMark | dynamicText(enabledMarkOptions) }}</template>
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
        F_AisleNo: undefined,
        F_AisleName: undefined,
        F_RegionNo: undefined,
        F_WarehouseNo: undefined,
        F_StackerNo: undefined,
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
      columnList: [
        { prop: 'F_AisleNo', label: '巷道编号' },
        { prop: 'F_AisleName', label: '巷道名称' },
        { prop: 'F_RegionNo', label: '区域编号' },
        { prop: 'F_WarehouseNo', label: '仓库编号' },
        { prop: 'F_StackerNo', label: '堆垛机编号' },
        { prop: 'F_CreateUser', label: '创建者' },
        { prop: 'F_CreateTime', label: '创建时间' },
        { prop: 'F_EnabledMark', label: '有效标志' },
      ],
      regionNoOptions: [],
      warehouseNoOptions: [],
      stackerNoOptions: [],
      enabledMarkOptions: [{ 'fullName': "禁用", 'id': "0" }, { 'fullName': "启用", 'id': "1" }],
    }
  },
  computed: {},
  created() {
    this.getRegionData();
    this.getWarehouseData();
    this.getStackerData();
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
        url: `/api/wms/ZjnWmsAisle`,
        method: 'GET',
        data: query
      }).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    getRegionData() {
      request({
        url: '/api/wms/ZjnWmsRegion/GetListToBox',
        method: 'get'
      }).then(res => {
        this.regionNoOptions = res.data;
      })
    },
    getWarehouseData(){
      request({
        url: '/api/wms/ZjnWmsWarehouse/GetHouseListToBox',
        method: 'get'
      }).then(res => {
        this.warehouseNoOptions = res.data;
      })
    },
    getStackerData(){
      request({
        url: '/api/wms/ZjnWcsWorkDevice/GetStackerListToBox',
        method: 'get'
      }).then(res => {
        this.stackerNoOptions = res.data;
      })
    },
    handleDel(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        request({
          url: `/api/wms/ZjnWmsAisle/${id}`,
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
          url: `/api/wms/ZjnWmsAisle/batchRemove`,
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