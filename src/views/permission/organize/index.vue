<template>
  <div class="HSZ-common-layout">
    <div class="HSZ-common-layout-center  HSZ-flex-main">
      <el-row class="HSZ-common-search-box"
              :gutter="16">
        <el-form @submit.native.prevent>
          <el-col :span="6">
            <el-form-item :label="$t('common.keyword')">
              <el-input v-model="listQuery.keyword"
                        :placeholder="$t('common.enterKeyword')"
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
      </el-row>
      <div class="HSZ-common-layout-main HSZ-flex-main">
        <div class="HSZ-common-head">
          <topOpts @add="addOrUpdateHandle()" />
          <div class="HSZ-common-head-right">
            <el-tooltip effect="dark"
                        :content="$t('common.refresh')"
                        placement="top">
              <el-link icon="icon-sz icon-sz-Refresh HSZ-common-head-icon"
                       :underline="false"
                       @click="reset()" />
            </el-tooltip>
          </div>
        </div>
        <HSZ-table v-loading="listLoading"
                   :data="treeList"
                   row-key="id"
                   default-expand-all
                   :tree-props="{children: 'children', hasChildren: ''}">
          <el-table-column prop="fullName"
                           label="名称" />
          <el-table-column prop="enCode"
                           label="编码" />
          <el-table-column prop="description"
                           label="说明" />
          <el-table-column prop="creatorTime"
                           :formatter="hsz.tableDateFormat"
                           label="创建时间"
                           width="120" />
          <el-table-column prop="sortCode"
                           label="排序"
                           width="70"
                           align="center" />
          <el-table-column label="操作"
                           width="150">
            <template slot-scope="scope">
              <tableOpts @edit="addOrUpdateHandle(scope.row.id)"
                         @del="handleDel(scope.row.id)">
                <el-dropdown hide-on-click>
                  <span class="el-dropdown-link">
                    <el-button size="mini"
                               type="text">
                      {{$t('common.moreBtn')}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="openGradeForm(scope.row)">
                      分级管理
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </tableOpts>
            </template>
          </el-table-column>
        </HSZ-table>
      </div>
    </div>
    <Form v-show="formVisible"
          ref="Form"
          @close="closeForm" />
    <gradeForm v-if="gradeFormVisible"
               ref="gradeForm"
               @close="gradeFormVisible=false" />
  </div>
</template>

<script>
import {
  getOrganizeList,
  delOrganize
} from '@/api/permission/organize'
import Form from './Form'
import GradeForm from './GradeForm'

export default {
  name: 'permission-organize',
  components: { Form, GradeForm },
  data () {
    return {
      listQuery: {
        keyword: ''
      },
      treeList: [],
      btnLoading: false,
      listLoading: true,
      formVisible: false,
      gradeFormVisible: false
    }
  },
  created () {
    this.initData()
  },
  methods: {
    initData () {
      this.loading = true
      getOrganizeList(this.listQuery).then(res => {
        this.treeList = res.data.list
        this.listLoading = false
        this.btnLoading = false
      }).catch(() => {
        this.listLoading = false
        this.btnLoading = false
      })
    },
    search () {
      this.initData()
    },
    reset () {
      this.listQuery.keyword = ''
      this.initData()
    },
    addOrUpdateHandle (id) {
      this.formVisible = true
      this.$nextTick(() => {
        this.$refs.Form.init(id)
      })
    },
    closeForm (isRefresh) {
      this.formVisible = false
      if (isRefresh) {
        this.keyword = ''
        this.initData()
      }
    },
    openGradeForm (row) {
      this.gradeFormVisible = true
      this.$nextTick(() => {
        this.$refs.gradeForm.init(row.id, row.fullName)
      })
    },
    handleDel (id) {
      this.$confirm(this.$t('common.delTip'), this.$t('common.tipTitle'), {
        type: 'warning'
      }).then(() => {
        delOrganize(id).then(res => {
          this.$message({
            type: 'success',
            message: res.msg,
            duration: 1500,
            onClose: () => {
              this.initData()
            }
          })
        })
      }).catch(() => { })
    }
  }
}
</script>
