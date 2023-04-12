<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="5">
            <el-form-item label="物料批号">
              <el-input
                v-model="query.F_TheContainer"
                placeholder="物料批号"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="5">
            <el-form-item label="物料编号">
              <el-input
                v-model="query.F_ProductsNo"
                placeholder="物料编号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="物料名称">
              <el-input
                v-model="query.F_ProductsName"
                placeholder="物料名称"
                clearable
              />
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="search()"
              >查询</el-button>
              <el-button
                icon="el-icon-refresh-right"
                @click="reset()"
              >重置</el-button>
              <el-button
                v-if="!showAll"
                type="text"
                icon="el-icon-arrow-down"
                @click="showAll = true"
              >展开</el-button>
              <el-button
                v-else
                type="text"
                icon="el-icon-arrow-up"
                @click="showAll = false"
              >收起</el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="HSZ-common-layout-main HSZ-flex-main">
        <div class="HSZ-common-head">
          <div class="HSZ-common-head-right">

            <el-button type="text" icon="el-icon-download" @click="exportData()">导出</el-button>

            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link
                icon="icon-sz icon-sz-Refresh HSZ-common-head-icon"
                :underline="false"
                @click="reset()"
              />
            </el-tooltip>
            <screenfull is-container />
          </div>
        </div>
        <HSZ-table v-loading="listLoading" :data="list">
          <el-table-column prop="productsCode" label="物料编号" align="left" />
          <el-table-column
            prop="productsName"
            label="物料名称"
            align="left"
          />
          <el-table-column prop="productsBatch" label="物料批号" align="left" />
          <el-table-column
            label="状态"
            prop="productsTakeCount"
            align="left"
            width="120"
          >
            <template slot-scope="scope">{{
              scope.row.productsTakeCount
                | dynamicTextByenCode(productstypeOptions)
            }}</template>
          </el-table-column>

          <el-table-column
            label="物料单位"
            prop="productsIsLock"
            align="left"
            width="120"
          >
            <template slot-scope="scope">{{
              scope.row.productsIsLock | dynamicTextByenCode(unitOptions)
            }}</template>
          </el-table-column>
          <el-table-column prop="gongc" label="工厂" align="left" />
          <el-table-column
            prop="productsSupplier"
            label="库内总数"
            align="left"
          />
          <el-table-column
            prop="F_PurchaseOrder"
            label="库内托数"
            align="left"
          />
          <el-table-column
            prop="F_PurchaseOrder"
            label="库外总数"
            align="left"
          />
          <el-table-column
            prop="F_PurchaseOrder"
            label="库外托数"
            align="left"
          />
          <el-table-column
            prop="F_PurchaseOrder"
            label="正在移动总数"
            align="left"
          />
          <el-table-column
            prop="F_PurchaseOrder"
            label="正在移动托数"
            align="left"
          />
          <el-table-column
            prop="productsSupplier"
            label="全部总数"
            align="left"
          />
          <el-table-column
            prop="F_PurchaseOrder"
            label="全部托数"
            align="left"
          />
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
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
import ExportBox from './ExportBox'
export default {
  components: { ExportBox },
  data() {
    return {
      showAll: false,
      orderTypeOptions: [],
      productstypeOptions: [],
      unitOptions: [],
      GradeOptions: [],
      goodsStateOptions: [],
      query: {
        F_ProductsNo: undefined,
        F_ProductsName: undefined,
        F_ProductsUser: undefined,
        F_TheContainer: undefined,
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
          prop: 'productsCode',
          label: '物料编号'
        },
        {
          prop: 'productsName',
          label: '物料名称'
        },
        {
          prop: 'productsTakeCount',
          label: '物料状态'
        },
        {
          prop: 'productsUnit',
          label: '物料单位'
        },
        {
          prop: 'gongc',
          label: '工厂'
        },
        {
          prop: 'productsQuantity',
          label: '库存总数'
        },
        {
          prop: 'purchaseOrder7',
          label: '库内托数'
        },
        {
          prop: 'purchaseOrder6',
          label: '库外总数'
        },
        {
          prop: 'purchaseOrder5',
          label: '库外托数'
        },
        {
          prop: 'purchaseOrder4',
          label: '正在移动总数'
        },
        {
          prop: 'purchaseOrder3',
          label: '正在移动托数'
        },
        {
          prop: 'productsSupplier2',
          label: '全部总数'
        },
        {
          prop: 'purchaseOrder1',
          label: '全部托数'
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
      getDictionaryDataSelector('326590282281780485').then((res) => {
        this.goodsStateOptions = res.data.list
      })
    },
    getorderTypeOptions() {
      getDictionaryDataSelector('325447612469609733').then((res) => {
        this.orderTypeOptions = res.data.list
      })
    },
    getproductstypeOptions() {
      getDictionaryDataSelector('326590282281780485').then((res) => {
        this.productstypeOptions = res.data.list
      })
    },
    getunitOptions() {
      getDictionaryDataSelector('326384591566800133').then((res) => {
        this.unitOptions = res.data.list
      })
    },
    getproductsGradeOptions() {
      getDictionaryDataSelector('326588657760732421').then((res) => {
        this.GradeOptions = res.data.list
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
        url: `/api/wms/ZjnBillsHistory/Actions/ExportSzai`,
        method: 'GET',
        data: query
      }).then(res => {
        if (!res.data.url) return
        window.location.href = this.define.comUrl + res.data.url
        this.$refs.ExportBox.visible = false
        this.exportBoxVisible = false
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
        url: `/api/wms/ZjnBillsHistory/JustinTimeInventory`,
        method: 'GET',
        data: query
      }).then((res) => {
        this.list = res.data.list
        this.total = res.data.pagination.total
        this.listLoading = false
      })
    },
    handleDel(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        type: 'warning'
      })
        .then(() => {
          request({
            url: `/api/wms/ZjnBillsHistory/${id}`,
            method: 'DELETE'
          }).then((res) => {
            this.$message({
              type: 'success',
              message: res.msg,
              onClose: () => {
                this.initData()
              }
            })
          })
        })
        .catch(() => {})
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
