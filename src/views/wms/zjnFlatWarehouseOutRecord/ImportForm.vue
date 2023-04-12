<template>
  <el-dialog
    title="批量导入"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="HSZ-dialog HSZ-dialog_center HSZ-dialog-import"
    lock-scroll
    width="1000px"
  >
    <el-steps :active="active" align-center>
      <el-step title="上传文件" />
      <el-step title="数据预览" />
      <el-step title="导入数据" />
    </el-steps>
    <div v-show="active==1" class="import-main">
      <div class="upload">
        <div class="up_left">
          <img src="@/assets/images/import.png">
        </div>
        <div class="up_right">
          <p class="title">填写导入数据信息</p>
          <p class="tip">请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除</p>
          <el-button type="text" @click="templateDownload">下载模板</el-button>
        </div>
      </div>

      <div class="upload">
        <div class="up_left">
          <img src="@/assets/images/upload.png">
        </div>
        <div class="up_right">
          <p class="title">上传填好的数据表</p>
          <p class="tip">文件后缀名必须是xls或xlsx，文件大小不超过500KB，最多支持导入1000条数据</p>
          <el-upload
            :action="define.comUrl+'/api/permission/Users/Uploader'"
            :headers="{ Authorization: $store.getters.token}"
            :on-success="handleSuccess"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-change="handleChange"
            :file-list="fileList"
            accept=".xls,.xlsx"
            :before-upload="beforeUpload"
            class="upload-area"
          >
            <el-button type="text">上传文件</el-button>
          </el-upload>
        </div>
      </div>
    </div>
    <div v-show="active==2" class="import-main">
      <HSZ-table v-loading="listLoading" :data="list">
        <el-table-column prop="PurchaseOrder" label="单据编号">
          <template slot-scope="scope">
            <el-input v-model="scope.row.PurchaseOrder" />
          </template>
        </el-table-column>
        <el-table-column prop="OrderNo" label="流水号">
          <template slot-scope="scope">
            <el-input v-model="scope.row.OrderNo" />
          </template>
        </el-table-column>
        <el-table-column prop="ProductsTotal" label="物料数量">
          <template slot-scope="scope">
            <el-input v-model="scope.row.ProductsTotal" />
          </template>
        </el-table-column>
        <el-table-column prop="ProductsLocation" label="物料货位">
          <template slot-scope="scope">
            <el-input v-model="scope.row.ProductsLocation" />
          </template>
        </el-table-column>
        <el-table-column prop="OrderType" label="单据类型">
          <template slot-scope="scope">
            <el-input v-model="scope.row.OrderType" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="50">
          <template slot-scope="scope">
            <el-button size="mini" type="text" class="HSZ-table-delBtn" @click="handleDel(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </HSZ-table>
    </div>
    <div v-show="active==3" class="import-main">
      <div v-if="!result.resultType" class="success">
        <img src="@/assets/images/success.png" alt="">
        <p class="success-title">批量导入成功</p>
        <p class="success-tip">您已成功导入{{ result.snum }}条数据</p>
      </div>
      <div v-if="result.resultType" class="unsuccess">
        <el-alert title="错误提醒：导入失败数据展示" type="warning" show-icon :closable="false" />
        <div class="upload error-show">
          <div class="up_left">
            <img class="" src="@/assets/images/tip.png">
          </div>
          <div class="up_right">
            <p class="tip">正常数量条数：<el-link type="success" :underline="false">{{ result.snum }}条
            </el-link>
            </p>
            <p class="tip">异常数量条数：<el-link type="danger" :underline="false">{{ result.fnum }}条
            </el-link>
            </p>
          </div>
        </div>
        <div class="contips">
          <p>以下文件数据为导入异常数据</p>
          <el-button type="text" icon="el-icon-upload2" @click="exportExceptionData">导出异常数据
          </el-button>
        </div>
        <HSZ-table :data="resultList" height="280px">
          <el-table-column prop="PurchaseOrder" label="单据编号" />
          <el-table-column prop="OrderNo" label="流水号" />
          <el-table-column prop="ProductsTotal" label="物料数量" />
          <el-table-column prop="ProductsLocation" label="物料货位" />
          <el-table-column prop="OrderType" label="单据类型"/>
        </HSZ-table>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="active == 1" @click="cancel()">取 消</el-button>
      <el-button v-if="active == 2" @click="prev">上一步</el-button>
      <el-button
        v-if="active < 3"
        type="primary"
        :loading="btnLoading"
        :disabled="active == 1 && !fileName"
        @click="next"
      >下一步
      </el-button>
      <el-button v-else type="primary" @click="cancel(true)">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
export default {
  data() {
    return {
      visible: false,
      btnLoading: false,
      listLoading: false,
      fileName: '',
      fileList: [],
      active: 1,
      list: [],
      resultList: [],
      result: {
        resultType: 0,
        snum: 0,
        fnum: 0
      }
    }
  },
  methods: {
    prev() {
      if (this.active == 1) return
      this.active--
    },
    next() {
      if (this.active == 2) {
        if (!this.list.length) {
          return this.$message({
            message: '导入数据为空',
            type: 'warning'
          })
        }
        this.btnLoading = true
        // 开始导入
        const datas = { list: this.list }
        console.log(datas)
        request({
          url: `/api/wms/ZjnBillsHistory/RawMaterialOutData`,
          method: 'POST',
          data: this.list
        }).then(res => {
          this.result = res.data
          this.resultList = res.data.failResult
          this.btnLoading = false
          this.active++
        }).catch(() => {
          this.btnLoading = false
        })
      }
      if (this.active == 1) {
        if (!this.fileList.length || !this.fileName) {
          return this.$message({
            message: '请先上传文件',
            type: 'warning'
          })
        }
        this.btnLoading = true
        const datas = { fileName: this.fileName }
        request({
          url: `/api/wms/ZjnBillsHistory/ImportPreviewYulan`,
          method: 'GET',
          data: datas
        }).then(res => {
          if (res.data.dataRow.length > 0 && res.data.dataRow[0].OrderNo == 'xxxxx-0') {
            res.data.dataRow.splice(0, 1)
          }
          this.list = res.data.dataRow
          this.btnLoading = false
          this.active++
        }).catch(() => {
          this.btnLoading = false
        })
      }
    },
    cancel(isRefresh) {
      this.visible = false
      if (isRefresh) this.$emit('refresh')
    },
    init() {
      this.active = 1
      this.fileList = []
      this.fileName = ''
      this.visible = true
    },
    handleDel(index) {
      this.list.splice(index, 1)
    },
    templateDownload() {
      const query = {
        fileName: '原材料出库记录模板'
      }
      request({
        url: `/api/wms/ZjnBillsHistory/TheRawMateri`,
        method: 'GET',
        data: query
      }).then(res => {
        this.hsz.downloadFile(res.data.url)
      })
    },
    exportExceptionData() {
      const query = {
        list: this.resultList,
        fileName: '原材料出库错误记录模板'
      }
      // 导出错误信息
      request({
        url: `/api/wms/ZjnBillsHistory/ExportExceptionwuhData`,
        method: 'POST',
        data: this.resultList
      }).then(res => {
        this.hsz.downloadFile(res.data.url)
      }).catch(() => {

      })
    },
    beforeUpload(file) {
      const isRightSize = file.size / 1024 < 500
      if (!isRightSize) this.$message.error(`文件大小不能超过500KB`)
      return isRightSize
    },
    handleRemove(file, fileList) {
      this.fileList = []
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`).catch(() => {})
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    handleSuccess(res, file, fileList) {
      if (res.code == 200) {
        this.fileList = fileList.slice(-1)
        this.fileName = res.data.name
      } else {
        this.fileList = fileList.filter(o => o.uid != file.uid)
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
      }
    }
  }
}
</script>
