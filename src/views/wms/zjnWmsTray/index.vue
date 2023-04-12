<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item label="托盘编号">
              <el-input v-model="query.F_TrayNo" placeholder="托盘编号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="托盘名称">
              <el-input v-model="query.F_TrayName" placeholder="托盘名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="类型">
              <el-select v-model="query.F_Type" placeholder="类型" clearable>
                <el-option v-for="(item, index) in typeOptions" :key="index" :label="item.fullName" :value="item.enCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="托盘属性">
              <el-select v-model="query.F_TrayAttr" placeholder="托盘属性" clearable>
                <el-option v-for="(item, index) in attrOptions" :key="index" :label="item.fullName" :value="item.enCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="托盘状态">
              <el-select v-model="query.F_TrayStates" placeholder="托盘状态" clearable>
                <el-option v-for="(item, index) in trayStatesOptions" :key="index" :label="item.fullName" :value="item.enCode" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="启用标识">
              <el-select v-model="query.F_EnabledMark" placeholder="启用标识">
                <el-option v-for="(item, index) in enabledMarkOptions" :key="index" :label="item.fullName"
                  :value="item.id" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
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
        <HSZ-table v-loading="listLoading" :data="list">
          <el-table-column prop="F_TrayNo" label="托盘编号" align="left" />
          <el-table-column prop="F_TrayName" label="托盘名称" align="left" />
         <el-table-column label="类型" prop="type" align="left">
            <template slot-scope="scope">{{ scope.row.F_Type | dynamicTextByenCode(typeOptions) }}</template>
          </el-table-column>
          <el-table-column label="托盘属性" prop="type" align="left">
            <template slot-scope="scope">{{ scope.row.F_TrayAttr | dynamicTextByenCode(attrOptions) }}</template>
          </el-table-column>
         <el-table-column label="托盘状态" prop="type" align="left">
            <template slot-scope="scope">{{ scope.row.F_TrayStates | dynamicTextByenCode(trayStatesOptions) }}</template>
          </el-table-column>

          <el-table-column prop="F_CreateUser" label="创建者" align="left" />
          <el-table-column label="创建时间" sortable align="left">
            <template slot-scope="scope">
              {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column label="启用标识" prop="enabledMark" align="left">
            <!-- <template slot-scope="scope">{{ scope.row.F_EnabledMark | dynamicText(enabledMarkOptions) }}</template> -->
            <template slot-scope="scope">
              <el-tag :type="scope.row.F_EnabledMark == 1 ? 'success' : 'danger'" disable-transitions>
                {{scope.row.F_EnabledMark==1?'启用':'禁用'}}
              </el-tag>
            </template>

          </el-table-column>
          <el-table-column label="操作" fixed="right" width="250">
            <template slot-scope="scope">
              <el-button type="text" @click="TheDeliveryInformations(scope.row.F_TrayNo)">货位出库</el-button>
              <el-button type="text" @click="goodsDetails(scope.row.F_TrayNo)">托盘物料明细</el-button>
              <el-button type="text" @click="addOrUpdateHandle(scope.row.F_Id)">编辑</el-button>
              <el-button type="text" @click="handleDel(scope.row.F_Id)" class='HSZ-table-delBtn'>删除</el-button>
            </template>
          </el-table-column>
        </HSZ-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
          @pagination="initData" />
      </div>
    </div>

    <el-dialog title="托盘物料明细" :visible.sync="detailsVisible">
      <HSZ-table v-loading="detailsLoading" :data="detailslist">
          <el-table-column prop="F_GoodsId" label="货物ID" align="left" />
          <el-table-column prop="F_GoodsCode" label="货物代码" align="left" />
          <el-table-column prop="F_Quantity" label="数量" align="left" />
          <el-table-column prop="F_Unit" label="单位" align="left" />
          <el-table-column prop="F_TrayNo" label="托盘编号" align="left" />
          <el-table-column prop="F_CreateUser" label="创建者" align="left" />
          <el-table-column prop="F_CreateTime" label="创建时间" align="left" >
            <template slot-scope="scope">
              {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>

        </HSZ-table>
        <pagination :total="detailstotal" :page.sync="detailsListQuery.currentPage" :limit.sync="detailsListQuery.pageSize"
          @pagination="goodsDetails('')" />
    </el-dialog>

    <HSZ-Form v-if="formVisible" ref="HSZForm" @refresh="refresh" />
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
    <ImportForm v-if="importFormVisible" ref="importForm" @refresh="reset()" />
    <DeliveryInformation v-if="DeliveryInformationr" ref="DeliveryInformation" @refresh="refresh" />
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
  import DeliveryInformation from './TheDeliveryInformation'
  import {
    getDataInterfaceRes
  } from '@/api/systemData/dataInterface'
  export default {
    components: {
      HSZForm,
      ExportBox,
      ImportForm,
      DeliveryInformation
    },
    data() {
      return {
        showAll: false,
        query: {
          F_TrayNo: undefined,
          F_Type: undefined,
          F_EnabledMark: undefined,
          F_TrayStates:undefined,
        },
        detailsquery: {
          F_TrayNo: undefined,
        },
        list: [],
        detailslist: [],
        listLoading: true,
        detailsLoading: true,
        detailsVisible:false,
        multipleSelection: [],
        total: 0,
        detailstotal: 0,
        listQuery: {
          currentPage: 1,
          pageSize: 20,
          sort: "desc",
          sidx: "",
        },
        detailsListQuery: {
          currentPage: 1,
          pageSize: 20,
          sort: "desc",
          sidx: "",
        },
        formVisible: false,
        exportBoxVisible: false,
        importFormVisible:false,
        DeliveryInformationr:false,
        columnList: [{
            prop: 'F_TrayNo',
            label: '托盘编号'
          },
          {
            prop: 'F_TrayName',
            label: '托盘名称'
          },
          {
            prop: 'F_Type',
            label: '类型'
          },
          {
            prop: 'F_TrayAttr',
            label: '托盘属性'
          },
          {
            prop: 'F_TrayStates',
            label: '托盘状态'
          },
          {
            prop: 'F_CreateUser',
            label: '创建者'
          },
          {
            prop: 'F_CreateTime',
            label: '创建时间'
          },
          {
            prop: 'F_EnabledMark',
            label: '禁用'
          },
        ],
        typeOptions: [],
        attrOptions:[],
        trayStatesOptions: [],

        enabledMarkOptions: [{
          'fullName': "启用",
          'id': "1"
        }, {
          'fullName': "禁用",
          'id': "0"
        }],

      }
    },
    computed: {},
    created() {
      this.initData()
      this.gettypeOptions();
      this.gettrayStatesOptions();
      this.getattrOptions();

    },
    methods: {
      gettypeOptions(){
				getDictionaryDataSelector('332411089230759173').then(res => {
					this.typeOptions = res.data.list
				});
			},
      getattrOptions(){
				getDictionaryDataSelector('363571017664169221').then(res => {
					this.attrOptions = res.data.list
				});
			},
      gettrayStatesOptions(){
				getDictionaryDataSelector('332412309932606725').then(res => {
					this.trayStatesOptions = res.data.list
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
          url: `/api/wms/ZjnWmsTray`,
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
            url: `/api/wms/BaseTray/${id}`,
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
      TheDeliveryInformations(id, isDetail){
        console.log(id);
        this.DeliveryInformationr=true,
        this.$nextTick(() => {
          this.$refs.DeliveryInformation.init(id, isDetail)
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
      },
      //托盘物料明细
      goodsDetails(TrayNo){
        if(TrayNo){
          this.detailsquery.F_TrayNo=TrayNo;
        }
        this.detailsVisible=true;
        this.detailsLoading = true;
        let _query = {
          ...this.detailsListQuery,
          ...this.detailsquery
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
          url: `/api/wms/ZjnWmsTray/GetGoodsDetailsList`,
          method: 'GET',
          data: query
        }).then(res => {
          this.detailslist = res.data.list
          this.detailstotal = res.data.pagination.total
          this.detailsLoading = false
        })
      },
      uploadForm() {
                this.importFormVisible = true
                this.$nextTick(() => {
                this.$refs.importForm.init()
                })
            },
            exportData() {
                this.exportBoxVisible = true
                this.$nextTick(() => {
                    this.$refs.ExportBox.init(this.columnList)
                })
            },
            download(data) {
                let query = { ...data, ...this.listQuery, ...this.query }
                request({
                    url: `/api/wms/ZjnWmsTray/ExportExcelData`,
                    method: 'GET',
                    data: query
                }).then(res => {
                    if (!res.data.url) return
                    window.location.href = this.define.comUrl + res.data.url
                    this.$refs.ExportBox.visible = false
                    this.exportBoxVisible = false
                })
            }
    }
  }
</script>
