<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

          <el-col :span="5">
            <el-form-item label="物料编号">
              <el-input v-model="query.F_ProductsNo" placeholder="物料编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="物料名称">
              <el-input v-model="query.F_ProductsName" placeholder="物料名称" clearable />
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="预警周期">
              <el-input v-model="query.F_ProductsTotal" placeholder="数量" clearable />
            </el-form-item>
          </el-col>
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
          <div class="HSZ-common-head-right">
            <div />
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
            </el-tooltip>
            <screenfull is-container />
          </div>
        </div>
        <HSZ-table v-loading="listLoading" :data="list">

          <el-table-column prop="F_GoodsCode" label="物料编号" align="left" />
          <el-table-column prop="F_GoodsName" label="物料名称" align="left" />
          <el-table-column label="批号" prop="CreateUser" align="left" width="120">
          </el-table-column>
          <el-table-column prop="F_GoodsType" label="物料类型" sortable="custom" align="left" width="140" />
          <el-table-column prop="F_VendorId" label="供应商" sortable="custom" align="left" width="140" />
          <el-table-column label="基本单位" prop="F_Unit" align="left" width="120">
            <template slot-scope="scope">{{ scope.row.F_Unit | dynamicTextByenCode(unitOptions) }}</template>
          </el-table-column>
          
          <el-table-column prop="F_Ceiling" label="库存上限" align="left" />
          <el-table-column prop="F_TheLowerLimit" label="库存下限" align="left" />
          <el-table-column prop="ProductsQuantity" label="库存数量" align="left" />
          <el-table-column prop="F_DisableMark" label="预警原因" align="left" />
          <!-- <el-table-column prop="CreateTime" label="入库时间" align="left">
            <template slot-scope="scope">
              {{ scope.row.CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
              </template>
          </el-table-column> -->
          <el-table-column prop="TheDateOfProduction" label="生产时间" align="left">
            <template slot-scope="scope">
              {{ scope.row.TheDateOfProduction | toDate("yyyy-MM-dd hh:mm:ss") }}
              </template>
          </el-table-column>
          <el-table-column prop="ExpiryDate" label="失效日期" align="left">
            <template slot-scope="scope">
              {{ scope.row.ExpiryDate | toDate("yyyy-MM-dd hh:mm:ss") }}
             </template>
          </el-table-column>
          <el-table-column prop="F_TellDate" label="预警周期" align="left" />
          <el-table-column prop="F_Specifications" label="保质期预警" align="left">
            <template slot-scope="scope">
              {{ scope.row.F_Specifications | toDate("yyyy-MM-dd hh:mm:ss") }}
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
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />

  </div>
</template>
<script>
import request from '@/utils/request'
import {
  getDictionaryDataSelector
} from '@/api/systemData/dictionary'

import {
  getDataInterfaceRes
} from '@/api/systemData/dataInterface'
export default {
  components: {

  },
  data() {
    return {
      showAll: false,
      orderTypeOptions: [],
      productstypeOptions: [],
      unitOptions: [],
      GradeOptions: [],
      goodsStateOptions: [],
      query: {
        F_OrderType: undefined,
        F_ProductsName: undefined,
        F_ProductsUser: undefined,
        F_ProductsSupplier: undefined,
        F_ProductsLocation: undefined
      },
      list: [],
      listLoading: true,
      productstypeOptions: false,
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
        {
          prop: 'F_PurchaseOrder',
          label: '单据号'
        }, {
          prop: 'F_OrderNo',
          label: '32位流水号'
        },
        {
          prop: 'F_ProductsNo',
          label: '物料编号'
        },
        {
          prop: 'F_ProductsName',
          label: '物料名称'
        },
        {
          prop: 'F_TestType',
          label: '是否冻结'
        },
        {
          prop: 'F_InspectionStatus',
          label: '物料状态'
        },
        {
          prop: 'F_TheDateOfProduction',
          label: '生产时间'
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
          prop: 'F_TheContainer',
          label: '容器编号'
        },
        {
          prop: 'F_TheTray',
          label: '托盘编号'
        },
        {
          prop: 'F_CreateTime',
          label: '入库时间'
        },
        {
          prop: 'F_ProductsLocation',
          label: '物料货位置'
        },
        {
          prop: 'F_ProductsLocation',
          label: '物料货位中文名称'
        },
        {
          prop: 'F_ProductsUser',
          label: '仓库'
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
    this.getgoodsStateOptions()
  },
  methods: {
    getgoodsStateOptions() {
      getDictionaryDataSelector('326590282281780485').then(res => {
        this.goodsStateOptions = res.data.list
      })
    },
    getorderTypeOptions() {
      getDictionaryDataSelector('325447612469609733').then(res => {
        this.orderTypeOptions = res.data.list
      })
    },
    getproductstypeOptions() {
      getDictionaryDataSelector('325448475967751429').then(res => {
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
    exportData() {
      this.exportBoxVisible = true
      this.$nextTick(() => {
        this.$refs.ExportBox.init(this.columnList)
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
      query.F_OrderType = '001'
       request({
         url: `/api/wms/ZjnBillsHistory/WarningStatements`,
         method: 'GET',
         data: query
       }).then(res => {
         this.list = res.data.list
         this.total = res.data.pagination.total
      this.listLoading = false
       })
    },
    download(data) {
      const query = { ...data, ...this.listQuery, ...this.query }
      // request({
      //   url: `/api/wms/ZjnBillsHistory/Actions/Export`,
      //   method: 'GET',
      //   data: query
      // }).then(res => {
      //   if (!res.data.url) return
      //   window.location.href = this.define.comUrl + res.data.url
      //   this.$refs.ExportBox.visible = false
      this.exportBoxVisible = false
      // })
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
