<template>
  <div class="search_box">
    <button class="backButton" @click="back"><i class="el-icon-arrow-left"></i>返回</button>
    <div class="line"></div>

    <el-autocomplete
      class="search_input"
      v-model="detail"
      :fetch-suggestions="querySearchAsync"
      @select="handleSelect"
      placeholder="请输入搜索内容（通知标题或者文件名）"
    >
      <i
      class="el-icon-search el-input__icon"
      slot="suffix"
      >
      </i>
    </el-autocomplete>

    <div class="search_content">
      <!-- 文件 -->
      <div class="file_content" v-if="showFile">
        <div class="item">
          <div class="file_title">所属通知: {{fileContent.publishMessage.title}}</div>
          <div class="file_item">
            <i class="iconfont">&#xe601;</i>
            <span>{{fileContent.fileName}}</span>
            <span>{{fileContent.size}}</span>
            <span>上传者：{{fileContent.user.name}}</span>
            <span>上传时间：{{fileContent.createTime | formatDate}}</span>
            <el-button type="success" size="small" @click="downLoadFile(fileContent.fileName)">下载</el-button>
          </div>
        </div>
      </div>

      <!-- 通知 -->
      <div class="content" v-if="showMsg" v-loading="loading">
          <div class="box_item">
            <div class="box_title">
              <span class="iconfont">&#xe612;</span>
              <span>标题: {{msgContent.title}}</span>
              <!-- <span class="new" v-if="index === 0">最新</span>
              <span class="history" v-else>历史</span> -->
            </div>
            <div class="author"><span>发布者：{{msgContent.uploaderName}}</span><span>发布时间: {{msgContent.createTime | formatDate}}</span></div>
            <div class="message_content" v-if="msgContent.message.length > 125">{{ msgContent.message.slice(0, 125) + '...' }}</div>
            <div class="message_content" v-else>{{ msgContent.message }}</div>
            <div class="ctrl">
              <span v-if="msgContent.messageCloseTime !== null">截至日期：{{ msgContent.messageCloseTime | formatDate }}</span>
              <span v-else></span>
              <button class="bt2" @click="downLoadFile(msgContent.adminFile[0].fileName)" v-if="msgContent.adminFile.length !== 0">下载附件</button>
              <button class="bt1" @click="sendDialog(msgContent.messageCloseTime, msgContent.id)" v-if="msgContent.isUpload === 0">上传文件</button>
              <button class="bt3" @click="viewDetail(msgContent)">查看详情</button>
            </div>
          </div>
      </div>
      <el-dialog title="通知详情" :modal = 'false' width="50%" :visible.sync="dialogDetail">
        <div class="detail_title">标题: {{detailTitle}}</div>
        <div class="detatil_author"><span>发布者：{{uploaderName}}</span><span>发布时间：{{modifyTime | formatDate}}</span></div>
        <div class="detail_content">{{msgDetail}}</div>
      </el-dialog>
      <!-- 上传弹窗 -->
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
      msgDetail: '',
      detailTitle: '',
      uploaderName: '',
      modifyTime: '',
      file: '',
      messageCloseTime: '',
      msgId: '',
      showFile: false,
      showMsg: false,
      fileContent: '',
      msgContent: ''
    }
  },
  // 时间戳转换
  filters: {
    formatDate (time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    viewDetail (item) {
      const vm = this
      vm.dialogDetail = true
      vm.msgDetail = item.message
      vm.detailTitle = item.title
      vm.uploaderName = item.uploaderName
      vm.modifyTime = item.createTime
    },
    // queryString 为在框中输入的值
    // callback 回调函数,将处理好的数据推回
    querySearchAsync (queryString, callback) {
      // 判断是否为空对象
      function isEmptyObject (obj) {
        for (var key in obj) {
          return false
        }
        return true
      }
      let list = [{}]
      const vm = this
      // 调用的后台接口
      const params = {
        name: queryString,
        classId: sessionStorage.classId
      }
      vm.$http.get(api.StudentFuzzySearchByName, { params: params })
        .then((response) => {
          console.log(response.data.data)
          // 在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示
          if (isEmptyObject(response.data.data)) {
            list = []
            callback(list)
          } else {
            if (response.data.data.fileList.length === 0) {
              for (let i of response.data.data.publishMessageList) {
                i.value = i.title // 将想要展示的数据作为value
              }
              list = response.data.data.publishMessageList
              callback(list)
            } else if (response.data.data.publishMessageList.length === 0) {
              for (let i of response.data.data.fileList) {
                i.value = i.fileName // 将想要展示的数据作为value
              }
              list = response.data.data.fileList
              callback(list)
            } else {
              let newFilelist = response.data.data.fileList
              newFilelist.map(item => {
                vm.$set(item, 'newName', item.fileName)
              })
              let newpublishMessageList = response.data.data.publishMessageList
              newpublishMessageList.map(item => {
                vm.$set(item, 'newName', item.title)
              })
              let newList = [...newFilelist, ...newpublishMessageList]
              for (let i of newList) {
                i.value = i.newName
              }
              list = newList
              callback(list)
            }
          }
        }).catch((error) => {
          console.log(error)
        })
    },
    handleSelect (item) {
      const vm = this
      if (item.fileName !== undefined) {
        vm.fileContent = item
        // KB转MB
        let size = vm.fileContent.fileSize
        if (size < 1024) {
          size = size + 'KB'
        } else {
          size = (size / 1024).toFixed(2) + 'MB'
        }
        vm.fileContent.size = size
        vm.showFile = true
        vm.showMsg = false
      } else if (item.title !== undefined) {
        vm.msgContent = item
        vm.showFile = false
        vm.showMsg = true
      }
    },
    back () {
      const vm = this
      vm.$emit('searchBack')
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
    // 点击确认上传事件
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
            vm.$message({
              type: 'success',
              message: '上传成功'
            })
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
.search_box
  position absolute
  margin-top 5%
  padding-left 2%
  background #ffffff
  height 85vh
  margin-right 3%
  width 100%
  .backButton
    background transparent
    color #3399FF
    font-size 18px
    cursor pointer
    transition color .3s
  .backButton:hover
    color #0087cb
  .line
    height 1px
    margin-top 3px
    background #eeeeee
  .search_input
    margin-top 2%
    width 38%
    margin-left 31%
  .search_content
    margin-left auto
    margin-top 3%
    margin-right auto
    width 60%
    .file_content
      width 97%
      .item
        height 100px
        box-shadow 0px 0px 10px #dddddd
        border-radius 5px
        overflow hidden
        margin-bottom 2%
        .file_title
          margin-left 20px
          margin-top 12px
          font-size 13px
          padding-left 5px
          width 100%
          border-left 5px solid #2BDE73
        .file_item
          width 100%
          height 70px
          display flex
          align-items center
          i
            display block
            font-size 30px
            color #F0B775
            margin-left 20px
          span
            font-size 14px
          span:nth-child(2)
            display block
            margin-left 10px
            width 20%
          span:nth-child(3)
            display block
            width 10%
            margin-left 7px
          span:nth-child(4)
            display block
            width 20%
          span:nth-child(5)
            width 32%
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
    .content
      display flex
      flex-flow wrap
      .box_item
        width 45%
        flex-grow 1
        background #ffffff
        padding-bottom 1.5%
        box-shadow 0px 0px 10px #dddddd
        border-radius 5px
        margin-bottom 3%
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
          margin-top 1%
          font-size 12px
          color #aaaaaa
          span:nth-child(1)
            display block
            padding-right 10px
            border-right 2px solid #00a03e
          span:nth-child(2)
            display block
            padding-left 10px
        .message_content
          margin-top 15px
          color #2d2d2d
          margin-left 3%
          margin-right 3%
          line-height 20px
          font-size 13px
          // display: -webkit-box
          // -webkit-box-orient: vertical
          // -webkit-line-clamp: 3
          // overflow: hidden
          // text-overflow:ellipsis
          // display: -moz-box
          // -moz-line-clamp: 3
          // -moz-box-orient: vertical
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
</style>
