<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <!-- <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button round slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row> -->

      <!-- 订单列表数据 -->
      <el-table :data="orderlist">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="订单ID">
                <span>{{ props.row.order_id }}</span>
              </el-form-item>
              <el-form-item label="下单时间" prop="create_time">
                <span>
                  {{ props.row.create_time | dateFormat }}
                </span>
              </el-form-item>

              <el-form-item label="商品名称">
                <span>{{ props.row.order_fapiao_content }}</span>
              </el-form-item>
              <el-form-item label="商品数量">
                <span>{{ props.row.trade_no }}</span>
              </el-form-item>
              <el-form-item label="是否发货">
                <span>{{ props.row.is_send }}</span>
              </el-form-item>
              <el-form-item label="总金额">
                <span>{{ props.row.order_price }} 元</span>
              </el-form-item>
              <el-form-item label="支付方式">
                <span>
                  <div v-if="props.row.order_pay === '0'">未支付</div>
                  <div v-if="props.row.order_pay === '1'">支付宝</div>
                  <div v-if="props.row.order_pay === '2'">微信</div>
                  <div v-if="props.row.order_pay === '3'">银行卡</div>
                </span>
              </el-form-item>
              <el-form-item label="发票抬头">
                <span>{{ props.row.order_fapiao_title }}</span>
              </el-form-item>
              <el-form-item label="配送地址">
                <span>{{ props.row.consignee_addr }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column
          label="发票抬头"
          prop="order_fapiao_title"
        ></el-table-column>
        <el-table-column label="是否付款" prop="order_pay">
          <template slot-scope="scope">
            <div v-if="scope.row.order_pay === '0'">未支付</div>
            <div v-if="scope.row.order_pay === '1'">支付宝</div>
            <div v-if="scope.row.order_pay === '2'">微信</div>
            <div v-if="scope.row.order_pay === '3'">银行卡</div>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">
          <template slot-scope="scope">
            <template>
              {{ scope.row.is_send }}
            </template>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-card
              shadow="hover"
              class="box-card handle"
              @click.native="deleteById(scope.row.order_id)"
            >
              删除
            </el-card>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button round @click="addressVisible = false">取 消</el-button>
        <el-button round type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 时间线 -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'

export default {
  data() {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      orderlist: [],
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: '',
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
        ],
      },
      cityData,
      progressVisible: false,
      progressInfo: [],
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表失败！')
      }

      console.log(res)
      this.total = res.data.total
      this.orderlist = res.data.order
    },
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 展示修改地址的对话框
    showBox() {
      this.addressVisible = true
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async deleteById(id) {
      console.log(id)
      const confirmResult = await this.$confirm(
        '您确定要删除该订单吗？',
        `${this.master}:`,
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
      const { data: res } = await this.$http.delete('orders/' + id)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success('删除订单成功！')
      this.getOrderList()
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';

.el-cascader {
  width: 100%;
}
.demo-table-expand {
  font-size: 0;
}
.el-form-item__label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.handle {
  cursor: pointer;
  float: left;
  width: 100px;
  height: 63px;
  text-align: center;
  margin-right: 20px;
  // line-height: 50px;
  padding: 0 !important;
}
</style>
