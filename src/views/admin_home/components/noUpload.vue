<template>
  <div class="noUpload_box">
    <!-- 未上传学生表单 -->
    <el-table
    :data="nomessage.slice((currentPage-1)*pagesize,currentPage*pagesize)"
    style="width: 100%">
      <el-table-column
        label="姓名"
        width="180">
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
        width="180">
        <template slot-scope="scope">
          {{scope.row.account}}
        </template>
      </el-table-column>
      <el-table-column
        label="宿舍"
        width="180">
        <template slot-scope="scope">
          {{scope.row.dorm}}
        </template>
      </el-table-column>
      <el-table-column
        label="手机"
        width="360">
        <template slot-scope="scope">
          {{scope.row.phone}}
        </template>
      </el-table-column>
    </el-table>
     <!-- 分页 -->
    <el-pagination
      class="page"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pagesize"
      :total="nomessage.length">
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: ['nomessage'],
  data () {
    return {
      tableData: [],
      currentPage: 1,
      pagesize: 8
    }
  },
  methods: {
    handleCurrentChange: function (currentPage) {
      const vm = this
      vm.currentPage = currentPage
      console.log(this.currentPage) // 点击第几页
    }
  }
}
</script>

<style lang="stylus" scoped>
.noUpload_box
  width 95%
  margin-left auto
  margin-right auto
  padding-bottom 3%
  .page
    margin-top 1.5%
</style>
