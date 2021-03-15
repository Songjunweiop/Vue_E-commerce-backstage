<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="10">
        <el-alert title="添加商品信息" type="info" center show-icon :clostable="false"></el-alert>
      </el-row>
      <el-row :gutter="10">
        <el-steps align-center :active="activeIndex-0" finish-status="success">
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>
      </el-row>
      <el-form
        ref="addFormRef"
        :rules="addFormRules"
        :model="addForm"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeleave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_name">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_name">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="{ expandTrigger: 'hover',value:'cat_id',label:'cat_name',children:'children' }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="(item,i) in manyTableData" :key="i">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="(item,i) in onlyTableData" :key="i">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary" round>点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button type="primary" class="btnAdd" @click="add" round>添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex:'0',
      addForm:{
        goods_cat:[],
        attrs:[],
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 图片的数组
        pics: [],
        // 商品的详情描述
        goods_introduce: ''
      },
      addFormRules:{
        goods_name:[{required: true, message:'请输入商品名称', trigger: 'blur'}],
        goods_price:[{required: true, message:'请输入商品价格', trigger: 'blur'}],
        goods_weight:[{required: true, message:'请输入商品重量', trigger: 'blur'}],
        goods_number:[{required: true, message:'请输入商品数量', trigger: 'blur'}],
        goods_cat:[{required: true, message:'请选择商品分类', trigger: 'blur'}],
      },
      catelist:[],
      manyTableData:[],
      onlyTableData:[],
      // 上传图片的URL地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  methods:{
    async getCateList(){
      const {data:res} = await this.$http.get('categories')
      if(res.meta.status!==200) return this.$message.error('获取失败')
      this.catelist=res.data
      // console.log(this.catelist)
    },
    handleChange(){
      console.log(this.addForm)
    },
    beforeleave(activeName,oldActiveName){
      console.log(this.addForm)
      if(oldActiveName==='0' & this.addForm.goods_cat.length !==3){
        this.$message.error('请先选择商品分类')
        return false
      }
    },
    async tabClicked(){
      if(this.activeIndex==='1'){
        const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{
            sel:'many'
          }
        })
        console.log(res)
        if(res.meta.status!==200) return this.$message.error('获取失败')
        res.data.forEach(item=>{
          item.attr_vals=item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })

        this.manyTableData=res.data
      }else if(this.activeIndex==='2'){
        const{data:res} =await this.$http.get(`categories/${this.cateId}/attributes`,{
          params:{
            sel:'only'
          }
        })
        if(res.meta.status!==200) return this.$message.error('获取静态属性失败')
        console.log(res.data)
        this.onlyTableData=res.data
      }
    },
    handlePreview(file){
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove(file){
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    handleSuccess(response) {
      console.log('response',response)
      console.log('addForm',this.addForm)
      // 1. 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2. 将图片信息对象，push 到pics数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        // 执行添加的业务逻辑
        // lodash   cloneDeep(obj)
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)

        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)

        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }

        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
  },
  created(){
    this.getCateList()
    console.log(this.uploadURL)
  },
  computed:{
    cateId(){
      if(this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script> 
<style lang="less" scope>
.el-checkbox{
  margin: 0 5px 0 0 !important;
}
.previewImg {
  width: 100%;
}

.btnAdd {
  margin-top: 15px;
}

</style>