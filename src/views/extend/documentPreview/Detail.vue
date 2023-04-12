<template>
  <transition name="el-zoom-in-center">
    <div class="HSZ-preview-main">
      <div class="HSZ-common-page-header">
        <el-page-header @back="goBack"
                        :content="title" />
        <div class="options">
          <el-button @click="goBack()">{{$t('common.cancelButton')}}</el-button>
        </div>
      </div>
      <iframe v-if="localPreview"
              width="100%"
              height="100%"
              :src="url"
              frameborder="0"></iframe>
      <div v-else
           v-html="rawHtml"></div>
    </div>
  </transition>
</template>

<script>
import { filePreviewServer, APIURl } from '@/utils/define'
import { PreviewFile } from '@/api/extend/documentPreview'

export default {
  data () {
    return {
      localPreview: true,
      rawHtml: '',
      title: '',
      url: ''
    }
  },
  methods: {
    goBack () {
      this.$emit('close')
    },
    init (id, name, type) {
      let Base64 = require('js-base64').Base64;
      this.url = ''
      if (!id) return this.goBack()
      this.title = '文档预览 - ' + name
      PreviewFile(id, type).then(res => {
        if (res.data) {
          if (type === 'localPreview') {
            console
            this.url = `${filePreviewServer}/onlinePreview?url=` + encodeURIComponent(Base64.encode(`${APIURl}` + res.data))
            //this.url = `${filePreviewServer}` + res.data
            //this.rawHtml = res.data
            return this.url
          }
          this.url = res.data
        } else {
          this.$message.warning('文件不存在')
          this.goBack()
        }
      })
    }
  }
}
</script>