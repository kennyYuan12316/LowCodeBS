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
          <el-form-item label="站点编号" prop="stationId">
            <el-input
              v-model="dataForm.stationId"
              :disabled="this.dataForm.id"
              placeholder="请输入站点编号"
              clearable
              required
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="名称" prop="capion">
            <el-input
              v-model="dataForm.capion"
              placeholder="请输入名称"
              clearable
              required
              :style="{ width: '100%' }"
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="设备编号" prop="deviceId">
            <popupSelect
              v-model="dataForm.deviceId"
              field="deviceId"
              placeholder="请选择设备编号"
              clearable
              required
              relationField="id"
              :columnOptions="deviceIdOptions"
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
          <el-form-item label="站点类别" prop="stationType">
            <el-select
              v-model="dataForm.stationType"
              placeholder="请选择站点类别"
              clearable
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in stationTypeOptions"
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
        <el-col :span="12">
          <el-form-item label="行" prop="row">
            <el-input-number v-model="dataForm.row" placeholder="行" :required="isRCL" :step="1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="行2" prop="row2">
            <el-input-number v-model="dataForm.row2" placeholder="行2" :step="1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="列" prop="cell">
            <el-input-number v-model="dataForm.cell" placeholder="列" :required="isRCL" :step="1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="列2" prop="cell2">
            <el-input-number v-model="dataForm.cell2" placeholder="列2" :step="1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="层" prop="layer">
            <el-input-number v-model="dataForm.layer" placeholder="层" :required="isRCL" :step="1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="层2" prop="layer2">
            <el-input-number v-model="dataForm.layer2" placeholder="层2" :required="isRCL" :step="1" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="有效" prop="isActive">
            <el-switch v-model="dataForm.isActive"> </el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="descrip">
            <el-input
              v-model="dataForm.descrip"
              placeholder="请输入描述"
              show-word-limit
              :style="{ width: '100%' }"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 4 }"
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
    var checkstationId = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入站点编号"));
      } else if(!this.dataForm.id) {

          request({
            url: `/api/wms/ZjnWcsWorkSite/ExistStationId`,
            method: "GET",
            data: { StationId: value },
          }).then((res) => {
            if (res.data) {
              callback(new Error("站点编号已存在！"));
            } else {
              callback();
            }
          });     
      }
	  else {
          callback();
        }
    };
    // 验证行列层的函数
    let validateRCL = (rule, value, callback) => {
      // 当活动名称为空值且为必填时，抛出错误，反之通过校验
      if (this.isRCL && !value) {
        callback(new Error('请输入行列层'))
      } else {
        callback()
      }
    }
    return {
      btnLoading: false,
      loading: false,
      visible: false,
      isDetail: false,
      isStationType:['2','3','4','5','6','7'],
      dataForm: {
        id: "",
        stationId: undefined,
        capion: undefined,
        deviceId: undefined,
        stationType: undefined,
        region: undefined,
        isActive: 0,
        descrip: undefined,
        row:undefined,
        cell:undefined,
        layer:undefined,
        row2:undefined,
        cell2:undefined,
        layer2:undefined,
      },
      rules: {
        stationId: [
          {
            required: true,
            // message:'请输入站点编号',
            trigger: "blur",
            validator: checkstationId,
          },
        ],
        capion: [
          {
            required: true,
            message: "请输入名称",
            trigger: "blur",
          },
        ],
        deviceId: [
          {
            required: true,
            message: "请输入设备编号",
            trigger: "change",
          },
        ],
        row: [{ type: 'number', required: this.isRCL,validator: validateRCL }],
        cell: [{ type: 'number', required: this.isRCL,validator: validateRCL }],
        layer: [{ type: 'number', required: this.isRCL,validator: validateRCL }],
      },
      deviceIdOptions: [
        { value: "id", label: "设备编号" },
        { value: "fullName", label: "设备名称" },
      ],
      stationTypeOptions: [],
      regionOptions: [],
    };
  },
  computed: {
    isRCL:function(){
      return this.isStationType.includes(this.dataForm.stationType)
    }
  },
  watch: {},
  created() {
    this.getstationTypeOptions();
    this.getregionOptions();
  },
  mounted() {},
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
            url: "/api/wms/ZjnWcsWorkSite/" + this.dataForm.id,
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
              url: `/api/wms/ZjnWcsWorkSite`,
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
              url: "/api/wms/ZjnWcsWorkSite/" + this.dataForm.id,
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
