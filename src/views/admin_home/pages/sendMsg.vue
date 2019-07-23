<template>
  <div class="send_box">
    <div class="send_title">
      <span class="iconfont">&#xe612;</span>
      <span>发布通知</span>
    </div>
    <!-- 发布通知表单 -->
    <div class="send_content" v-loading="loading">

      <div class="title_item">
        <span>通知标题:</span>
        <el-input maxlength="20" v-model="title" class="title_input" placeholder="请输入通知标题(20字以内)"></el-input>
      </div>

      <div class="content_item">
        <span>通知内容:</span>
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 6}"
          placeholder="请输入通知内容(300字以内)"
          class="area"
          maxlength="300"
          v-model="textarea">
        </el-input>
      </div>

      <div class="uploadFile">
        <span>上传附件(可选)</span>
          <el-upload
          class="upload-demo upload"
          ref="upload"
          action=""
          :on-change="handleChange"
          :auto-upload="false"
          :limit=1
        >
          <el-button  size="small" type="primary">选择文件</el-button>
      </el-upload>
      </div>
      <div class="require">
        <span>要求上传文件</span>
        <el-radio v-model="radio" label="1">不要求</el-radio>
        <el-radio v-model="radio" label="0">要求</el-radio>
      </div>

      <div class="date_pick" v-show="radio === '0'">
        <span>截至时间:</span>
        <el-date-picker
          v-model="date"
          type="datetime"
          value-format="yyyy-MM-dd hh:mm:ss"
          placeholder="选择日期截至时间">
        </el-date-picker>
      </div>

      <div class="send_button">
        <el-button type="success" @click="handleSend" class="button" round>发布通知</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/serverApi.js'
export default {
  data () {
    return {
      title: '',
      textarea: '',
      loading: false,
      date: '',
      radio: '1',
      file: ''
    }
  },
  methods: {
    handleChange (file) {
      const vm = this
      if (file.raw === undefined) {
        vm.file = ''
      } else {
        vm.file = file.raw
      }
    },
    handleSend () {
      const vm = this
      if (vm.textarea === '') {
        vm.$message('请填写通知内容')
      } else if (vm.title === '') {
        vm.$message('请填写通知标题')
      } else if (vm.textarea.length > 300) {
        vm.$message('通知内容不能超过300字')
      } else if (vm.title.length > 20) {
        vm.$message('标题不可超过20字')
      } else if (vm.radio === '0' && vm.date === '') {
        vm.$message('请选择文件上传的截止时间')
      } else {
        vm.sendMsg()
      }
    },
    // 发布通知
    /**
     * id: 用户id
     * message: 发布的信息
     * classId: 发布者classId
     * messageCloseTime2: 截至时间
     * isUpload: 是否需要上传文件
    */
    sendMsg () {
      const vm = this
      vm.loading = true
      const isUpload = Number(vm.radio)
      let data = new FormData()
      data.append('id', sessionStorage.userId)
      data.append('message', vm.textarea)
      data.append('classId', sessionStorage.classId)
      data.append('messageCloseTime2', vm.date)
      data.append('isUpload', isUpload)
      data.append('multipartFile', vm.file)
      data.append('title', vm.title)
      vm.$http.post(api.PublishNews, data)
        .then(res => {
          vm.loading = false
          vm.$message({
            type: 'success',
            message: '发布成功'
          })
          vm.textarea = ''
          vm.radio = '1'
          vm.date = ''
          vm.title = ''
          vm.$refs.upload.uploadFiles = []
          vm.file = ''
        })
        .catch(err => {
          throw new Error(err)
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.send_box
  margin-top 1%
  padding-left 1%
  padding-bottom 3%
  .send_title
    border-bottom 1px solid #dddddd
    padding-bottom 8px
    span:nth-child(1)
      color #4bc2c5
      font-size 40px
    span:nth-child(2)
      display inline-block
      margin-left 3px
      font-size 15px
      color #666
  .send_content
    width 84%
    margin-left auto
    margin-right auto
    .title_item
      margin-top 4%
      display flex
      align-items center
      span
        display inline-block
        font-size 15px
      .title_input
        width 70%
        margin-left 5%
    .content_item
      margin-top 2%
      width 100%
      display flex
      align-items center
      .area
        width 70%
      span
        display inline-block
        // margin-bottom 5%
        margin-right 5%
        font-size 15px
    .date_pick
      margin-top 3%
      width 100%
      span
        display inline-block
        margin-right 5%
        font-size 15px
    .uploadFile
      margin-top 3%
      width 100%
      display flex
      span
        display inline
        margin-right 10px
        font-size 13px
      .upload
        margin-left 10px
        width 20%
    .require
      margin-top 3%
      width 100%
      span
        display inline
        margin-right 3%
        font-size 13px
    .send_button
      margin-top 5%
      .button
        width 82%
</style>
