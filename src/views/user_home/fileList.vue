<template>
  <div class="file_list_box">
    <div class="file_content">
      <div class="item" v-for="(item, index) of fileList" :key="index">
        <div class="file_title">所属通知：{{item.publishMessage.title}}</div>
        <div class="file_item">
          <i class="iconfont">&#xe601;</i>
          <span>{{item.fileName}}</span>
          <span>{{item.size}}</span>
          <span>上传者：{{item.publishMessage.uploaderName}}</span>
          <span>上传时间：{{item.createTime | formatDate}}</span>
          <el-button type="success" size="small" @click="downLoadFile(item.fileName)">下载</el-button>
        </div>
      </div>
      <!-- 加载更多 -->
      <div class="noneData" v-if="currentPage === totalPage">无更多文件</div>
      <div v-else-if="!fileList.length" class="noneData">暂无文件</div>
      <el-button plain v-else round class="morebottom" @click="showMore">查看更多</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/serverApi.js'
import { formatDate } from '@/date.js'
export default {
  data () {
    return {
      allData: [],
      fileList: [],
      currentPage: 1,
      pagesize: 6,
      totalPage: ''
    }
  },
  // 时间戳转换
  filters: {
    formatDate (time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  created () {
    this.getFileList()
  },
  methods: {
    getFileList () {
      const vm = this
      const params = {
        classId: sessionStorage.classId
      }
      // 把KB转换为MB
      function size (fileSize) {
        if (fileSize < 1024) {
          return fileSize + 'KB'
        } else {
          return (fileSize / 1024).toFixed(2) + 'MB'
        }
      }
      vm.$http.get(api.getAllAdminFileByClassId, { params: params })
        .then(res => {
          vm.allData = res.data.data.fileList
          vm.allData.map(item => {
            vm.$set(item, 'size', size(item.fileSize))
          })
          vm.allData.reverse()
          vm.fileList = vm.allData.slice(0, vm.pagesize)
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
          vm.fileList.push(item)
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
    download (url) {
      let a = document.createElement('a')
      let e = document.createEvent('MouseEvents') // 创建鼠标事件对象
      e.initEvent('click', false, false) // 初始化事件对象
      a.href = url
      a.download = ''
      a.dispatchEvent(e) // 给指定事件执行click事件
    },
    // 下载文件
    downLoadFile (fileName) {
      const vm = this
      if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileName)) {
        vm.downloadImg(api.dwonloadUrl + fileName, fileName)
      } else {
        vm.download(api.dwonloadUrl + fileName)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.file_list_box
  position absolute
  margin-top 11%
  margin-left 27%
  width 70%
  .file_content
    width 96%
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
    .item
      height 100px
      box-shadow 0px 0px 10px #dddddd
      background #ffffff
      border-radius 5px
      overflow hidden
      margin-bottom 2%
      transition all .2s
      cursor default
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
          display: -webkit-box
          -webkit-box-orient: vertical
          -webkit-line-clamp: 1
          overflow: hidden
          text-overflow:ellipsis
          width 20%
        span:nth-child(3)
          display block
          margin-left 5px
          width 10%
        span:nth-child(4)
          display block
          width 20%
        span:nth-child(5)
          width 32%
    .item:hover
      overflow hidden
      box-shadow 0px 0px 10px #4bc2c5
      transform translateX(-3px)
</style>
