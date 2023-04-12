<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="单据类型">
              <el-input v-model="query.F_OrderType" placeholder="单据类型" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料名称">
              <el-input v-model="query.F_ProductsName" placeholder="物料名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="客户">
              <el-input v-model="query.F_ProductsUser" placeholder="客户" clearable />
            </el-form-item>
          </el-col>
          <template v-if="showAll">
            <el-col :span="6">
              <el-form-item label="供应商">
                <el-input v-model="query.F_ProductsSupplier" placeholder="供应商" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="物料货位">
                <el-input v-model="query.F_ProductsLocation" placeholder="物料货位" clearable />
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
          <div class="HSZ-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
            </el-tooltip>
            <screenfull isContainer />
          </div>
        </div>
        <HSZ-table v-loading="listLoading" :data="list">
          <el-table-column prop="F_OrderNo" label="32位流水号" align="left" />
          <el-table-column label="单据类型" prop="F_OrderType" align="left">
            <template slot-scope="scope">{{ scope.row.F_OrderType | dynamicTextByenCode(orderTypeOptions) }}</template>
          </el-table-column>
          <el-table-column prop="F_ProductsName" label="物料名称" align="left" />
          <el-table-column prop="F_ProductsStyle" label="物料规格" align="left" />
          <el-table-column label="物料类型" prop="F_ProductsType" align="left" width="120">
            <template slot-scope="scope">{{ scope.row.F_ProductsType | dynamicTextByenCode(productstypeOptions) }}</template>
          </el-table-column>
          <el-table-column prop="F_ProductsTotal" label="物料数量" align="left" />
          <el-table-column label="物料单位" prop="F_ProductsUnit" align="left" width="120">
            <template slot-scope="scope">{{ scope.row.F_ProductsUnit | dynamicTextByenCode(unitOptions) }}</template>
          </el-table-column>
          <el-table-column label="物料等级" prop="F_ProductsGrade" align="left" width="120">
            <template slot-scope="scope">{{ scope.row.F_ProductsGrade | dynamicTextByenCode(GradeOptions) }}</template>
          </el-table-column>
          <el-table-column prop="F_ProductsBach" label="物料批次" align="left" />          
          <el-table-column prop="F_ProductsLocation" label="物料货位" align="left" width="150" />
          
        </HSZ-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
      
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
        productstypeOptions:[],
        unitOptions:[],
        GradeOptions:[],
        query: {
          F_OrderType: undefined,
          F_ProductsName: undefined,
          F_ProductsUser: undefined,
          F_ProductsSupplier: undefined,
          F_ProductsLocation: undefined,
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
          },
        ],
      }
    },
    computed: {},
    created() {
      this.getorderTypeOptions();
      this.getproductstypeOptions();
      this.getunitOptions();
      this.getproductsGradeOptions();
      this.initData();
    },
    methods: {
      getorderTypeOptions() {
        getDictionaryDataSelector('325447612469609733').then(res => {
          this.orderTypeOptions = res.data.list
        });
      },
      getproductstypeOptions() {
        getDictionaryDataSelector('325449144728552709').then(res => {
          this.productstypeOptions = res.data.list
        });
      },
      getunitOptions() {
        getDictionaryDataSelector('326384591566800133').then(res => {
          this.unitOptions = res.data.list
        });
      },
      getproductsGradeOptions() {
        getDictionaryDataSelector('326588657760732421').then(res => {
          this.GradeOptions = res.data.list
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
        query.F_OrderType="005";
        request({
          url: `/api/wms/ZjnBillsHistory/InventoryReportList`,
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
            });
          })
        }).catch(() => {});
      },
      
      search() {
        this.listQuery = {
          currentPage: 1,
          pageSize: 20,
          sort: "desc",
          sidx: "a.F_Id",
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
