<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box" :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="任务号">
              <el-input
                v-model="query.F_TaskNo"
                placeholder="任务号"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务名称">
              <el-input
                v-model="query.F_TaskName"
                placeholder="任务名称"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="任务状态描述">
              <el-input
                v-model="query.F_TaskDescribe"
                placeholder="任务状态描述"
                clearable
              />
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
            <topOpts @add="addFlow()"
                   addText="新建任务"></topOpts>
          <!-- <div>
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="addOrUpdateHandle()"
              >新增</el-button
            >
          </div> -->
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
          <el-table-column prop="F_TaskNo" width="100" label="任务号" align="left" />
          <el-table-column prop="F_TaskName" label="任务名称" align="left" />
          <el-table-column
            prop="F_TaskTypeName"
            label="业务类型名称"
            align="left"
          />
          <el-table-column
            prop="F_TaskDescribe"
            label="任务状态描述"
            align="left"
          />
          <el-table-column
            prop="F_PositionFromName"
            label="起点工位"
            align="left"
          />
          <el-table-column prop="F_PositionToName" label="终点工位" align="left" />
          <el-table-column
            prop="F_PositionCurrent"
            label="当前工位"
            align="left"
          />
          <el-table-column prop="F_RouteNo" label="路径编号" align="left" />
          <el-table-column prop="F_EnabledMark" label="有效标志" align="left" />
          <el-table-column prop="F_TaskFrom" label="任务来源" align="left" />
          <el-table-column prop="F_TaskState" label="任务状态" align="left" />
          <el-table-column prop="F_CreateTime" label="创建时间" align="left">
          <template slot-scope="scope">
                        {{ scope.row.F_CreateTime | toDate("yyyy-MM-dd hh:mm:ss") }}
                        </template>
                    </el-table-column>	
          <el-table-column prop="F_CreateUser" label="创建者" align="left" />
          <el-table-column
            prop="F_LastModifyUserId"
            label="修改用户"
            align="left"
          />
          <el-table-column
            prop="F_LastModifyTime"
            label="修改时间"
            align="left"
          >
          <template slot-scope="scope">
                        {{ scope.row.F_LastModifyTime | toDate("yyyy-MM-dd hh:mm:ss") }}
                        </template>
                    </el-table-column>	
          <el-table-column label="操作" fixed="right" width="150">
            <template slot-scope="scope">
              <!-- <el-button type="text" @click="addOrUpdateHandle(scope.row.F_Id)"
                >编辑</el-button
              > -->
              <el-button
                type="text"
                @click="handleDel(scope.row.F_Id)"
                class="HSZ-table-delBtn"
                >删除</el-button
              >
              <el-button type="text" @click="toDetail(scope.row,0)"
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
    <flow
      v-if="flowVisible"
      ref="flow"
      @close="flowVisible = false"
      @choiceFlow="choiceFlow"
    />
    <FlowBox v-if="formVisible" ref="FlowBox" @close="closeForm" />

    <!-- <HSZ-Form v-if="formVisible" ref="HSZForm" @refresh="refresh" /> -->
    <ExportBox v-if="exportBoxVisible" ref="ExportBox" @download="download" />
    <!-- <Detail
      v-if="detailVisible"
      ref="Detail"
      @refresh="detailVisible = false"
    /> -->
  </div>
</template>
<script>
import request from "@/utils/request";
import { getDictionaryDataSelector } from "@/api/systemData/dictionary";
import HSZForm from "./Form";
import Flow from "./Flow";
import FlowBox from './FlowBox'

import ExportBox from "./ExportBox";
import { getDataInterfaceRes } from "@/api/systemData/dataInterface";
// import Detail from "./Detail";
export default {
  components: { HSZForm, ExportBox, Flow, FlowBox },
  data() {
    return {
      detailVisible: false,
      showAll: false,
      query: {
        F_TaskNo: undefined,
        F_TaskName: undefined,
        F_TaskDescribe: undefined,
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
      flowVisible: false,
      exportBoxVisible: false,
      columnList: [
        { prop: "F_TaskNo", label: "任务号" },
        { prop: "F_TaskName", label: "任务名称" },
        { prop: "F_TaskTypeNum", label: "业务类型编号" },
        { prop: "F_TaskDescribe", label: "任务状态描述" },
        { prop: "F_PositionFrom", label: "起点工位" },
        { prop: "F_PositionTo", label: "终点工位" },
        { prop: "F_PositionCurrent", label: "当前工位" },
        { prop: "F_RouteNo", label: "路径编号" },
        { prop: "F_EnabledMark", label: "有效标志" },
        { prop: "F_TaskFrom", label: "任务来源" },
        { prop: "F_TaskState", label: "任务状态" },
        { prop: "F_CreateTime", label: "创建时间" },
        { prop: "F_CreateUser", label: "创建者" },
        { prop: "F_LastModifyUserId", label: "修改用户" },
        { prop: "F_LastModifyTime", label: "修改时间" },
      ],
    };
  },
  computed: {},
  created() {
    this.initData();
  },
  methods: {
    goDetail(id) {
      this.detailVisible = true;
      this.$nextTick(() => {
        this.$refs.Detail.init(id);
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
        url: `/api/wms/ZjnWmsTask`,
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
            url: `/api/wms/ZjnWmsTask/${id}`,
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
    choiceFlow(item) {
      console.log(item)
      let data = {
        id: "",
        enCode: item.F_work_no,
        flowId: item.F_Id,
        formType: item.formType,
        opType: "-1",
      };
      this.formVisible = true;
      this.$nextTick(() => {
        this.$refs.FlowBox.init(data);
        this.flowVisible = false;
      });
    }
    ,
    closeForm (isRefresh) {
      this.formVisible = false
      if (isRefresh) this.refresh(true)
    },
    addFlow () {
      this.flowVisible = true
      this.$nextTick(() => {
        this.$refs.flow.init()
      })
    },
    toDetail (item, opType) {
      let data = {
        id: item.F_Id,
        enCode: item.flowCode,
        flowId: item.F_TaskTypeNum,
        formType: item.formType,
        opType,
        status: item.status
      }
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.FlowBox.init(data)
      })
    },

  },
};
</script>