<template>
  <div class="upload_box">
    <button @click="back" class="backButton"><i class="el-icon-arrow-left"></i>返回</button>
    <el-button class="downButton" v-if="downloadPath === null" type="success"  round>暂无文件可下载</el-button>
    <el-button class="downButton" v-else @click="downLoadAllFile" type="success" round>一键下载所有文件</el-button>
    <div class="uploadcontent">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="已上传" name="first"><haveUpload :message="uploadedUserList"></haveUpload></el-tab-pane>
        <el-tab-pane label="未上传" name="second"><noUpload :nomessage="NoUploadedUserList"></noUpload></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import haveUpload from '@/views/admin_home/components/haveUpload.vue'
import noUpload from '@/views/admin_home/components/noUpload.vue'
import api from '@/serverApi.js'
export default {
  components: {
    haveUpload,
    noUpload
  },
  props: ['msgId'],
  data () {
    return {
      activeName: 'first',
      uploadedUserList: [],
      NoUploadedUserList: [],
      downloadPath: ''
    }
  },
  created () {
    this.getStatus()
    this.getAllFile()
  },
  methods: {
    back () {
      const vm = this
      vm.$emit('uploadBack', true)
    },
    // 获取上传情况数据
    getStatus () {
      const vm = this
      const params = {
        classId: sessionStorage.classId,
        id: vm.msgId
      }
      vm.$http.get(api.uploadSituationByUser, { params: params })
        .then(res => {
          console.log(res.data)
          vm.uploadedUserList = res.data.data.uploadedUserList
          vm.NoUploadedUserList = res.data.data.NoUploadedUserList
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    download (url, fileName) {
      let a = document.createElement('a')
      let e = document.createEvent('MouseEvents') // 创建鼠标事件对象
      e.initEvent('click', false, false) // 初始化事件对象
      a.href = url
      a.download = fileName
      document.body.appendChild(a)
      a.dispatchEvent(e) // 给指定事件执行click事件
      a.remove()
    },
    // 下载文件
    downLoadAllFile () {
      const vm = this
      vm.download(api.dwonloadUrl + vm.downloadPath, 'studentFile.zip')
    },
    // 获取所有文件
    getAllFile () {
      const vm = this
      const params = {
        messageId: vm.msgId
      }
      vm.$http.get(api.getAllStudentFileByClassId, { params: params })
        .then(res => {
          vm.downloadPath = res.data.data.downloadPath
        })
        .catch(err => {
          throw new Error(err)
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.upload_box
  width 100%
  padding-bottom 2%
  .downButton
    float right
    margin-right 2%
  .backButton
    background transparent
    color #3399FF
    font-size 18px
    cursor pointer
    transition color .3s
  .backButton:hover
    color #0087cb
  .uploadcontent
    margin-top 10px
</style>
