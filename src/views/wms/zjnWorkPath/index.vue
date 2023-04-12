<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="4">
            <el-form-item label="路径编号 ">
              <el-input
                v-model="query.PathID"
                placeholder="路径编号 "
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="路径名称">
              <el-input
                v-model="query.StationFrom"
                placeholder="路径名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="路径类型">
              <el-select
                v-model="query.PathType"
                placeholder="路径类型"
                clearable
              >
                <el-option
                  v-for="(item, index) in pathTypeOptions"
                  :key="index"
                  :label="item.fullName"
                  :value="item.enCode"
                />
              </el-select>
            </el-form-item>
          </el-col>
		   <el-col :span="4">
              <el-form-item label="区域">
                <el-select v-model="query.Region" placeholder="区域" clearable>
                  <el-option
                    v-for="(item, index) in regionOptions"
                    :key="index"
                    :label="item.fullName"
                    :value="item.enCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          <template v-if="showAll">
            <!-- <el-col :span="4">
              <el-form-item label="区域">
                <el-select v-model="query.Region" placeholder="区域" clearable>
                  <el-option
                    v-for="(item, index) in regionOptions"
                    :key="index"
                    :label="item.fullName"
                    :value="item.enCode"
                  />
                </el-select>
              </el-form-item>
            </el-col> -->
          </template>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="search()"
                >查询</el-button
              >
              <el-button icon="el-icon-refresh-right" @click="reset()"
                >重置</el-button
              >
              <!-- <el-button
                type="text"
                icon="el-icon-arrow-down"
                @click="showAll = true"
                v-if="!showAll"
                >展开</el-button
              >
              <el-button
                type="text"
                icon="el-icon-arrow-up"
                @click="showAll = false"
                v-else
                >收起</el-button
              > -->
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
          <el-table-column prop="PathID" label="路径编号 " align="left" />
          <el-table-column prop="StationFrom" label="路径名称" align="left" />
          <el-table-column prop="StationTo" label="输送设备" align="left" />
          <el-table-column prop="DeviceFrom" label="起点站点" align="left" />
          <el-table-column prop="DeviceTo" label="终点站点" align="left" />
          <el-table-column label="路径类型" prop="pathType" align="left">
            <template slot-scope="scope">{{
              scope.row.PathType | dynamicTextByenCode(pathTypeOptions)
            }}</template>
          </el-table-column>
          <el-table-column label="区域" prop="region" align="left">
            <template slot-scope="scope">{{
              scope.row.Region | dynamicTextByenCode(regionOptions)
            }}</template>
          </el-table-column>
          <el-table-column prop="IsActive" label="有效" align="left">
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
          <el-table-column prop="F_CreateTime" label="创建时间" align="left" >
			<template slot-scope="scope">
              {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
            </template>
          </el-table-column>
          <el-table-column
            prop="F_ModifiedUser"
            label="最后修改者"
            align="left"
          />
          <el-table-column
            prop="F_ModifiedTime"
            label="最后修改时间"
            align="left"
          >
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
      showAll: false,
      query: {
        PathID: undefined,
        StationFrom: undefined,
        PathType: undefined,
        Region: undefined,
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
        { prop: "PathID", label: "路径编号 " },
        { prop: "StationFrom", label: "路径名称" },
        { prop: "StationTo", label: "起点设备" },
        { prop: "DeviceFrom", label: "起点站点" },
        { prop: "DeviceTo", label: "终点站点" },
        { prop: "PathType", label: "路径类型" },
        { prop: "Region", label: "区域" },
        { prop: "IsActive", label: "有效" },
        { prop: "Descrip", label: "描述" },
        { prop: "F_CreateUser", label: "创建者" },
        { prop: "F_CreateTime", label: "创建时间" },
        { prop: "F_ModifiedUser", label: "最后修改者" },
        { prop: "F_ModifiedTime", label: "最后修改时间" },
      ],
      pathTypeOptions: [],
      regionOptions: [],
    };
  },
  computed: {},
  created() {
    this.initData();
    this.getpathTypeOptions();
    this.getregionOptions();
  },
  methods: {
    getpathTypeOptions() {
      getDictionaryDataSelector("343242169164760325").then((res) => {
        this.pathTypeOptions = res.data.list;
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
        url: `/api/wms/ZjnWcsWorkPath`,
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
            url: `/api/wms/ZjnWcsWorkPath/${id}`,
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