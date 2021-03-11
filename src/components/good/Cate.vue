<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-button type="primary"  @click="addCateVisible = true; getParentCateList()" round>添加商品</el-button>
      </el-row>

      <!-- 表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        style="margin-top:15px;"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            style="color:lightgreen;"
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
          ></i>
          <i style="color:red;" class="el-icon-error" v-else></i>
        </template>

        <!-- 级别 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level=='0'">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level=='1'">二级</el-tag>
          <el-tag type="info" v-else>三级</el-tag>
        </template>

        <!--  操作 -->
        <template slot="opt" slot-scope="scope">
          <el-tooltip content="编辑" placement="top" :enterable="false">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.cat_id)"
              round
            >编辑</el-button>
          </el-tooltip>
          <el-tooltip content="删除" placement="top" :enterable="false">
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              round
              @click="removeCate(scope.row.cat_id)"
            >删除</el-button>
          </el-tooltip>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 编辑商品 -->
      <el-dialog title="编辑分类名称" :visible.sync="editCateVisible" width="30%">
        <el-form :model="editCateForm" ref="e roundditCateRef" label-width="100px" class="demo-ruleForm">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editCateForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editCateVisible = false" round>取 消</el-button>
          <el-button type="primary" @click="editCate" round>确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加分类的对话框 -->
      <el-dialog title="添加分类" :visible.sync="addCateVisible" width="50%" @close="addDialogClosed">
        <el-form
          :rules="addCateFormRules"
          :model="addCateForm"
          ref="addCateFormRef"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名称:" prop="cat_Name">
            <el-input v-model="addCateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类:" prop="cat_Name">
            <!-- <el-input v-model="addCateForm.cat_name"></el-input> -->
            <el-cascader
              class="wi"
              v-model="selectedKeys"
              :options="ParentCateList"
              :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
              @change="parentCateChanged"
              clearable
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCateVisible = false" round>取 消</el-button>
          <el-button type="primary" @click="addCate" round>确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 查询条件
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },
      catelist:[],
      // 总数据条数
      total:0,
      // 为table指定列的定义
      columns:[
        {
          label:'分类名称',
          prop:'cat_name'
        },
        {//这是模板列
          label:'是否有效',
          type:'template',
          template:'isok'
        },
        {//这是模板列
          label:'排序',
          type:'template',
          template:'order'
        },
        {//这是模板列
          label:'操作',
          type:'template',
          template:'opt'
        }
      ],
      editCateVisible:false,
      editCateForm:{

      },
      addCateVisible:false,
      addCateForm:{
        cat_name:'',
        cat_pid:'0',
        cat_level:'0'
      },
      addCateFormRules:{
        cat_name: [
          { required: true, message: "别忘了输入账号哦", trigger: "blur" },
          { min: 1, max: 10, message: "长度在 1 到 10个字符", trigger: "blur" }
        ],
        cat_pid: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
      },
      // 父级列表
      ParentCateList:[],
      // cascaderProps:'',
      // 选中的父级分类id数
      selectedKeys:[]
    }
  },
  created(){
    this.getCateList()
  },
  methods:{

    async getCateList(){
      const {data:res}=await this.$http.get('categories',{params:this.queryInfo})

      if(res.meta.status!==200) return this.$message.error('获取商品分类失败')

      this.catelist=res.data.result
      this.total=res.data.total
      console.log('this='+this.total)
      console.log(this.catelist)
    },

    async showEditDialog(id){
      console.log(id)
      const {data:res} = await this.$http.get('categories/'+id)
      if(res.meta.status!==200) return this.$message.error('获取失败')
      this.editCateForm=res.data
      console.log(this.editCateForm)
      this.editCateVisible=true
    },

    async editCate(){
      const {data:res} = await this.$http.put('categories/'+this.editCateForm.cat_id,{
        cat_name:this.editCateForm.cat_name
      })
      if (res.meta.status!==200) return this.$message.error('编辑失败')
      this.$message.success('编辑成功')
      this.getCateList()
      this.editCateVisible=false
    },

    async removeCate(id){
      const confirmResult=await this.$confirm('此操作将永久删除该商品分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      console.log(confirmResult)

      if (confirmResult !== 'confirm') {
        return this.$message.info("已取消删除")
      }
      const {data:res} = await this.$http.delete('categories/'+id)
      if(res.meta.status!==200) return this.$message.error('删除失败')
      this.$message.success('删除成功！')
      this.getCateList()
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    // 监听页码值得改变
    handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage
      this.getCateList()
    },
    // 添加分类
    async addCate(){
      // parentCateChanged()
      console.log(this.addCateForm)
      this.getCateList()
      const {data:res} =await this.$http.post('categories',this.addCateForm)
      if(res.meta.status!==201) return this.$message.error('添加失败')
      this.$message.success('添加成功')
      this.getCateList()
      this.addCateVisible=false
    },
    // 获取父级分类的数据列表
    async getParentCateList(){
      const{data:res}=await this.$http.get('categories',{params:{
        type:2
      }})
      if(res.meta.status!==200) {
        return this.$message.error('获取父级分类失败')
      }
      this.$message.success('获取父级列表成功')
      this.ParentCateList=res.data
    },
    parentCateChanged(){
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        //父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys [
          this.selectedKeys.length - 1]
        //为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
        return 
      } else {
        //父级分类的Id
        this.addCateForm.cat_pid = 0
        //为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    addDialogClosed(){
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys=[]
      this.addCateForm.cat_level=0
      this.addCateForm.cat_pid=0
    }
  }
}
</script> 
<style lang="less" scoped>
.wi{
  width: 100%;
}
</style>