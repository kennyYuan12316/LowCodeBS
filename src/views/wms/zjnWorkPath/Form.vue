<template>
  <el-dialog
    :title="!dataForm.id ? '新建' : isDetail ? '详情' : '编辑'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="HSZ-dialog HSZ-dialog_center"
    lock-scroll
    width="600px"
  >
    <el-row :gutter="15" class="">
      <el-form
        ref="elForm"
        :model="dataForm"
        size="small"
        label-width="100px"
        label-position="right"
        :disabled="!!isDetail"
        :rules="rules"
      >
        <el-col :span="24">
          <el-form-item label="路径编号 " prop="pathId">
            <el-input
              v-model="dataForm.pathId"
              placeholder="请输入路径编号 "
              clearable
              required
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="路径名称" prop="stationFrom">
            <el-input
              v-model="dataForm.stationFrom"
              placeholder="请输入路径名称"
              clearable
              required
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="输送设备" prop="stationTo">
            <popupSelect
              v-model="dataForm.stationTo"
              field="stationTo"
              placeholder="请选择输送设备"
              clearable
              required
              relationField="id"
              :columnOptions="stationToOptions"
              :pageSize="20"
              propsValue="id"
              interfaceId="343201383203210501"
              popupType="dialog"
              popupTitle="选择数据"
              popupWidth="800px"
            >
            </popupSelect>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="起点站点" prop="deviceFrom">
            <popupSelect
              v-model="dataForm.deviceFrom"
              field="deviceFrom"
              placeholder="请选择起点站点"
              clearable
              required
              relationField="Capion"
              :columnOptions="deviceFromOptions"
              :pageSize="20"
              propsValue="StationID"
              interfaceId="343244101333812485"
              popupType="dialog"
              popupTitle="选择数据"
              popupWidth="800px"
            >
            </popupSelect>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="终点站点" prop="deviceTo">
            <popupSelect
              v-model="dataForm.deviceTo"
              field="deviceTo"
              placeholder="请选择终点站点"
              clearable
              required
              relationField="Capion"
              :columnOptions="deviceToOptions"
              :pageSize="20"
              propsValue="StationID"
              interfaceId="343244101333812485"
              popupType="dialog"
              popupTitle="选择数据"
              popupWidth="800px"
            >
            </popupSelect>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="路径类型" prop="pathType">
            <el-select
              v-model="dataForm.pathType"
              placeholder="请选择路径类型"
              clearable
              required
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in pathTypeOptions"
                :key="index"
                :label="item.fullName"
                :value="item.enCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="区域" prop="region">
            <el-select
              v-model="dataForm.region"
              placeholder="请选择区域"
              clearable
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in regionOptions"
                :key="index"
                :label="item.fullName"
                :value="item.enCode"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="有效" prop="isActive">
            <el-switch
              v-model="dataForm.isActive"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="descrip">
            <el-input
              v-model="dataForm.descrip"
              placeholder="请输入"
              show-word-limit
              :style="{ width: '100%' }"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 4 }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="false">
          <el-form-item label="创建者" prop="createUser">
            <el-input
              v-model="dataForm.createUser"
              placeholder="系统自动生成"
              readonly
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="false">
          <el-form-item label="创建时间" prop="createTime">
            <el-input
              v-model="dataForm.createTime"
              placeholder="系统自动生成"
              readonly
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="false">
          <el-form-item label="最后修改者" prop="modifiedUser">
            <el-input
              v-model="dataForm.modifiedUser"
              placeholder="系统自动生成"
              readonly
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="false">
          <el-form-item label="最后修改时间" prop="modifiedTime">
            <el-input
              v-model="dataForm.modifiedTime"
              placeholder="系统自动生成"
              readonly
            >
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button
        type="primary"
        @click="dataFormSubmit()"
        v-if="!isDetail"
        :loading="btnLoading"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>
<script>
import request from "@/utils/request";
import { getDictionaryDataSelector } from "@/api/systemData/dictionary";
import { getDataInterfaceRes } from "@/api/systemData/dataInterface";
export default {
  components: {},
  props: [],
  data() {
    var checkpathId = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入路径编号"));
      } else if (!this.dataForm.id) {
        request({
          url: `/api/wms/ZjnWcsWorkPath/ExistPathId`,
          method: "GET",
          data: { PathId: value },
        }).then((res) => {
          if (res.data) {
            callback(new Error("路径编号已存在！"));
          } else {
            callback();
          }
        });
      } else {
        callback();
      }
    };
    return {
      btnLoading: false,
      loading: false,
      visible: false,
      isDetail: false,
      dataForm: {
        id: "",
        pathId: undefined,
        stationFrom: undefined,
        stationTo: undefined,
        deviceFrom: undefined,
        deviceTo: undefined,
        pathType: undefined,
        region: undefined,
        isActive: 0,
        descrip: undefined,
        createUser: undefined,
        createTime: undefined,
        modifiedUser: undefined,
        modifiedTime: undefined,
      },
      rules: {
        pathId: [
          {
            required: true,
            // message:'请输入路径编号 ',
            trigger: "blur",
            validator: checkpathId,
          },
        ],
        stationFrom: [
          {
            required: true,
            message: "请输入路径名称",
            trigger: "blur",
          },
        ],
        stationTo: [
          {
            required: true,
            message: "请输入起点设备",
            trigger: "change",
          },
        ],
        deviceFrom: [
          {
            required: true,
            message: "请输入起点站点",
            trigger: "change",
          },
        ],
        deviceTo: [
          {
            required: true,
            message: "请输入终点站点",
            trigger: "change",
          },
        ],
        pathType: [
          {
            required: true,
            message: "请输入路径类型",
            trigger: "change",
          },
        ],
      },
      stationToOptions: [
        { value: "id", label: "设备编号" },
        { value: "fullName", label: "设备名称" },
      ],
      deviceFromOptions: [
        { value: "StationID", label: "站点编号" },
        { value: "Capion", label: "站点名称" },
      ],
      deviceToOptions: [
        { value: "StationID", label: "站点编号" },
        { value: "Capion", label: "站点名称" },
      ],
      pathTypeOptions: [],
      regionOptions: [],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getpathTypeOptions();
    this.getregionOptions();
  },
  mounted() {},
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
    goBack() {
      this.$emit("refresh");
    },
    init(id, isDetail) {
      this.dataForm.id = id || 0;
      this.visible = true;
      this.isDetail = isDetail || false;
      this.$nextTick(() => {
        this.$refs["elForm"].resetFields();
        if (this.dataForm.id) {
          request({
            url: "/api/wms/ZjnWcsWorkPath/" + this.dataForm.id,
            method: "get",
          }).then((res) => {
            this.dataForm = res.data;
          });
        }
      });
      this.$store.commit("generator/UPDATE_RELATION_DATA", {});
    },
    dataFormSubmit() {
      this.$refs["elForm"].validate((valid) => {
        if (valid) {
          this.btnLoading = true;
          if (!this.dataForm.id) {
            request({
              url: `/api/wms/ZjnWcsWorkPath`,
              method: "post",
              data: this.dataForm,
            }).then((res) => {
              this.$message({
                message: res.msg,
                type: "success",
                duration: 1000,
                onClose: () => {
                  this.btnLoading = false;
                  (this.visible = false), this.$emit("refresh", true);
                },
              });
            });
          } else {
            request({
              url: "/api/wms/ZjnWcsWorkPath/" + this.dataForm.id,
              method: "PUT",
              data: this.dataForm,
            }).then((res) => {
              this.$message({
                message: res.msg,
                type: "success",
                duration: 1000,
                onClose: () => {
                  this.btnLoading = false;
                  this.visible = false;
                  this.$emit("refresh", true);
                },
              });
            });
          }
        }
      });
    },
  },
};
</script>
