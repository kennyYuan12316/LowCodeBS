<template>
  <el-row class="HSZ-common-search-box"
          :gutter="16"
          v-if="searchList.length">
    <el-form @submit.native.prevent>
      <el-col :span="6"
              v-for="(item, index) in searchList"
              :key="index">
        <el-form-item :label="item.__config__.label"
                      v-show="index<3 || (index>=3 && showAll)">
          <template v-if="useInputList.indexOf(item.__config__.hszKey)>-1">
            <el-input v-model="item.value"
                      :placeholder="item.__config__.label"
                      clearable
                      class="item">
            </el-input>
          </template>
          <template v-else-if="useDateList.indexOf(item.__config__.hszKey)>-1">
            <el-date-picker v-model="item.value"
                            value-format="timestamp"
                            format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            class="item"
                            type="daterange"
                            clearable />
          </template>
          <template v-else-if="useSelectList.indexOf(item.__config__.hszKey)>-1">
            <el-select v-model="item.value"
                       :placeholder="'请选择'+item.__config__.label"
                       clearable
                       filterable
                       class="item">
              <el-option :label="oItem[item.__config__.props.label]"
                         v-for="(oItem, i) in item.__slot__.options"
                         :value="oItem[item.__config__.props.value]"
                         :key="i"></el-option>
            </el-select>
          </template>
          <template v-else>
            <template v-if="item.__config__.hszKey==='numInput'||item.__config__.hszKey==='calculate'">
              <num-range v-model="item.value"></num-range>
            </template>
            <template v-if="item.__config__.hszKey==='cascader'">
              <el-cascader v-model="item.value"
                           :options="item.options"
                           clearable
                           :show-all-levels="item['show-all-levels']"
                           :props="item.props.props"
                           filterable
                           :placeholder="'请选择'+item.__config__.label"
                           class="item"></el-cascader>
            </template>
            <template v-if="item.__config__.hszKey==='time'|| item.__config__.hszKey==='timeRange'">
              <el-time-picker v-model="item.value"
                              start-placeholder="开始时间"
                              end-placeholder="结束时间"
                              clearable
                              :value-format="item['value-format']"
                              :format="item.format"
                              is-range
                              class="item" />
            </template>
            <template v-if="item.__config__.hszKey==='date'">
              <el-date-picker v-model="item.value"
                              :type="item.type+'range'"
                              clearable
                              :value-format="item['value-format']"
                              :format="item.format"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              class="item">
              </el-date-picker>
            </template>
            <template v-if="item.__config__.hszKey==='dateRange'">
              <el-date-picker v-model="item.value"
                              :type="item.type"
                              clearable
                              :value-format="item['value-format']"
                              :format="item.format"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              class="item">
              </el-date-picker>
            </template>
            <template v-if="commonList.includes(item.__config__.hszKey)">
              <component :is="item.__config__.tag"
                         v-model="item.value"
                         clearable
                         :placeholder="'请选择'+item.__config__.label"
                         class="item" />
            </template>
            <template v-if="item.__config__.hszKey==='address'">
              <HSZAddress v-model="item.value"
                          :placeholder="'请选择'+item.__config__.label"
                          :level="item.level"
                          class="item"
                          clearable />
            </template>
            <template v-if="item.__config__.hszKey==='treeSelect'">
              <HSZ-TreeSelect v-model="item.value"
                              :placeholder="'请选择'+item.__config__.label"
                              :options="item.options"
                              :props="item.props.props"
                              class="item"
                              clearable />
            </template>
            <template v-if="item.__config__.hszKey==='createUser'||item.__config__.hszKey==='modifyUser'">
              <userSelect v-model="item.value"
                          :placeholder="'请选择'+item.__config__.label"
                          clearable
                          class="item" />
            </template>
            <template v-if="item.__config__.hszKey==='currOrganize'">
              <comSelect v-model="item.value"
                         :placeholder="'请选择'+item.__config__.label"
                         clearable
                         class="item" />
            </template>
            <template v-if="item.__config__.hszKey==='currDept'">
              <depSelect v-model="item.value"
                         :placeholder="'请选择'+item.__config__.label"
                         clearable
                         class="item" />
            </template>
            <template v-if="item.__config__.hszKey==='currPosition'">
              <posSelect v-model="item.value"
                         :placeholder="'请选择'+item.__config__.label"
                         clearable
                         class="item" />
            </template>
          </template>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item>
          <el-button type="primary"
                     icon="el-icon-search"
                     @click="search()">{{$t('common.search')}}
          </el-button>
          <el-button icon="el-icon-refresh-right"
                     @click="reset()">{{$t('common.reset')}}
          </el-button>
          <template v-if="searchList.length>3">
            <el-button type="text"
                       icon="el-icon-arrow-down"
                       @click="showAll=true"
                       v-if="!showAll">
              展开
            </el-button>
            <el-button type="text"
                       icon="el-icon-arrow-up"
                       @click="showAll=false"
                       v-else>
              收起</el-button>
          </template>
        </el-form-item>
      </el-col>
    </el-form>
  </el-row>
</template>

<script>
import { deepClone } from '@/utils'
import { dyOptionsList, useInputList, useDateList, useSelectList } from '@/components/Generator/generator/comConfig'
import { getDictionaryDataSelector } from '@/api/systemData/dictionary'
import { getDataInterfaceRes } from '@/api/systemData/dataInterface'
export default {
  props: ['list'],
  data () {
    return {
      showAll: false,
      searchList: [],
      commonList: ['comSelect', 'depSelect', 'posSelect', 'userSelect', 'dicSelect'],
      useInputList,
      useDateList,
      useSelectList
    }
  },
  watch: {
    list: {
      handler: function (val) {
        this.searchList = deepClone(val)
        this.buildOptions(this.searchList)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    buildOptions (componentList) {
      componentList.forEach(cur => {
        const config = cur.__config__
        if (config.hszKey === 'cascader') cur.props.props.multiple = false
        if (dyOptionsList.indexOf(config.hszKey) > -1) {
          let isTreeSelect = config.hszKey === 'treeSelect' || config.hszKey === 'cascader'
          if (config.dataType === 'dictionary') {
            if (!config.dictionaryType) return
            getDictionaryDataSelector(config.dictionaryType).then(res => {
              isTreeSelect ? cur.options = res.data.list : cur.__slot__.options = res.data.list
            })
          }
          if (config.dataType === 'dynamic') {
            if (!config.propsUrl) return
            getDataInterfaceRes(config.propsUrl).then(res => {
              let data = this.hsz.interfaceDataHandler(res.data)
              if (Array.isArray(data)) {
                isTreeSelect ? cur.options = data : cur.__slot__.options = data
              } else {
                isTreeSelect ? cur.options = [] : cur.__slot__.options = []
              }
            })
          }
        }
      })
    },
    setProps (componentList) {
      componentList.forEach(cur => {
        const config = cur.__config__
        if (config.hszKey === 'cascader') cur.props.props.multiple = false
      })
    },
    search () {
      let obj = {}
      for (let i = 0; i < this.searchList.length; i++) {
        const e = this.searchList[i]
        if (e.value) {
          if (Array.isArray(e.value)) {
            if (e.value.length) obj[e.__vModel__] = e.value
          } else {
            obj[e.__vModel__] = e.value
          }
        }
      }
      let json = JSON.stringify(obj) === "{}" ? '' : JSON.stringify(obj)
      this.$emit('search', json)
    },
    reset () {
      this.treeReset()
      this.$emit('reset')
    },
    treeReset () {
      for (let i = 0; i < this.searchList.length; i++) {
        this.searchList[i].value = ''
      }
    }
  }
}
</script>