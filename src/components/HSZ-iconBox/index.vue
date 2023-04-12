<template>
  <el-dialog title="图标选择"
             :close-on-click-modal="false"
             class="HSZ-dialog HSZ-dialog_center icon-dialog"
             lock-scroll
             append-to-body
             v-bind="$attrs"
             width="950px"
             :modal-append-to-body="false"
             v-on="$listeners"
             @open="onOpen"
             @close="onClose">
    <div slot="title"
         class="icon-dialog-title">
      图标选择
      <el-input v-model="keyword"
                placeholder="请输入图标名称"
                prefix-icon="el-icon-search"
                clearable />
    </div>
    <el-tabs class="HSZ-el_tabs"
             v-model="activeName">
      <el-tab-pane label="szIcon 图标">
        <div class="icon-box-list">
          <el-button v-for="(item, index) in szIconsList"
                     :key="index"
                     @click="iconActiveHandle(generateYmIconCode(item))"
                     :class="{ 'is-active': generateYmIconCode(item) === active }">
            <i :class="generateYmIconCode(item)" />
          </el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Element-UI 图标">
        <div class="icon-box-list">
          <el-button v-for="(item, index) in elementIconsList"
                     :key="index"
                     @click="iconActiveHandle(item)"
                     :class="{ 'is-active': item === active }">
            <i :class="item" />
          </el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="szCustom 图标">
        <div class="icon-box-list">
          <el-button v-for="(item, index) in szCustomList"
                     :key="index"
                     @click="iconActiveHandle(generateYmCustomCode(item))"
                     :class="{ 'is-active': generateYmCustomCode(item) === active }">
            <i :class="generateYmCustomCode(item)" />
          </el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="closeDialog">{{$t('common.cancelButton')}}</el-button>
      <el-button type="primary"
                 @click="choiceIcon()">{{$t('common.confirmButton')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import elementIconsJson from 'static/json/element-icons.json'
import szIconsJson from 'static/json/szIcon.json'
import szCustomJson from 'static/json/szCustom.json'
const szIcons = szIconsJson.glyphs.map(o => `icon-sz-${o.font_class}`)
const szCustom = szCustomJson.glyphs.map(o => `sz-custom-${o.font_class}`)
const elementIcons = elementIconsJson.map(name => `el-icon-${name}`)

export default {
  props: ['current'],
  data () {
    return {
      elementIcons,
      szIcons,
      szCustom,
      active: null,
      keyword: '',
      szIconsList: [],
      szCustomList: [],
      elementIconsList: [],
      activeName: ''
    }
  },
  watch: {
    keyword (val) {
      this.search()
    },
    activeName (val) {
      if (this.keyword) {
        this.keyword = ''
      } else {
        this.search()
      }
    }
  },
  methods: {
    search () {
      let key = ''
      if (this.activeName == '0') {
        key = 'szIcons'
      } else if (this.activeName == '1') {
        key = 'elementIcons'
      } else if (this.activeName == '2') {
        key = 'szCustom'
      }
      if (this.keyword) {
        this[key + 'List'] = this[key].filter(o => o.indexOf(this.keyword) > -1)
      } else {
        this[key + 'List'] = this[key]
      }
    },
    onOpen () {
      this.active = this.current
      this.keyword = ''
    },
    onClose () { },
    closeDialog () {
      this.$emit('update:visible', false)
    },
    choiceIcon () {
      if (!this.active) return
      this.$emit('choiceIcon', this.active)
      this.$emit('update:visible', false)
    },
    generateYmIconCode (symbol) {
      return `icon-sz ${symbol}`
    },
    generateYmCustomCode (symbol) {
      return `sz-custom ${symbol}`
    },
    iconActiveHandle (item) {
      this.active = item
    }
  }
}
</script>
<style lang="scss" scoped>
.icon-dialog {
  .icon-dialog-title {
    font-size: 18px;
    .el-input {
      width: 260px;
      margin-left: 10px;
    }
  }
  >>> .el-dialog__body {
    height: 70vh;
    padding: 0 20px !important;
  }
}
.icon-box-list {
  padding-bottom: 8px;
  > .el-button {
    margin: 8px 0 0 8px;
    width: 60px;
    height: 60px;
    padding: 0;
    >>> span {
      width: 60px;
      height: 60px;
      display: inline-block;
      line-height: 60px;
      text-align: center;
      transition: 300ms;
      [class^='el-icon-'] {
        margin-top: 17px;
      }
      .fa {
        margin-top: 17px;
      }
    }
    i {
      font-size: 24px;
    }
    &:hover {
      >>> span {
        transform: scale(1.8);
      }
    }
  }
}
</style>