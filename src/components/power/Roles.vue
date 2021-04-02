<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="4">
          <el-button round type="primary" @click="addRolesVisible = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="rolesList" style="width: 100%" >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>

              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <el-col :span="6">
                    <el-tag
                      :class="[i3 === 0 ? '' : 'bdtop']"
                      v-for="(item3, i3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>

            <!-- <pre>
              {{scope.row}}
            </pre>-->
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          prop="roleName"
          label="角色名称"
          width="width"
        ></el-table-column>
        <el-table-column
          prop="roleDesc"
          label="角色描述"
          width="width"
        ></el-table-column>
        <el-table-column label="操作" width="width">
          <template slot-scope="scope">
            <el-tooltip content="编辑角色" placement="top" :enterable="false">
              <el-button
                round
                size="mini"
                type="primary"
                icon="el-icon-edit"
                @click="showEditDialog(scope.row.id)"
                >编辑</el-button
              >
            </el-tooltip>
            <el-tooltip content="删除角色" placement="top" :enterable="false">
              <el-button
                round
                size="mini"
                type="danger"
                icon="el-icon-delete"
                @click="removeRole(scope.row.id)"
                >删除</el-button
              >
            </el-tooltip>
            <el-tooltip content="控制" placement="top" :enterable="false">
              <el-button
                round
                size="mini"
                type="warning"
                icon="el-icon-setting"
                @click="showSetRightDialog(scope.row)"
                >分配权限</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色的对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesVisible"
      width="30%"
      @close="addRolesClosed"
    >
      <el-form
        :model="addRolesForm"
        :rules="addRolesRules"
        ref="addRolesRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="addRolesVisible = false">取 消</el-button>
        <el-button round type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色的对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRolesVisible" width="30%">
      <el-form
        :model="editRolesForm"
        :rules="editRolesRules"
        ref="editRolesRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="editRolesVisible = false">取 消</el-button>
        <el-button round type="primary" @click="editRole">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限的对话框 -->
    <el-dialog
      title="权限分配"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogVisibleClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button round @click="setRightDialogVisible = false"
          >取 消</el-button
        >
        <el-button round type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      // 添加角色
      addRolesVisible: false,
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      addRolesRules: {
        roleName: [
          { required: true, message: '别忘了输入名称哦', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 编辑角色
      editRolesVisible: false,
      editRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      editRolesRules: {
        roleName: [
          { required: true, message: '别忘了输入名称哦', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10个字符', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      },
      // 权限分配
      setRightDialogVisible: false,
      // 所有权限数据
      rightsList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defKeys: [],
      //即将分配权限的角色id
      roleId: ''
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles');
      if (res.meta.status !== 200)
        return this.$message.error(res.meta.msg);
      this.rolesList = res.data;
      console.log(this.rolesList);
    },
    // 添加角色
    addRole() {
      this.$refs.addRolesRef.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$http.post('roles', this.addRolesForm);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg);
        }
        this.$message.success('添加角色成功！');
        this.addRolesVisible = false;
        this.getRolesList();
      });
    },
    addRolesClosed() {
      this.$refs.addRolesRef.resetFields(); //重置表单为空白
    },
    // 删除角色
    async removeRole(id) {
      console.log(id);
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err);
      console.log(confirmResult);

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除');
      }
      const { data: res } = await this.$http.delete('roles/' + id);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success('删除角色成功！');
      this.getRolesList();
    },
    // 展示编辑角色的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('roles/' + id);
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg);
      }
      this.$message.success('获取成功');
      console.log(id);
      this.editRolesForm = res.data;
      this.editRolesVisible = true;
    },
    // 编辑角色
    editRole() {
      this.$refs.editRolesRef.validate(async valid => {
        console.log(valid);
        if (!valid) return;

        //正确则发起请求
        console.log(this.editRolesForm);
        const { data: res } = await this.$http.put(
          'roles/' + this.editRolesForm.roleId,
          {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc
          }
        );
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg);
        }
        //成功后关闭对话框，重新加载列表，提示用户成功
        this.editRolesVisible = false;
        this.getRolesList();
        this.$message.success('更新用户成功！');
      });
    },
    //删除权限
    async removeRightById(role, rightId) {
      // 弹框提示
      const confirmResult = await this.$confirm(
        '此操作将永久删除该权限, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err);
      console.log(confirmResult);
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除');
      }

      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success('删除权限成功');

      // this.getRolesList()  // 为了避免这个页面的完整性刷新
      role.children = res.data;
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      // 先获取所有的权限数据
      this.roleId = role.id;
      const { data: res } = await this.$http.get('rights/tree');
      if (res.meta.status !== 200)
        return this.$message.error(res.meta.msg);
      console.log(res);
      this.$message.success('获取权限数据成功!');
      this.rightsList = res.data;
      console.log(this.rightsList);
      this.getLeafKey(role, this.defKeys);
      this.setRightDialogVisible = true;
    },
    // 通过递归的形式，获取角色下所有三级权限id，并保存到defKeys中
    getLeafKey(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }

      node.children.forEach(item => this.getLeafKey(item, arr));
    },
    setRightDialogVisibleClosed() {
      this.defKeys = [];
    },
    // 点击确定分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ];
      console.log(keys);
      const idStr = keys.join(',');

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      );

      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success('分配权限成功！');
      this.getRolesList();
      this.setRightDialogVisible = false;
    }
  }
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
