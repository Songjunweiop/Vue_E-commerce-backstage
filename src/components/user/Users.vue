<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 搜索区域 -->
      <el-row :gutter="20">
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
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
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
            <el-tooltip content="删除用户" placement="top" :enterable="false">
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
            <el-tooltip content="角色分配" placement="top" :enterable="false">
              <el-button
                round
                size="mini"
                type="warning"
                icon="el-icon-setting"
                circle
                :disabled="scope.row.id === 500 ? true : false"
                @click="showsetRole(scope.row)"
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

    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
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
        <el-form-item label="用户名" prop="username">
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

    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="30%">
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="editDialogVisible = false">取 消</el-button>
        <el-button round type="primary" @click="editUserChange"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="30%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前用户：{{ userInfo.username }}</p>
        <p>当前角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择角色">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button round type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    //验证电话的规则
    var checkMobile = (rule, value, cb) => {
      const regMobile = /^1\d{10}$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }

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
          { validator: checkMobile, trigger: 'blur' },
        ],
      },

      editDialogVisible: false,
      editForm: {
        username: '',
        email: '',
        mobile: '',
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
          { validator: checkMobile, trigger: 'blur' },
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
      const { data: res } = await this.$http.get('users', {
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
      this.$message.success('更新用户状态成功')
    },
    //监听添加用户对话框关闭事件
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
        this.$message.success('添加用户成功')
        this.adddialogVisible = false
        this.getUserList()
      })
    },
    async showEditDialog(id) {
      console.log(id)
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //监听修改用户对话框关闭的事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields() //重置
    },
    //修改用户信息提交
    editUserChange() {
      this.$refs.editFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return

        //正确则发起请求
        console.log(this.editForm)
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        )
        console.log(res)
        console.log(this.editForm.id)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        //成功后关闭对话框，重新加载列表，提示用户成功
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('更新用户成功！')
      })
    },
    //删除用户
    async removeUser(id) {
      console.log(id)
      //弹框询问
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
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

      const { data: res } = await this.$http.delete('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      this.$message.success('删除用户成功！')
      this.getUserList()
    },
    // 角色分配
    async showsetRole(userInfo) {
      this.userInfo = userInfo

      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesList = res.data

      this.setRoleDialogVisible = true
    },
    // 点击按钮，分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) return this.$message.error('请选择要分配的角色')

      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId,
        }
      )
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('更新用户成功')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 分配角色列表关闭
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    },
  },
}
</script>

<style lang="less" scoped>
.button {
  border-radius: 40px;
}
</style>
