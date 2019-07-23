<template>
  <div class="login-register-box">
    <!-- <div class="bkg" :style="background"></div> -->
    <div class="head_title">
      <i class="iconfont">&#xe640;</i>
      <span>学生自主班级管理系统</span>
    </div>
    <div class="content" v-loading="loading">
      <div class="login-box" v-show="showLogin">
        <div class="login_title"><span>用户登录</span></div>
        <div class="login-content">
          <!-- 登陆表单 -->
          <el-form :label-position="'right'" label-width="60px" :model="form">
            <el-form-item label="账号">
              <el-input class="input-item" clearable placeholder="请输入账号" v-model="form.account" oninput = "value=value.replace(/[^\d]/g,'')"></el-input>
            </el-form-item>

            <el-form-item label="密码">
              <el-input class="input-item" placeholder="请输入密码" show-password v-model="form.password"></el-input>
            </el-form-item>

            <el-form-item label="类型">
              <el-radio-group v-model="type">
                <el-radio :label="2">普通用户</el-radio>
                <el-radio :label="1">管理员</el-radio>
                <el-radio :label="0">高级管理员</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-button
            class="login-button"
            @click="login"
            type="success"
            >登陆</el-button>
          </el-form>
        </div>
        <div class="footer">
          <span @click="toForgetPwd">忘记密码</span>
          <span @click="toRegister">用户注册</span>
        </div>
      </div>

      <register @registerBack="registerBack" v-if="showRegister"></register>
      <forgetPwd @forgetPwdBack="forgetPwdBack" v-if="showForgetPwd"></forgetPwd>
    </div>
  </div>
</template>

<script>
import forgetPwd from '@/views/login_register/components/forgetPwd.vue'
import register from '@/views/login_register/components/register.vue'
import api from '@/serverApi.js'
export default {
  components: {
    register,
    forgetPwd
  },
  data () {
    return {
      showLogin: true,
      showRegister: false,
      showForgetPwd: false,
      loading: false,
      form: {
        account: '',
        password: ''
      },
      type: 2
      // background: {
      //   backgroundImage: 'url(' + require('@/assets/timg.jpg') + ')'
      // }
    }
  },
  methods: {
    login () {
      const vm = this
      if (vm.form.account === '' || vm.form.password === '') {
        vm.$message('请填写账号信息')
      } else {
        // const loading = vm.$loading({
        //   lock: true,
        //   text: 'Loading',
        //   spinner: 'el-icon-loading',
        //   background: 'rgba(255, 255, 255, 0.1)'
        // })
        // setTimeout(() => {
        //   loading.close()
        // }, 800)
        vm.loading = true
        vm.loginInterface()
      }
    },
    // 用户登陆
    loginInterface () {
      const vm = this
      const account = vm.form.account
      const password = vm.form.password
      const status = vm.type
      const params = { account: account, password: password }
      vm.$http.get(api.login + status, { params: params })
        .then(res => {
          vm.loading = false
          if (status === 0) {
            if (res.data.code === 0) {
              vm.$message('账号密码不匹配，请重新输入')
            } else {
              sessionStorage.status = status
              vm.form.account = ''
              vm.form.password = ''
              vm.$router.replace({ name: 'topaAdminHome', query: { time: new Date().getTime() } })
            }
          } else if (status === 1) {
            if (res.data.code === 0) {
              vm.$message('账号密码不匹配，请重新输入')
            } else {
              vm.form.account = ''
              vm.form.password = ''
              console.log(res.data.data.User)
              sessionStorage.status = status
              sessionStorage.userId = res.data.data.User.id
              sessionStorage.classId = res.data.data.User.classId
              vm.$router.replace({ name: 'adminHome', query: { time: new Date().getTime() } })
            }
          } else if (status === 2) {
            if (res.data.code === 0) {
              vm.$message('账号密码不匹配，请重新输入')
            } else {
              vm.form.account = ''
              vm.form.password = ''
              sessionStorage.status = status
              sessionStorage.userId = res.data.data.User.id
              sessionStorage.classId = res.data.data.User.classId
              vm.$router.replace({ name: 'home', query: { time: new Date().getTime() } })
            }
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    toRegister () {
      const vm = this
      vm.showLogin = false
      vm.showRegister = true
    },
    registerBack () {
      const vm = this
      vm.showLogin = true
      vm.showRegister = false
    },
    toForgetPwd () {
      const vm = this
      vm.showForgetPwd = true
      vm.showLogin = false
    },
    forgetPwdBack () {
      const vm = this
      vm.showLogin = true
      vm.showForgetPwd = false
    }
  }
}
</script>

<style lang="stylus" scoped>
.login-register-box
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  .head_title
    height 68px
    display flex
    position fixed
    width 100%
    z-index 3
    line-height 68px
    background  #3dd9d6
    // background #00b0ff
    box-shadow 1px 4px 3px #eeeeee
    i
      font-size 40px
      color #ffffff
      display inline-block
      margin-left 2%
    span
      display inline-block
      margin-left 2px
      font-size 20px
      color #fff
  .content
    margin-top 10px
    .login-box
      width 40%
      margin 8% auto
      // padding-top 1%
      padding-bottom 1.5%
      background-color #ffffff
      border-radius 5px
      overflow hidden
      box-shadow 0px 0px 10px #dddddd
      .login_title
        height 40px
        text-align center
        line-height 40px
        background #4bc2c5
        span
          color #ffffff
          font-weight bold
          font-size 17px
      .login-content
        margin-top 3%
        width 80%
        margin-left 18%
        .input-item
          width 70%
        .login-button
          width 65%
          margin-left 8%
      .footer
        margin-top 4%
        width 100%
        font-size 14px
        color #62C8A5
        cursor pointer
        span:nth-child(1)
          float right
          display inline-block
          margin-right 4%
        span:nth-child(2)
          float right
          display inline-block
          padding-right 10px
          border-right 3px solid #eeeeee
          margin-right 10px
        span:hover
          color #5BE7C4
</style>
