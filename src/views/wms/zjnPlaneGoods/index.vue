<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="物料类型">
              <el-select v-model="query.F_GoodsType" placeholder="物料类型" clearable>
                <el-option v-for="(item, index) in goodsTypeOptions" :key="index" :label="item.fullName"
                  :value="item.enCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料编码">
              <el-input v-model="query.F_GoodsCode" placeholder="物料编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="物料名称">
              <el-input v-model="query.F_GoodsName" placeholder="物料名称" clearable />
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
            <el-button type="text" icon="el-icon-download" @click="exportData()">导出</el-button>
            <el-button type="text" icon="el-icon-upload2" @click="uploadForm">导入</el-button>
          </div>
          <div class="HSZ-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
            </el-tooltip>
            <screenfull isContainer />
          </div>
        </div>
        <HSZ-table v-loading="listLoading" :data="list" @sort-change='sortChange'>
          <el-table-column prop="F_GoodsCode" label="物料编码" sortable='custom' align="left" width="100"/>
          <el-table-column prop="F_GoodsName" label="物料名称" sortable='custom' width="300" align="left" />
          <el-table-column label="物料类型" prop="goodsType" sortable='custom' align="left" width="100"  >
            <template slot-scope="scope">{{ scope.row.F_GoodsType | dynamicTextByenCode(goodsTypeOptions) }}</template>
          </el-table-column>
          <el-table-column label="物料单位" prop="unit" sortable='custom' width="100"  align="left">
            <template slot-scope="scope">{{ scope.row.F_Unit | dynamicTextByenCode(unitOptions) }}</template>
          </el-table-column>

          <el-table-column label="检验类型" prop="checkType" sortable='custom' width="100"  align="left">
            <template slot-scope="scope">{{ scope.row.F_CheckType | dynamicTextByenCode(checkTypeOptions) }}</template>
          </el-table-column>
          <el-table-column prop="F_Specifications" label="物料规格" sortable='custom' width="300"  align="left" />
          <el-table-column prop="F_Ceiling" label="库存上限" sortable='custom' width="100"  align="left" />
          <el-table-column prop="F_TheLowerLimit" label="库存下限" sortable='custom' width="100"  align="left" />
          <el-table-column prop="F_TellDate" label="预警周期(天)" align="left" width="100" />
          <el-table-column label="物料状态" prop="goodsState" sortable='custom' width="100"  align="left">
            <template slot-scope="scope">{{ scope.row.F_GoodsState | dynamicTextByenCode(goodsStateOptions) }}</template>
          </el-table-column>
          <el-table-column prop="F_DisableMark" label="禁用原因" align="left" />
          <el-table-column prop="F_CustomerId" label="客户编码" align="left" />
          <el-table-column prop="F_VendorId" label="供应商编码" align="left" />
          <el-table-column label="保质期" prop="F_ShelfLife" align="left">           
          </el-table-column>
          <el-table-column prop="CreateUser" label="创建人" align="left" />
          <el-table-column prop="CreateTime" label="创建时间" sortable='custom' align="left" width="140">
              <template slot-scope="scope">
              {{ scope.row.CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
              </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.F_Id)">编辑</el-button>
              <el-button type="text" @click="handleDel(scope.row.F_Id)" class='HSZ-table-delBtn'>删除</el-button>
              <el-button type="text" @click="goDetail(scope.row.F_Id)">详情</el-button>
            </template>
          </el-table-column>
        </HSZ-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>
    <HSZ-Form v-if="formVisible" ref="HSZForm" @refresh="refresh" />
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
    <Detail v-if="detailVisible" ref="Detail" @refresh="detailVisible=false" />
    <ImportForm v-if="importFormVisible" ref="importForm" @refresh="reset()" />
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
  import {
    getDataInterfaceRes
  } from '@/api/systemData/dataInterface'
  import Detail from './Detail'
  export default {
    components: {
      HSZForm,
      ExportBox,
      Detail,
      ImportForm
    },
    data() {
      return {
        detailVisible: false,
        showAll: false,
        query: {
          F_GoodsType: undefined,
          F_GoodsCode: undefined,
          F_GoodsName: undefined,
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
        importFormVisible:false,
        columnList: [{
            prop: 'F_GoodsCode',
            label: '物料编码'
          },
          {
            prop: 'F_GoodsName',
            label: '物料名称'
          },
          {
            prop: 'F_GoodsType',
            label: '物料类型'
          },
          {
            prop: 'F_Unit',
            label: '物料单位'
          },
          {
            prop: 'F_GoodsState',
            label: '物料状态'
          },
          {
            prop: 'F_CheckType',
            label: '检验类型'
          },
          {
            prop: 'F_Specifications',
            label: '物料规格'
          },
          {
            prop: 'F_Ceiling',
            label: '库存上限'
          },
          {
            prop: 'F_TheLowerLimit',
            label: '库存下限'
          },
          {
            prop: 'F_CustomerId',
            label: '客户编码'
          },
          {
            prop: 'F_VendorId',
            label: '供应商编码'
          },
          {
            prop: 'F_ShelfLife',
            label: '保质期'
          },
          {
            prop: 'F_TellDate',
            label: '预警周期(天)'
          },
          {
            prop: 'F_DisableMark',
            label: '禁用原因'
          },
        ],
        goodsTypeOptions: [],
        unitOptions: [],
        goodsStateOptions: [],
        checkTypeOptions: [],
        isFirstOutOptions: [{
          'fullName': "是",
          'id': "1"
        }, {
          'fullName': "否",
          'id': "0"
        }],
      }
    },
    computed: {},
    created() {
      this.initData()
      this.getgoodsTypeOptions();
      this.getunitOptions();
      this.getgoodsStateOptions();
      this.getcheckTypeOptions();

    },
    methods: {
      goDetail(id) {
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.Detail.init(id)
        })
      },
       uploadForm() {
        this.importFormVisible = true
        this.$nextTick(() => {
          this.$refs.importForm.init()
        })
      },
      getgoodsTypeOptions() {
        getDictionaryDataSelector('325449144728552709').then(res => {
          this.goodsTypeOptions = res.data.list
        });
      },
      getunitOptions() {
        getDictionaryDataSelector('326384591566800133').then(res => {
          this.unitOptions = res.data.list
        });
      },
      getgoodsStateOptions() {
        getDictionaryDataSelector('326590282281780485').then(res => {
          this.goodsStateOptions = res.data.list
        });
      },
      getcheckTypeOptions() {
        getDictionaryDataSelector('325448312364729605').then(res => {
          this.checkTypeOptions = res.data.list
        });
      },
      sortChange({
        column,
        prop,
        order
      }) {
        this.listQuery.sort = order == 'ascending' ? 'asc' : 'desc'
        this.listQuery.sidx = !order ? '' : prop
        this.initData()
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
          url: `/api/wms/ZjnPlaneGoods`,
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
            url: `/api/wms/ZjnPlaneGoods/${id}`,
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
          url: `/api/wms/ZjnPlaneGoods/Actions/Export`,
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
