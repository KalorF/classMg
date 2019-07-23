<template>
  <div class="home-box">
    <div class="head">
      <i class="iconfont">&#xe640;</i>
      <span class="head-title">学生自主班级管理系统</span>
      <button @click="upPwd" class="head_buttom" v-show="showHome">修改密码</button>
      <button @click="logout" class="head_buttom" v-show="showHome">退出登陆</button>
    </div>
    <div v-show="showHome">
    <hide>
      <div class="message-box" v-if="isShow">
        <div class="msg_title">
          <div class="iconfont msg_img">&#xe62f;</div>
          <span class="thisSpan">个人信息</span>
          <span class="thisSpanSec" @click="edit">修改</span>
        </div>
        <div class="msg_item">
          <span>姓名：</span>
          <span>{{ userInfo.name }}</span>
        </div>
        <div class="msg_item">
          <span>班级：</span>
          <span>{{ userInfo.className }}</span>
        </div>
        <div class="msg_item">
          <span>宿舍：</span>
          <span>{{ userInfo.dorm }}</span>
        </div>
        <div class="msg_item">
          <span>性别：</span>
          <span v-if="userInfo.sex === 0">男</span>
          <span v-else>女</span>
        </div>
        <div class="msg_item">
          <span>电话：</span>
          <span>{{ userInfo.phone }}</span>
        </div>
        <div class="msg_item">
          <span>学号：</span>
          <span>{{ userInfo.account }}</span>
        </div>
        <div class="msg_item">
          <span>QQ：</span>
          <span>{{ userInfo.qq }}</span>
        </div>
        <div class="msg_item">
          <span>微信：</span>
          <span>{{ userInfo.wechat }}</span>
        </div>
      </div>
    </hide>

    <div class="select_title" v-if="showSelect">
      <i class="iconfont">&#xe6a1;</i>
      <span :class="{active: item === 0}" @click="msg">通知信息</span>
      <span :class="{active: item === 1}" @click="file">文件目录</span>
      <span :class="{active: item === 2}" @click="classMember">班级成员</span>
      <div @click="toSearch">
        <i class="el-icon-search"></i>
        <b>搜索</b>
      </div>
    </div>

    <message v-show="showMsg"></message>
    <fileList v-show="showFile"></fileList>
    <classMember v-show="showMember"></classMember>
    <hide>
      <edit v-if="showEdit" @upDate="upDate" :userInfo="userInfo" :show="showEdit" @back="back"></edit>
    </hide>

    </div>
    <transition name="slide">
      <serarch @searchBack="searchBack" v-if="showSearch"></serarch>
    </transition>
    <hide>
      <uppassword v-if="showPwd" :encrypted="encrypted" :show="showPwd" @hidePwd="hidePwd"></uppassword>
    </hide>
  </div>
</template>

<script>
import message from '@/views/user_home/message.vue'
import edit from '@/views/user_home/edit.vue'
import uppassword from '@/views/user_home/uppassword.vue'
import fileList from '@/views/user_home/fileList.vue'
import classMember from '@/views/user_home/classMember.vue'
import serarch from '@/views/user_home/serarch.vue'
import hide from '@/components/hide.vue'
import api from '@/serverApi.js'
export default {
  components: {
    message,
    hide,
    edit,
    uppassword,
    fileList,
    serarch,
    classMember
  },
  data () {
    return {
      showHome: true,
      showSearch: false,
      isShow: true,
      showMsg: true,
      showSelect: true,
      showFile: false,
      showMember: false,
      showEdit: false,
      showPwd: false,
      item: 0,
      userInfo: '',
      encrypted: ''
    }
  },
  created () {
    const vm = this
    vm.getUserInfo()
  },
  methods: {
    // 获取用户信息
    getUserInfo () {
      const vm = this
      const userId = sessionStorage.userId
      const params = { id: userId }
      vm.$http.get(api.getUserMessageById, { params: params })
        .then(res => {
          console.log(res.data)
          let info = res.data.data.user
          vm.$set(info, 'className', info.grade.className)
          vm.userInfo = info
          vm.encrypted = res.data.data.user.encrypted
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    upDate () {
      const vm = this
      vm.getUserInfo()
    },
    // 点击退出登录按钮
    logout () {
      const vm = this
      sessionStorage.clear()
      vm.$router.replace({ path: '/' })
    },
    // 点击修改信息按钮
    edit () {
      const vm = this
      vm.isShow = false
      vm.showSelect = false
      if (vm.showMsg) {
        vm.showMsg = false
      } else if (vm.showFile) {
        vm.showFile = false
      } else if (vm.showMember) {
        vm.showMember = false
      }
      vm.showEdit = true
    },
    // 点击修改密码按钮
    upPwd () {
      const vm = this
      vm.isShow = false
      vm.showSelect = false
      if (vm.showMsg) {
        vm.showMsg = false
      } else if (vm.showFile) {
        vm.showFile = false
      } else if (vm.showMember) {
        vm.showMember = false
      }
      vm.showPwd = true
    },
    back (e) {
      const vm = this
      vm.isShow = e
      if (vm.item === 0) {
        vm.showMsg = true
      } else if (vm.item === 1) {
        vm.showFile = true
      } else if (vm.item === 2) {
        vm.showMember = true
      }
      vm.showSelect = true
      vm.showEdit = false
    },
    hidePwd (e) {
      const vm = this
      vm.isShow = e
      if (vm.item === 0) {
        vm.showMsg = true
      } else if (vm.item === 1) {
        vm.showFile = true
      } else if (vm.item === 2) {
        vm.showMember = true
      }
      vm.showSelect = true
      vm.showPwd = false
    },
    msg () {
      const vm = this
      vm.item = 0
      vm.showMsg = true
      vm.showFile = false
      vm.showMember = false
    },
    file () {
      const vm = this
      vm.showFile = true
      vm.showMsg = false
      vm.showMember = false
      vm.item = 1
    },
    classMember () {
      const vm = this
      vm.showMember = true
      vm.showMsg = false
      vm.showFile = false
      vm.item = 2
    },
    toSearch () {
      const vm = this
      vm.showHome = false
      vm.showSearch = true
    },
    searchBack () {
      const vm = this
      vm.showHome = true
      vm.showSearch = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.slide-enter, .slide-leave-to
  transform translateY(-100%)
.slide-enter-active, .slide-leave-active
  transition all .4s
.home-box
  position relative
  .head
    position fixed
    z-index 3
    height 58px
    line-height 58px
    display flex
    width 100%
    background #3dd9d6
    box-shadow 1px 3px 3px #eeeeee
    i
      margin-left 20px
      display inline-block
      font-size 40px
      color #ffffff
    .head-title
      display inline-block
      color #ffffff
      padding-left 5px
      width 78%
      font-size 20px
    .head_buttom
      width 100px
      height 40px
      margin-top 10px
      margin-right 10px
      background-color #ffffff
      border-radius 50px
      font-size 14px
      color #41b6e6
      cursor pointer
      font-weight 600
      transition all .5s
    .head_buttom:hover
      border 1px solid #41b6e6
      color #50C1E9
  .message-box
    position absolute
    background #ffffff
    width 19%
    padding-bottom 20px
    border-radius 5px
    box-shadow 0px 0px 10px #dddddd
    margin-top 6%
    left 2%
    transition all .3s
    .msg_title
      border-bottom 1px solid #f5f7fa
      padding-bottom 4px
      margin-bottom 14px
      .msg_img
        font-size 30px
        color #aaaaaa
        margin-top 3px
        display inline-block
        margin-left 5px
      .thisSpan
        display inline-block
        margin-left 8px
        font-size 16px
        color #aaaaaa
      .thisSpanSec
        float right
        line-height 40px
        font-size 14px
        margin-right 10px
        color #41b6e6
        cursor pointer
      .thisSpanSec:hover
        color #50C1E9
    .msg_item
      margin-left 12%
      margin-top 3%
      font-size 12px
      color #393E46
      span:nth-child(1)
        font-size 15px
      span:nth-child(2)
        color #505050
  .message-box:hover
    box-shadow 0px 0px 10px #4bc2c5
  .select_title
    position absolute
    background #ffffff
    box-shadow 0px 0px 10px #dddddd
    margin-top 6%
    margin-left 27%
    height 50px
    align-items center
    width 67%
    border-radius 5px
    display flex
    i
      display inline-block
      color #aaaaaa
      margin-left 10px
      font-size 28px
    span:nth-child(2)
      display block
      font-size 15px
      cursor pointer
      border-right 3px solid #eeeeee
      padding-right 10px
      padding-left 5px
    span:nth-child(3)
      display block
      font-size 15px
      cursor pointer
      padding-left 10px
      padding-right 10px
      border-right 3px solid #eeeeee
    span:nth-child(4)
      isplay block
      font-size 15px
      cursor pointer
      padding-left 10px
      width 61%
    div
      display flex
      align-items center
      width 13%
      height 30px
      box-shadow 0px 0px 10px #ccc
      cursor default
      border-radius 10px
      transition all .3s
      b
        color #aaaaaa
        display block
        margin-left 15px
        font-size 14px
      i
        font-size 25px
    div:hover
      box-shadow 0px 0px 10px #4bc2c5
    .active
      color #62C8A5
</style>
