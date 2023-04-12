<template>
  <div style="padding: 0 15px;"
       @click="toggleClick">
    <i class="icon-sz icon-sz-header-collapse1"
       v-if='isActive'></i>
    <i class="icon-sz icon-sz-header-expand"
       v-else></i>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick () {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.icon-sz {
  font-size: 20px;
  color: #666666;
}
</style>