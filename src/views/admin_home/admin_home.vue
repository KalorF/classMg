<template>
  <div class="admin_box">
    <div class="head_box">
      <i class="iconfont">&#xe63d;</i>
      <span class="head-title">管理员后台</span>
      <button @click="logout" class="head_buttom">退出登陆</button>
    </div>
    <!-- 导航菜单 -->
    <div class="menu">
      <el-menu @select="select" :default-active="$route.path" class="menu_content">
          <el-menu-item index="/hadSendMsg" class="list-group-item">通知情况</el-menu-item>
          <el-menu-item index="/sendMsg" class="list-group-item">发布通知</el-menu-item>
          <el-menu-item index="/setManage" class="list-group-item">班级成员</el-menu-item>
          <el-menu-item index="/upPwd" class="list-group-item">修改密码</el-menu-item>
      </el-menu>
    </div>

    <div class="admin_body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      active: true
    }
  },
  methods: {
    logout () {
      const vm = this
      sessionStorage.clear()
      vm.$router.replace({ path: '/' })
    },
    select (e) {
      const vm = this
      vm.$router.replace({ path: `${e}` })
    }
  }
}
</script>

<style lang="stylus">
.admin_box
  position relative
  .head_box
    position fixed
    z-index 3
    height 58px
    display flex
    align-items center
    width 100%
    background #3dd9d6
    box-shadow 1px 3px 3px #eeeeee
    i
      display block
      margin-left 13px
      color #ffffff
      font-size 30px
    .head-title
      margin-left 10px
      color #ffffff
      font-size 20px
      width 87%
    .head_buttom
      width 100px
      height 40px
      margin-right 10px
      background-color #ffffff
      font-size 14px
      border-radius 50px
      color #41b6e6
      cursor pointer
      font-weight 600
      transition all .5s
    .head_buttom:hover
      border 1px solid #41b6e6
      color #50C1E9
  .menu
    position absolute
    margin-top 5.5%
    height 83vh
    background #ffffff
    border-radius 10px
    margin-bottom 20px
    box-shadow 0px 0px 10px #dddddd
    margin-left 10px
    width 20%
    .el-menu--horizontal.el-menu--dark .el-submenu .el-menu-item.is-active, .el-menu-item.is-active
      color #5BE7C4
    .list-group-item
      font-size 15px
  .admin_body
    position absolute
    overflow auto
    margin-top 5.5%
    margin-left 23%
    width 75%
    height 83vh
    margin-bottom 20px
    border-radius 5px
    box-shadow 0px 0px 10px #dddddd
    background #ffffff
</style>
