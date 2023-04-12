<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>

          <el-col :span="5">
            <el-form-item label="32位流水码">
              <el-input v-model="query.F_OrderNo" placeholder="32位流水码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="物料名称">
              <el-input v-model="query.F_ProductsName" placeholder="物料名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="物料编号">
              <el-input v-model="query.F_ProductsNo" placeholder="物料编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="容器托盘">
              <el-input v-model="query.F_TheContainer" placeholder="容器" clearable />
            </el-form-item>
          </el-col>
          <!-- <el-col :span="5">
            <el-form-item label="数量">
              <el-input v-model="query.F_ProductsTotalF_ProductsTotal" placeholder="数量" clearable />
            </el-form-item>
          </el-col> -->
          <!--
          <el-col :span="5">
            <el-form-item label="位置">
              <el-input v-model="query.F_ProductsLocation" placeholder="位置" clearable />
            </el-form-item>
          </el-col> -->

          <el-col :span="4">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()">查询</el-button>
              <el-button icon="el-icon-refresh-right" @click="reset()">重置</el-button>
              <!-- <el-button type="text" icon="el-icon-arrow-down" @click="showAll=true" v-if="!showAll">展开</el-button>
              <el-button type="text" icon="el-icon-arrow-up" @click="showAll=false" v-else>收起</el-button> -->
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="HSZ-common-layout-main HSZ-flex-main">
        <div class="HSZ-common-head">
          <div>
            <el-button type="text" icon="el-icon-download" @click="exportData()">导出</el-button>
          </div>
          <div class="HSZ-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
            </el-tooltip>
            <screenfull isContainer />
          </div>
        </div>
        <HSZ-table v-loading="listLoading" :data="list">

          <el-table-column prop="F_PurchaseOrder" label="单据号" align="left" width="120"/>
          <el-table-column prop="F_OrderNo" label="32位流水号" align="left" width="250"/>
          <el-table-column prop="F_ProductsNo" label="物料编号" align="left" width="100"/>
          <el-table-column prop="F_ProductsName" label="物料名称" align="left" width="320"/>
          <el-table-column prop="F_ProductsLocation" label="货物位置" align="left" width="150" />
          <el-table-column prop="F_ProductsTotal" label="剩余数量" align="left" />
          <!-- <el-table-column prop="F_ProductsTotal" label="入库数量" align="left" /> -->
          <el-table-column prop="F_BatchDeliveryQuantity" label="出库数量" align="left" />
          <el-table-column label="物料单位" prop="F_ProductsUnit" align="left" width="120">
            <template slot-scope="scope">{{ scope.row.F_ProductsUnit | dynamicTextByenCode(unitOptions) }}</template>
          </el-table-column>
          <el-table-column label="状态" prop="F_InspectionStatus" align="left" width="120">
            <template
              slot-scope="scope">{{ scope.row.F_InspectionStatus | dynamicTextByenCode(productstypeOptions) }}</template>
          </el-table-column>
          
          <el-table-column prop="F_TheDateOfProduction" label="物料生产时间" sortable='custom' align="left" width="140">
            <template slot-scope="scope">
              {{ scope.row.F_TheDateOfProduction | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>
          
          <el-table-column prop="F_TheContainer" label="容器编号" align="left" width="180"/>
          <el-table-column prop="F_TheTray" label="托盘编号" align="left" width="180"/>
          <!-- <el-table-column prop="F_CreateTime" label="入库时间" sortable='custom' align="left" width="140">
            <template slot-scope="scope">
              {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column> -->
          
          <el-table-column prop="F_ProductsLocation" label="位置中文名" align="left" width="150" />
          <el-table-column prop="F_ProductsUser" label="备注" align="left" width="150" />
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle2(scope.row.F_OrderNo,scope.row.F_ProductsLocation,scope.row.F_InspectionStatus,scope.row.F_PurchaseOrder)">修改状态</el-button>
              
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
  import HSZForm from './Form'
  import {
    getDictionaryDataSelector
  } from '@/api/systemData/dictionary'
  import ExportBox from './ExportBox'
  import {
    getDataInterfaceRes
  } from '@/api/systemData/dataInterface'
  export default {
    components: {
      ExportBox,
      HSZForm
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
          F_ProductsLocation: undefined,
        },
        list: [],
        listLoading: true,
        productstypeOptions: false,
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
            prop: 'F_ProductsLocation',
            label: '物料货位'
          },
          {
            prop: 'F_ProductsStyle',
            label: '剩余数量'
          },
          {
            prop: 'F_BatchDeliveryQuantity',
            label: '出库数量'
          },
          {
            prop: 'F_ProductsUnit',
            label: '物料单位'
          },        
          {
            prop: 'F_InspectionStatus',
            label: '状态'
          },
          {
            prop: 'F_TheDateOfProduction',
            label: '生产时间'
          },
          {
            prop: 'F_TheContainer',
            label: '容器编号'
          },
          {
            prop: 'F_TheTray',
            label: '托盘编号'
          },
          // {
          //   prop: 'F_CreateTime',
          //   label: '入库时间'
          // },          
          {
            prop: 'F_ProductsLocation',
            label: '物料货位中文名称'
          },
          {
            prop: 'F_ProductsUser',
            label: '备注'
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
      this.getgoodsStateOptions();
      
    },
    methods: {
      addOrUpdateHandle2(id,houWzhe,staes,dangjuhao){
       
        this.formVisible = true
        this.$nextTick(() => {
          this.$refs.HSZForm.init(id,houWzhe,staes,dangjuhao)
        })
      },

      getgoodsStateOptions() {
        getDictionaryDataSelector('326590282281780485').then(res => {
          this.goodsStateOptions = res.data.list
        });
      },
      getorderTypeOptions() {
        getDictionaryDataSelector('325447612469609733').then(res => {
          this.orderTypeOptions = res.data.list
        });
      },
      getproductstypeOptions() {
        getDictionaryDataSelector('325448475967751429').then(res => {
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
      exportData() {
        this.exportBoxVisible = true
        this.$nextTick(() => {
          this.$refs.ExportBox.init(this.columnList)
        })
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
          url: `/api/wms/ZjnBillsHistory/TheReportDetailsList`,
          method: 'GET',
          data: query
        }).then(res => {
          this.list = res.data.list
          this.total = res.data.pagination.total
          this.listLoading = false
        })
      },
      download(data) {
        let query = {
          ...data,
          ...this.listQuery,
          ...this.query
        }
        request({
          url: `/api/wms/ZjnBillsHistory/Actions/Export`,
          method: 'GET',
          data: query
        }).then(res => {
          if (!res.data.url) return
          window.location.href = this.define.comUrl + res.data.url
          this.$refs.ExportBox.visible = false
          this.exportBoxVisible = false
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
