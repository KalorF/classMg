<template>
  <div class="addCLass_box">
    <div class="title">
      <i class="el-icon-plus"></i>
      <span>班级添加</span>
    </div>
    <div class="content">
      <div class="item">
        <span>班级</span>
        <el-input class="input" v-model="className" placeholder="请输入班级"></el-input>
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
      className: ''
    }
  },
  methods: {
    // 点击添加班级按钮
    comfirm () {
      const vm = this
      if (vm.className === '') {
        vm.$message('请输入班级')
      } else {
        vm.registeredGrade()
      }
    },
    // 添加学生班级
    registeredGrade () {
      const vm = this
      const params = {
        className: vm.className
      }
      vm.$http.get(api.RegisteredGrade, { params: params })
        .then(res => {
          if (res.data.code === 100) {
            vm.$message({
              type: 'warning',
              message: '班级已经存在，请重新输入'
            })
          } else {
            vm.$message({
              message: '添加成功',
              type: 'success'
            })
            vm.className = ''
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
.addCLass_box
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
