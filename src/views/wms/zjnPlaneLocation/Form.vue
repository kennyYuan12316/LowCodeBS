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
          <el-form-item label-width="0">
            <HSZ-Text
              value="货位信息"
              :text-style="{
                color: '#000000',
                'text-align': 'center',
                'font-weight': 'bold',
                'font-style': 'normal',
                'text-decoration': 'none',
                'line-height': 32,
                'font-size': 32,
              }"
              :style="{ width: '100%' }"
            />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="货位编号" prop="locationNo">
            <el-input
              v-model="dataForm.locationNo"
              placeholder="请输入"
              :disabled="dataForm.id"
              clearable
              required
              :style="{ width: '100%' }"
            />
          </el-form-item>
        </el-col>
        <!-- <el-col :span="6">
						<el-form-item label="自动编号" prop="t1">
							<el-checkbox-group v-model='dataForm.t1' :style='{}' >
								<el-checkbox v-for="(item, index) in t1Options" :key="index" :label="item.id" >{{item.fullName}}</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-col> -->
        <el-col :span="24">
          <el-form-item label="所属库位" prop="ByWarehouse">
            <el-select
              v-model="dataForm.ByWarehouse"
              placeholder="请选择"
              clearable
              required
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in byWarehouseOptions"
                :key="index"
                :label="item.WarehouseName"
                :value="item.WarehouseNo"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="货位状态" prop="locationStatus">
            <el-select
              v-model="dataForm.locationStatus"
              placeholder="请选择"
              clearable
              required
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in locationStatusOptions"
                :key="index"
                :label="item.fullName"
                :value="item.enCode"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="有效标志" prop="enabledMark">
            <!-- <el-switch v-model='dataForm.enabledMark' required :active-value='1' :inactive-value='0'>
            </el-switch> -->
            <el-radio-group v-model="dataForm.enabledMark" :style="{}">
              <el-radio
                v-for="(item, index) in enabledMarkOptions"
                :key="index"
                :label="item.id"
              >{{ item.fullName }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="描述" prop="description">
            <el-input
              v-model="dataForm.description"
              placeholder="请输入"
              show-word-limit
              :style="{ width: '100%' }"
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 4 }"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="false" :span="24">
          <el-form-item label="创建者" prop="createUser">
            <el-input
              v-model="dataForm.createUser"
              placeholder="系统自动生成"
              readonly
            />
          </el-form-item>
        </el-col>
        <el-col v-if="false" :span="24">
          <el-form-item label="创建时间" prop="createTime">
            <el-input
              v-model="dataForm.createTime"
              placeholder="系统自动生成"
              readonly
            />
          </el-form-item>
        </el-col>
      </el-form>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button
        v-if="!isDetail"
        type="primary"
        :loading="btnLoading"
        @click="dataFormSubmit()"
      >确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import request from '@/utils/request'
export default {
  components: {},
  props: [],
  data() {
    var checklocationNo = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入货位编号'))
      } else {
        if (!this.dataForm.id) {
          request({
            url: `/api/wms/ZjnPlaneLocation/ExistLocationNo`,
            method: 'GET',
            data: { LocationNo: value }
          }).then((res) => {
            if (res.data) {
              callback(new Error('货位编号已存在！'))
            } else {
              callback()
            }
          })
        } else {
          callback()
        }
      }
    }
    return {
      btnLoading: false,
      loading: false,
      visible: false,
      isDetail: false,
      dataForm: {
        id: '',
        locationNo: undefined,
        locationStatus: '0',
        ByWarehouse: undefined,
        enabledMark: '1',
        TrayNo: '',
        description: undefined,
        createUser: undefined,
        createTime: undefined
      },
      rules: {
        locationNo: [
          {
            required: true,
            // message: '请输入货位编号',
            trigger: 'blur',
            validator: checklocationNo
          }
        ],
        ByWarehouse: [
          {
            required: true,
            message: '请选择所属库位',
            trigger: 'blur'
          }
        ],
        locationStatus: [
          {
            required: true,
            message: '请选择货位状态',
            trigger: 'blur'
          }
        ],
        enabledMark: [
          {
            required: true,
            message: '请输入有效标志',
            trigger: 'change'
          }
        ]
      },
      t1Options: [
        {
          fullName: '',
          id: ''
        }
      ],
      byWarehouseOptions: [], // 所属仓库列表
      locationStatusOptions: [], // 货位状态列表
      enabledMarkOptions: [
        { fullName: '启用', id: '1' },
        { fullName: '禁用', id: '0' }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    goBack() {
      this.$emit('refresh')
    },
    init(id, isDetail) {
      // 获取所属仓库列表
      request({
        url: '/api/wms/ZjnWmsWarehouse/GetHouseListToBox',
        method: 'get'
      }).then((res) => {
        this.byWarehouseOptions = res.data
      })

      // 获取货位状态的数据字典 id : 326208333797131525
      request({
        url: '/api/system/DictionaryData/326208333797131525',
        method: 'get'
      }).then((res) => {
        this.locationStatusOptions = res.data.list
        // console.log(this.locationStatusOptions);
      })

      this.dataForm.id = id || 0
      this.visible = true
      this.isDetail = isDetail || false
      this.$nextTick(() => {
        this.$refs['elForm'].resetFields()
        if (this.dataForm.id) {
          request({
            url: '/api/wms/ZjnPlaneLocation/' + this.dataForm.id,
            method: 'get'
          }).then((res) => {
            res.data.enabledMark = res.data.enabledMark.toString()
            this.dataForm = res.data
          })
        }
      })
      this.$store.commit('generator/UPDATE_RELATION_DATA', {})
    },
    dataFormSubmit() {
      this.$refs['elForm'].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          if (!this.dataForm.id) {
            request({
              url: `/api/wms/ZjnPlaneLocation`,
              method: 'post',
              data: this.dataForm
            }).then((res) => {
              this.$message({
                message: res.msg,
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.btnLoading = false;
                  (this.visible = false), this.$emit('refresh', true)
                }
              })
            })
          } else {
            request({
              url: '/api/wms/ZjnPlaneLocation/' + this.dataForm.id,
              method: 'PUT',
              data: this.dataForm
            }).then((res) => {
              this.$message({
                message: res.msg,
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.btnLoading = false
                  this.visible = false
                  this.$emit('refresh', true)
                }
              })
            })
          }
        }
      })
    }
    // 数据过滤
    // filters(type) {
    // 	console.log("type:",type)
    // 	let item = this.menuItemName.filter(i => i.F_ItemValue === type);
    // 	return item[0].F_ItemName;
    // },
  }
}
</script>
