<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

          <el-col :span="6">
            <el-form-item label="单据号">
              <el-input v-model="query.F_PurchaseOrder" placeholder="单据号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="32流水号">
              <el-input v-model="query.F_OrderNo" placeholder="32流水号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="单据类型" prop="OrderTypes">
                    <el-select v-model='query.OrderTypes' placeholder='' clearable required 
                        :style='{"width":"100%"}'>
                        <el-option v-for="(item, index) in orderTypeOptions" :key="index" :label="item.fullName"
                          :value="item.enCode"></el-option>
                      </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料编号">
              <el-input v-model="query.F_ProductsNo" placeholder="物料编号" clearable />
            </el-form-item>
          </el-col>
          
          
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="物料货位">
                <el-input v-model="query.F_ProductsLocation" placeholder="物料货位" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
            <el-form-item label="物料名称">
              <el-input v-model="query.F_ProductsName" placeholder="物料名称" clearable />
            </el-form-item>
          </el-col>
            <el-col :span="6">
              <el-form-item label="供应商">
                <el-input v-model="query.F_ProductsSupplier" placeholder="供应商" clearable />
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
            <el-button type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">入库</el-button>
            <el-button type="text" icon="el-icon-download" @click="exportForm">导出</el-button>
            <el-button type="text" icon="el-icon-upload2" @click="uploadForm">导入</el-button>
          </div>

          <div class="HSZ-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
            </el-tooltip>
            <screenfull is-container />
          </div>
        </div>
        <HSZ-table v-loading="listLoading" :data="list">
          <el-table-column prop="F_PurchaseOrder" label="单据号" align="left" width="150"/>
          <el-table-column prop="F_OrderNo" label="32位流水号" align="left" width="250" />
          <el-table-column label="单据类型" prop="F_OrderType" align="left">
            <template slot-scope="scope">{{ scope.row.F_OrderType | dynamicTextByenCode(orderTypeOptions) }}</template>
          </el-table-column>
          <el-table-column prop="F_ProductsName" label="物料名称" align="left" width="320" />
          
          <el-table-column label="物料类型" prop="F_ProductsType" align="left" width="120">
            <template slot-scope="scope">{{ scope.row.F_ProductsType | dynamicTextByenCode(productstypeOptions) }}</template>
          </el-table-column>
          <el-table-column prop="F_ProductsLocation" label="物料货位" align="left" width="150" />
          <el-table-column prop="F_ProductsTotal" label="物料数量" align="left" />
          <el-table-column label="物料单位" prop="F_ProductsUnit" align="left" width="120">
            <template slot-scope="scope">{{ scope.row.F_ProductsUnit | dynamicTextByenCode(unitOptions) }}</template>
          </el-table-column>
          <el-table-column label="物料等级" prop="F_ProductsGrade" align="left" width="120">
            <template slot-scope="scope">{{ scope.row.F_ProductsGrade | dynamicTextByenCode(GradeOptions) }}</template>
          </el-table-column>
          <el-table-column label="校验类型" prop="F_TestType" align="left" width="120">
            <template slot-scope="scope">{{ scope.row.F_TestType | dynamicTextByenCode(TestTypeOptions) }}</template>
          </el-table-column>
          <el-table-column label="校验状态" prop="F_InspectionStatus" align="left" width="120">
            <template slot-scope="scope">{{ scope.row.F_InspectionStatus | dynamicTextByenCode(InspectionStatusOptions) }}</template>
          </el-table-column>
          <el-table-column prop="F_ProductsBach" label="物料批次" align="left" width="250" />
          <el-table-column prop="F_TheTray" label="托盘号" align="left" width="100"  />
          <el-table-column prop="F_TheContainer" label="容器号" align="left" width="100" />
          <el-table-column prop="F_ExpiryDate" label="失效日期" align="left" width="150">
            <template slot-scope="scope">
              {{ scope.row.F_ExpiryDate | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column prop="F_ProductsUser" label="客户" align="left" width="150" />
          <el-table-column prop="F_ProductsSupplier" label="供应商" align="left" width="230" />
          <el-table-column prop="F_CreateUser" label="创建人员" align="left" width="230" />
          <el-table-column prop="F_CreateTime" label="创建时间" sortable="custom" align="left" width="140">
            <template slot-scope="scope">
              {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>

          <el-table-column prop="F_LastModifyUserId" label="修改人员" align="left" width="150" />
          <el-table-column prop="F_LastModifyTime" label="修改时间" sortable="custom" align="left" width="140">
            <template slot-scope="scope">
              {{ scope.row.F_LastModifyTime | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column prop="F_ProductsStyle" label="物料规格" align="left" width="320" />
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle2(scope.row.F_Id)">编辑</el-button>
              <el-button type="text" class="HSZ-table-delBtn" @click="handleDel(scope.row.F_Id)">删除</el-button>
            </template>
          </el-table-column>
        </HSZ-table>
        <pagination
          :total="total"
          :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize"
          @pagination="initData"
        />
      </div>
    </div>
    <HSZ-Form v-if="formVisible" ref="HSZForm" @refresh="refresh" />
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
    <ImportForm
      v-if="importFormVisible"
      ref="importForm"
      @refresh="reset()"
    />
    <ExportForm v-if="exportFormVisible" ref="exportForm" />
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
      showAll: false,
      orderTypeOptions: [],
      productstypeOptions: [],
      unitOptions: [],
      GradeOptions: [],
      TestTypeOptions: [],
      query: {
        F_OrderType: undefined,
        F_ProductsName: undefined,
        F_ProductsUser: undefined,
        F_ProductsSupplier: undefined,
        F_ProductsLocation: undefined
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
      importFormVisible: false,
      exportFormVisible: false,
      InspectionStatusOptions: false,
      columnList: [{
        prop: 'F_OrderNo',
        label: '32位流水号'
      },
      {
        prop: 'F_OrderType',
        label: '单据类型'
      },
      {
        prop: 'F_ProductsName',
        label: '物料名称'
      },
      {
        prop: 'F_ProductsStyle',
        label: '物料规格'
      },
      {
        prop: 'F_ProductsType',
        label: '物料类型'
      },
      {
        prop: 'F_ProductsTotal',
        label: '物料数量'
      },
      {
        prop: 'F_ProductsUnit',
        label: '物料单位'
      },
      {
        prop: 'F_ProductsGrade',
        label: '物料等级'
      },
      {
        prop: 'F_ProductsBach',
        label: '物料批次'
      },
      {
        prop: 'F_ProductsUser',
        label: '客户'
      },
      {
        prop: 'F_ProductsSupplier',
        label: '供应商'
      },
      {
        prop: 'F_ProductsLocation',
        label: '物料货位'
      }
      ]
    }
  },
  computed: {},
  created() {
    this.getorderTypeOptions()
    this.getproductstypeOptions()
    this.getunitOptions()
    this.getproductsGradeOptions()
    this.initData()
    this.getTestTypeOptions()
    this.getInspectionStatustions()
  },
  methods: {
    exportForm() {
      this.exportFormVisible = true
      this.$nextTick(() => {
        this.$refs.exportForm.init(this.listQuery)
      })
    },
    getInspectionStatustions() {
      getDictionaryDataSelector('325448475967751429').then(res => {
        this.InspectionStatusOptions = res.data.list
      })
    },
    getTestTypeOptions() {
      getDictionaryDataSelector('325448312364729605').then(res => {
        this.TestTypeOptions = res.data.list
      })
    },
    getorderTypeOptions() {
      getDictionaryDataSelector('337742110771905797').then(res => {
        this.orderTypeOptions = res.data.list
      })
    },
    getproductstypeOptions() {
      getDictionaryDataSelector('325449144728552709').then(res => {
        this.productstypeOptions = res.data.list
      })
    },
    getunitOptions() {
      getDictionaryDataSelector('326384591566800133').then(res => {
        this.unitOptions = res.data.list
      })
    },
    getproductsGradeOptions() {
      getDictionaryDataSelector('326588657760732421').then(res => {
        this.GradeOptions = res.data.list
      })
    },
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
        url: `/api/wms/ZjnBillsHistory`,
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
          url: `/api/wms/ZjnBillsHistory/${id}`,
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
      }).catch(() => {})
    },
    addOrUpdateHandle(id, isDetail) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.HSZForm.init(id, isDetail)
      })
    },
    addOrUpdateHandle2(id, isDetail) {
      const _query = {
        id: id
      }
      request({
        url: '/api/wms/zjnbillshistory/GetChuKuInfo',
        method: 'get',
        data: _query
      }).then(res => {
        if (res.data == null) {
          this.formVisible = true
          console.log(res.data)
          this.$nextTick(() => {
            this.$refs.HSZForm.init(id, isDetail)
          })
        }
      })
    },
    search() {
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: 'desc',
        sidx: 'a.F_Id'
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
        sidx: 'a.F_Id'
      }
      this.initData()
    }
  }
}
</script>
