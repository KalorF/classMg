<template>
  <div class="stdMsg_box">
    <!-- 搜索框 -->
    <div class="head" v-show="showHead">
      <el-select v-model="value" @change="selectClass" class="input" placeholder="选择班级查看">
        <el-option :label="'所有学生信息'" :value="'所有'"></el-option>
        <el-option
          v-for="item in options"
          :key="item.className"
          :label="item.className"
          :value="item.id">
        </el-option>
      </el-select>
      <el-autocomplete
        class="search_input"
        v-model="result"
        :fetch-suggestions="querySearchAsync"
        @select="handleSelect"
        placeholder="输入学生姓名进行搜索"
      >
        <i
        class="el-icon-search el-input__icon"
        slot="suffix"
        >
        </i>
      </el-autocomplete>
    </div>
    <!-- 学生信息表单 -->
    <el-table
    v-if="showStdMsg"
    :data="tableData.slice((currentPage-1)*pagesize,currentPage*pagesize)"
    style="width: 100%">
      <el-table-column
        label="姓名"
        width="100">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p v-if="scope.row.qq !== null">QQ: {{ scope.row.qq }}</p>
            <p v-else>QQ: 未填写</p>
            <p v-if="scope.row.wechat !== null">微信: {{ scope.row.wechat }}</p>
            <p v-else>微信: 未填写</p>
            <p v-if="scope.row.phone !== null">手机: {{scope.row.phone}}</p>
            <p v-else>手机: 未填写</p>
            <p v-if="scope.row.dorm !== null">宿舍: {{scope.row.dorm}}</p>
            <p v-else>宿舍: 未填写</p>
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
        label="班级"
        width="180">
        <template slot-scope="scope">
          {{scope.row.className}}
        </template>
      </el-table-column>
      <el-table-column
        label="身份"
        width="120">
        <template slot-scope="scope">
          {{scope.row.status}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleSetManger(scope.$index, scope.row)">设为管理员</el-button>
          <el-button
            size="mini"
            type="info"
            @click="handleSetCommon(scope.$index, scope.row)">设为普通成员</el-button>
          <el-button
            size="mini"
            type="success"
            @click="editMsg(scope.$index, scope.row)">修改信息</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-show="showPage"
      class="page"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pagesize"
      :total="tableData.length">
    </el-pagination>
    <!-- 删除班级按钮 -->
    <el-button v-if="!tableData.length" @click="delClass" type="danger" class="delButton" round>删除该班级</el-button>
    <!-- 弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="25%"
      :modal = 'false'
      >
      <span>{{dialogContent}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogConfirm">确 定</el-button>
      </span>
    </el-dialog>

    <editMsg v-if="showEditMsg" @upDate="upDate" :userInfo="userInfo" @editBack='editBack'></editMsg>
  </div>
</template>

<script>
import editMsg from '@/views/top_admin_home/components/editMsg.vue'
import api from '@/serverApi.js'
export default {
  components: {
    editMsg
  },
  data () {
    return {
      showStdMsg: true,
      showPage: true,
      showHead: true,
      showEditMsg: false,
      dialogContent: '',
      ctrlIndex: '',
      classId: '',
      isAdmin: '',
      options: '',
      value: '',
      tableData: [],
      currentPage: 1, // 起始页
      pagesize: 8, // 每页的数据条数
      userInfo: '',
      userId: '',
      dialogVisible: false,
      result: '' // 搜索结果
    }
  },
  created () {
    const vm = this
    vm.getAllUser()
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
    handleCurrentChange: function (currentPage) {
      const vm = this
      vm.currentPage = currentPage
      console.log(this.currentPage) // 点击第几页
    },
    // 获取所有学生信息
    getAllUser () {
      const vm = this
      vm.$http.get(api.getAllUser)
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
              vm.$set(item, 'status', '管理员')
            } else {
              vm.$set(item, 'status', '普通成员')
            }
            vm.$set(item, 'className', item.grade.className)
          })
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    selectClass (value) {
      const vm = this
      if (value === '所有') {
        vm.getAllUser()
      } else {
        vm.getStdMsgByClass()
      }
    },
    // 选择班级获取学生信息
    getStdMsgByClass () {
      const vm = this
      const params = {
        classId: vm.value
      }
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
              vm.$set(item, 'status', '管理员')
            } else {
              vm.$set(item, 'status', '普通成员')
            }
            vm.$set(item, 'className', item.grade.className)
          })
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    // 搜索
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
        name: queryString
      }
      vm.$http.get(api.SeniorAdminFuzzySearchByName, { params: params })
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
    handleSelect (e) {
      const vm = this
      console.log(e)
      let data = []
      data.push(e)
      vm.tableData = data
      vm.tableData.map(item => {
        if (item.isAdmin === 0) {
          vm.$set(item, 'status', '管理员')
        } else {
          vm.$set(item, 'status', '普通成员')
        }
        vm.$set(item, 'className', item.grade.className)
      })
    },
    dialogConfirm () {
      const vm = this
      if (vm.ctrlIndex === 0 || vm.ctrlIndex === 1) {
        vm.updateAdmin()
      } else if (vm.ctrlIndex === 2) {
        vm.delStudentId()
      }
    },
    // 设置管理员
    handleSetManger (index, row) {
      const vm = this
      vm.userId = row.id
      vm.classId = row.grade.id
      vm.dialogContent = '是否设为管理员？'
      vm.ctrlIndex = 0
      vm.isAdmin = 0
      vm.dialogVisible = true
    },
    // 设为普通成员
    handleSetCommon (index, row) {
      const vm = this
      vm.userId = row.id
      vm.classId = row.grade.id
      vm.ctrlIndex = 1
      vm.isAdmin = 1
      vm.dialogContent = '是否设为普通成员？'
      vm.dialogVisible = true
    },
    // 删除学生
    handDel (index, row) {
      const vm = this
      vm.userId = row.id
      vm.ctrlIndex = 2
      vm.dialogContent = '是否删除该学生？'
      vm.dialogVisible = true
    },
    // 设置学生是否为管理员接口
    updateAdmin () {
      const vm = this
      const params = {
        id: vm.userId,
        classId: vm.classId,
        operatorId: -1,
        isAdmin: vm.isAdmin,
        status: 0
      }
      vm.$http.get(api.updateAdminMessage, { params: params })
        .then(res => {
          if (res.data.code === 200) {
            vm.$message({
              type: 'success',
              message: '设置成功'
            })
            if (vm.value === '' || vm.value === '所有') {
              vm.getAllUser()
            } else {
              vm.getStdMsgByClass()
            }
            vm.dialogVisible = false
          } else {
            vm.$message({
              type: 'warning',
              message: `${res.data.message}`
            })
            vm.dialogVisible = false
          }
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    // 删除学生接口
    delStudentId () {
      const vm = this
      const id = vm.userId
      vm.$http.get(api.delStudentId + id)
        .then(res => {
          vm.$message({
            type: 'success',
            message: '删除成功'
          })
          if (vm.value === '' || vm.value === '所有') {
            vm.getAllUser()
          } else {
            vm.getStdMsgByClass()
          }
          vm.dialogVisible = false
        })
        .catch(err => {
          throw new Error(err)
        })
    },
    upDate () {
      const vm = this
      vm.getAllUser()
    },
    editMsg (index, row) {
      const vm = this
      vm.userInfo = row
      vm.showStdMsg = false
      vm.showHead = false
      vm.showPage = false
      vm.showEditMsg = true
    },
    editBack () {
      const vm = this
      vm.showStdMsg = true
      vm.showPage = true
      vm.showHead = true
      vm.showEditMsg = false
    },
    // 删除班级
    delClass () {
      const vm = this
      const classId = vm.value
      vm.$http.get(api.delGrade + classId)
        .then(res => {
          vm.value = '所有'
          vm.getAllGrade()
          vm.getAllUser()
          vm.$message('删除成功')
        })
        .catch(err => {
          throw new Error(err)
        })
    }
  }
}
</script>

<style lang="stylus" scoped>
.stdMsg_box
  width 95%
  margin-left auto
  margin-right auto
  margin-top 10px
  padding-bottom 3%
  .head
    border-bottom 1px solid #eee
    padding-bottom 1.5%
    margin-bottom 1%
    .search_input
      float right
  .page
    margin-top 1.5%
  .delButton
    margin-top 2%
    width 100%
</style>
