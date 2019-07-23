<template>
  <div class="msg_box">
    <!-- 搜索框 -->
    <div class="search_head" v-if="showMsg">
    <el-autocomplete
        class="search_input"
        v-model="result"
        @input="oninput"
        :fetch-suggestions="querySearchAsync"
        @select="handleSelect"
        placeholder="输入通知标题搜索相关通知"
      >
        <i
        class="el-icon-search el-input__icon"
        slot="suffix"
        >
        </i>
      </el-autocomplete>
      <span v-show="showBack" @click="searchBack" class="iconfont">&#xe61a;</span>
    </div>
    <!-- 通知列表 -->
    <div class="msg_content" v-if="showMsg" v-loading="showLoading">
      <div class="msg_item" v-for="(item, index) in formData" :key="index">
        <div class="msg_title">
          <span class="iconfont">&#xe612;</span>
          <span>标题：{{item.title}}</span>
          <i class="iconfont" @click="delMsg(item.id)">&#xe635;</i>
        </div>
        <div class="author"><span>发布时间：{{item.createTime | formatDate}}</span></div>
        <div class="content" v-if="item.message.length > 125">{{ item.message.slice(0, 125) + '...' }}</div>
        <div class="content" v-else>{{item.message}}</div>
        <div class="ctrl">
          <button v-show="item.isUpload === 0" class="ctrl_btn1" @click="viewDormitory(item.id)">宿舍情况</button>
          <button v-show="item.isUpload === 0" class="ctrl_btn2" @click="viewUpload(item.id)">上传情况</button>
          <button class="ctrl_btn3" @click="viewDetail(item)">查看内容</button>
        </div>
      </div>
        <div class="noneData" v-show="showCtrl" v-if="currentPage === totalPage">无更多数据</div>
        <div v-else-if="!formData.length" class="noneData">暂无通知</div>
        <el-button v-show="showCtrl" plain v-else round class="morebottom" @click="showMore">查看更多</el-button>
    </div>
    <el-dialog title="通知内容" :modal = 'false' width="50%" :visible.sync="dialogDetail">
      <div class="detail_title">标题: {{detailTitle}}</div>
      <div class="detatil_author"><span>发布时间：{{createTime | formatDate}}</span></div>
      <div class="detail_content">{{detail}}</div>
    </el-dialog>
     <!-- 弹窗提示 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogdel"
      width="25%"
      :modal = 'false'
      >
      <span>是否删除该通知？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogdel = false">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <uploadStatus v-if="showUploadStatus" :msgId="msgId" @uploadBack ="uploadBack"></uploadStatus>
    <dormitoryStatus v-if="showDorditoryStatus" :msgId="msgId" @dormitoryBack="dormitoryBack"></dormitoryStatus>
  </div>
</template>

<script>
import uploadStatus from '@/views/admin_home/pages/uploadStatus.vue'
import dormitoryStatus from '@/views/admin_home/pages/dormitoryStatus.vue'
import api from '@/serverApi.js'
import { formatDate } from '@/date.js'
export default {
  data () {
    return {
      showMsg: true,
      showCtrl: true,
      showLoading: true,
      showUploadStatus: false,
      showDorditoryStatus: false,
      dialogdel: false,
      formData: [],
      allData: [],
      currentPage: 1,
      pagesize: 6,
      totalPage: '',
      msgId: '',
      result: '',
      showBack: false,
      dialogDetail: false,
      detailTitle: '',
      createTime: '',
      detail: '',
      messageId: ''
    }
  },
  // 时间戳转换
  filters: {
    formatDate (time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  components: {
    uploadStatus,
    dormitoryStatus
  },
  created () {
    const vm = this
    vm.getData()
  },
  methods: {
    delMsg (id) {
      const vm = this
      vm.messageId = id
      vm.dialogdel = true
    },
    // 点击确认删除按钮事件
    dialogConfirm () {
      const vm = this
      const params = {
        id: vm.messageId
      }
      vm.$http.get(api.delMessage, { params: params })
        .then(res => {
          vm.$message({
            type: 'success',
            message: '删除成功'
          })
          vm.dialogdel = false
          vm.showBack = false
          vm.showCtrl = true
          vm.result = ''
          vm.currentPage = 1
          vm.totalPage = ''
          vm.getData()
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    // 查看通知详情
    viewDetail (item) {
      const vm = this
      vm.dialogDetail = true
      vm.detail = item.message
      vm.detailTitle = item.title
      vm.createTime = item.createTime
    },
    // 获取通知信息
    getData () {
      const vm = this
      const params = {
        classId: sessionStorage.classId,
        uploaderId: sessionStorage.userId
      }
      vm.$http.get(api.AdminGetMessage, { params: params })
        .then(res => {
          vm.allData = res.data.data.publishMessageList
          vm.formData = vm.allData.slice(0, vm.pagesize)
          vm.totalPage = Math.ceil(vm.allData.length / vm.pagesize)
          vm.showLoading = false
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    // 点击搜索返回按钮事件
    searchBack () {
      const vm = this
      vm.showBack = false
      vm.showCtrl = true
      vm.result = ''
      vm.currentPage = 1
      vm.totalPage = ''
      vm.getData()
    },
    // 监听搜索框的值为空时触发的事件
    oninput (value) {
      const vm = this
      if (value === '') {
        vm.showCtrl = true
        vm.showBack = false
        vm.getData()
      }
    },
    // 搜索通知
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
      vm.$http.get(api.AdminFuzzySearchByName, { params: params })
        .then((response) => {
          // 在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示
          if (isEmptyObject(response.data.data)) {
            console.log(1)
            list = []
            callback(list)
          } else {
            for (let i of response.data.data.publishMessageList) {
              i.value = i.title // 将想要展示的数据作为value
            }
            list = response.data.data.publishMessageList
            callback(list)
          }
        }).catch((error) => {
          console.log(error)
        })
    },
    handleSelect (e) {
      const vm = this
      vm.showCtrl = false
      vm.showBack = true
      vm.totalPage = ''
      vm.currentPage = 1
      vm.formData = []
      vm.formData.push(e)
    },
    // 展示更多
    showMore () {
      const vm = this
      let page = vm.currentPage
      if (page < vm.totalPage) {
        vm.currentPage++
        const data = vm.allData.slice((vm.currentPage - 1) * vm.pagesize, vm.currentPage * vm.pagesize)
        data.map(item => {
          vm.formData.push(item)
        })
      }
    },
    viewUpload (id) {
      const vm = this
      vm.msgId = id
      vm.showMsg = false
      vm.showUploadStatus = true
    },
    viewDormitory (id) {
      const vm = this
      vm.msgId = id
      vm.showMsg = false
      vm.showDorditoryStatus = true
    },
    uploadBack () {
      const vm = this
      vm.showMsg = true
      vm.showUploadStatus = false
    },
    dormitoryBack () {
      const vm = this
      vm.showMsg = true
      vm.showDorditoryStatus = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.msg_box
  width 95%
  margin-top 2%
  margin-left auto
  margin-right auto
  margin-bottom 3%
  .detail_title
    border-left 5px solid #1fb27f
    padding-left 6px
    font-size 18px
  .detatil_author
    display flex
    color #aaaaaa
    margin-top 2%
    font-size 13px
  .detail_content
    margin-top 2%
    line-height 20px
  .morebottom
    width 60%
    margin-left 20%
  .noneData
    text-align center
    width 100%
    font-size 15px
    color #aaaaaa
  .search_head
    display flex
    align-items center
    margin-bottom 2%
    .search_input
      width 30%
    span
      display block
      margin-left 2%
      cursor default
      color #2694ab
      font-size 35px
      margin-top 2px
      transition all .3s
    span:hover
      color #41b6e6
      transform translateX(-3px)
  .msg_content
    display flex
    flex-flow wrap
    .msg_item
      width 46%
      padding-bottom 2%
      background #ffffff
      border-radius 5px
      box-shadow 0px 0px 10px #dddddd
      margin-right 3%
      margin-bottom 3%
      cursor default
      transition all .2s
      .msg_title
        height 25px
        line-height 35px
        padding-left 3%
        padding-bottom 10px
        border-bottom 1px solid #f5f5fa
        span:nth-child(1)
          color #4bc2c5
          font-size 25px
        span:nth-child(2)
          font-size 13px
          margin-left 5px
        i
          float right
          font-size 20px
          color #FF0000
          margin-right 3%
          cursor pointer
        i:hover
          color #FF2E63
      .author
        display flex
        margin-left 3%
        margin-top 1.5%
        font-size 12px
        color #aaaaaa
        span
          display block
          padding-right 10px
      .content
        padding-left 3%
        line-height 20px
        padding-right 3%
        margin-top 2%
        font-size 14px
        color #666666
      .ctrl
        margin-top 7%
        font-size 14px
        .ctrl_btn1
          float right
          display inline-block
          margin-right 3%
          color #39BAE8
          border 1px solid #39BAE8
          cursor pointer
          width 20%
          height 25px
          border-radius 5px
          background transparent
          transition all .3s
          margin-left 2%
        .ctrl_btn1:hover
          color #1794A5
          border 1px solid #1794A5
        .ctrl_btn2
          float right
          color #d0a727
          border 1px solid #d0a727
          cursor pointer
          width 20%
          height 25px
          border-radius 5px
          transition all .3s
          background transparent
        .ctrl_btn2:hover
          color #F0B775
          border 1px solid #F0B775
        .ctrl_btn3
          float right
          color #00c07f
          border 1px solid #00c07f
          cursor pointer
          width 20%
          height 25px
          margin-right 10px
          border-radius 5px
          transition all .3s
          background transparent
        .ctrl_btn3:hover
          color #35CE8D
          border 1px solid #35CE8D
    .msg_item:hover
      overflow hidden
      box-shadow 0px 0px 10px #4bc2c5
      transform translateY(-3px)
</style>
