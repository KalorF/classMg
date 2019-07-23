<template>
  <div class="addStdId_box">
    <div class="title">
      <i class="el-icon-plus"></i>
      <span>学生信息添加</span>
    </div>
   <div class="content">
      <div class="item">
        <span>学号</span>
        <el-input class="input" v-model="account" placeholder="请输入学生学号"></el-input>
      </div>
      <div class="item">
        <span>班级</span>
        <el-select v-model="value" class="input" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.className"
              :label="item.className"
              :value="item.id">
            </el-option>
        </el-select>
      </div>
      <div class="item">
        <span>姓名</span>
        <el-input class="input" v-model="name" placeholder="请输入学生姓名"></el-input>
      </div>
      <el-button class="add" @click="comfirm" type="success">确认添加</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/serverApi.js'
export default {
  data () {
    return {
      account: '',
      options: '',
      name: '',
      value: ''
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
    // 点击添加学生按钮
    comfirm () {
      const vm = this
      if (vm.value === '' || vm.account === '' || vm.name === '') {
        vm.$message('请输入学生信息')
      } else if (vm.account.length !== 13) {
        vm.$message('请输入13位学号')
      } else {
        vm.addStudentId()
      }
    },
    // 添加学生信息
    addStudentId () {
      const vm = this
      const params = {
        account: vm.account,
        classId: vm.value,
        name: vm.name
      }
      vm.$http.get(api.RegisteredStudentId, { params: params })
        .then(res => {
          if (res.data.code === 100) {
            vm.$message({
              type: 'warning',
              message: '此学号的学生信息已经添加，请添加新的学生信息'
            })
          } else {
            vm.$message({
              message: '添加成功',
              type: 'success'
            })
            vm.account = ''
            vm.name = ''
            vm.value = ''
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
.addStdId_box
  margin-top 1.5%
  .title
    margin-left 1%
    display flex
    align-items center
    padding-bottom 1%
    border-bottom 1px solid #dddddd
    i
      font-size 25px
      color #41b6e6
    span
      margin-left 5px
      font-size 16px
  .content
    width 50%
    margin-top 2%
    margin-left 1%
    .item
      width 100%
      margin-left 10px
      display flex
      align-items center
      margin-bottom 3%
      span
        width 10%
        font-size 15px
        color #2d2d2d
      .input
        width 65%
    .add
      margin-top 2%
      margin-left 3%
      width 73%
</style>
