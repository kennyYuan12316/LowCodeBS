<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center">
      <el-row class="HSZ-common-search-box"
              :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item label="关键词">
              <el-input v-model="keyword"
                        placeholder="请输入关键词查询"
                        clearable
                        @keyup.enter.native="initData()" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary"
                         icon="el-icon-search"
                         @click="initData()">
                {{$t('common.search')}}</el-button>
              <el-button icon="el-icon-refresh-right"
                         @click="reset()">{{$t('common.reset')}}
              </el-button>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
      <div class="HSZ-common-layout-main HSZ-flex-main">
        <el-tabs type="border-card"
                 v-model="activeTab"
                 class="documentPreview-tab">
          <el-tab-pane label="本地预览"
                       name="localPreview"></el-tab-pane>
          <el-tab-pane label="在线预览"
                       name="yozoOnlinePreview"></el-tab-pane>
          <div class="box">
            <el-alert title="本地预览支持doc/docx/xls/xlsx/ppt/pptx/pdf等办公文档。"
                      type="warning"
                      :closable="false"
                      v-if="activeTab==='localPreview'" />
            <el-alert title="免责声明：永中文档预览组件不属于合力泰产品，只用于介绍第三方组件如何在《合力泰HR适配器》中使用。"
                      type="warning"
                      :closable="false"
                      v-else />
            <HSZ-table v-loading="listLoading"
                       :data="list">
              <el-table-column label="文件名称">
                <template slot-scope="scope">
                  <el-link @click="readInfo(scope.row.fileId,scope.row.fileName)"
                           style="font-size:12px">
                    {{ scope.row.fileName }}
                  </el-link>
                </template>
              </el-table-column>
              <el-table-column prop="fileType"
                               label="文件类型"
                               width="130" />
              <el-table-column prop="fileSize"
                               label="文件大小"
                               width="130" />
            </HSZ-table>
          </div>
        </el-tabs>
      </div>
    </div>
    <Detail v-show="detailVisible"
            ref="detail"
            @close="detailVisible=false" />
  </div>
</template>

<script>
import { DocumentPreviewList } from '@/api/extend/documentPreview'
import Detail from './Detail'
export default {
  components: { Detail },
  name: 'extend-documentPreview',
  data () {
    return {
      activeTab: 'localPreview',
      detailVisible: false,
      keyword: '',
      list: [],
      listLoading: true,
      formVisible: false
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.listLoading = true
      let query = { keyword: this.keyword }
      DocumentPreviewList(query).then(res => {
        this.list = res.data
        this.listLoading = false
      })
    },
    readInfo (id, name) {
      this.detailVisible = true
      this.$nextTick(() => {
        this.$refs.detail.init(id, name, this.activeTab)
      })
    },
    reset () {
      this.keyword = ''
      this.initData()
    }
  }
}
</script>
<style lang="scss" scoped>
.HSZ-common-layout-main {
  padding: 0;
  .el-alert {
    margin: 10px 0;
  }
}
.documentPreview-tab {
  height: 100%;
  >>> .el-tabs__content {
    padding: 0;
    height: calc(100% - 40px);
    .box {
      flex: 1;
      height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      padding-bottom: 10px;
    }
  }
}
</style>