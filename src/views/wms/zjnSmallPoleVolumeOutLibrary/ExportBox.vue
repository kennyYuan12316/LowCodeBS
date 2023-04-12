<template>
  <el-dialog title="导出数据" :close-on-click-modal="false" :visible.sync="visible" class="HSZ-dialog HSZ-dialog_center"
    lock-scroll width="600px">
    <el-form label-position="top" label-width="80px">
      <el-form-item label="数据选择">
        <el-radio-group v-model="type">
          <el-radio :label="0">当前页面数据</el-radio>
          <el-radio :label="1">全部页面数据</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="导出字段">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="columns" @change="handleCheckedChange">
          <el-checkbox v-for="item in columnList" :label="item.prop" :key="item.prop">
            {{item.label}}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible=false">取 消</el-button>
      <el-button type="primary" @click="downLoad">导 出</el-button>
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
        type: 0,
        columns: [],
        checkAll: true,
        isIndeterminate: false,
         columnList: [{
            prop: 'F_OrderNo',
            label: '32位流水号'
          },
          {
            prop: 'F_OrderType',
            label: '单据类型'
          },
          
          {
            prop: 'F_ProductsName',
            label: '物料名称'
          },
          {
            prop: 'F_ProductsStyle',
            label: '物料规格'
          },
          {
            prop: 'F_ProductsType',
            label: '物料类型'
          },
           {
            prop: 'F_ProductsLocation',
            label: '物料货位'
          },

          {
            prop: 'F_ProductsTotal',
            label: '物料数量'
          },
          {
            prop: 'F_ProductsUnit',
            label: '物料单位'
          },
          {
            prop: 'F_ProductsGrade',
            label: '物料等级'
          },
          {
            prop: 'F_ProductsBach',
            label: '物料批次'
          },
          {
            prop: 'F_ProductsUser',
            label: '客户'
          },

          {
            prop: 'F_ProductsSupplier',
            label: '供应商'
          },          
          {
            prop: 'Case3',
            label: '托盘号'
          },          
          {
            prop: 'F_CreateUser',
            label: '创建人员'
          }
          ,          
          {
            prop: 'F_CreateTime',
            label: '创建时间'
          }
        ],
      }
    },
    methods: {
      init(columnList) {
        console.log(columnList)
        this.visible = true
        this.checkAll = true
        this.isIndeterminate = false
        // this.columnList = columnList
        this.columns = this.columnList.map(o => o.prop)
      },
      handleCheckAllChange(val) {
        this.columns = val ? this.columnList.map(o => o.prop) : [];
        this.isIndeterminate = false;
      },
      handleCheckedChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.columnList.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnList.length;
      },
      downLoad() {
        if (!this.columns.length) return this.$message.warning(`请至少选择一个导出字段`)
        this.btnLoading = true
        let query = {
          dataType: this.type,
          selectKey: this.columns.join(','),
          OrderTypes:"006",
          OrderTypeName:"小极卷库出库信息导出数据"
        }
        console.log(query)
        request({
          url: `/api/wms/ZjnBillsHistory/ExportExcel`,
          method: 'GET',
          data: query
        }).then(res => {
          this.btnLoading = false
          if (!res.data.url) return
          this.hsz.downloadFile(res.data.url)
          this.visible = false
        }).catch(() => {
          this.btnLoading = false
        });

      }
      // downLoad() {
      //   this.$emit('download', {
      //     dataType: this.type,
      //     selectKey: this.columns.join(',')
      //   })
      // }
    }
  }
</script>
<style lang="scss" scoped>
  >>>.el-dialog__body {
    padding: 20px !important;
  }
</style>
