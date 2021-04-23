<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="min-height: 600px">
      <div class="float" id="main2" style="width: 880px;height:400px;"></div>
      <div class="float" id="main1" style="width: 400px;height:400px;"></div>
      <!-- <div class="float" id="main2" style="width: 500px;height:600px;"></div>
      <div class="float" id="main1" style="width: 500px;height:600px;"></div> -->
    </el-card>
  </div>
</template>
<script>
import _ from 'lodash';
export default {
  data() {
    return {
      option1: {
        title: {
          text: '订单支付表',
          // subtext: '纯属虚构',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        color: [
          '#91cc75',
          '#fac858',
          '#ee6666',
          '#73c0de',
          '#3ba272',
          '#fc8452',
          '#9a60b4',
          '#ea7ccc'
        ],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 0, name: '已发货' },
              { value: 0, name: '未发货' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      },
      option2: {
        title: {
          text: '商品销量'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        yAxis: {
          name: '商品名称',
          axisLabel:{
          },
          type: 'category',
          data: ['iPhone X', 'iPhone 11', 'iPhone 12', '小米电视 EA55']
        },
        xAxis: {
          name: '商品销量',
          type: 'value'
        },
        series: [
          {
            name: '销量',
            data: [120, 200, 150],
            type: 'bar'
          }
        ],
        color: [
          '#5470c6',
          '#91cc75',
          '#fac858',
          '#ee6666',
          '#73c0de',
          '#3ba272',
          '#fc8452',
          '#9a60b4',
          '#ea7ccc'
        ]
      },
      ordersList: {},
      queryInfo: {
        query: '是',
        pagenum: 1,
        pagesize: 100 //为了能够拿到全部订单
      }
    };
  },
  async created() {
    this.getAllOrders();

    console.log('1111111111111111111');
  },
  methods: {
    async getAllOrders() {
      console.log('222222222222222222');
      const { data: res } = await this.$http.get('orders', {
        params: {
          query: '',
          pagenum: this.queryInfo.pagenum,
          pagesize: this.queryInfo.pagesize
        }
      });
      console.log(res);
      this.ordersList = res.data.order;
      this.isSend();
      this.getGoodsnum();
    },
    isSend() {
      console.log('33333333333333333');
      const isSend = this.ordersList.reduce((res, item) => {
        if (item.is_send == '是') {
          res.push(item);
        }
        return res;
      }, []);
      console.log(isSend);
      this.option1.series[0].data[0].value = isSend.length;
      this.option1.series[0].data[1].value =
        this.ordersList.length - isSend.length;
      console.log('4444444444444444444');
    },
    getGoodsnum() {
      let ix = 0;
      let i11 = 0;
      let i12 = 0;
      let xiaomi = 0;
      this.ordersList.map(item => {
        console.log('????????');
        if (item.order_fapiao_content == 'iPhone X') {
          ix = ix + parseInt(item.trade_no);
        } else if (item.order_fapiao_content == 'iPhone 11') {
          i11 = i11 + parseInt(item.trade_no);
        } else if (item.order_fapiao_content == 'iPhone 12') {
          i12 = i12 + parseInt(item.trade_no);
        } else if (item.order_fapiao_content == '小米电视 EA55 2022款') {
          xiaomi += parseInt(item.trade_no);
        }
      });
      console.log(ix, i11, i12);
      this.option2.series[0].data[0] = ix;
      this.option2.series[0].data[1] = i11;
      this.option2.series[0].data[2] = i12;
      this.option2.series[0].data[3] = xiaomi;
    }
  },
  async mounted() {
    console.log('55555555555555555555');
    setTimeout(() => {
      var echarts1 = require('echarts');
      var myChart1 = echarts1.init(document.getElementById('main1'));
      // const result=_.merge(res.data,this.options)
      const result1 = this.option1;
      // console.log(result);
      myChart1.setOption(result1);

      //------------------------------------------------------
      var echarts2 = require('echarts');
      var myChart2 = echarts2.init(document.getElementById('main2'));
      // const result=_.merge(res.data,this.options)
      const result2 = this.option2;
      // console.log(result);
      myChart2.setOption(result2);
    }, 1000);
  }
};
</script>
<style lang="less" scoped>
.float {
  float: left;
  // margin-left: 800px;
  margin-left: 50px;
}
</style>
