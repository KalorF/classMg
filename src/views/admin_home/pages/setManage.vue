<template>
  <div class="set_box">
    <!-- 搜索框 -->
    <div class="search_head">
      <el-autocomplete
          class="search_input"
          v-model="result"
          @input="oninput"
          :fetch-suggestions="querySearchAsync"
          @select="handleSelect"
          placeholder="输入学生姓名搜索学生"
        >
          <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          >
          </i>
      </el-autocomplete>
      <span v-show="showBack" @click="searchBack" class="iconfont">&#xe61a;</span>
    </div>
    <!-- 学生信息表单 -->
    <el-table
      :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      style="width: 100%">
      <el-table-column
        label="姓名"
        width="140">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p v-if="scope.row.qq !== null">QQ: {{ scope.row.qq }}</p>
            <p v-else>QQ: 未填写</p>
            <p v-if="scope.row.wechat !== null">微信: {{ scope.row.wechat }}</p>
            <p v-else>微信: 未填写</p>
            <p v-if="scope.row.sex === 0">性别: 男</p>
            <p v-else-if="scope.row.sex === 1">性别: 女</p>
            <p v-else>性别: 未填写</p>
            <div slot="reference" class="name-wrapper">
              {{ scope.row.name }}
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="学号"
        width="150">
        <template slot-scope="scope">
          {{scope.row.account}}
        </template>
      </el-table-column>
      <el-table-column
        label="宿舍"
        width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.dorm !== null">{{scope.row.dorm}}</span>
          <span v-else>未填写</span>
        </template>
      </el-table-column>
      <el-table-column
        label="手机"
        width="140">
        <template slot-scope="scope">
          <span v-if="scope.row.phone !== null">{{scope.row.phone}}</span>
          <span v-else>未填写</span>
        </template>
      </el-table-column>
      <el-table-column
        label="身份"
        width="100">
        <template slot-scope="scope">
         {{ scope.row.identity }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleAdmin(scope.$index, scope.row)">设为管理员</el-button>
          <el-button
            size="mini"
            type="info"
            @click="handleCommon(scope.$index, scope.row)">设位普通成员</el-button>
          <!-- <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
   <!-- 分页 -->
    <el-pagination
      class="page"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pagesize"
      :total="tableData.length">
    </el-pagination>
    <!-- 弹窗提示 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="25%"
      :modal = 'false'
      >
      <span>{{dialogcontent}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/serverApi.js'
export default {
  data () {
    return {
      tableData: [],
      currentPage: 1, // 起始页
      pagesize: 8, // 每页的数据条数
      dialogVisible: false,
      dialogcontent: '',
      userId: '',
      status: '',
      ctrlIndex: '',
      isAdmin: '',
      result: '',
      showBack: false
    }
  },
  created () {
    this.getData()
  },
  methods: {
    getData () {
      const vm = this
      const params = { classId: sessionStorage.classId }
      vm.$http.get(api.getUserByClassId, { params: params })
        .then(res => {
          let listData = res.data.data.userList
          let len = listData.length
          for (let i = 0; i < len; i++) {
            for (let j = 0; j < len - 1 - i; j++) {
              if (Number(listData[j].account.substr(listData[j].account.length - 2)) > Number(listData[j+1].account.substr(listData[j+1].account.length - 2))){
                let temp = listData[j+1]
                listData[j+1] = listData[j]
                listData[j] = temp
              }
            }
          }
          vm.tableData = listData
          vm.tableData.map(item => {
            if (item.isAdmin === 0) {
              vm.$set(item, 'identity', '管理员')
            } else {
              vm.$set(item, 'identity', '普通成员')
            }
          })
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    // 点击返回按钮
    searchBack () {
      const vm = this
      vm.result = ''
      vm.getData()
      vm.showBack = false
    },
    oninput (value) {
      const vm = this
      if (value === '') {
        vm.showBack = false
        vm.getData()
      }
    },
    // 搜索学生
    querySearchAsync (queryString, callback) {
      // 判断是否为空对象
      function isEmptyObject (obj) {
        for (var key in obj) {
          return false
        }
        return true
      }
      let list = [{}]
      const vm = this
      // 调用的后台接口
      const params = {
        name: queryString,
        classId: sessionStorage.classId
      }
      vm.$http.get(api.AdminFuzzySearchByName, { params: params })
        .then((response) => {
          // 在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示
          if (isEmptyObject(response.data.data)) {
            console.log(1)
            list = []
            callback(list)
          } else {
            for (let i of response.data.data.userList) {
              i.value = i.name // 将想要展示的数据作为value
            }
            list = response.data.data.userList
            callback(list)
          }
        }).catch((error) => {
          console.log(error)
        })
    },
    // 选择搜索结果触发
    handleSelect (e) {
      const vm = this
      vm.showBack = true
      vm.tableData = []
      vm.tableData.push(e)
    },
    handleCurrentChange: function (currentPage) {
      const vm = this
      vm.currentPage = currentPage
      console.log(this.currentPage) // 点击第几页
    },
    // 弹窗确认时触发
    dialogConfirm () {
      const vm = this
      if (vm.ctrlIndex === 0 || vm.ctrlIndex === 1) {
        vm.setIdentity(vm.userId)
      } else if (vm.ctrlIndex === 2) {
        vm.delMember(vm.userId)
      }
      vm.dialogVisible = false
    },
    handleAdmin (index, row) {
      const vm = this
      vm.dialogVisible = true
      vm.ctrlIndex = 0
      vm.isAdmin = 0
      vm.dialogcontent = '是否设置为管理员？'
      vm.userId = row.id
      vm.status = 0
    },
    handleCommon (index, row) {
      const vm = this
      vm.dialogVisible = true
      vm.ctrlIndex = 1
      vm.isAdmin = 1
      vm.dialogcontent = '是否设置为普通成员？'
      vm.userId = row.id
      vm.status = 1
    },
    // 设置用户身份接口
    setIdentity (userId) {
      const vm = this
      const params = {
        id: userId,
        isAdmin: vm.isAdmin,
        classId: sessionStorage.classId,
        operatorId: sessionStorage.userId,
        status: 1
      }
      vm.$http.get(api.updateAdminMessage, { params: params })
        .then(res => {
          if (res.data.code === 200) {
            vm.$message({
              type: 'success',
              message: '设置成功'
            })
            vm.getData()
          } else if (res.data.code === 108) {
            vm.$message({
              type: 'success',
              message: '您已成为普通成员，请重新登录'
            })
            sessionStorage.clear()
            vm.$router.replace({ path: '/' })
          } else {
            vm.$message({
              type: 'warning',
              message: `${res.data.message}`
            })
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    handleDelete (index, row) {
      const vm = this
      vm.dialogVisible = true
      vm.ctrlIndex = 2
      vm.dialogcontent = '是否删除此成员？'
      vm.userId = row.id
      vm.status = 1
    },
    // 删除成员接口
    delMember (userId, isdel) {
      const vm = this
      const params = {
        id: userId,
        isdel: isdel
      }
      vm.$http.get(api.updateAdminMessage, { params: params })
        .then(res => {
          vm.$message({
            type: 'success',
            message: '删除成功'
          })
          vm.getData()
        })
        .catch(err => {
          throw new Error(err)
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.set_box
  width 95%
  margin-left auto
  margin-right auto
  margin-top 2%
  padding-bottom 3%
  .page
    margin-top 1.5%
  .search_head
    display flex
    align-items center
    .search_input
      margin-bottom 1%
    span
      display block
      margin-left 2%
      cursor default
      color #2694ab
      font-size 35px
      padding-bottom 5px
      transition all .3s
    span:hover
      color #41b6e6
      transform translateX(-3px)
</style>
