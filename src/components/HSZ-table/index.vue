<template>
  <el-table :data="data"
            ref="HSZTable"
            class="HSZ-common-table"
            :height="height"
            v-bind="$attrs"
            v-on="$listeners"
            :border="border">
    <el-table-column type="selection"
                     width="50"
                     v-if="hasC"
                     align="center" />
    <el-table-column type="index"
                     width="50"
                     label="序号"
                     v-if="hasNO"
                     align="center" />
    <slot></slot>
    <template slot="empty">
      <el-empty description="暂无数据"
                :image-size="120"></el-empty>
    </template>
  </el-table>
</template>

<script>
export default {
  name: 'HSZ-table',
  props: {
    data: {
      type: Array,
      default: () => []
    },
    columnData: {
      type: Array,
      default: () => []
    },
    // 序号 默认有
    hasNO: {
      type: Boolean,
      default: true
    },
    // 多选框 默认无
    hasC: {
      type: Boolean,
      default: false
    },
    border: {
      type: Boolean,
      default: false
    },
    height: {
      default: '100%'
    }
  },
  watch: {
    data: {
      handler (val) {
        if (!val) return
        this.doLayout()
      },
      deep: true
    },
    columnData: {
      handler (val) {
        if (!val) return
        this.doLayout()
      },
      deep: true
    }
  },
  methods: {
    doLayout () {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.HSZTable.doLayout()
        })
      }, 50)
    }
  }
}
</script>