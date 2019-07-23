<template>
  <div class="message_box">
    <div class="content" v-loading="loading">
      <!-- 通知列表 -->
      <div class="box_item" v-for="(item, index) of msgData" :key="index">

        <div class="box_title">
          <span class="iconfont">&#xe612;</span>
          <span>标题: {{item.title}}</span>
          <span class="new" v-if="index === 0">最新</span>
          <span class="history" v-else>历史</span>
        </div>
        <div class="author"><span>发布者：{{item.uploaderName}}</span><span>发布时间：{{item.createTime | formatDate}}</span></div>
        <div class="message_content" v-if="item.message.length > 125">{{ item.message.slice(0, 125) + '...' }}</div>
        <div class="message_content" v-else>{{ item.message }}</div>
        <div class="ctrl">
          <span v-if="item.messageCloseTime !== null">截至日期：{{ item.messageCloseTime | formatDate }}</span>
          <span v-else></span>
          <button class="bt2" @click="downLoadFile(item.adminFile[0].fileName)" v-if="item.adminFile.length !== 0">下载附件</button>
          <button class="bt1" @click="sendDialog(item.messageCloseTime, item.id)" v-if="item.isUpload === 0">上传文件</button>
          <button class="bt3" @click="viewDetail(item)">查看详情</button>
        </div>
      </div>
    </div>
    <!-- 加载更多 -->
    <div class="noneData" v-if="currentPage === totalPage">无更多通知</div>
    <div v-else-if="!msgData.length" class="noneData">暂无通知</div>
    <el-button plain v-else round class="morebottom" @click="showMore">查看更多</el-button>

    <el-dialog title="通知详情" :modal = 'false' width="50%" :visible.sync="dialogDetail">
      <div class="detail_title">标题: {{detailTitle}}</div>
      <div class="detatil_author"><span>发布者：{{uploaderName}}</span><span>发布时间：{{modifyTime | formatDate}}</span></div>
      <div class="detail_content">{{detail}}</div>
    </el-dialog>

    <el-dialog
      title="上传文件"
      :visible.sync="sendFileDialog"
      :modal = 'false'
      :before-close="handleClose"
      width="30%"
    >
      <el-upload
        class="upload-demo"
        ref="upload"
        action=""
        :on-change="handleChange"
        :auto-upload="false"
        :limit=1
      >
        <el-button slot="trigger" size="small" type="primary">选择文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确认上传</el-button>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/serverApi.js'
import { formatDate } from '@/date.js'
export default {
  data () {
    return {
      sendFileDialog: false,
      loading: false,
      dialogDetail: false,
      detail: '',
      detailTitle: '',
      uploaderName: '',
      modifyTime: '',
      msgData: [],
      allData: [],
      file: '',
      currentPage: 1,
      pagesize: 6,
      totalPage: '',
      messageCloseTime: '',
      msgId: ''
    }
  },
  created () {
    this.getData()
  },
  // 时间戳转换
  filters: {
    formatDate (time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    // 查看通知详情
    viewDetail (item) {
      const vm = this
      vm.dialogDetail = true
      vm.detail = item.message
      vm.detailTitle = item.title
      vm.uploaderName = item.uploaderName
      vm.modifyTime = item.createTime
    },
    // 获取通知信息
    getData () {
      const vm = this
      const params = {
        classId: sessionStorage.classId
      }
      vm.$http.get(api.getMessage, { params: params })
        .then(res => {
          vm.allData = res.data.data.publishMessageList
          console.log(vm.allData)
          vm.msgData = vm.allData.slice(0, vm.pagesize)
          vm.totalPage = Math.ceil(vm.allData.length / vm.pagesize)
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    // 展示更多
    showMore () {
      const vm = this
      let page = vm.currentPage
      if (page < vm.totalPage) {
        vm.currentPage++
        const data = vm.allData.slice((vm.currentPage - 1) * vm.pagesize, vm.currentPage * vm.pagesize)
        data.map(item => {
          vm.msgData.push(item)
        })
      }
    },
    // 下载图片
    downloadImg (imgsrc, fileName) {
      const vm = this
      let newUrl = imgsrc.replace(/\\/g, '/')
      let reader = new FileReader()
      reader.addEventListener('loadend', function () {
        console.log(reader.result)
      })
      vm.getImageBlob(newUrl, function (blob) {
        // 读取来看下下载的内容
        reader.readAsDataURL(blob)
        // 最终生成的字符串
        // data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAA...
        // 生成下载用的URL对象
        let url = URL.createObjectURL(blob)
        console.log(url)
        // 生成一个a标签，并模拟点击，即可下载，批量下载同理
        let aDom = document.createElement('a')
        aDom.href = url
        aDom.download = fileName
        // aDom.text = '下载文件';
        document.getElementsByTagName('body')[0].appendChild(aDom)
        aDom.click()
        aDom.remove()
      })
    },
    getImageBlob (url, cb) {
      var xhr = new XMLHttpRequest()
      if ('withCredentials' in xhr) {
        // "withCredentials"属性是XMLHTTPRequest2中独有的
        xhr.open('GET', url, true)
      } else if (typeof XDomainRequest !== 'undefined') {
        // 检测是否XDomainRequest可用
        // eslint-disable-next-line no-undef
        xhr = new XDomainRequest()
        xhr.open('GET', url)
      } else {
        // 看起来CORS根本不被支持
        xhr = null
      }
      // xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

      xhr.responseType = 'blob'
      xhr.onload = function () {
        if (this.status === 200) {
          cb(this.response)
        }
      }
      xhr.send()
    },
    // 创建下载文件事件
    download (url) {
      let a = document.createElement('a')
      let e = document.createEvent('MouseEvents') // 创建鼠标事件对象
      e.initEvent('click', false, false) // 初始化事件对象
      a.href = url
      a.download = ''
      document.body.appendChild(a)
      a.dispatchEvent(e) // 给指定事件执行click事件
      a.remove()
    },
    // 下载文件
    downLoadFile (fileName) {
      const vm = this
      if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileName)) {
        vm.downloadImg(api.dwonloadUrl + fileName, fileName)
      } else {
        vm.download(api.dwonloadUrl + fileName)
      }
    },
    sendDialog (time, id) {
      const vm = this
      vm.sendFileDialog = true
      vm.messageCloseTime = time
      vm.msgId = id
    },
    handleClose (done) {
      const vm = this
      vm.$refs.upload.uploadFiles = []
      done()
    },
    handleChange (file) {
      const vm = this
      vm.file = file.raw
    },
    // 确认上传文件事件
    submitUpload () {
      const vm = this
      if (vm.file === '') {
        vm.$message('请选择文件进行上传')
      } else {
        vm.loading = true
        let data = new FormData()
        data.append('userId', sessionStorage.userId)
        data.append('classId', sessionStorage.classId)
        data.append('multipartFile', vm.file)
        data.append('messageCloseTime2', vm.messageCloseTime)
        data.append('messageId', vm.msgId)
        vm.$http.post(api.uploadFiles, data)
          .then(res => {
            if (res.data.code === 100) {
              vm.$message({
                type: 'warning',
                message: '已过文件上传时间，无法上传'
              })
            } else {
              vm.$message({
                type: 'success',
                message: '上传成功'
              })
            }
            vm.sendFileDialog = false
            vm.loading = false
            vm.$refs.upload.uploadFiles = []
            vm.file = ''
          })
          .catch(err => {
            throw new Error(err)
          })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.message_box
  position absolute
  margin-top 11%
  margin-left 25%
  width 70%
  .detail_title
    border-left 5px solid #1fb27f
    padding-left 6px
    font-size 18px
  .detatil_author
    display flex
    color #aaaaaa
    margin-top 2%
    font-size 13px
    span:nth-child(2)
      display block
      margin-left 10px
      padding-left 10px
      border-left 3px solid #1fb27f
  .detail_content
    margin-top 2%
    line-height 20px
  .morebottom
    width 60%
    margin-left 20%
    margin-bottom 3%
  .noneData
    text-align center
    width 100%
    font-size 15px
    color #aaaaaa
    margin-bottom 3%
  .content
    display flex
    flex-flow wrap
    .box_item
      width 46%
      // flex-grow 1
      background #ffffff
      padding-bottom 1.5%
      box-shadow 0px 0px 10px #dddddd
      border-radius 5px
      margin-left 3%
      margin-bottom 3%
      cursor default
      transition all .2s
      .box_title
        border-bottom 1px solid #f5f7fa
        padding-bottom 8px
        span:nth-child(1)
          color #4bc2c5
          display inline-block
          font-size 25px
          margin-top 5px
          margin-left 3%
        span:nth-child(2)
          display inline-block
          margin-left 5px
          font-size 14px
        .new
          float right
          line-height 40px
          font-size 12px
          margin-right 10px
          color #f6003c
        .history
          float right
          line-height 40px
          font-size 12px
          margin-right 10px
          color #f29c2b
      .author
        display flex
        margin-left 3%
        margin-top 1.5%
        font-size 12px
        color #aaaaaa
        span:nth-child(1)
          display block
          padding-right 10px
          border-right 2px solid #00a03e
        span:nth-child(2)
          display block
          padding-left 10px
          width 65%
      .message_content
        margin-top 15px
        color #2d2d2d
        margin-left 3%
        margin-right 3%
        line-height 20px
        font-size 13px
      .ctrl
        margin-top 4%
        margin-right 3%
        span
          margin-left 3%
          font-size 12px
          color #aaaaaa
          margin-top 5px
          float left
        .bt1
          float right
          margin-right 10px
          background transparent
          color #2470a0
          font-size 14px
          cursor pointer
          transition color .5s
        .bt1:hover
          color #4bc2c5
        .bt2
          float right
          background transparent
          font-size 14px
          cursor pointer
          transition color .5s
          color #00a03e
        .bt2:hover
          color #8bc24c
        .bt3
          float right
          font-size 14px
          cursor pointer
          margin-right 10px
          background transparent
          color #00c07f
          transition color .5s
        .bt3:hover
          color #35CE8D
    .box_item:hover
      // transform scaleY(1.05)
      overflow hidden
      box-shadow 0px 0px 10px #4bc2c5
      transform translateY(-3px)
</style>
