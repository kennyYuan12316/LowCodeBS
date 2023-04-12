<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="站点编号">
              <el-input
                v-model="query.StationID"
                placeholder="站点编号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="名称">
              <el-input v-model="query.Capion" placeholder="名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()"
                >查询</el-button
              >
              <el-button icon="el-icon-refresh-right" @click="reset()"
                >重置</el-button
              >
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="HSZ-common-layout-main HSZ-flex-main">
        <div class="HSZ-common-head">
          <div>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addOrUpdateHandle()"
              >新增</el-button
            >
          </div>
          <div class="HSZ-common-head-right">
            <el-tooltip effect="dark" content="刷新" placement="top">
              <el-link
                icon="icon-sz icon-sz-Refresh HSZ-common-head-icon"
                :underline="false"
                @click="reset()"
              />
            </el-tooltip>
            <screenfull isContainer />
          </div>
        </div>
        <HSZ-table v-loading="listLoading" :data="list">
          <el-table-column prop="StationID" label="站点编号" align="left" />
          <el-table-column prop="Capion" label="名称" align="left" />
          <el-table-column prop="DeviceName" label="设备编号" align="left" />
          <el-table-column label="站点类别" prop="stationType" align="left">
            <template slot-scope="scope">{{
              scope.row.StationType | dynamicTextByenCode(stationTypeOptions)
            }}</template>
          </el-table-column>
          <el-table-column label="区域" prop="region" align="left">
            <template slot-scope="scope">{{
              scope.row.Region | dynamicTextByenCode(regionOptions)
            }}</template>
          </el-table-column>
          <el-table-column prop="Row" label="行" align="left" />
          <el-table-column prop="Cell" label="列" align="left" />
          <el-table-column prop="Layer" label="层" align="left" />
          <el-table-column prop="Row2" label="行2" align="left" />
          <el-table-column prop="Cell2" label="列2" align="left" />
          <el-table-column prop="Layer2" label="层2" align="left" />

          <el-table-column prop="IsActive" label="有效" align="left" >
			<template slot-scope="scope">
              <el-switch
                :value="scope.row.IsActive"
                disabled
                active-value="开"
                inactive-value="关"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="Descrip" label="描述" align="left" />
          <el-table-column prop="F_CreateUser" label="创建者" align="left" />
          <el-table-column label="创建时间" sortable align="left">
            <template slot-scope="scope">
              {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column
            prop="F_ModifiedUser"
            label="最后修改者"
            align="left"
          />
          <el-table-column label="最后修改时间" sortable align="left">
            <template slot-scope="scope">
              {{ scope.row.F_ModifiedTime | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column label="操作" fixed="right" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.F_Id)"
                >编辑</el-button
              >
              <el-button
                type="text"
                @click="handleDel(scope.row.F_Id)"
                class="HSZ-table-delBtn"
                >删除</el-button
              >
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
  </div>
</template>
<script>
import request from "@/utils/request";
import { getDictionaryDataSelector } from "@/api/systemData/dictionary";
import HSZForm from "./Form";
import ExportBox from "./ExportBox";
import { getDataInterfaceRes } from "@/api/systemData/dataInterface";
export default {
  components: { HSZForm, ExportBox },
  data() {
    return {
      query: {
        StationID: undefined,
        Capion: undefined,
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
        { prop: "StationID", label: "站点编号" },
        { prop: "Capion", label: "名称" },
        { prop: "DeviceName", label: "设备编号" },
        { prop: "StationType", label: "站点类别" },
        { prop: "Region", label: "区域" },
        { prop: "IsActive", label: "有效" },
        { prop: "Descrip", label: "描述" },
        ,
        {
          prop: "F_CreateUser",
          label: "创建者",
        },
        {
          prop: "F_CreateTime",
          label: "创建时间",
        },
        {
          prop: "F_ModifiedUser",
          label: "最后修改者",
        },
        {
          prop: "F_ModifiedTime",
          label: "最后修改时间",
        },
      ],
      stationTypeOptions: [],
      regionOptions: [],
    };
  },
  computed: {},
  created() {
    this.initData();
    this.getstationTypeOptions();
    this.getregionOptions();
  },
  methods: {
    getstationTypeOptions() {
      getDictionaryDataSelector("343195372341953797").then((res) => {
        this.stationTypeOptions = res.data.list;
      });
    },
    getregionOptions() {
      getDictionaryDataSelector("343037780953138437").then((res) => {
        this.regionOptions = res.data.list;
      });
    },
    initData() {
      this.listLoading = true;
      let _query = {
        ...this.listQuery,
        ...this.query,
      };
      let query = {};
      for (let key in _query) {
        if (Array.isArray(_query[key])) {
          query[key] = _query[key].join();
        } else {
          query[key] = _query[key];
        }
      }
      request({
        url: `/api/wms/ZjnWcsWorkSite`,
        method: "GET",
        data: query,
      }).then((res) => {
        this.list = res.data.list;
        this.total = res.data.pagination.total;
        this.listLoading = false;
      });
    },
    handleDel(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        type: "warning",
      })
        .then(() => {
          request({
            url: `/api/wms/ZjnWcsWorkSite/${id}`,
            method: "DELETE",
          }).then((res) => {
            this.$message({
              type: "success",
              message: res.msg,
              onClose: () => {
                this.initData();
              },
            });
          });
        })
        .catch(() => {});
    },
    addOrUpdateHandle(id, isDetail) {
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.HSZForm.init(id, isDetail);
      });
    },
    search() {
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "F_Id",
      };
      this.initData();
    },
    refresh(isrRefresh) {
      this.formVisible = false;
      if (isrRefresh) this.reset();
    },
    reset() {
      for (let key in this.query) {
        this.query[key] = undefined;
      }
      this.listQuery = {
        currentPage: 1,
        pageSize: 20,
        sort: "desc",
        sidx: "F_Id",
      };
      this.initData();
    },
  },
};
</script>