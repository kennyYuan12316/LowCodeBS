<template>
  <div class="app-container Document-container nohead">
    <el-tabs tab-position="left"
             style="height:100%"
             v-model="activeTab">
      <el-tab-pane name="allPanel">
        <span slot="label"><i class="icon-sz icon-sz-extend-folder-open"></i>全部文档</span>
        <div class="main HSZ-flex-main">
          <div class="HSZ-common-head">
            <el-breadcrumb>
              <el-breadcrumb-item v-if="levelList.length>1">
                <a @click="jump(levelList[levelList.length-2],levelList.length-2)">返回上一级</a>
              </el-breadcrumb-item>
              <el-breadcrumb-item v-for="(item,i) in levelList"
                                  :key="i">
                <span v-if="i+1>=levelList.length">{{item.fullName}}</span>
                <a v-else
                   @click="jump(item,i)">{{item.fullName}}</a>
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <el-row class="HSZ-common-search-box"
                  :gutter="16">
            <el-form @submit.native.prevent>
              <el-col :span="6">
                <el-form-item label="关键词">
                  <el-input v-model="keyword"
                            placeholder="请输入关键词查询"
                            clearable
                            @keyup.enter.native="search()" />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button type="primary"
                             icon="el-icon-search"
                             @click="search()">
                    {{$t('common.search')}}</el-button>
                  <el-button icon="el-icon-refresh-right"
                             @click="reset()">{{$t('common.reset')}}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
            <div class="HSZ-common-search-box-right">
              <el-button @click="addFolder()"
                         style="margin-right:10px">新建文件夹</el-button>
              <el-upload :action="uploadUrl"
                         :headers="uploadHeaders"
                         :on-success="handleSuccess"
                         :data='{parentId: parentId}'
                         multiple
                         :show-file-list="false"
                         class="upload-box"
                         :before-upload="beforeUpload">
                <el-button type="primary"
                           icon="el-icon-upload2"
                           :loading="receiveing">上传文件
                </el-button>
              </el-upload>
            </div>
          </el-row>
          <HSZ-table v-loading="listLoading"
                     :data="list"
                     empty-text="该文件夹为空"
                     size="mini">
            <el-table-column label="文件名">
              <template slot-scope="scope">
                <span v-if="scope.row.type">
                  <i :class='"icon-sz " + toFileExt(scope.row.fileExtension) + " i-default"' />
                  {{scope.row.fullName}}
                </span>
                <span class='cursor-pointer'
                      v-else
                      @click="openFolder(scope.row)">
                  <i class='icon-sz icon-sz-extend-folder text-warning' />
                  {{scope.row.fullName}}
                </span>
              </template>
            </el-table-column>
            <el-table-column label=""
                             width="35">
              <template slot-scope="scope">
                <span v-if="scope.row.type && scope.row.isShare"
                      title='共享文件'><i class="icon-sz icon-sz-extend-thumbs-up i-default"></i></span>
              </template>
            </el-table-column>
            <el-table-column prop="fileSize"
                             label="大小"
                             width="90">
              <template slot-scope="scope">{{scope.row.fileSize | toFileSize()}}</template>
            </el-table-column>
            <el-table-column prop="creatorTime"
                             label="创建日期"
                             :formatter="hsz.tableDateFormat"
                             width="120" />
            <el-table-column label="操作"
                             fixed="right"
                             width="150">
              <template slot-scope="scope">
                <el-button size="mini"
                           type="text"
                           @click="handleDownLoad(scope.row.id)"
                           :disabled="!scope.row.type">下载</el-button>
                <el-button size="mini"
                           type="text"
                           class="HSZ-table-delBtn"
                           @click="handleDel(scope.$index,scope.row.id)">删除</el-button>
                <el-dropdown>
                  <el-button type="text"
                             size="mini">
                    {{$t('common.moreBtn')}}<i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="shareFolder(scope.row.id)"
                                      v-if="scope.row.type">
                      共享
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="getFolder(scope.row.id)">重命名
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="moveTo(scope.row.id,scope.row.parentId)">
                      移动到
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </HSZ-table>
        </div>
      </el-tab-pane>
      <el-tab-pane name="shareoutPanel">
        <span slot="label"><i class="icon-sz icon-sz-extend-thumbs-up"></i>我的共享</span>
        <div class="main HSZ-flex-main">
          <div class="HSZ-common-head">
            <el-breadcrumb>
              <el-breadcrumb-item>我的共享</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <el-row class="HSZ-common-search-box"
                  :gutter="16">
            <el-form @submit.native.prevent>
              <el-col :span="6">
                <el-form-item label="文件名">
                  <el-input v-model="keyword"
                            placeholder="搜索我的文件"
                            clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button type="primary"
                             icon="el-icon-search"
                             @click="search()">
                    {{$t('common.search')}}</el-button>
                  <el-button icon="el-icon-refresh-right"
                             @click="reset()">{{$t('common.reset')}}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <HSZ-table v-loading="listLoading"
                     :data="list"
                     empty-text="该文件夹为空"
                     size="mini">
            <el-table-column label="文件名">
              <template slot-scope="scope">
                <i :class='"icon-sz " + toFileExt(scope.row.fileExtension) + " i-default"' />
                {{scope.row.fullName}}
              </template>
            </el-table-column>
            <el-table-column prop="fileSize"
                             label="大小"
                             width="90">
              <template slot-scope="scope">{{scope.row.fileSize | toFileSize()}}</template>
            </el-table-column>
            <el-table-column prop="shareTime"
                             label="共享日期"
                             :formatter="hsz.tableDateFormat"
                             width="120" />
            <el-table-column label="操作"
                             fixed="right"
                             width="70">
              <template slot-scope="scope">
                <el-button size="mini"
                           type="text"
                           class="HSZ-table-delBtn"
                           @click="unshare(scope.$index,scope.row.id)">取消共享</el-button>
              </template>
            </el-table-column>
          </HSZ-table>
        </div>
      </el-tab-pane>
      <el-tab-pane name="sharetomePanel">
        <span slot="label"><i class="icon-sz icon-sz-extend-share"></i>共享给我</span>
        <div class="main HSZ-flex-main">
          <div class="HSZ-common-head">
            <el-breadcrumb>
              <el-breadcrumb-item>共享给我</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <el-row class="HSZ-common-search-box"
                  :gutter="16">
            <el-form @submit.native.prevent>
              <el-col :span="6">
                <el-form-item label="文件名">
                  <el-input v-model="keyword"
                            placeholder="搜索我的文件"
                            clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button type="primary"
                             icon="el-icon-search"
                             @click="search()">
                    {{$t('common.search')}}</el-button>
                  <el-button icon="el-icon-refresh-right"
                             @click="reset()">{{$t('common.reset')}}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <HSZ-table v-loading="listLoading"
                     :data="list"
                     empty-text="该文件夹为空"
                     size="mini">
            <el-table-column label="文件名">
              <template slot-scope="scope">
                <i :class='"icon-sz " + toFileExt(scope.row.fileExtension) + " i-default"' />
                {{scope.row.fullName}}
              </template>
            </el-table-column>
            <el-table-column prop="fileSize"
                             label="大小"
                             width="90">
              <template slot-scope="scope">{{scope.row.fileSize | toFileSize()}}</template>
            </el-table-column>
            <el-table-column prop="shareTime"
                             label="共享日期"
                             :formatter="hsz.tableDateFormat"
                             width="120" />
            <el-table-column label="共享人员"
                             width="120"
                             prop="creatorUserId" />
            <el-table-column label="操作"
                             fixed="right"
                             width="50">
              <template slot-scope="scope">
                <el-button size="mini"
                           type="text"
                           @click="handleDownLoad(scope.row.id)">下载
                </el-button>
              </template>
            </el-table-column>
          </HSZ-table>
        </div>
      </el-tab-pane>
      <el-tab-pane name="trashPanel">
        <span slot="label"><i class="icon-sz icon-sz-extend-trash"></i>回收站</span>
        <div class="main HSZ-flex-main">
          <div class="HSZ-common-head">
            <el-breadcrumb>
              <el-breadcrumb-item>回收站</el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <el-row class="HSZ-common-search-box"
                  :gutter="16">
            <el-form @submit.native.prevent>
              <el-col :span="6">
                <el-form-item label="文件名">
                  <el-input v-model="keyword"
                            placeholder="搜索我的文件"
                            clearable />
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item>
                  <el-button type="primary"
                             icon="el-icon-search"
                             @click="search()">
                    {{$t('common.search')}}</el-button>
                  <el-button icon="el-icon-refresh-right"
                             @click="reset()">{{$t('common.reset')}}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
          <HSZ-table v-loading="listLoading"
                     :data="list"
                     empty-text="该文件夹为空"
                     size="mini">
            <el-table-column label="文件名">
              <template slot-scope="scope">
                <span v-if="scope.row.type">
                  <i :class='"icon-sz " + toFileExt(scope.row.fileExtension) + " i-default"' />
                  {{scope.row.fullName}}
                </span>
                <span v-else>
                  <i class='icon-sz icon-sz-extend-folder text-warning' />
                  {{scope.row.fullName}}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="fileSize"
                             label="大小"
                             width="90">
              <template slot-scope="scope">{{scope.row.fileSize | toFileSize()}}</template>
            </el-table-column>
            <el-table-column prop="deleteTime"
                             label="删除日期"
                             :formatter="hsz.tableDateFormat"
                             width="120" />
            <el-table-column label="操作"
                             fixed="right"
                             width="100">
              <template slot-scope="scope">
                <el-button size="mini"
                           type="text"
                           @click="recovery(scope.$index,scope.row.id)">
                  还原</el-button>
                <el-button size="mini"
                           type="text"
                           class="HSZ-table-delBtn"
                           @click="trashDel(scope.$index,scope.row.id)">删除</el-button>
              </template>
            </el-table-column>
          </HSZ-table>
        </div>
      </el-tab-pane>
    </el-tabs>
    <userBox v-if="userBoxVisible"
             ref="userBox"
             @refresh="initData" />
    <folderTree v-if="folderTreeVisible"
                ref="folderTree"
                @refresh="initData" />
  </div>

</template>

<script>
import { AllList, Create, Delete, Download, DocumentInfo, ShareCancel, ShareOutList, ShareTomeList, TrashDelete, TrashList, TrashRecovery, Update } from '@/api/extend/document'
import userBox from './UserBox'
import folderTree from './FolderTree'

export default {
  name: 'extend-document',
  components: { userBox, folderTree },
  data () {
    return {
      receiveing: false,
      userBoxVisible: false,
      folderTreeVisible: false,
      detailVisible: false,
      activeTab: 'allPanel',
      keyword: '',
      parentId: '0',
      listLoading: true,
      list: [],
      levelList: [{
        id: '0',
        fullName: '全部文档'
      }],
      uploadUrl: process.env.VUE_APP_BASE_API + '/api/extend/Document/Uploader',
      uploadHeaders: { Authorization: this.$store.getters.token }
    }
  },
  watch: {
    activeTab (val) {
      if (val === 'allPanel') {
        this.levelList = [{
          id: "0",
          fullName: '全部文档'
        }]
        this.parentId = "0"
      }
      this.reset()
    }
  },
  created () {
    this.initData()
  },
  methods: {
    reset () {
      this.list = []
      this.keyword = ''
      this.initData()
    },
    initData () {
      this.listLoading = true
      let data = { keyword: this.keyword }
      if (this.activeTab === 'allPanel') {
        data = { ...data, parentId: this.parentId }
        AllList(data).then(res => {
          this.list = res.data.list
          this.listLoading = false
        })
      }
      if (this.activeTab === 'shareoutPanel') {
        ShareOutList(data).then(res => {
          this.list = res.data.list
          this.listLoading = false
        })
      }
      if (this.activeTab === 'sharetomePanel') {
        ShareTomeList(data).then(res => {
          this.list = res.data.list
          this.listLoading = false
        })
      }
      if (this.activeTab === 'trashPanel') {
        TrashList(data).then(res => {
          this.list = res.data.list
          this.listLoading = false
        })
      }
    },
    search () {
      this.initData()
    },
    handleDel (index, id) {
      this.$confirm('您确定要把所选文件放入回收站, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        Delete(id).then(res => {
          this.list.splice(index, 1);
          this.$message({
            type: 'success',
            message: res.msg
          });
        })
      }).catch(() => { });
    },
    unshare (index, id) {
      this.$confirm('您确定要取消共享, 是否继续?', '提示', {
        type: 'warning'
      }).then(() => {
        ShareCancel(id).then(res => {
          this.list.splice(index, 1);
          this.$message({
            type: 'success',
            message: res.msg
          });
        })
      }).catch(() => { });
    },
    recovery (index, id) {
      this.$confirm('您确定要还原选中的文件?', '提示', {
        type: 'warning'
      }).then(() => {
        TrashRecovery(id).then(res => {
          this.list.splice(index, 1);
          this.$message({
            type: 'success',
            message: res.msg
          });
        })
      }).catch(() => { });
    },
    trashDel (index, id) {
      this.$confirm('文件删除后将无法恢复，您确定要彻底删除所选文件吗?', '提示', {
        type: 'warning'
      }).then(() => {
        TrashDelete(id).then(res => {
          this.list.splice(index, 1);
          this.$message({
            type: 'success',
            message: res.msg
          });
        })
      }).catch(() => { });
    },
    moveTo (id, parentId) {
      this.folderTreeVisible = true
      this.$nextTick(() => {
        this.$refs.folderTree.init(id, parentId)
      })
    },
    shareFolder (id) {
      this.userBoxVisible = true
      this.$nextTick(() => {
        this.$refs.userBox.init(id)
      })
    },
    getFolder (id) {
      DocumentInfo(id).then(res => {
        this.addFolder(res.data)
      })
    },
    // 新建文件夹
    addFolder (info) {
      let inputValue = ""
      if (info) { inputValue = info.fullName }
      let title = info ? (info.type ? '重命名文件' : '重命名文件夹') : '新建文件夹'
      this.$prompt('', title, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder: '输入名称',
        inputErrorMessage: '请正确输入文件夹名称',
        inputValue: inputValue,
        // inputPattern: /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/,
        closeOnClickModal: false
      }).then(({ value }) => {
        let data = {
          type: info && info.type ? info.type : "0",
          parentId: this.parentId,
          fullName: value
        }
        if (info && info.id) {
          Object.assign(data, { id: info.id })
          Update(data).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            });
            this.initData()
          })
        } else {
          Create(data).then(res => {
            this.$message({
              type: 'success',
              message: res.msg
            });
            this.initData()
          })
        }
      }).catch(() => { });
    },
    handleSuccess (res, file) {
      this.receiveing = false
      if (res.code == 200) {
        this.$message({
          message: res.msg,
          type: 'success',
          duration: 1000
        })
        this.reset()
      } else {
        this.$message({
          message: res.msg,
          type: 'error',
          duration: 1000
        })
      }
    },
    beforeUpload () { this.receiveing = true },
    // 下载文件
    handleDownLoad (id) {
      Download(id).then(res => {
        this.hsz.downloadFile(res.data.url)
      })
    },
    // 打开文件夹
    openFolder (item) {
      this.parentId = item.id
      this.levelList.push(item)
      this.reset()
    },
    jump (item, i) {
      this.parentId = item.id
      this.reset()
      this.levelList = this.levelList.slice(0, i + 1)
    },
    toFileExt (ext) {
      if (ext) ext = ext.replace('.', '')
      if (ext == "doc" || ext == "docx") {
        return "icon-sz-file-word";
      }
      if (ext == "xls" || ext == "xlsx") {
        return "icon-sz-file-excel";
      }
      if (ext == "ppt" || ext == "pptx") {
        return "icon-sz-file-ppt";
      }
      if (ext == "rar" || ext == "zip") {
        return "icon-sz-file-zip";
      }
      if (ext == "txt" || ext == "log") {
        return "icon-sz-file-text";
      }
      if (ext == "html" || ext == "cs" || ext == "xml") {
        return "icon-sz-file-code";
      }
      if (ext == "gif" || ext == "jpg" || ext == "jpeg" || ext == "bmp" || ext == "png") {
        return "icon-sz-file-image1";
      }
      if (ext == "pdf") {
        return "icon-sz-file-pdf";
      }
      if (ext == "mp3") {
        return "icon-sz-file-audio";
      }
      if (ext == "mp4") {
        return "icon-sz-file-movie";
      }
      return "icon-sz-file-blank";
    },
  }
}
</script>
<style lang="scss" scoped>
.Document-container {
  position: relative;
  .HSZ-common-search-box {
    margin-bottom: 0;
    padding-left: 0;
  }
  .HSZ-common-head {
    padding: 14px 0 10px;
  }
  >>> .el-tabs__item {
    text-align: left !important;
    width: 160px;
    .icon-sz {
      font-size: 14px;
      margin-right: 8px;
    }
  }
  >>> .el-tabs__content {
    height: 100%;
    .el-tab-pane {
      height: 100%;
      overflow: hidden;
    }
  }
  .main {
    height: 100%;
    .icon-sz {
      font-size: 14px;
    }
    .cursor-pointer {
      cursor: pointer;
    }
  }
  .upload-box {
    display: inline-block;
  }
}
</style>
