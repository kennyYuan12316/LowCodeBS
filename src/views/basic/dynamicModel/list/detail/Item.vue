<template>
  <el-col :span="item.__config__.span"
          :class="{'item-card':item.__config__.hszKey==='card','item-table':item.__config__.hszKey==='table'}"
          v-if="!item.__config__.noShow && (!item.__config__.visibility || (Array.isArray(item.__config__.visibility) && item.__config__.visibility.includes('pc')))">
    <template v-if="item.__config__.layout==='colFormItem'">
      <template v-if="item.__config__.hszKey==='divider'">
        <el-divider :content-position="item['content-position']">{{item.__slot__.default}}
        </el-divider>
      </template>
      <template v-else-if="item.__config__.hszKey==='HSZText'">
        <el-form-item label-width="0">
          <HSZText :lineHeight="item.lineHeight"
                   :fontSize="item.fontSize"
                   v-model="item.__config__.defaultValue"
                   :textStyle="item.textStyle" />
        </el-form-item>
      </template>
      <template v-else-if="item.__config__.hszKey==='groupTitle'">
        <el-form-item label-width="0">
          <groupTitle :content="item.content"
                      :content-position="item['content-position']" />
        </el-form-item>
      </template>
      <template v-else-if="item.__config__.hszKey==='button'">
        <el-form-item label-width="0">
          <hsz-button :align="item.align"
                      :buttonText="item.buttonText"
                      :type="item.type"
                      :disabled="item.disabled" />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item :prop="item.__vModel__"
                      :label-width="item.__config__.labelWidth?`${item.__config__.labelWidth}px`: null"
                      :label="item.__config__.showLabel ? item.__config__.label : '' ">
          <template v-if="item.__config__.hszKey==='uploadFz'">
            <HSZUploadFz v-model="item.__config__.defaultValue"
                         detailed
                         disabled />
          </template>
          <template v-else-if="item.__config__.hszKey==='uploadImg'">
            <el-image :src="define.comUrl+cItem.url"
                      class="dy-img"
                      v-for="(cItem,ci) in item.__config__.defaultValue"
                      :key="ci"
                      :preview-src-list="getImgList(item.__config__.defaultValue)"
                      :z-index="10000">
            </el-image>
          </template>
          <template v-else-if="item.__config__.hszKey==='colorPicker'">
            <el-color-picker v-model="item.__config__.defaultValue"
                             :show-alpha="item['show-alpha']"
                             :color-format="item['color-format']"
                             :size="item.size"
                             disabled />
          </template>
          <template v-else-if="item.__config__.hszKey==='rate'">
            <el-rate v-model="item.__config__.defaultValue"
                     :max="item.max"
                     :allow-half="item['allow-half']"
                     :show-text="item['show-text']"
                     :show-score="item['show-score']"
                     disabled />
          </template>
          <template v-else-if="item.__config__.hszKey==='slider'">
            <div class="slider-box">
              <el-slider v-model="item.__config__.defaultValue"
                         :range='item.range'
                         :show-stops="item['show-stops']" />
              <div class="slider-mark"></div>
            </div>
          </template>
          <template v-else-if="item.__config__.hszKey==='editor'">
            <div v-html="item.__config__.defaultValue"></div>
          </template>
          <template v-else-if="item.__config__.hszKey==='relationForm'">
            <el-link :underline="false"
                     @click.native="toDetail(item)"
                     type="primary">
              {{ item.name }}</el-link>
          </template>
          <template v-else-if="item.__config__.hszKey==='popupSelect'">
            <p>{{ item.name }}</p>
          </template>
          <template v-else-if="['relationFormAttr','popupAttr'].includes(item.__config__.hszKey)">
            <p>
              {{ relationData[item.relationField] && relationData[item.relationField][item.showField] ? relationData[item.relationField][item.showField] : '' }}
            </p>
          </template>
          <template v-else-if="item.__config__.hszKey==='barcode'">
            <hsz-barcode :format="item.format"
                         :lineColor="item.lineColor"
                         :background="item.background"
                         :width="item.width"
                         :height="item.height"
                         :staticText="item.staticText"
                         :dataType="item.dataType"
                         :relationField="item.relationField+'_id'"
                         :formData="formValue"></hsz-barcode>
          </template>
          <template v-else-if="item.__config__.hszKey==='qrcode'">
            <hsz-qrcode :format="item.format"
                        :colorLight="item.colorLight"
                        :colorDark="item.colorDark"
                        :size="item.size"
                        :staticText="item.staticText"
                        :dataType="item.dataType"
                        :relationField="item.relationField+'_id'"
                        :formData="formValue"></hsz-qrcode>
          </template>
          <template v-else>
            <p>{{ getValue(item) }}</p>
          </template>
        </el-form-item>
      </template>
    </template>
    <template v-else>
      <template v-if="item.__config__.hszKey==='card'">
        <el-card :shadow="item.shadow"
                 :header="item.header"
                 class="mb-20">
          <Item v-for="(childItem, childIndex) in item.__config__.children"
                :key="childIndex"
                :item="childItem"
                v-bind="$props"
                v-on="$listeners" />
        </el-card>
      </template>
      <template v-if="item.__config__.hszKey==='row'">
        <el-row :gutter="formConf.gutter">
          <Item v-for="(childItem, childIndex) in item.__config__.children"
                :key="childIndex"
                :item="childItem"
                v-bind="$props"
                v-on="$listeners" />
        </el-row>
      </template>
      <template v-if="item.__config__.hszKey==='table'">
        <el-form-item label-width="0"
                      v-if="!item.__config__.noShow">
          <div class="HSZ-common-title"
               v-if="item.__config__.showTitle">
            <h2>{{item.__config__.label}}</h2>
          </div>
          <HSZ-table :data="item.__config__.defaultValue"
                     :show-summary="!!item.__config__.defaultValue.length && item['show-summary'] && (item.summaryField && !!item.summaryField.length)"
                     :summary-method="getSummaries">
            <template v-for="(column,columnIndex) in item.__config__.children">
              <template v-if="!column.__config__.noShow && (!column.__config__.visibility || (Array.isArray(column.__config__.visibility) && column.__config__.visibility.includes('pc')))">
                <el-table-column :key="columnIndex"
                                 :prop="column.__vModel__"
                                 :label="column.__config__.label"
                                 v-if="column.__config__.hszKey==='relationForm'">
                  <template slot-scope="scope">
                    <el-link :underline="false"
                             type="primary"
                             @click.native="toTableDetail(column,scope.row[column.__vModel__+'_id'])">
                      {{ scope.row[column.__vModel__] }}</el-link>
                  </template>
                </el-table-column>
                <el-table-column :key="columnIndex"
                                 :label="column.__config__.label"
                                 v-else-if="['relationFormAttr','popupAttr'].includes(column.__config__.hszKey)">
                  <template slot-scope="scope">
                    {{ scope.row[column.relationField.split('_hszTable_')[0]+'_'+column.showField] }}
                  </template>
                </el-table-column>
                <el-table-column :key="columnIndex"
                                 :label="column.__config__.label"
                                 v-else-if="column.__config__.hszKey==='uploadFz'">
                  <template slot-scope="scope">
                    <HSZUploadFz v-model="scope.row[column.__vModel__]"
                                 detailed
                                 disabled />
                  </template>
                </el-table-column>
                <el-table-column :key="columnIndex"
                                 :prop="column.__vModel__"
                                 :label="column.__config__.label"
                                 v-else />
              </template>
            </template>
          </HSZ-table>
        </el-form-item>
      </template>
      <template v-if="item.__config__.hszKey==='tab'">
        <el-tabs :type="item.type"
                 :tab-position="item['tab-position']"
                 v-model="item.__config__.active"
                 class="mb-10">
          <el-tab-pane v-for="(pane,i) in item.__config__.children"
                       :key="i"
                       :label="pane.title">
            <Item v-for="(childItem, childIndex) in pane.__config__.children"
                  :key="childIndex"
                  :item="childItem"
                  v-bind="$props"
                  v-on="$listeners" />
          </el-tab-pane>
        </el-tabs>
      </template>
      <template v-if="item.__config__.hszKey==='collapse'">
        <el-collapse :accordion="item.accordion"
                     v-model="item.__config__.active"
                     class="mb-20">
          <el-collapse-item v-for="(pane,i) in item.__config__.children"
                            :key="i"
                            :title="pane.title"
                            :name="pane.name">
            <Item v-for="(childItem, childIndex) in pane.__config__.children"
                  :key="childIndex"
                  :item="childItem"
                  v-bind="$props"
                  v-on="$listeners" />
          </el-collapse-item>
        </el-collapse>
      </template>
    </template>
  </el-col>
</template>
<script>
import { getDownloadUrl } from '@/api/common'

export default {
  name: 'Item',
  props: {
    item: {
      type: Object,
      required: true
    },
    formConf: {
      type: Object,
      required: true
    },
    formValue: {
      type: Object,
    },
    relationData: {
      type: Object,
      default: () => { }
    }
  },
  methods: {
    toDetail (item) {
      this.$emit('toDetail', item)
    },
    toTableDetail (item, value) {
      item.__config__.defaultValue = value
      this.$emit('toDetail', item)
    },
    downloadFile (file) {
      if (!file.fileId) return
      getDownloadUrl('annex', file.fileId).then(res => {
        this.hsz.downloadFile(res.data.url)
      })
    },
    getImgList (list) {
      const newList = list.map(o => this.define.comUrl + o.url)
      return newList
    },
    getValue (item) {
      if (Array.isArray(item.__config__.defaultValue)) {
        if (['timeRange', 'dateRange'].includes(item.__config__.hszKey)) {
          return item.__config__.defaultValue.join('')
        }
        return item.__config__.defaultValue.join()
      }
      return item.__config__.defaultValue
    },
    getSummaries (param) {
      const summaryField = this.item.summaryField
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (!summaryField.includes(column.property)) {
          sums[index] = '';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
        } else {
          sums[index] = '';
        }
      });
      return sums
    }
  }
}
</script>