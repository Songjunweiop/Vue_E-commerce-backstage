<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>会员管理</el-breadcrumb-item>
      <el-breadcrumb-item>会员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <!-- <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            class="button"
            placeholder="请输入想要查找的管理员"
            prefix-icon="el-icon-search"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
            @keyup.enter.native="getUserList"
          >
            <el-button
              round
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="adddialogVisible = true" round
            >添加会员</el-button
          >
        </el-col>
      </el-row> -->

      <!-- 会员列表区域 -->
      <el-table :data="userlist">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="性别" prop="sex"></el-table-column>
        <el-table-column
          label="邮箱"
          prop="email"
          width="200px"
        ></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="QQ" prop="qq"></el-table-column>
        <el-table-column label="学历" prop="xueli"></el-table-column>
        <el-table-column label="注册时间" prop="create_time" width="200px">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip content="修改信息" placement="top" :enterable="false">
              <el-button
                round
                size="mini"
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showEditDialog(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除会员" placement="top" :enterable="false">
              <el-button
                round
                size="mini"
                type="danger"
                icon="el-icon-delete"
                circle
                :disabled="scope.row.id === 500 ? true : false"
                @click="removeUser(scope.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加会员的对话框 -->
    <el-dialog
      title="添加会员"
      :visible.sync="adddialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="会员名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="adddialogVisible = false">取 消</el-button>
        <el-button round type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改会员的对话框 -->
    <el-dialog title="修改会员" :visible.sync="editDialogVisible" width="30%">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="会员名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="qq" prop="qq">
          <el-input v-model="editForm.qq"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="editDialogVisible = false">取 消</el-button>
        <el-button round type="primary" @click="editUserChange"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10,
      },
      userlist: [],
      total: 0,
      adddialogVisible: false,
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      addFormRules: {
        username: [
          { required: true, message: '别忘了输入账号哦', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10个字符', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change'],
          },
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          // { validator: checkMobile, trigger: 'blur' }
        ],
      },

      editDialogVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: '',
        qq: '',
      },
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change'],
          },
        ],
        mobile: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          // { validator: checkMobile, trigger: 'blur' }
        ],
      },

      setRoleDialogVisible: false,
      userInfo: {},
      // 所有的角色列表
      rolesList: [],
      // 已选中的角色id
      selectedRoleId: '',
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      console.log('aaaaaaaaaaaaaaaaaaaaaaa')
      const { data: res } = await this.$http.get('vips', {
        // params:this.queryInfo
        params: {
          query: this.queryInfo.query,
          pagenum: this.queryInfo.pagenum,
          pagesize: this.queryInfo.pagesize,
        },
      })
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log(res)
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      console.log(newSize)
      // if (this.queryInfo.pagenum * newSize > this.total) return
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 监听Switch开关状态的改变
    async userStateChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status != 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('更新会员状态成功')
    },
    //监听添加会员对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields() //重置表单为空白
    },
    addUser() {
      //先进行校验
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return

        //正确则可以发起添加请求
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error(res.meta.msg)
        }
        this.$message.success('添加会员成功')
        this.adddialogVisible = false
        this.getUserList()
      })
    },
    async showEditDialog(id) {
      console.log(id)
      const { data: res } = await this.$http.get('vips/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
      console.log(this.editForm)
      this.editDialogVisible = true
    },
    //监听修改会员对话框关闭的事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields() //重置
    },
    //修改会员信息提交
    editUserChange() {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return

        //正确则发起请求
        console.log(this.editForm)
        const { data: res } = await this.$http.put('vips/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile,
          qq: this.editForm.qq,
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        //成功后关闭对话框，重新加载列表，提示会员成功
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('更新会员成功！')
      })
    },
    //删除会员
    async removeUser(id) {
      console.log(id)
      //弹框询问
      const confirmResult = await this.$confirm(
        '此操作将永久删除该会员, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch(err => err)
      console.log(confirmResult)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('vips/' + id)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      this.$message.success('删除会员成功！')
      this.getUserList()
    },
  },
}
</script>

<style lang="less" scoped>
.button {
  border-radius: 40px;
}
</style>
