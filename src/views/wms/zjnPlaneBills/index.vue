<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="单据类型">
              <el-select v-model="query.F_BillType" placeholder="单据类型" clearable>
                <el-option v-for="(item, index) in billTypeOptions" :key="index" :label="item.fullName"
                  :value="item.enCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据号码">
              <el-input v-model="query.F_BillNo" placeholder="单据号码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据状态">
              <el-select v-model="query.F_BillState" placeholder="单据状态" clearable>
                <el-option v-for="(item, index) in billStateOptions" :key="index" :label="item.fullName"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
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
            <el-button type="text" icon="el-icon-download" @click="exportData()">导出</el-button>
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
          <el-table-column prop="F_BillNo" label="单据号码" align="left" />
          <el-table-column label="单据类型" prop="billType" align="left">
            <template slot-scope="scope">{{ scope.row.F_BillType | dynamicTextByenCode(billTypeOptions) }}</template>
          </el-table-column>
          <el-table-column label="单据状态" prop="billState" align="left">
            <template slot-scope="scope">{{ scope.row.F_BillState | dynamicTextByenCode(billStateOptions) }}</template>
          </el-table-column>
          <el-table-column label="有效标志" prop="enabledMark" align="left">
            <template slot-scope="scope">
              <el-tag :type="scope.row.F_EnabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{scope.row.F_EnabledMark==1?'启用':'禁用'}}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="140">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.F_Id)">编辑/明细</el-button>
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
          F_BillType: undefined,
          F_BillNo: undefined,
          F_BillState: undefined,
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
            prop: 'F_BillNo',
            label: '单据号码'
          },
          {
            prop: 'F_BillState',
            label: '单据状态'
          },
          {
            prop: 'F_EnabledMark',
            label: '有效标志'
          },
          {
            prop: 'F_BillType',
            label: '单据类型'
          },
        ],
        billTypeOptions: [],
        billStateOptions: [],
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
      this.getbillTypeOptions();
      this.getbillStateOptions();
    },
    methods: {
      getbillTypeOptions() {
        getDictionaryDataSelector('325447612469609733').then(res => {
          this.billTypeOptions = res.data.list
        });
      },
      getbillStateOptions() {
        getDictionaryDataSelector('325448007375914245').then(res => {
          this.billStateOptions = res.data.list
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
          url: `/api/wms/ZjnPlaneBills`,
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
            url: `/api/wms/ZjnPlaneBills/${id}`,
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
            url: `/api/wms/ZjnPlaneBills/batchRemove`,
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
      exportData() {
        this.exportBoxVisible = true
        this.$nextTick(() => {
          this.$refs.ExportBox.init(this.columnList)
        })
      },
      download(data) {
        let query = {
          ...data,
          ...this.listQuery,
          ...this.query
        }
        request({
          url: `/api/wms/ZjnPlaneBills/Actions/Export`,
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
