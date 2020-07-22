<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="10">
        <el-col :span="6">
          <!-- 搜索 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            @keyup.enter.native="getOrderList"
            class="input-with-select"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- orderlist区域 -->
      <el-row>
        <el-table :data="orderlist" style="width: 100%">
          <el-table-column type="index"></el-table-column>
          <el-table-column prop="order_number" label="订单编号"></el-table-column>
          <el-table-column prop="order_price" label="订单价格" width="200px"></el-table-column>
          <el-table-column prop="pay_status" label="是否付款" width="200px">
            <template slot-scope="scope">
              <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
              <el-tag type="danger" v-else>未付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="is_send" label="是否发货" width="200px"></el-table-column>
          <el-table-column prop="create_time" label="下单时间" width="200px">
            <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
          </el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <el-tooltip content="编辑商品" placement="top" :enterable="false">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="showEditDialog(scope.row.goods_id)"
                ></el-button>
              </el-tooltip>
              <el-tooltip content="删除商品" placement="top" :enterable="false">
                <el-button
                  size="mini"
                  type="success"
                  icon="el-icon-location"
                  circle
                  @click="removeGood(scope.row.goods_id)"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

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
  </div>
</template>
<script>
export default {
  data() {
    return {
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:5
      },
      total:0,
      orderlist:[],
    }
  },
  created(){
    this.getOrderList()
  },
  methods:{
    async getOrderList(){
      // console.log(this.queryInfo)
      const {data:res} = await this.$http.get('orders',{
        // params:this.queryInfo
        params:{
          query:this.queryInfo.query,
          pagenum:this.queryInfo.pagenum,
          pagesize:this.queryInfo.pagesize
        }
      })
      if(res.meta.status!==200) return this.$message.error('获取订单列表失败')
      this.$message.success('获取订单列表成功！')
      // console.log(res)
      this.orderlist=res.data.goods
      this.total=res.data.total
      // console.log(this.orderlist)
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum=newPage
      this.getOrderList()
    },

  }
}
</script>
<style lang="less" scope>

</style>