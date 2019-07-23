<template>
  <div class="hadUpload_box">
    <!-- 已上传学生表单 -->
    <el-table
    :data="message.slice((currentPage-1)*pagesize,currentPage*pagesize)"
    style="width: 100%">
      <el-table-column
        label="姓名"
        width="180">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p v-if="scope.row.qq !== null">QQ: {{ scope.row.qq }}</p>
            <p v-else>QQ: 未填写</p>
            <p v-if="scope.row.wechat !== null">微信: {{ scope.row.wechat }}</p>
            <p v-else>微信: 未填写</p>
            <p v-if="scope.row.sex === 0">性别: 男</p>
            <p v-else-if="scope.row.sex === 1">性别: 女</p>
            <p v-else>性别: 未填写</p>
            <div slot="reference" class="name-wrapper">
              {{ scope.row.name }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="学号"
        width="180">
        <template slot-scope="scope">
          {{scope.row.account}}
        </template>
      </el-table-column>
      <el-table-column
        label="宿舍"
        width="180">
        <template slot-scope="scope">
          {{scope.row.dorm}}
        </template>
      </el-table-column>
      <el-table-column
        label="手机"
        width="180">
        <template slot-scope="scope">
          {{scope.row.phone}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="success"
            @click="handleUpload(scope.$index, scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="page"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pagesize"
      :total="message.length">
    </el-pagination>
  </div>
</template>

<script>
import api from '@/serverApi.js'
export default {
  props: ['message'],
  data () {
    return {
      tableData: [],
      currentPage: 1,
      pagesize: 8
    }
  },
  methods: {
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
    // 点击下载的事件
    handleUpload (index, row) {
      const vm = this
      const fileName = row.file.fileName
      if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/.test(fileName)) {
        vm.downloadImg(api.dwonloadUrl + fileName, fileName)
      } else {
        vm.download(api.dwonloadUrl + fileName)
      }
    },
    handleCurrentChange: function (currentPage) {
      const vm = this
      vm.currentPage = currentPage
      console.log(this.currentPage) // 点击第几页
    }
  }
}
</script>

<style lang="stylus" scoped>
.hadUpload_box
  width 95%
  margin-left auto
  margin-right auto
  padding-bottom 3%
  .page
    margin-top 1.5%
</style>
