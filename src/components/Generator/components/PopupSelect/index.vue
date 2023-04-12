<template>
  <div class="popupSelect-container">
    <div
      class="el-select"
      @click="openDialog"
    >
      <el-input
        v-model="innerValue"
        :placeholder="placeholder"
        readonly
        :validate-event="false"
        @mouseenter.native="inputHovering = true"
        @mouseleave.native="inputHovering = false"
      >
        <template slot="suffix">
          <i
            v-show="!showClose"
            :class="['el-select__caret', 'el-input__icon', 'el-icon-arrow-up']"
          />
          <i
            v-if="showClose"
            class="el-select__caret el-input__icon el-icon-circle-close"
            @click="clear"
          />
        </template>
      </el-input>
    </div>
    <template v-if="popupType==='dialog'">
      <el-dialog
        v-if="visible"
        :title="popupTitle"
        :close-on-click-modal="false"
        :visible.sync="visible"
        class="HSZ-dialog HSZ-dialog_center"
        lock-scroll
        append-to-body
        :width="popupWidth"
      >
        <el-row
          class="HSZ-common-search-box"
          :gutter="16"
        >
          <el-form @submit.native.prevent>
            <el-col :span="10">
              <el-form-item label="关键词">
                <el-input
                  v-model="listQuery.keyword"
                  placeholder="请输入关键词查询"
                  clearable
                  class="search-input"
                  @keyup.enter.native="search()"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item>
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  @click="search()"
                >
                  {{ $t('common.search') }}
                </el-button>
                <el-button
                  icon="el-icon-refresh-right"
                  @click="reset()"
                >{{ $t('common.reset') }}
                </el-button>
              </el-form-item>
            </el-col>
          </el-form>
          <div class="HSZ-common-search-box-right">
            <el-tooltip
              effect="dark"
              :content="$t('common.refresh')"
              placement="top"
            >
              <el-link
                icon="icon-sz icon-sz-Refresh HSZ-common-head-icon"
                :underline="false"
                @click="reset()"
              />
            </el-tooltip>
          </div>
        </el-row>
        <HSZ-table
          v-loading="listLoading"
          :data="list"
          :border="false"
          highlight-current-row
          :has-n-o="false"
          @row-click="rowClick"
        >
          <el-table-column width="35">
            <template slot-scope="scope">
              <el-radio
                v-model="checked"
                :label="scope.row[propsValue]"
              >&nbsp;</el-radio>
            </template>
          </el-table-column>
          <el-table-column
            type="index"
            width="50"
            label="序号"
            align="center"
          />
          <el-table-column
            v-for="(item,i) in columnOptions"
            :key="i"
            :prop="item.value"
            :label="item.label"
          />
        </HSZ-table>
        <pagination
          v-if="hasPage"
          :total="total"
          :page.sync="listQuery.currentPage"
          :limit.sync="listQuery.pageSize"
          @pagination="initData"
        />
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button
            size="small"
            @click="visible = false"
          >{{ $t('common.cancelButton') }}</el-button>
          <el-button
            type="primary"
            size="small"
            @click="select()"
          >{{ $t('common.confirmButton') }}
          </el-button>
        </span>
      </el-dialog>
    </template>
    <template v-if="popupType ==='drawer'">
      <el-drawer
        ref="drawer"
        :title="popupTitle"
        :visible.sync="visible"
        :wrapper-closable="false"
        :size="popupWidth"
        append-to-body
        class="HSZ-common-drawer"
      >
        <div class="HSZ-flex-main">
          <el-row
            class="HSZ-common-search-box"
            :gutter="16"
          >
            <el-form @submit.native.prevent>
              <el-col :span="10">
                <el-form-item label="关键词">
                  <el-input
                    v-model="listQuery.keyword"
                    placeholder="请输入关键词查询"
                    clearable
                    class="search-input"
                    @keyup.enter.native="search()"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item>
                  <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="search()"
                  >
                    {{ $t('common.search') }}
                  </el-button>
                  <el-button
                    icon="el-icon-refresh-right"
                    @click="reset()"
                  >{{ $t('common.reset') }}
                  </el-button>
                </el-form-item>
              </el-col>
            </el-form>
            <div class="HSZ-common-search-box-right">
              <el-tooltip
                effect="dark"
                :content="$t('common.refresh')"
                placement="top"
              >
                <el-link
                  icon="icon-sz icon-sz-Refresh HSZ-common-head-icon"
                  :underline="false"
                  @click="reset()"
                />
              </el-tooltip>
            </div>
          </el-row>
          <HSZ-table
            v-loading="listLoading"
            :data="list"
            :border="false"
            highlight-current-row
            :has-n-o="false"
            @row-click="rowClick"
          >
            <el-table-column width="35">
              <template slot-scope="scope">
                <el-radio
                  v-model="checked"
                  :label="scope.row[propsValue]"
                >&nbsp;</el-radio>
              </template>
            </el-table-column>
            <el-table-column
              type="index"
              width="50"
              label="序号"
              align="center"
            />
            <el-table-column
              v-for="(item,i) in columnOptions"
              :key="i"
              :prop="item.value"
              :label="item.label"
            />
          </HSZ-table>
          <pagination
            v-if="hasPage"
            :total="total"
            :page.sync="listQuery.currentPage"
            :limit.sync="listQuery.pageSize"
            @pagination="initData"
          />
          <div class="drawer-footer">
            <el-button
              size="small"
              @click="visible = false"
            >{{ $t('common.cancelButton') }}
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="select()"
            >{{ $t('common.confirmButton') }}
            </el-button>
          </div>
        </div>
      </el-drawer>
    </template>
  </div>
</template>

<script>
import { getDataInterfaceDataSelect, getDataInterfaceDataInfo } from '@/api/systemData/dataInterface'
export default {
  name: 'PopupSelect',
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    value: {
      default: ''
    },
    interfaceId: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    propsValue: {
      type: String,
      default: 'id'
    },
    relationField: {
      type: String,
      default: 'fullName'
    },
    popupType: {
      type: String,
      default: 'dialog'
    },
    popupTitle: {
      type: String,
      default: '选择数据'
    },
    popupWidth: {
      type: String,
      default: '800px'
    },
    field: {
      type: String,
      default: ''
    },
    columnOptions: {
      type: Array,
      default: () => []
    },
    hasPage: {
      type: Boolean,
      default: false
    },
    pageSize: {
      type: Number,
      default: 20
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    queryJson: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: [],
      innerValue: '',
      listQuery: {
        keyword: '',
        currentPage: 1,
        pageSize: 20,
        queryJson: this.queryJson
      },
      total: 0,
      checked: '',
      checkedTxt: '',
      checkedRow: {},
      listLoading: false,
      visible: false,
      inputHovering: false
    }
  },
  computed: {
    showClose() {
      const hasValue = this.multiple
        ? Array.isArray(this.value) && this.value.length > 0
        : this.value !== undefined && this.value !== null && this.value !== ''
      const criteria = this.clearable &&
        !this.disabled &&
        this.inputHovering &&
        hasValue
      return criteria
    },
    propsLabel() {
      return this.columnOptions[0].value
    },
    //修改框架多个列模糊查询
    relationFieldFirst(){
      return this.relationField.indexOf("#")>-1?this.relationField.split("#")[0]:this.relationField;
    }
  },
  watch: {
    value(val) {
      this.setDefault()
    }
  },
  created() {
    this.listQuery.pageSize = this.hasPage ? this.pageSize : 10000
    // this.reset()
    this.setDefault()
  },
  methods: {
    initData() {
      if (!this.interfaceId) return
      this.listLoading = true
      const query = {
        ...this.listQuery,
        interfaceId: this.interfaceId,
        propsValue: this.propsValue,
        relationField: this.relationField
      }
      getDataInterfaceDataSelect(this.interfaceId, query).then(res => {
        this.list = this.interfaceDataHandler(res.data)
        this.total = res.data.pagination.total
        this.listLoading = false
      }).catch(() => { this.listLoading = false })
    },
    interfaceDataHandler(data) {
      if (!data.dataProcessing) return data.list
      const dataHandler = this.hsz.getScriptFunc.call(this, data.dataProcessing)
      if (!dataHandler) return data.list
      return dataHandler(data.list)
    },
    search() {
      this.initData()
      this.listQuery.currentPage = 1
      this.listQuery.pageSize = this.hasPage ? this.pageSize : 10000
    },
    reset() {
      this.listQuery.keyword = ''
      this.listQuery.currentPage = 1
      this.listQuery.pageSize = this.hasPage ? this.pageSize : 10000
      this.initData()
    },
    openDialog() {
      if (this.disabled) return
      this.checked = this.value
      this.visible = true
      this.reset()
    },
    clear(event) {
      this.checked = ''
      this.innerValue = ''
      this.checkedRow = {}
      this.$emit('input', this.checked)
      this.$emit('change', this.checked, this.checkedRow)
      event.stopPropagation()
    },
    select() {
      if (!this.checked) return
      this.innerValue = this.checkedTxt
      this.$emit('input', this.checked)
      this.$emit('change', this.checked, this.checkedRow)
      this.visible = false
    },
    rowClick(row) {
      this.checked = row[this.propsValue]
      // this.checkedTxt = row[this.relationField]
      this.checkedTxt = row[this.relationFieldFirst]
      this.checkedRow = row
    },
    setDefault() {
      if (this.value) {
        if (!this.interfaceId) return
        const query = {
          id: this.value,
          interfaceId: this.interfaceId,
          propsValue: this.propsValue,
          relationField: this.relationField
        }
        getDataInterfaceDataInfo(this.interfaceId, query).then(res => {
          // this.innerValue = res.data[this.relationField]
          this.innerValue = res.data[this.relationFieldFirst]
          if (!this.field) return
          const relationData = this.$store.state.generator.relationData
          this.$set(relationData, this.field, res.data)
          this.$store.commit('generator/UPDATE_RELATION_DATA', relationData)
        })
      } else {
        this.innerValue = ''
        if (!this.field) return
        const relationData = this.$store.state.generator.relationData
        this.$set(relationData, this.field, {})
        this.$store.commit('generator/UPDATE_RELATION_DATA', relationData)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
>>> .el-dialog__body {
  height: 70vh;
  padding: 0 0 10px !important;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .HSZ-common-search-box {
    margin-bottom: 0;
    .HSZ-common-search-box-right {
      padding: 10px 10px 0 0;
    }
  }
}
</style>
