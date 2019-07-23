<template>
  <div class="pwd_box">
    <div class="pwd_content">
       <!-- 密码修改表单 -->
      <el-form :label-position="'left'" label-width="70px">
        <el-form-item label="密码">
          <el-input class="pwd-item" placeholder="请输入密码" show-password v-model="pwd"></el-input>
        </el-form-item>

        <el-form-item label="确认密码">
          <el-input class="pwd-item" placeholder="请再次输入密码" show-password v-model="againPwd"></el-input>
        </el-form-item>
        <el-button class="pwd-button" @click="upPwd" type="success">确认修改</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '@/serverApi.js'
export default {
  data () {
    return {
      pwd: '',
      againPwd: ''
    }
  },
  methods: {
    upPwd () {
      const vm = this
      if (vm.pwd !== vm.againPwd) {
        vm.$message({
          message: '密码不一致，请重新输入',
          type: 'warning'
        })
      } else if (vm.pwd === '' || vm.againPwd === '') {
        vm.$message('请输入密码')
      } else {
        vm.updatePwd()
      }
    },
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
          vm.pwd = ''
          vm.againPwd = ''
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
  margin-top 3%
  margin-left 3%
  width 40%
  box-shadow 0px 0px 10px #dddddd
  padding-bottom 20px
  padding-top 30px
  border-radius 5px
  .pwd_content
    width 400px
    margin-left 10%
    .pwd-item
      width 70%
    .pwd-button
      width 75%
</style>
