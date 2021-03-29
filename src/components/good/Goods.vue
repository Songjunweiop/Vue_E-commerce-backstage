<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card -->
    <el-card>
      <el-row :gutter="30">
        <el-col :span="6">
          <!-- 搜索 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @keyup.enter.native="getGoodsList"
            class="input-with-select"
          >
            <el-button
              slot="append"
              round
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button round type="primary" @click="goAddpage"
            >添加商品</el-button
          >
        </el-col>
      </el-row>

      <el-table :data="goodslist" style="width: 100%">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          label="商品价格"
          prop="goods_price"
          width="150px"
        ></el-table-column>
        <el-table-column
          label="商品数量"
          prop="goods_number"
          width="150px"
        ></el-table-column>
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="150px"
        ></el-table-column>
        <el-table-column label="录入时间" prop="add_time" width="200px">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-tooltip content="编辑商品" placement="top" :enterable="false">
              <el-button
                size="mini"
                type="primary"
                icon="el-icon-edit"
                circle
                round
                @click="showEditDialog(scope.row.goods_id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除商品" placement="top" :enterable="false">
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                circle
                round
                @click="removeGood(scope.row.goods_id)"
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

      <!-- 修改商品的对话框 -->
      <el-dialog
        title="修改商品信息"
        :visible.sync="editDialogVisible"
        width="50%"
      >
        <el-form
          :model="editForm"
          ref="editFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="商品图片">
            <el-image
              style="width: 100px; height: 100px"
              :src="url"
              :preview-src-list="urlList"
              fit="cover"
            >
              <div slot="error" class="image-slot">暂无</div></el-image
            >
          </el-form-item>
          <el-form-item label="商品名称" prop="goods_name">
            <el-input v-model="editForm.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="价格" prop="goods_price">
            <el-input v-model="editForm.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="goods_number">
            <el-input v-model="editForm.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="重量" prop="goods_weight">
            <el-input v-model="editForm.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品分类" prop="goods_cat">
            <el-col>
              <el-cascader
                disabled
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
          </el-form-item>
          <el-form-item label="静态属性">
            <el-table :data="manyTabData" style="width: 100%">
              <el-table-column width="200px">
                <template slot-scope="scope">
                  <el-tag effect="dark">{{ scope.row.attr_name }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column width="200px">
                <template slot-scope="scope">
                  <el-tag
                  effect="plain"
                    style="margin:0 5px;"
                    v-for="(item, i) in scope.row.attr_value"
                    :key="i"
                    type="success"
                    @close="handleClose(i, scope.row)"
                    >{{ item }}</el-tag
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button round @click="editDialogVisible = false">取 消</el-button>
          <el-button round type="primary" @click="editUserChange"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      goodslist: [],
      input: '',
      total: 0,
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      editDialogVisible: false,
      editForm: {},
      url: '',
      urlList: [],
      manyTabData: [],
      catelist: [],
      selectedCateKeys: []
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories');
      if (res.meta.status !== 200)
        return this.$message.error(res.meta.msg);
      this.catelist = res.data;
      console.log(this.catelist);
    },
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: {
          query: this.queryInfo.query,
          pagenum: this.queryInfo.pagenum,
          pagesize: this.queryInfo.pagesize
        }
      });
      if (res.meta.status !== 200)
        return this.$message.error(res.meta.msg);
      this.$message.success('获取商品列表成功');
      // console.log(res)
      this.goodslist = res.data.goods;
      this.total = res.data.total;
      // console.log(this.queryInfo.query)
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    },
    async showEditDialog(id) {
      this.getCateList();

      this.url = '';
      this.urlList = [];
      const { data: res } = await this.$http.get('goods/' + id);
      // console.log(id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.editForm = res.data;

      this.selectedCateKeys = JSON.parse('[' + res.data.goods_cat + ']');
      // this.selectedCateKeys = res.data.goods_cat.split(',').map(Number);

      if (this.editForm.pics.length !== 0) {
        this.url = this.editForm.pics[0].pics_sma_url;
        this.urlList.push(this.editForm.pics[0].pics_big_url);
      }

      res.data.attrs.forEach(item => {
        item.attr_value = item.attr_value ? item.attr_value.split(',') : [];
        // 控制文本显示隐藏
        item.inputVisible = false;
        item.inputValue = '';
      });
      this.manyTabData = res.data.attrs;

      // console.log(this.url);
      this.editDialogVisible = true;
      console.log(this.selectedCateKeys);
    },
    handleChange() {
      console.log(this.selectedCateKeys);
    },
    async editUserChange() {
      // console.log(this.editForm)
      // console.log(this.editForm.goods_id)
      const { data: res } = await this.$http.put(
        'goods/' + this.editForm.goods_id,
        {
          goods_name: this.editForm.goods_name,
          goods_price: this.editForm.goods_price,
          goods_number: this.editForm.goods_number,
          goods_weight: this.editForm.goods_weight
        }
      );
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);

      this.editDialogVisible = false;
      this.getGoodsList();
      // this.$message.info('更新商品信息接口维护中');
    },
    async removeGood(id) {
      console.log(id);
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
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
      const { data: res } = await this.$http.delete('goods/' + id);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.$message.success('删除商品成功！');
      this.getGoodsList();
    },
    goAddpage() {
      this.$router.push('/goods/add');
    }
  }
};
</script>

<style lang="less" scoped></style>
