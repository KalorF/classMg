<template>
  <div class="pwd_box">
    <div class="pwd_content">
       <!-- 密码修改表单 -->
      <el-form :label-position="'left'" label-width="70px">
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
          <el-input class="pwd-item" placeholder="请输入密码" show-password v-model="pwd"></el-input>
        </el-form-item>

        <el-form-item label="确认密码">
          <el-input class="pwd-item" placeholder="请再次输入密码" show-password v-model="againPwd"></el-input>
        </el-form-item>
        <el-button class="pwd-button" @click="cancel" type="warning">取消修改</el-button>
        <el-button class="pwd-button" @click="upPwd" type="success">确认修改</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '@/serverApi.js'
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    encrypted: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      pwd: '',
      againPwd: '',
      answer1: '',
      answer2: '',
      answer3: ''
    }
  },
  methods: {
    cancel () {
      const vm = this
      vm.$emit('hidePwd', true)
    },
    upPwd () {
      const vm = this
      if (vm.pwd !== vm.againPwd) {
        vm.$message({
          message: '密码不一致，请重新输入',
          type: 'warning'
        })
      } else if (vm.answer1 !== vm.encrypted.answer1 || vm.answer2 !== vm.encrypted.answer2 || vm.answer3 !== vm.encrypted.answer3) {
        vm.$message('密保答案不正确，请重新输入')
      } else if (vm.pwd === '' || vm.againPwd === '') {
        vm.$message('请输入密码')
      } else {
        vm.updatePwd()
      }
    },
    // 更新密码按钮
    updatePwd () {
      const vm = this
      const params = {
        id: sessionStorage.userId,
        password: vm.againPwd
      }
      vm.$http.get(api.updatePassword, { params: params })
        .then(res => {
          vm.$message({
            message: '密码修该成功',
            type: 'success'
          })
          vm.$emit('hidePwd', true)
        })
        .catch(err => {
          throw new Error(err)
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.pwd_box
  position absolute
  margin-top 6%
  margin-left 30%
  margin-bottom 5%
  width 40%
  background #ffffff
  box-shadow 0px 0px 10px #dddddd
  padding-bottom 3%
  padding-top 2%
  border-radius 5px
  .pwd_content
    width 400px
    margin-left 10%
    .pwd-item
      width 100%
    .pwd-button
      width 48%
</style>
