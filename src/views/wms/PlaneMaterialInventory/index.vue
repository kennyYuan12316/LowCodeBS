<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="物料规格">
              <el-input v-model="query.F_ProductsStyle" placeholder="物料规格" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料名称">
              <el-input v-model="query.F_ProductsName" placeholder="物料名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料编码">
              <el-input v-model="query.F_ProductsCode" placeholder="物料编码" clearable />
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
          </div>
          <div class="HSZ-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
            </el-tooltip>
            <screenfull isContainer />
          </div>
        </div>
        <HSZ-table v-loading="listLoading" :data="list">
          <el-table-column prop="F_ProductsCode" label="物料编码" align="left" />
          <el-table-column prop="F_ProductsName" label="物料名称" align="left" />
          <el-table-column prop="F_ProductsQuantity" label="物料数量" align="left" />
          <!-- <el-table-column prop="F_ProductsUnit" label="物料单位" align="left" /> -->
          <el-table-column label="货物单位" prop="F_ProductsUnit" sortable='custom' align="left" width="100">
            <template slot-scope="scope">{{ scope.row.F_ProductsUnit | dynamicTextByenCode(unitOptions) }}</template>
          </el-table-column>
          <el-table-column label="物料类型" prop="F_ProductsType" sortable='custom' align="left" width="100">
            <template slot-scope="scope">{{ scope.row.F_ProductsType | dynamicTextByenCode(productstypeOptions) }}</template>
          </el-table-column>
          <el-table-column prop="F_ProductsStyle" label="物料规格" align="left" />
          <el-table-column label="物料等级" prop="F_ProductsGrade" sortable='custom' align="left" width="100">
            <template slot-scope="scope">{{ scope.row.F_ProductsGrade | dynamicTextByenCode(GradeOptions) }}</template>
          </el-table-column>
          <el-table-column label="物料状态" prop="F_ProductsState" sortable='custom' align="left" width="100">
            <template slot-scope="scope">{{ scope.row.F_ProductsState | dynamicTextByenCode(orderStateOptions) }}</template>
          </el-table-column>
          <el-table-column prop="F_ProductsBatch" label="物料批次" align="left" />
          <el-table-column prop="F_ProductsLocation" label="物料货位" align="left" width="120"/>
          <el-table-column prop="F_ProductsCustomer" label="客户" align="left" width="150" />
          <el-table-column prop="F_ProductsSupplier" label="供应商" align="left" width="150"/>
          <el-table-column prop="F_ProductsCheckType" label="检验类型" align="left" />
          <el-table-column prop="F_ProductsIsLock" label="是否锁定" align="left">
            <template slot-scope="scope">
              {{ scope.row.F_ProductsIsLock == 0 ? "否" : "是" }}
            </template>
          </el-table-column>
          <el-table-column prop="F_ProductsTakeStockTime" label="上次盘点时间" width="150"  align="left">
            <template slot-scope="scope">
              {{ scope.row.F_ProductsTakeStockTime | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column prop="F_ProductsTakeCount" label="盘点次数" align="left" />
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
          F_ProductsStyle: undefined,
          F_ProductsName: undefined,
          F_ProductsCode: undefined,
        },
        list: [],
        unitOptions: [],
        productstypeOptions:[],
        GradeOptions:[],
        orderStateOptions:[],
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
            prop: 'F_ProductsCode',
            label: '物料编码'
          },
          {
            prop: 'F_ProductsName',
            label: '物料名称'
          },
          {
            prop: 'F_ProductsQuantity',
            label: '物料数量'
          },
          {
            prop: 'F_ProductsUnit',
            label: '物料单位'
          },
          {
            prop: 'F_ProductsType',
            label: '物料类型'
          },
          {
            prop: 'F_ProductsStyle',
            label: '物料规格'
          },
          {
            prop: 'F_ProductsGrade',
            label: '物料等级'
          },
          {
            prop: 'F_ProductsState',
            label: '物料状态'
          },
          {
            prop: 'F_ProductsBatch',
            label: '物料批次'
          },
          {
            prop: 'F_ProductsLocation',
            label: '物料货位'
          },
          {
            prop: 'F_ProductsCustomer',
            label: '客户'
          },
          {
            prop: 'F_ProductsSupplier',
            label: '供应商'
          },
          {
            prop: 'F_ProductsCheckType',
            label: '经验类型'
          },
          {
            prop: 'F_ProductsIsLock',
            label: '是否锁定'
          },
          {
            prop: 'F_ProductsTakeStockTime',
            label: '上次盘点时间'
          },
          {
            prop: 'F_ProductsTakeCount',
            label: '盘点次数'
          },
        ],
      }
    },
    computed: {},
    created() {

      this.getunitOptions(); //单位的数据字典
      this.getproductstypeOptions();
      this.getproductsGradeOptions();
      this.getorderStateOptions();
      this.initData();
    },
    methods: {

      //单位数据字典
      getunitOptions() {
        getDictionaryDataSelector('326384591566800133').then(res => {
          this.unitOptions = res.data.list
        });
      },
      getproductstypeOptions() {
        getDictionaryDataSelector('325449144728552709').then(res => {
          this.productstypeOptions = res.data.list
        });
      },
      getproductsGradeOptions() {
        getDictionaryDataSelector('326588657760732421').then(res => {
          this.GradeOptions = res.data.list
        });
      },
      getorderStateOptions() {
        getDictionaryDataSelector('326590282281780485').then(res => {
          this.orderStateOptions = res.data.list
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
          url: `/api/wms/ZjnPlaneMaterialInventory`,
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
            url: `/api/wms/ZjnPlaneMaterialInventory/${id}`,
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
      reset() {
        for (let key in this.query) {
          this.query[key] = undefined
        }
        this.listQuery = {
          currentPage: 1,
          pageSize: 20,
          sort: "desc",
          sidx: "a.F_Id",
        }
        this.initData()
      }
    }
  }
</script>
