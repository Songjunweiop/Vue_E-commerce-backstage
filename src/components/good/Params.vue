<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-alert
        class="guandu"
        show-icon
        :closable="false"
        title="注意！只允许为第三级分类设置相关参数！"
        type="warning"
      ></el-alert>

      <el-row style="margin:15px 0;">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="selectedCateKeys"
            :options="catelist"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children'
            }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            round
            :disabled="isBtnDisabled"
            @click="addVisible = true"
            >添加参数</el-button
          >

          <el-table :data="manyTabData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  style="margin:0 5px;"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  type="success"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  round
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>

            <el-table-column type="index"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="参数名称"
              width="width"
            ></el-table-column>
            <el-table-column label="操作" width="width">
              <template slot-scope="scope">
                <el-tooltip
                  content="编辑参数"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    size="mini"
                    round
                    type="warning"
                    icon="el-icon-setting"
                    circle
                    @click="showeditVisible(scope.row.attr_id)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  content="删除参数"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    size="mini"
                    round
                    type="danger"
                    icon="el-icon-delete"
                    circle
                    @click="remove(scope.row.attr_id)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            round
            :disabled="isBtnDisabled"
            @click="addVisible = true"
            >添加属性</el-button
          >
          <el-table :data="onlyTabData" style="width: 100%">
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag
                  style="margin:0 5px;"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  type="success"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button
                  v-else
                  round
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              prop="attr_name"
              label="属性名称"
              width="width"
            ></el-table-column>
            <el-table-column label="操作" width="width">
              <template slot-scope="scope">
                <el-tooltip
                  content="编辑属性"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    size="mini"
                    round
                    type="warning"
                    icon="el-icon-setting"
                    circle
                    @click="showeditVisible(scope.row.attr_id)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  content="删除属性"
                  placement="top"
                  :enterable="false"
                >
                  <el-button
                    size="mini"
                    type="danger"
                    round
                    icon="el-icon-delete"
                    circle
                    @click="remove(scope.row.attr_id)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>

      <!-- 添加参数的对话框 -->
      <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addVisible"
        width="50%"
        @close="addVisibleClosed"
      >
        <el-form
          :rules="addFormRules"
          :model="addForm"
          ref="addFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="addForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button round @click="addVisible = false">取 消</el-button>
          <el-button round type="primary" @click="add">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改参数的对话框 -->
      <el-dialog
        :title="'修改' + titleText"
        :visible.sync="editVisible"
        width="50%"
        @close="editVisibleClosed"
      >
        <el-form
          :rules="editFormRules"
          :model="editForm"
          ref="editFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item :label="titleText" prop="attr_name">
            <el-input v-model="editForm.attr_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button round @click="editVisible = false">取 消</el-button>
          <el-button round type="primary" @click="edit">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      catelist: [],
      // 级联选择框
      selectedCateKeys: [],
      // 默认激活的tab
      activeName: 'many',
      manyTabData: [],
      onlyTabData: [],
      addVisible: false,
      addForm: {
        attr_name: ''
      },
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' }
        ]
      },
      editVisible: false,
      editForm: {},
      editFormRules: {},
      // 控制按钮与文本输入框的显示
      inputVisible: false,
      inputValue: ''
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 200)
        return this.$message.error('获取商品分类失败');
      this.catelist = res.data;
      console.log(this.catelist);
    },
    async getParamsData() {
      // console.log(this.selectedCateKeys)
      // console.log(this.cateId)
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) return this.$message.error('获取失败');
      // console.log(res.data)
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
        // 控制文本显示隐藏
        item.inputVisible = false;
        item.inputValue = '';
      });

      console.log(res.data);
      if (this.activeName === 'many') {
        this.manyTabData = res.data;
      } else {
        this.onlyTabData = res.data;
      }
    },
    // 级联选择框选中项变化，出发事件
    handleChange() {
      this.getParamsData();
    },

    handleTabClick() {
      console.log(this.activeName);
      this.getParamsData();
    },
    addVisibleClosed() {
      this.$refs.addFormRef.resetFields();
    },
    async add() {
      const { data: res } = await this.$http.post(
        `categories/${this.cateId}/attributes`,
        {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName
        }
      );
      if (res.meta.status !== 201)
        return this.$message.error('添加' + this.titleText + '失败');
      this.$message.success('添加' + this.titleText + '成功');
      this.addVisible = false;
      this.getParamsData();
    },

    async showeditVisible(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          params: { attr_sel: this.activeName }
        }
      );
      if (res.meta.status !== 200) return this.$message.error('获取失败');
      this.$message.success('获取成功');
      this.editForm = res.data;
      this.editVisible = true;
    },
    editVisibleClosed() {
      this.$refs.editFormRef.resetFields();
    },
    async edit() {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
        {
          attr_sel: this.activeName,
          attr_name: this.editForm.attr_name
        }
      );
      if (res.meta.status !== 200) return this.$message.error('修改失败');
      this.$message.success('修改参数成功');
      this.editVisible = false;
      this.getParamsData();
    },
    async remove(id) {
      console.log(id);
      const confirmResult = await this.$confirm(
        '此操作将永久删除该' + this.titleText + '属性, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err);

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除');
      }
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      );
      if (res.meta.status !== 200) return this.$message.error('删除失败');
      this.$message.success('删除成功');
      this.getParamsData();
    },
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(',')
        }
      );
      if (res.meta.status !== 200) return this.$message.error('修改参数项失败');
      this.$message.success('修改参数项成功');
    },
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = '';
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = '';
      row.inputVisible = false;
      this.saveAttrVals(row);
    },
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      this.saveAttrVals(row);
    }
  },
  computed: {
    // 如果按钮需要被禁用
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true;
      }
      return false;
    },
    // 当前选中的三级分类id
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2];
      }
      return null;
    },
    titleText() {
      if (this.activeName === 'many') return '动态参数';
      return '静态参数';
    }
  }
};
</script>
<style lang="less" scoped>
.guandu {
  width: 20%;
}
.input-new-tag {
  width: 120px;
}
</style>
