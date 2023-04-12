<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box"
              :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="出库单号">
              <el-input v-model="query.f2"
                        placeholder="出库单号"
                        clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出库日期">
              <el-date-picker v-model="query.f4"
                              type="daterange"
                              value-format="timestamp"
                              format="yyyy-MM-dd"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出库确认日期">
              <el-date-picker v-model="query.f5"
                              type="daterange"
                              value-format="timestamp"
                              format="yyyy-MM-dd"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="出库站台">
                <el-select v-model="query.f6"
                           placeholder="出库站台"
                           clearable>
                  <el-option v-for="(item, index) in f6Options"
                             :key="index"
                             :label="item.fullName"
                             :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary"
                         icon="el-icon-search"
                         @click="search()">查询</el-button>
              <el-button icon="el-icon-refresh-right"
                         @click="reset()">重置</el-button>
              <el-button type="text"
                         icon="el-icon-arrow-down"
                         @click="showAll=true"
                         v-if="!showAll">展开</el-button>
              <el-button type="text"
                         icon="el-icon-arrow-up"
                         @click="showAll=false"
                         v-else>收起</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="HSZ-common-layout-main HSZ-flex-main">
        <div class="HSZ-common-head">
          <div>
            <el-button type="primary"
                       icon="el-icon-plus"
                       @click="addOrUpdateHandle()">新增</el-button>
          </div>
          <div class="HSZ-common-head-right">
            <el-tooltip effect="dark"
                        content="刷新"
                        placement="top">
              <el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon"
                       :underline="false"
                       @click="reset()" />
            </el-tooltip>
            <screenfull isContainer />
          </div>
        </div>
        <HSZ-table v-loading="listLoading"
                   :data="list">
          <el-table-column prop="f2"
                           label="出库单号"
                           align="left" />
          <el-table-column prop="f3"
                           label="出库类型"
                           align="left" />
          <el-table-column prop="f4"
                           label="出库日期"
                           align="left" />
          <el-table-column prop="f5"
                           label="出库确认日期"
                           align="left" />
          <el-table-column label="出库站台"
                           prop="f6"
                           align="left">
            <template slot-scope="scope">{{ scope.row.f6 | dynamicText(f6Options) }}</template>
          </el-table-column>
          <el-table-column prop="f7"
                           label="库存标识"
                           align="left" />
          <el-table-column prop="f8"
                           label="回传状态"
                           align="left" />
          <el-table-column label="操作"
                           fixed="right"
                           width="100">
            <template slot-scope="scope">
              <el-button type="text"
                         @click="addOrUpdateHandle(scope.row.f1)">编辑</el-button>
              <el-button type="text"
                         @click="handleDel(scope.row.f1)"
                         class='HSZ-table-delBtn'>删除</el-button>
            </template>
          </el-table-column>
        </HSZ-table>
        <pagination :total="total"
                    :page.sync="listQuery.currentPage"
                    :limit.sync="listQuery.pageSize"
                    @pagination="initData" />
      </div>
    </div>
    <HSZ-Form v-if="formVisible"
              ref="HSZForm"
              @refresh="refresh" />
    <ExportBox v-if="exportBoxVisible"
               ref="ExportBox"
               @download="download" />
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
  data () {
    return {
      showAll: false,
      query: {
        f2: undefined,
        f4: undefined,
        f5: undefined,
        f6: undefined,
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
        { prop: 'f2', label: '出库单号' },
        { prop: 'f3', label: '出库类型' },
        { prop: 'f4', label: '出库日期' },
        { prop: 'f5', label: '出库确认日期' },
        { prop: 'f6', label: '出库站台' },
        { prop: 'f7', label: '库存标识' },
        { prop: 'f8', label: '回传状态' },
      ],
      f6Options: [{ 'fullName': "站台1", 'id': "1" }, { 'fullName': "站台1", 'id': "2" }, { 'fullName': "站台1", 'id': "" }, { 'fullName': "站台1", 'id': "" }, { 'fullName': "站台1", 'id': "" }],
    }
  },
  computed: {},
  created () {
    this.initData()
  },
  methods: {
    initData () {
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
        url: `/api/wms/Test2`,
        method: 'GET',
        data: query
      }).then(res => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    handleDel (id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        request({
          url: `/api/wms/Test2/${id}`,
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
    addOrUpdateHandle (id, isDetail) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.HSZForm.init(id, isDetail)
      })
    },
    search () {
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "f1",
      }
      this.initData()
    },
    refresh (isrRefresh) {
      this.formVisible = false
      if (isrRefresh) this.reset()
    },
    reset () {
      for (let key in this.query) {
        this.query[key] = undefined
      }
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "f1",
      }
      this.initData()
    }
  }
}
</script>