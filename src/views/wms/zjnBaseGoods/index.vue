<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="货物编码">
              <el-input v-model="query.a_F_GoodsCode" placeholder="货物编码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="货物批次">
              <el-input v-model="query.a1_F_batch" placeholder="货物批次" clearable />
            </el-form-item>
          </el-col>
          <template>
            <el-col :span="6">
              <el-form-item label="创建日期">
                <el-date-picker v-model="query.a_CreateTime" type="daterange" value-format="timestamp"
                  format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </template>
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
            <el-button type="text" icon="el-icon-delete" @click="handleBatchRemoveDel()">批量删除
            </el-button>
          </div>
          <div class="HSZ-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon" :underline="false" @click="reset()" />
            </el-tooltip>
            <screenfull isContainer />
          </div>
        </div>
        <HSZ-table  v-loading="listLoading" :data="list" @sort-change='sortChange' has-c
          @selection-change="handleSelectionChange">
          <el-table-column prop="a_F_GoodsCode" label="货物编码" sortable='custom' align="left" width="140" />
          <el-table-column prop="a_goodsName" label="货物名称" sortable='custom' align="left" width="200" />

          <el-table-column label="货物类型" prop="a_GoodsType" sortable='custom' align="left" width="120">
            <template slot-scope="scope">{{ scope.row.a_GoodsType | dynamicTextByenCode(goodstypeOptions) }}</template>
          </el-table-column>
          <!-- <el-table-column prop="a1_F_batch" label="货物批次" sortable='custom' align="left" width="120" /> -->
          <el-table-column prop="a1_F_specifications" label="货物规格" sortable='custom' align="left" width="140" />
          <el-table-column label="货物状态" prop="a1_F_GoodsState" sortable='custom' align="left" width="100">
            <template
              slot-scope="scope">{{ scope.row.a1_F_GoodsState | dynamicTextByenCode(hsz_zjn_base_goods_details_hsz_goodsStateOptions) }}</template>
          </el-table-column>
          <el-table-column label="货物单位" prop="a_F_Unit" sortable='custom' align="left" width="100">
            <template slot-scope="scope">{{ scope.row.a_F_Unit | dynamicTextByenCode(unitOptions) }}</template>
          </el-table-column>
          <el-table-column prop="a1_F_CheckType" label="检验类型" sortable='custom' align="left" width="100">
            <template
              slot-scope="scope">{{ scope.row.a1_F_CheckType | dynamicTextByenCode(hsz_zjn_base_goods_details_hsz_goodsCheckTypeOptions) }}</template>
          </el-table-column>
          <el-table-column prop="a_CreateTime" label="创建日期" sortable='custom' align="left" width="140">
            <template slot-scope="scope">
              {{ scope.row.a_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column prop="a1_F_LastModifyTime" label="修改日期" sortable='custom' align="left" width="140">
            <template slot-scope="scope">
              {{ scope.row.a1_F_LastModifyTime | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column label="有效标志" prop="a_F_EnabledMark" align="left">
            <template slot-scope="scope">
              <el-tag :type="scope.row.a_F_EnabledMark == '1' ? 'success' : 'danger'" disable-transitions>
                {{ scope.row.a_F_EnabledMark | dynamicText(enabledMarkOptions) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="a1_F_Remarks" label="货物描述" sortable='custom' align="left" width="240" />
          <el-table-column label="操作" fixed="right" width="140">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.a_F_Id)">编辑/详情</el-button>
              <el-button type="text" @click="handleDel(scope.row.a_F_Id)" class='HSZ-table-delBtn'>删除</el-button>
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
        query: {
          a_F_GoodsId: undefined,
          a_F_GoodsCode: undefined,
          a1_F_batch: undefined,
          a_CreateTime: undefined,
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
            prop: 'a_F_GoodsId',
            label: '货物ID'
          },
          {
            prop: 'a_F_GoodsCode',
            label: '货物编码'
          },
          {
            prop: 'a_F_Quantity',
            label: '数量'
          },
          {
            prop: 'a_F_Unit',
            label: '货物单位'
          },
          {
            prop: 'a_F_TrayNo',
            label: '托盘编号'
          },
          {
            prop: 'a_F_EnabledMark',
            label: '有效标志'
          },
          {
            prop: 'a1_F_batch',
            label: '货物批次'
          },
          {
            prop: 'a1_F_specifications',
            label: '货物规格'
          },
          {
            prop: 'a_CreateTime',
            label: '创建日期'
          },
          {
            prop: 'a1_F_GoodsState',
            label: '货物状态'
          },
          {
            prop: 'a1_F_GoodsLocationNo',
            label: '货位ID'
          },
          {
            prop: 'a1_F_CustomerId',
            label: '客户ID'
          },
          {
            prop: 'a1_F_CheckDate',
            label: '检验日期'
          },
          {
            prop: 'a1_F_GoodsGrade',
            label: '货物等级'
          },
          {
            prop: 'a1_F_CheckType',
            label: '检验类型'
          },
          {
            prop: 'a1_F_VendorId',
            label: '供应商ID'
          },
          {
            prop: 'a1_F_PalledNo',
            label: '托盘ID'
          },
          {
            prop: 'a1_F_Remarks',
            label: '货物描述'
          },
          {
            prop: 'a1_F_EnabledMark',
            label: '有效标志'
          },
        ],
        unitOptions: [],
        goodstypeOptions: [],
        enabledMarkOptions: [{
          'fullName': "启用",
          'id': "1"
        }, {
          'fullName': "禁用",
          'id': "0"
        }],
        hsz_zjn_base_goods_details_hsz_goodsStateOptions: [], //货物状态数据字典
        hsz_zjn_base_goods_details_hsz_goodsGradeOptions: [], //货物等级的数据字典
        hsz_zjn_base_goods_details_hsz_goodsCheckTypeOptions: [], //货物检验类型的数据字典
        hsz_zjn_base_goods_details_hsz_enabledMarkOptions: [{
          'fullName': "启用",
          'id': "0"
        }, {
          'fullName': "禁用",
          'id': "1"
        }],
      }
    },
    computed: {},
    created() {
      this.initData()
      this.getunitOptions(); //单位的数据字典
      this.getgoodstypeOptions(); //货物类型的数据字典
      this.gethsz_zjn_base_goods_details_hsz_goodsStateOptions(); //货物状态的数据字典
      this.gethsz_zjn_base_goods_details_hsz_goodsGradeOptions(); //货物等级的数据字典
      this.gethsz_zjn_base_goods_details_hsz_goodsCheckTypeOptions(); //货物检验类型的数据字典
    },
    methods: {
      //单位数据字典
      getunitOptions() {
        getDictionaryDataSelector('326384591566800133').then(res => {
          this.unitOptions = res.data.list
        });
      },
      //货物状态的数据字典
      gethsz_zjn_base_goods_details_hsz_goodsStateOptions() {
        getDictionaryDataSelector('326590282281780485').then(res => {
          this.hsz_zjn_base_goods_details_hsz_goodsStateOptions = res.data.list
        });
      },
      //货物类型的数据字典
      getgoodstypeOptions() {
        getDictionaryDataSelector('325449144728552709').then(res => {
          this.goodstypeOptions = res.data.list
        });
      },
      //货物等级的数据字典
      gethsz_zjn_base_goods_details_hsz_goodsGradeOptions() {
        getDictionaryDataSelector('326588657760732421').then(res => {
          this.hsz_zjn_base_goods_details_hsz_goodsGradeOptions = res.data.list
        });
      },
      //货物检验类型的数据字典
      gethsz_zjn_base_goods_details_hsz_goodsCheckTypeOptions() {
        getDictionaryDataSelector('325448312364729605').then(res => {
          this.hsz_zjn_base_goods_details_hsz_goodsCheckTypeOptions = res.data.list
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
          url: `/api/wms/ZjnBaseGoods`,
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
            url: `/api/wms/ZjnBaseGoods/${id}`,
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
        const res = val.map(item => item.a_F_Id)
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
            url: `/api/wms/ZjnBaseGoods/batchRemove`,
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
          url: `/api/wms/ZjnBaseGoods/Actions/Export`,
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
          sidx: "a_F_Id",
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
          sidx: "a_F_Id",
        }
        this.initData()
      }
    }
  }
</script>
