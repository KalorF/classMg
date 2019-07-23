<template>
  <div class="edit_box">
    <!-- 修改信息表单 -->
    <div class="edit_content">
      <el-form :label-position="'left'" label-width="70px">

        <el-form-item label="学号">
          <el-input class="edit-item" :disabled="true" type="tel"  clearable placeholder="请输入学号" v-model="account"></el-input>
        </el-form-item>

        <el-form-item label="姓名">
          <el-input class="edit-item" :disabled="true" clearable placeholder="请输入姓名" v-model="name"></el-input>
        </el-form-item>

        <el-form-item label="班级">
          <el-input class="edit-item" :disabled="true" clearable placeholder="请输入姓名" v-model="className"></el-input>
        </el-form-item>

        <el-form-item label="宿舍">
          <el-input class="edit-item" clearable placeholder="请输入宿舍 (如2栋B408)" v-model="dorm"></el-input>
        </el-form-item>

        <el-form-item label="手机">
          <el-input class="edit-item" type="tel" maxlength="11" oninput="value=value.replace(/[^\d]/g,'')" clearable placeholder="请输入手机号码" v-model="phone"></el-input>
        </el-form-item>

        <el-form-item label="QQ">
          <el-input class="edit-item" type="tel" maxlength="13" clearable placeholder="请输入QQ号码" oninput="value=value.replace(/[^\d]/g,'')" v-model="qq"></el-input>
        </el-form-item>

        <el-form-item label="微信">
          <el-input class="edit-item" clearable placeholder="请输入微信号" v-model="wechat"></el-input>
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="sex">
            <el-radio :label="0">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button class="edit-button" @click="cancel" type="warning">取消修改</el-button>
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
      className: this.userInfo.grade.className,
      name: this.userInfo.name,
      dorm: this.userInfo.dorm,
      phone: this.userInfo.phone,
      qq: this.userInfo.qq,
      wechat: this.userInfo.wechat,
      sex: this.userInfo.sex,
      classId: this.userInfo.grade.id,
      options: '',
      value: ''
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    userInfo: {
      type: Object,
      default: null
    }
  },
  created () {
    this.getAllGrade()
  },
  methods: {
    // 获取所有班级
    getAllGrade () {
      const vm = this
      vm.$http.get(api.getAllGrade)
        .then(res => {
          console.log(res.data)
          vm.options = res.data.data.gradeList
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    // 修改学生信息
    updateStudentMessage () {
      const vm = this
      const params = {
        id: sessionStorage.userId,
        account: vm.account,
        name: vm.name,
        dorm: vm.dorm,
        phone: vm.phone,
        sex: vm.sex,
        qq: vm.qq,
        wechat: vm.wechat,
        classId: vm.classId
      }
      vm.$http.get(api.updateStudentMessage, { params: params })
        .then(res => {
          vm.$message({
            type: 'success',
            message: '修改成功'
          })
          vm.$emit('back', true)
          vm.$emit('upDate')
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    // 确认修改信息事件
    upMsg () {
      const vm = this
      if (vm.phone === '' || vm.dorm === '' || vm.qq === '' || vm.wechat === '') {
        vm.$message('请将信息填写完成')
      } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(vm.phone))) {
        vm.$message('请填写正确的手机号')
      } else {
        vm.updateStudentMessage()
      }
    },
    cancel () {
      const vm = this
      vm.$emit('back', true)
    }
  }
}
</script>

<style lang="stylus" scoped>
.edit_box
  position absolute
  margin-top 6%
  margin-left 30%
  width 40%
  border-radius 5px
  box-shadow 0px 0px 10px #dddddd
  background #ffffff
  margin-bottom 5%
  .edit_content
    width 400px
    margin 20px auto
    .edit-item
      width 70%
    .edit-button
      width 35%
</style>
