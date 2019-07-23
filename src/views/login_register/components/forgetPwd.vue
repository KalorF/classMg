<template>
  <div class="forget_pwd_box">
    <button class="backButton" @click="back"><i class="el-icon-arrow-left"></i>返回</button>
    <div class="line"></div>
    <!-- 输入账号获取密保 -->
    <div v-if="showInput" class="input_content">
      <el-input class="item" v-model="account" placeholder="输入账号获取密保进行修改"></el-input>
      <el-button class="input_button" @click="confirm" type="success">确认</el-button>
    </div>
    <!-- 通过密保找回 -->
    <div v-if="showPwdBox" class="forgetPwd-content">
      <el-form :label-position="'left'" label-width="70px" class="formTwo">
        <el-form-item label="密保一">
          {{encrypted.question1}}
        </el-form-item>
        <el-form-item label="回答一">
          <el-input class="register-item" type="textarea" v-model="answer1" placeholder="请输入密保一答案"></el-input>
        </el-form-item>
        <el-form-item label="密保二">
          {{encrypted.question2}}
        </el-form-item>
        <el-form-item label="回答二">
          <el-input class="register-item" type="textarea" v-model="answer2" placeholder="请输入密保二答案"></el-input>
        </el-form-item>
        <el-form-item label="密保三">
          {{encrypted.question3}}
        </el-form-item>
        <el-form-item label="回答三">
          <el-input class="register-item" type="textarea" v-model="answer3" placeholder="请输入密保三答案"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input class="register-item" placeholder="请输入密码" show-password v-model="pwd"></el-input>
        </el-form-item>

        <el-form-item label="确认密码">
          <el-input class="register-item" placeholder="请再次输入密码" show-password v-model="againPwd"></el-input>
        </el-form-item>
      </el-form>
      <div class="tip">（回答密保问题即可修改密码）</div>
      <el-button class="forgetPwd_button" @click="handlepwd" type="success">确认修改</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/serverApi.js'
export default {
  data () {
    return {
      showInput: true,
      showPwdBox: false,
      account: '',
      answer1: '',
      answer2: '',
      answer3: '',
      encrypted: '',
      pwd: '',
      againPwd: '',
      userId: ''
    }
  },
  methods: {
    back () {
      const vm = this
      vm.$emit('forgetPwdBack')
    },
    handlepwd () {
      const vm = this
      if (vm.answer1 !== vm.encrypted.answer1 || vm.answer2 !== vm.encrypted.answer2 || vm.answer3 !== vm.encrypted.answer3) {
        vm.$message('密保答案不正确，请重新输入')
      } else if (vm.againPwd === '' || vm.pwd === '') {
        vm.$message('请输入密码')
      } else if (vm.pwd !== vm.againPwd) {
        vm.$message('密码不一致，请重新输入')
      } else {
        vm.updatePassword()
      }
    },
    // 修改密码接口
    updatePassword () {
      const vm = this
      const params = {
        id: vm.userId,
        password: vm.againPwd
      }
      vm.$http.get(api.updatePassword, { params: params })
        .then(res => {
          vm.$message({
            type: 'success',
            message: '修改成功，可登陆'
          })
          setTimeout(() => {
            vm.$emit('forgetPwdBack')
          }, 300)
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    confirm () {
      const vm = this
      if (vm.account === '') {
        vm.$message('请输入学号获取密保')
      } else {
        vm.getUserByAccount()
      }
    },
    // 根据学号获取密保
    getUserByAccount () {
      const vm = this
      const params = {
        account: vm.account
      }
      vm.$http.get(api.getUserByAccount, { params: params })
        .then(res => {
          if (res.data.code === 100) {
            vm.$message('账号不正确，请输入正确的账号')
          } else {
            vm.encrypted = res.data.data.user.encrypted
            vm.userId = res.data.data.user.id
            vm.showInput = false
            vm.showPwdBox = true
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.forget_pwd_box
  width 98%
  margin 6% auto
  background #fff
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
  .input_content
    margin-top 5%
    width 40%
    display flex
    margin-left auto
    margin-right auto
    padding-bottom 20%
    .item
      width 60%
    .input_button
      margin-left 10px
      width 18%
  .forgetPwd-content
    width 35%
    margin-left auto
    margin-right auto
    margin-top 2%
  .tip
    font-size 14px
    float right
    color #aaaaaa
  .forgetPwd_button
    width 100%
    margin-top 5%
    margin-bottom 8%
</style>
