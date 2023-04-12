<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <WmsTask ref="processDesign"
                 :conf="flowTemplateJson"
                 @startNodeChange="onStartChange"
                 :flowType="dataForm.type" />
    </div>
  </div>
</template>
<script>
  import WmsTask from "@/components/WmsTask"

import request from "@/utils/request";
import { getDictionaryDataSelector } from "@/api/systemData/dictionary";
import { getDataInterfaceRes } from "@/api/systemData/dataInterface";
export default {
  components: { WmsTask },
  data() {
    return {
      query: {
        StationID: undefined,
        Capion: undefined,
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
      dataForm: {
        flowTemplateJson: '',
        type: 0,
        id:undefined,
      },
      formVisible: false,
      exportBoxVisible: false,
      columnList: [
        { prop: "StationID", label: "站点编号" },
        { prop: "Capion", label: "名称" },
        { prop: "DeviceName", label: "设备编号" },
        { prop: "StationType", label: "站点类别" },
        { prop: "Region", label: "区域" },
        { prop: "IsActive", label: "有效" },
        { prop: "Descrip", label: "描述" },
        ,
        {
          prop: "F_CreateUser",
          label: "创建者",
        },
        {
          prop: "F_CreateTime",
          label: "创建时间",
        },
        {
          prop: "F_ModifiedUser",
          label: "最后修改者",
        },
        {
          prop: "F_ModifiedTime",
          label: "最后修改时间",
        },
      ],
      stationTypeOptions: [],
      regionOptions: [],
    };
  },
  computed: {},
  created() {
    // this.initData();
    // this.getstationTypeOptions();
    // this.getregionOptions();
    init();
  },
  methods: {
    onStartChange (node) {
      console.log(node);
    },
    init(){
      this.$refs['processDesign'].getData().then(res => {
        this.btnLoading = true
        this.flowTemplateJson = res.formData
        this.dataForm.flowTemplateJson = JSON.stringify(this.flowTemplateJson)
        // this.dataForm.formData = JSON.stringify(this.formData)
        // this.dataForm.tables = JSON.stringify(this.tables)
        const formMethod = this.dataForm.id ? Update : Create
        formMethod(this.dataForm).then((res) => {
          this.$message({
            message: res.msg,
            type: 'success',
            duration: 1500,
            onClose: () => {
              this.btnLoading = false
              this.closeDialog(true)
            }
          })
        }).catch(() => { this.btnLoading = false })
      }).catch(err => {
        err.msg && this.$message.warning(err.msg)
      })
    },


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
        url: `/api/wms/ZjnWcsWorkSite`,
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
            url: `/api/wms/ZjnWcsWorkSite/${id}`,
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
  },
};
</script>