<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box"
              :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="工厂">
              <el-input v-model="query.f2"
                        placeholder="工厂"
                        clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料">
              <el-input v-model="query.f3"
                        placeholder="物料"
                        clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="批号">
              <el-input v-model="query.f5"
                        placeholder="批号"
                        clearable />
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="状态">
                <el-input v-model="query.f6"
                          placeholder="状态"
                          clearable />
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
                           label="工厂"
                           align="left" />
          <el-table-column prop="f3"
                           label="物料"
                           align="left" />
          <el-table-column prop="f4"
                           label="物料名称"
                           align="left" />
          <el-table-column prop="f5"
                           label="批号"
                           align="left" />
          <el-table-column prop="f6"
                           label="状态"
                           align="left" />
          <el-table-column prop="f7"
                           label="单位"
                           align="left" />
          <el-table-column prop="f8"
                           label="库内总数"
                           align="left" />
          <el-table-column prop="f9"
                           label="库内托数"
                           align="left" />
          <el-table-column prop="f10"
                           label="库外总数"
                           align="left" />
          <el-table-column prop="f11"
                           label="库外托数"
                           align="left" />
          <el-table-column prop="f12"
                           label="正在移动总数"
                           align="left" />
          <el-table-column prop="f13"
                           label="正在移动托数"
                           align="left" />
          <el-table-column prop="f14"
                           label="全部总数"
                           align="left" />
          <el-table-column prop="f15"
                           label="全部托数"
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
        f3: undefined,
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
        { prop: 'f2', label: '工厂' },
        { prop: 'f3', label: '物料' },
        { prop: 'f4', label: '物料名称' },
        { prop: 'f5', label: '批号' },
        { prop: 'f6', label: '状态' },
        { prop: 'f7', label: '单位' },
        { prop: 'f8', label: '库内总数' },
        { prop: 'f9', label: '库内托数' },
        { prop: 'f10', label: '库外总数' },
        { prop: 'f11', label: '库外托数' },
        { prop: 'f12', label: '正在移动总数' },
        { prop: 'f13', label: '正在移动托数' },
        { prop: 'f14', label: '全部总数' },
        { prop: 'f15', label: '全部托数' },
      ],
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
        url: `/api/wms/Test3`,
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
          url: `/api/wms/Test3/${id}`,
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