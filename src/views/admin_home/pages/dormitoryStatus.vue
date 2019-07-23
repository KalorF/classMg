<template>
  <div class="dormitory_box">
    <button @click="back" class="backButton"><i class="el-icon-arrow-left"></i>返回</button>
    <el-button class="downButton" v-if="downloadPath === null" type="success" round>暂无文件可下载</el-button>
    <el-button class="downButton" v-else @click="downLoadAllFile" type="success" round>一键下载所有文件</el-button>
    <div class="noData" v-show="!listData.length">无宿舍上传</div>
    <div class="dormitoryContent">
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane v-for="(item, index) of listData" :key="index" :label="item.dormName" :name="`${index}`">
          <dormitoryUpload :dormList="item.userList"></dormitoryUpload>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import dormitoryUpload from '@/views/admin_home/components/dormitoryUpload.vue'
import api from '@/serverApi.js'
export default {
  components: {
    dormitoryUpload
  },
  props: ['msgId'],
  data () {
    return {
      activeName: '0',
      listData: '',
      downloadPath: ''
    }
  },
  created () {
    this.getDormMsg()
    this.getAllFile()
  },
  methods: {
    // 获取宿舍的上传情况
    getDormMsg () {
      const vm = this
      const params = {
        classId: sessionStorage.classId,
        id: vm.msgId
      }
      vm.$http.get(api.uploadSituationByDorm, { params: params })
        .then(res => {
          console.log(res.data)
          vm.listData = res.data.data.dormList
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
    // 下载所有文件
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
    },
    back () {
      const vm = this
      vm.$emit('dormitoryBack', true)
    }
  }
}
</script>

<style lang="stylus" scoped>
.dormitory_box
  width 100%
  padding-bottom 2%
  .backButton
    background transparent
    color #3399FF
    font-size 18px
    cursor pointer
    transition color .3s
  .downButton
    float right
    margin-right 2%
  .backButton:hover
    color #0087cb
  .dormitoryContent
    margin-top 10px
  .noData
    text-align center
    font-size 15px
    color #aaaaaa
</style>
