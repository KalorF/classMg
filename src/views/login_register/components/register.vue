<template>
  <div class="register-box">
    <button class="backButton" @click="back"><i class="el-icon-arrow-left"></i>返回</button>
    <div class="line"></div>
    <div class="register-content">
      <!-- 注册表单 -->
      <el-form :label-position="'left'" label-width="70px" class="formOne">

        <el-form-item label="学号">
          <el-input class="register-item" type="tel"  maxlength="13" @input="whenInput" clearable placeholder="请输入13位学号" v-model="account" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>

        <el-form-item label="班级">
          <el-input :disabled="true" class="register-item" clearable placeholder="所在班级" v-model="className"></el-input>
        </el-form-item>

        <el-form-item label="姓名">
          <el-input class="register-item" clearable placeholder="请输入姓名" v-model="name" onkeyup="value=value.replace(/[\d]/g,'') " maxlength="4"></el-input>
        </el-form-item>

        <el-form-item label="宿舍">
          <el-input class="register-item" clearable placeholder="请输入宿舍 (如2栋B334)" v-model="dorm"></el-input>
        </el-form-item>

        <el-form-item label="手机">
          <el-input class="register-item" type="tel" maxlength="11" clearable placeholder="请输入手机号码" v-model="phone" onkeyup="this.value=this.value.replace(/\D/g,'')"></el-input>
        </el-form-item>

        <el-form-item label="QQ">
          <el-input class="register-item" type="tel" maxlength="13" clearable placeholder="请输入QQ号码" v-model="qq" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>

        <el-form-item label="微信">
          <el-input class="register-item" clearable placeholder="请输入微信号" v-model="wechat"></el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>

      </el-form>

      <el-form :label-position="'left'" label-width="70px" class="formTwo">
        <el-form-item label="密保一">
          <el-input class="register-item" type="tel"  clearable placeholder="设置密保问题一（用于修改密码及找回密码）" v-model="problem1"></el-input>
        </el-form-item>
        <el-form-item label="回答一">
          <el-input class="register-item" type="textarea" v-model="desc1" placeholder="请设置密保一答案"></el-input>
        </el-form-item>
        <el-form-item label="密保二">
          <el-input class="register-item" type="tel"  clearable placeholder="设置密保问题二（用于修改密码及找回密码）" v-model="problem2"></el-input>
        </el-form-item>
        <el-form-item label="回答二">
          <el-input class="register-item" type="textarea" v-model="desc2" placeholder="请设置密保二答案"></el-input>
        </el-form-item>
        <el-form-item label="密保三">
          <el-input class="register-item" type="tel"  clearable placeholder="设置密保问题三（用于修改密码及找回密码）" v-model="problem3"></el-input>
        </el-form-item>
        <el-form-item label="回答三">
          <el-input class="register-item" type="textarea" v-model="desc3" placeholder="请设置密保三答案"></el-input>
        </el-form-item>

        <el-form-item label="密码">
          <el-input class="register-item" placeholder="请输入密码" show-password v-model="pwd"></el-input>
        </el-form-item>

        <el-form-item label="确认密码">
          <el-input class="register-item" placeholder="请再次输入密码" show-password v-model="againPwd"></el-input>
        </el-form-item>
      </el-form>

    </div>
    <el-button class="register-button" @click="handleRegister" type="success">确认注册</el-button>

  </div>
</template>

<script>
import api from '@/serverApi.js'
export default {
  data () {
    return {
      account: '',
      className: '',
      classId: '',
      name: '',
      dorm: '',
      phone: '',
      qq: '',
      wechat: '',
      sex: 0,
      pwd: '',
      againPwd: '',
      problem1: '',
      problem2: '',
      problem3: '',
      desc1: '',
      desc2: '',
      desc3: ''
    }
  },
  created () {
    const vm = this
    vm.getAllGrade()
  },
  methods: {
    // 获取所有班级
    getAllGrade () {
      const vm = this
      vm.$http.get(api.getAllGrade)
        .then(res => {
          vm.options = res.data.data.gradeList
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    // 输入学号时请求
    whenInput (value) {
      const vm = this
      if (value.length === 13) {
        vm.getUserByAccount()
      } else if (value.length !== 13) {
        vm.className = ''
      }
    },
    // 根据学号获取班级
    getUserByAccount () {
      const vm = this
      const params = {
        account: vm.account
      }
      vm.$http.get(api.getUserByAccount, { params: params })
        .then(res => {
          if (res.data.data.user === null) {
            vm.$message('此学号不存在，请重新输入')
          } else {
            vm.className = res.data.data.user.grade.className
            vm.classId = res.data.data.user.grade.id
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    // 点击注册按钮
    handleRegister () {
      const vm = this
      if (vm.account.length === '' ||
      vm.name === '' ||
      vm.phone === '' ||
      vm.dorm === '' ||
      vm.qq === '' ||
      vm.wechat === '' ||
      vm.pwd === '' ||
      vm.againPwd === '' ||
      vm.className === '' ||
      vm.desc1 === '' ||
      vm.desc2 === '' ||
      vm.desc3 === '' ||
      vm.problem1 === '' ||
      vm.problem2 === '' ||
      vm.problem3 === '') {
        vm.$message('请将信息填写完整')
      } else if (!(/^1(3|5|7|8)\d{9}$/.test(vm.phone))) {
        vm.$message('请输入正确手机号')
      } else if (vm.pwd !== vm.againPwd) {
        vm.$message('密码不一致，请重新输入')
      } else {
        vm.toRegister()
      }
    },
    // 注册接口
    toRegister () {
      const vm = this
      const params = {
        account: vm.account,
        name: vm.name,
        dorm: vm.dorm,
        classId: vm.classId,
        phone: vm.phone,
        qq: vm.qq,
        wechat: vm.wechat,
        sex: vm.sex,
        password: vm.againPwd,
        question1: vm.problem1,
        question2: vm.problem2,
        question3: vm.problem3,
        answer1: vm.desc1,
        answer2: vm.desc2,
        answer3: vm.desc3
      }
      vm.$http.get(api.registerUser, { params: params })
        .then(res => {
          if (res.data.code === 0) {
            vm.$message(`${res.data.message}`)
          } else if (res.data.code === 100) {
            vm.$message(`${res.data.message}`)
          } else {
            vm.$message({
              type: 'success',
              message: '注册成功，可进行登录'
            })
            vm.$emit('registerBack')
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    back () {
      const vm = this
      vm.$emit('registerBack')
    }
  }
}
</script>

<style lang="stylus" scoped>
.register-box
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
  .register-content
    width 95%
    display flex
    margin-left 6%
    // margin-right auto
    margin-top 1.5%
    .formOne
      width 50%
      margin-left 5%
      .register-item
        width 70%
      .register-button
        width 65%
        margin-left 8%
    .formTwo
      width 50%
      .register-item
        width 70%
  .register-button
    width 82%
    margin-left 9%
    margin-top 2%
    margin-bottom 5%
</style>
