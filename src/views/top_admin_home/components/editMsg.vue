<template>
  <div class="edit_box">
    <button @click="back" class="backButton"><i class="el-icon-arrow-left"></i>返回</button>
    <div class="line"></div>
    <div class="editcontent">
      <el-form :label-position="'left'" label-width="70px">

        <el-form-item label="学号">
          <el-input class="register-item" type="tel"  clearable placeholder="请输入学号" v-model="account" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
        </el-form-item>

        <el-form-item label="姓名">
          <el-input class="register-item" clearable placeholder="请输入姓名" v-model="name"></el-input>
        </el-form-item>

        <el-form-item label="班级">
          <el-select v-model="value" style="width: 100%" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.className"
              :label="item.className"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="宿舍">
          <el-input class="register-item" clearable placeholder="请输入宿舍 (如2栋B408)" v-model="dorm"></el-input>
        </el-form-item>

        <el-form-item label="手机">
          <el-input class="register-item" type="tel" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')" clearable placeholder="请输入手机号码" v-model="phone"></el-input>
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

        <el-button class="edit-button" @click="upMsg" type="success">确认修改</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from '@/serverApi.js'
export default {
  data () {
    return {
      account: this.userInfo.account,
      name: this.userInfo.name,
      dorm: this.userInfo.dorm,
      phone: this.userInfo.phone,
      qq: this.userInfo.qq,
      wechat: this.userInfo.wechat,
      sex: this.userInfo.sex,
      options: '',
      value: this.userInfo.classId
    }
  },
  props: {
    userInfo: {
      type: Object,
      default: null
    }
  },
  created () {
    const vm = this
    vm.getAllGrade()
  },
  methods: {
    back () {
      const vm = this
      vm.$emit('editBack', true)
    },
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
    // 信息更新接口
    updateStudentMessage () {
      const vm = this
      const params = {
        id: vm.userInfo.id,
        account: vm.account,
        name: vm.name,
        dorm: vm.dorm,
        phone: vm.phone,
        sex: vm.sex,
        qq: vm.qq,
        wechat: vm.wechat,
        classId: vm.value
      }
      vm.$http.get(api.updateStudentMessage, { params: params })
        .then(res => {
          vm.$message({
            type: 'success',
            message: '修改成功'
          })
          vm.$emit('editBack', true)
          vm.$emit('upDate')
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    // 点击确认修改按钮触发
    upMsg () {
      const vm = this
      if (vm.account === null || vm.name === null || vm.dorm === null || vm.phone === null || vm.sex === null || vm.qq === null || vm.wechat === null) {
        vm.$message('请将信息填写完整')
      } else if (vm.value === '') {
        vm.$message('请选择班级')
      } else if (!/^1(3|5|7|8)\d{9}$/.test(vm.phone)) {
        vm.$message('请输入正确手机号')
      } else {
        vm.updateStudentMessage()
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.edit_box
  width 100%
  padding-bottom 2%
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
    width 100%
    margin-top 10px
    background-color #dddddd
  .editcontent
    margin-top 2%
    width 40%
    .edit-button
      width 100%
</style>
