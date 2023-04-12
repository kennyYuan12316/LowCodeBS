<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="设备编号">
              <el-input
                v-model="query.DeviceID"
                placeholder="设备编号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备名称">
              <el-input
                v-model="query.Caption"
                placeholder="设备名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="设备类型">
              <el-select
                v-model="query.DeviceType"
                placeholder="设备类型"
                clearable
              >
                <el-option
                  v-for="(item, index) in deviceTypeOptions"
                  :key="index"
                  :label="item.fullName"
                  :value="item.enCode"
                />
              </el-select>
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
          <el-table-column prop="DeviceID" label="设备编号" align="left" />
          <el-table-column prop="Caption" label="设备名称" align="left" />
          <el-table-column prop="F_PlcID" label="plc编号" align="left" />
          <el-table-column label="区域类型" prop="region" align="left">
            <template slot-scope="scope">{{
              scope.row.Region | dynamicTextByenCode(regionOptions)
            }}</template>
          </el-table-column>
          <el-table-column prop="PlcIP" label="ip地址" align="left" />
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
          <el-table-column prop="IsController" label="是否控制器" align="left">
            <template slot-scope="scope">
              <el-switch
                :value="scope.row.IsController"
                disabled
                active-value="开"
                inactive-value="关"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="ControllerType"
            label="控制器类型"
            align="left"
          />
          <el-table-column prop="IsAlone" label="是否为独立线程" align="left">
            <template slot-scope="scope">
              <el-switch
                :value="scope.row.IsAlone"
                disabled
                active-value="开"
                inactive-value="关"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="Descrip" label="描述" align="left" />
          <el-table-column prop="ThreadGroup" label="同线程" align="left" />
          <el-table-column label="设备类型" prop="deviceType" align="left">
            <template slot-scope="scope">{{
              scope.row.DeviceType | dynamicTextByenCode(deviceTypeOptions)
            }}</template>
          </el-table-column>
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
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <el-button type="text" @click="addOrUpdateHandle(scope.row.DeviceID)"
                >编辑</el-button
              >
              <el-button
                type="text"
                @click="handleDel(scope.row.DeviceID)"
                class="HSZ-table-delBtn"
                >删除</el-button
              >
              <el-button type="text" @click="goDetail(scope.row.DeviceID)"
                >详情</el-button
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
    <Detail
      v-if="detailVisible"
      ref="Detail"
      @refresh="detailVisible = false"
    />
  </div>
</template>
<script>
import request from "@/utils/request";
import { getDictionaryDataSelector } from "@/api/systemData/dictionary";
import HSZForm from "./Form";
import ExportBox from "./ExportBox";
import { getDataInterfaceRes } from "@/api/systemData/dataInterface";
import Detail from "./Detail";

export default {
  components: { HSZForm, ExportBox, Detail },
  data() {
    return {
      showAll: false,
      detailVisible: false,
      query: {
        DeviceID: undefined,
        DeviceName: undefined,
        DeviceType: undefined,
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
        { prop: "DeviceID", label: "设备编号" },
        { prop: "Caption", label: "设备名称" },
        { prop: "F_PlcID", label: "Plc编号" },

        { prop: "Region", label: "区域类型" },
        { prop: "PlcIP", label: "ip地址" },
        { prop: "IsActive", label: "有效" },
        { prop: "IsController", label: "是否控制器" },
        { prop: "ControllerType", label: "控制器类型" },
        { prop: "IsAlone", label: "是否为独立线程" },
        { prop: "Descrip", label: "描述" },
        { prop: "ThreadGroup", label: "同线程" },
        { prop: "DeviceType", label: "设备类型" },
      ],
      deviceTypeOptions: [],
      regionOptions: [],
    };
  },
  computed: {},
  created() {
    this.initData();
    this.getdeviceTypeOptions();
    this.getregionOptions();
  },
  methods: {
    getdeviceTypeOptions() {
      getDictionaryDataSelector("343042755552871685").then((res) => {
        this.deviceTypeOptions = res.data.list;
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
        url: `/api/wms/ZjnWcsWorkDevice`,
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
            url: `/api/wms/ZjnWcsWorkDevice/${id}`,
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
    goDetail(id) {
      this.detailVisible = true;
      this.$nextTick(() => {
        this.$refs.Detail.init(id);
      });
    },
  },
};
</script>