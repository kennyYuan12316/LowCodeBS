<template>
  <el-dialog :title="!dataForm.DeviceId ? '新建' : isDetail ? '详情' : '编辑'" :close-on-click-modal="false"
    :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center" lock-scroll width="600px">
    <el-row :gutter="15" class="">
      <el-form ref="elForm" :model="dataForm" size="small" label-width="100px" label-position="right"
        :disabled="!!isDetail" :rules="rules">
        <el-col :span="24">
          <el-form-item label="设备编号" prop="deviceId">
            <el-input v-model="dataForm.deviceId" placeholder="请输入设备编号" :disabled="!!dataForm.DeviceId" clearable
              required :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="设备名称" prop="caption">
            <el-input v-model="dataForm.caption" placeholder="请输入设备名称" clearable required :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="设备类型" prop="deviceType">
            <el-select v-model="dataForm.deviceType" placeholder="请选择" clearable required :style="{ width: '100%' }">
              <el-option v-for="(item, index) in deviceTypeOptions" :key="index" :label="item.fullName"
                :value="item.enCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="区域类型" prop="region">
            <el-select v-model="dataForm.region" placeholder="请选择" clearable required :style="{ width: '100%' }">
              <el-option v-for="(item, index) in regionOptions" :key="index" :label="item.fullName"
                :value="item.enCode"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item label="PLC设备" prop="plc">
            <popupSelect v-model="dataForm.plc" field="plc" placeholder="请选择PLC设备" clearable required
              relationField="ip" :columnOptions="plcToOptions" :pageSize="20" propsValue="id"
              interfaceId="346603304110785797" popupType="dialog" popupTitle="选择数据" popupWidth="800px">
            </popupSelect>
          </el-form-item>
        </el-col> -->
        <el-col :span="12">
          <el-form-item label="有效" prop="isActive">
            <el-switch v-model="dataForm.isActive" :active-value="1" :inactive-value="0">
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否控制器" prop="isController">
            <el-switch v-model="dataForm.isController" :active-value="1" :inactive-value="0">
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="控制器类型" prop="controllerType">
            <el-input v-model="dataForm.controllerType" placeholder="请输入" clearable required :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="是否为独立线程" prop="isAlone">
            <el-switch v-model="dataForm.isAlone" :active-value="1" :inactive-value="0">
            </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="同线程" prop="threadGroup">
            <el-input v-model="dataForm.threadGroup" placeholder="请输入" clearable :style="{ width: '100%' }">
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="descrip">
            <el-input v-model="dataForm.descrip" placeholder="请输入" show-word-limit :style="{ width: '100%' }"
              type="textarea" :autosize="{ minRows: 4, maxRows: 4 }">
            </el-input>
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" v-if="!isDetail" :loading="btnLoading">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
  import request from "@/utils/request";
  import {
    getDictionaryDataSelector
  } from "@/api/systemData/dictionary";
  import {
    getDataInterfaceRes
  } from "@/api/systemData/dataInterface";
  export default {
    components: {},
    props: [],
    data() {
      var checkdeviceId = (rule, value, callback) => {
        if (!value) {
          callback(new Error("请输入设备编号"));
        } else if (!this.dataForm.DeviceId) {
          request({
            url: `/api/wms/ZjnWcsWorkDevice/ExistDeviceId`,
            method: "GET",
            data: {
              DeviceId: value
            },
          }).then((res) => {
            if (res.data) {
              callback(new Error("设备编号已存在！"));
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
          DeviceId: "",
          deviceId: undefined,
          caption: undefined,
          deviceType: undefined,
          region: undefined,
          isActive: 0,
          isController: 0,
          controllerType: undefined,
          isAlone: 0,
          threadGroup: undefined,
          descrip: undefined,
          plcID: undefined,
        },
        rules: {
          deviceId: [{
            required: true,
            // message:'请输入设备编号',
            trigger: "blur",
            validator: checkdeviceId,
          }, ],
          caption: [{
            required: true,
            message: "请输入设备名称",
            trigger: "blur",
          }, ],
          deviceType: [{
            required: true,
            message: "请输入设备类型",
            trigger: "change",
          }, ],
          region: [{
            required: true,
            message: "请输入区域类型",
            trigger: "change",
          }, ],
          controllerType: [{
            required: true,
            message: "请输入控制器类型",
            trigger: "blur",
          }, ],
        },
        deviceTypeOptions: [],
        regionOptions: [],
        PlcIDOptions: [{
            value: "PlcID",
            label: "plc编号"
          },
          {
            value: "Caption",
            label: "plc名称"
          },
          {
            value: "Region",
            label: "区域"
          },
          {
            value: "IsConnected",
            label: "连接状态"
          },
          {
            value: "CpuType",
            label: "类型;1500;1200"
          },
          {
            value: "IP",
            label: "IP"
          },
          {
            value: "Port",
            label: "Port"
          },
          {
            value: "Rack",
            label: "Plc Rack"
          },
          {
            value: "Sock",
            label: "Plc Sock"
          },
        ],
      };
    },
    computed: {},
    watch: {},
    created() {
      this.getdeviceTypeOptions();
      this.getregionOptions();
    },
    mounted() {},
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
      goBack() {
        this.$emit("refresh");
      },
      init(DeviceID, isDetail) {

        this.dataForm.DeviceId = DeviceID || 0;
        this.dataForm.deviceId = DeviceID ;

        this.visible = true;
        this.isDetail = isDetail || false;
        this.$nextTick(() => {
          this.$refs["elForm"].resetFields();
          if (this.dataForm.DeviceId) {
            request({
              url: "/api/wms/ZjnWcsWorkDevice/" + this.dataForm.DeviceId,
              method: "get",
            }).then((res) => {
              this.dataForm = res.data;
              this.dataForm.DeviceId=this.dataForm.deviceId;
            });
          }
        });
        this.$store.commit("generator/UPDATE_RELATION_DATA", {});
      },
      dataFormSubmit() {
        this.$refs["elForm"].validate((valid) => {
          if (valid) {
            this.btnLoading = true;
            if (!this.dataForm.DeviceId) {
              request({
                url: `/api/wms/ZjnWcsWorkDevice`,
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
                url: "/api/wms/ZjnWcsWorkDevice/" + this.dataForm.deviceId,
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
