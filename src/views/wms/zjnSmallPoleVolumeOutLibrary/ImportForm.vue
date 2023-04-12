<template>
  <el-dialog title="批量导入" :close-on-click-modal="false" :visible.sync="visible"
    class="HSZ-dialog HSZ-dialog_center HSZ-dialog-import" lock-scroll width="1000px">
    <el-steps :active="active" align-center>
      <el-step title="上传文件"></el-step>
      <el-step title="数据预览"></el-step>
      <el-step title="导入数据"></el-step>
    </el-steps>
    <div class="import-main" v-show="active==1">
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
          <el-upload :action="define.comUrl+'/api/permission/Users/Uploader'"
            :headers="{ Authorization: $store.getters.token}" :on-success="handleSuccess" :on-remove="handleRemove"
            :before-remove="beforeRemove" :on-change="handleChange" :file-list="fileList" accept=".xls,.xlsx"
            :before-upload="beforeUpload" class="upload-area">
            <el-button type="text">上传文件</el-button>
          </el-upload>
        </div>
      </div>
    </div>
    <div class="import-main" v-show="active==2">
      <HSZ-table v-loading="listLoading" :data="list">
        <el-table-column prop="OrderNo" label="流水号" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.OrderNo" />
          </template>
        </el-table-column>
        <el-table-column prop="OrderType" label="单据类型" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.OrderType" />
          </template>
        </el-table-column>
        <el-table-column prop="ProductsNo" label="物料Id" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.ProductsNo" />
          </template>
        </el-table-column>
        <el-table-column prop="ProductsName" label="物料名称" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.ProductsName" />
          </template>
        </el-table-column>

        <el-table-column prop="ProductsType" label="物料类型" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.ProductsType" />
          </template>
        </el-table-column>
        <el-table-column prop="ProductsStyle" label="物料规格" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.ProductsStyle" />
          </template>
        </el-table-column>
        <el-table-column prop="ProductsTotal" label="物料数量" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.ProductsTotal" />
          </template>
        </el-table-column>
        <el-table-column prop="ProductsUnit" label="物料单位" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.ProductsUnit" />
          </template>
        </el-table-column>

         <el-table-column prop="ProductsGrade" label="物料等级" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.ProductsGrade" />
          </template>
        </el-table-column>
        <el-table-column prop="ProductsBach" label="物料批次" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.ProductsBach" />
          </template>
        </el-table-column>
        <el-table-column prop="ProductsUser" label="客户" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.ProductsUser" />
          </template>
        </el-table-column>
        <el-table-column prop="ProductsSupplier" label="供应商" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.ProductsSupplier" />
          </template>
        </el-table-column>

        <el-table-column prop="ProductsLocation" label="物料货位" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.ProductsUser" />
          </template>
        </el-table-column>
        <el-table-column prop="Case3" label="托盘号" >
          <template slot-scope="scope">
            <el-input v-model="scope.row.Case3" />
          </template>
        </el-table-column>

        <el-table-column label="操作" width="50">
          <template slot-scope="scope">
            <el-button size="mini" type="text" class="HSZ-table-delBtn" @click="handleDel(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </HSZ-table>
    </div>
    <div class="import-main" v-show="active==3">
      <div class="success" v-if="!result.resultType">
        <img src="@/assets/images/success.png" alt="">
        <p class="success-title">批量导入成功</p>
        <p class="success-tip">您已成功导入{{result.snum}}条数据</p>
      </div>
      <div class="unsuccess" v-if="result.resultType">
        <el-alert title="错误提醒：导入失败数据展示" type="warning" show-icon :closable="false" />
        <div class="upload error-show">
          <div class="up_left">
            <img class="" src="@/assets/images/tip.png">
          </div>
          <div class="up_right">
            <p class="tip">正常数量条数：<el-link type="success" :underline="false">{{result.snum}}条
              </el-link>
            </p>
            <p class="tip">异常数量条数：<el-link type="danger" :underline="false">{{result.fnum}}条
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
          <el-table-column prop="OrderNo" label="流水号"/>
          <el-table-column prop="OrderType" label="单据类型" />
          <el-table-column prop="ProductsNo" label="物料Id"/>
          <el-table-column prop="ProductsName" label="物料名称" />
          <el-table-column prop="ProductsType" label="物料类型"/>
          <el-table-column prop="ProductsStyle" label="物料规格" />
          <el-table-column prop="ProductsTotal" label="物料数量"/>
          <el-table-column prop="ProductsUnit" label="物料单位" />
          <el-table-column prop="ProductsGrade" label="物料等级"/>
          <el-table-column prop="ProductsBach" label="物料批次" />
          <el-table-column prop="ProductsUser" label="客户"/>
          <el-table-column prop="ProductsSupplier" label="供应商" />
          <el-table-column prop="ProductsLocation" label="物料货位"/>
          <el-table-column prop="Case3" label="托盘号" />
          
        </HSZ-table>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel()" v-if="active == 1">取 消</el-button>
      <el-button @click="prev" v-if="active == 2">上一步</el-button>
      <el-button @click="next" type="primary" v-if="active < 3" :loading="btnLoading"
        :disabled="active == 1 && !fileName">下一步
      </el-button>
      <el-button @click="cancel(true)" type="primary" v-else>关 闭</el-button>
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
          if (!this.list.length) return this.$message({
            message: '导入数据为空',
            type: 'warning'
          })
          this.btnLoading = true
          //开始导入
          let datas ={ list: this.list };
          console.log(datas)
          request({
            url: `/api/wms/ZjnBillsHistory/ImportData`,
            method: 'POST',
            data: this.list
          }).then(res => {
            this.result = res.data
            this.resultList = res.data.failResult
            this.btnLoading = false
            this.active++
          }).catch(() => {
            this.btnLoading = false
          });
        }
        if (this.active == 1) {
          if (!this.fileList.length || !this.fileName) return this.$message({
            message: '请先上传文件',
            type: 'warning'
          })
          this.btnLoading = true
          let datas = {fileName: this.fileName};
          request({
            url: `/api/wms/ZjnBillsHistory/ImportPreview`,
            method: 'GET',
            data: datas
          }).then(res => {
            this.list = res.data.dataRow
            this.btnLoading = false
            this.active++
          }).catch(() => {
            this.btnLoading = false
          });
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
        let query = {          
          fileName:"小极卷出库库记录模板"
        }
        request({
          url: `/api/wms/ZjnBillsHistory/TheRawMaterial`,
          method: 'GET',
          data: query
        }).then(res => {
          this.hsz.downloadFile(res.data.url)
        })

      },
      exportExceptionData() {
        let query = {   
          list: this.resultList,      
          fileName:"小极卷库出库记录失败记录"
        }
        //导出错误信息
        request({
          url: `/api/wms/ZjnBillsHistory/ExportExceptionData`,
          method: 'POST',
          data: this.resultList
        }).then(res => {
          this.hsz.downloadFile(res.data.url)
        }).catch(() => {

        });

      },
      beforeUpload(file) {
        let isRightSize = file.size / 1024 < 500
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
