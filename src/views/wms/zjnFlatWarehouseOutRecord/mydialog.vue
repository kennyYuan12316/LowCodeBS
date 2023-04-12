<template>
    <div class="options">
        <el-button type="primary" size="small" @click="closeDialog">取消</el-button>
        <el-button type="primary" size="small" @click="saveDialog">保存</el-button>
        <HSZ-table v-loading="listLoading" :data="list" has-c @selection-change="handleSelectionChange">
            <el-table-column prop="F_PurchaseOrder" label="单据号" align="left" width="120" />
            <el-table-column prop="F_OrderNo" label="32位流水号" align="left" width="250" />
        </HSZ-table>
        <pagination :total="total" :page.sync="listQuery.currentPage" :limit.sync="listQuery.pageSize"
            @pagination="initData" />
    </div>
</template>
<script>
import request from '@/utils/request'
export default {
    created() {
        this.initData();
    },
    methods: {
        handleSelectionChange(val) {
            const res = val.map(item => item.F_Id)
            this.multipleSelection = res
        },
        closeDialog(entity) {
            this.$emit('close', entity);
        },
        saveDialog() {
            if (!this.multipleSelection.length) {
                this.$message({
                    type: 'error',
                    message: '请选择一条数据',
                    duration: 1500,
                })
                return
            }
            const ids = this.multipleSelection
            
            this.closeDialog(ids);
        },
        initData(ProductsCode) {
            alert(ProductsCode);
            this.listLoading = true;
            let _query = {
                ...this.listQuery,
                ...this.query
            };
            let query = {}
            for (let key in _query) {
                if (Array.isArray(_query[key])) {
                    query[key] = _query[key].join()
                } else {
                    query[key] = _query[key]
                }
            }
            
            request({
                url: `/api/wms/ZjnBillsHistory/EntiyList`,
                method: 'GET',
                data: ProductsCode
            }).then(res => {
                this.list = res.data.list
                
                this.listLoading = false
            })
        },
    },
    data() {
        return {
            listLoading: true,
            list: [],
            total: 0,
            listQuery: {
                currentPage: 1,
                pageSize: 50,
                sort: "desc",
                sidx: "",
            },
           
        }
    }
}
</script>