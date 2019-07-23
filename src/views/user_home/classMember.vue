<template>
  <div class="member_box">
    <div class="member_content">
      <div class="member_item" v-for="(item, index) of userList" :key="index">
        <div class="member_title">学号: {{item.account}}</div>
        <div class="content">
          <i class="iconfont">&#xe7df;</i>
          <span>{{item.name}}</span>
          <span v-if="item.sex === 0">男</span>
          <span v-else-if="item.sex === 1">女</span>
          <span v-else>未填写</span>
          <span v-if="item.dorm !== null">宿舍：{{item.dorm}}</span>
          <span v-else>宿舍：未填写</span>
          <span v-if="item.phone !== null">手机：{{item.phone}}</span>
          <span v-else>手机：未填写</span>
          <span v-if="item.qq !== null">QQ：{{item.qq}}</span>
          <span v-else>QQ：未填写</span>
          <span v-if="item.wechat !== null">微信：{{item.wechat}}</span>
          <span v-else>微信：未填写</span>
        </div>
      </div>
      <!-- 加载更多 -->
      <div class="noneData" v-if="currentPage === totalPage">无更多成员</div>
      <div v-else-if="!userList.length" class="noneData">暂无成员</div>
      <el-button plain v-else round class="morebottom" @click="showMore">查看更多</el-button>
    </div>
  </div>
</template>

<script>
import api from '@/serverApi.js'
export default {
  data () {
    return {
      allData: [],
      userList: [],
      currentPage: 1,
      pagesize: 6,
      totalPage: ''
    }
  },
  created () {
    this.getMember()
  },
  methods: {
    // 获取班级成员
    getMember () {
      const vm = this
      const params = {
        classId: sessionStorage.classId
      }
      vm.$http.get(api.getUserByClassId, { params: params })
        .then(res => {
          vm.allData = res.data.data.userList
          let listData = vm.allData
          let len = listData.length
          for (let i = 0; i < len; i++) {
            for (let j = 0; j < len - 1 - i; j++) {
              if (Number(listData[j].account.substr(listData[j].account.length - 2)) > Number(listData[j + 1].account.substr(listData[j + 1].account.length - 2))) {
                let temp = listData[j + 1]
                listData[j + 1] = listData[j]
                listData[j] = temp
              }
            }
          }
          vm.userList = listData.slice(0, vm.pagesize)
          vm.totalPage = Math.ceil(vm.allData.length / vm.pagesize)
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    // 加载更多
    showMore () {
      const vm = this
      let page = vm.currentPage
      if (page < vm.totalPage) {
        vm.currentPage++
        const data = vm.allData.slice((vm.currentPage - 1) * vm.pagesize, vm.currentPage * vm.pagesize)
        data.map(item => {
          vm.userList.push(item)
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.member_box
  position absolute
  margin-top 11%
  margin-left 27%
  width 70%
  .member_content
    width 96%
    .morebottom
      width 60%
      margin-left 20%
      margin-bottom 3%
    .noneData
      text-align center
      width 100%
      font-size 15px
      color #aaaaaa
      margin-bottom 3%
    .member_item
      height 80px
      box-shadow 0px 0px 10px #dddddd
      background #ffffff
      border-radius 5px
      overflow hidden
      margin-bottom 2%
      transition all .2s
      cursor default
      border-left 10px solid #098ec4
      .member_title
        margin-left 20px
        margin-top 12px
        font-size 13px
        padding-left 8px
        width 100%
        border-left 5px solid #23B5AF
      .content
        width 100%
        height 55px
        display flex
        align-items center
        i
          display block
          font-size 30px
          color #aaaaaa
          margin-left 20px
        span
          font-size 14px
        span:nth-child(2)
          display block
          margin-left 14px
          width 8%
        span:nth-child(3)
          display block
          width 8%
        span:nth-child(4)
          display block
          width 15%
        span:nth-child(5)
          display block
          width 18%
         span:nth-child(6)
          display block
          width 20%
    .member_item:hover
      overflow hidden
      box-shadow 0px 0px 10px #4bc2c5
      transform translateX(-3px)
</style>
