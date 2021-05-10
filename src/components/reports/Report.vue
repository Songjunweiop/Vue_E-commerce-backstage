<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card style="min-height: 600px">
      <div class="float" id="main2" style="width: 880px;height:400px; padding-top:0px"></div>
      <div class="float" id="main1" style="width: 300px;height:300px;"></div>
      <div class="float" id="main3" style="width: 1200px;height:200px; padding-top:0px"></div>
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
        // legend: {
        //   orient: 'vertical',
        //   left: 'left'
        // },
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
            radius: ['50%', '70%'],
            avoidLabelOverlap: true,
            name: '访问来源',
            type: 'pie',
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
          axisLabel: {},
          type: 'category',
          data: ['iPhone X', 'iPhone 11', 'iPhone 12', '小米电视 EA55', '小米透明电视', '小米电视大师']
        },
        xAxis: {
          name: '件',
          type: 'value'
        },

        color: ['#9a60b4'],
        series: [
          {
            name: '销量',
            data: [120, 200, 150],
            type: 'bar',

            label: {
              show: true
            }
          }
        ]
      },
      option3: {
        title: {
          text: '商店营业额'
        },
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: {
        //     type: 'shadow'
        //   }
        // },
        yAxis: {
          name: '商品名称',
          axisLabel: {},
          type: 'category',
          data: ['商店营业额']
        },
        xAxis: {
          name: '元',
          type: 'value'
        },

        color: ['#9a60b4'],
        series: [
          {
            name: '销量',
            data: [120],
            type: 'bar',

            label: {
              show: true
            }
          }
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
      let xiaomitoumin = 0;
      let dashi = 0;
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
        } else if(item.order_fapiao_content == '小米透明电视') {
          xiaomitoumin += parseInt(item.trade_no)
        } else if(item.order_fapiao_content == '小米电视大师') {
          dashi += parseInt(item.trade_no)
        }
      });
      console.log(ix, i11, i12);
      this.option2.series[0].data[0] = ix;
      this.option2.series[0].data[1] = i11;
      this.option2.series[0].data[2] = i12;
      this.option2.series[0].data[3] = xiaomi;
      this.option2.series[0].data[4] = xiaomitoumin;
      this.option2.series[0].data[5] = dashi;

      

      const total = this.ordersList.reduce((total, item) => {
        return total += item.order_price
      }, 0)
      this.option3.series[0].data[0] = total
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

      //------------------------------------------------------
      var echarts3 = require('echarts');
      var myChart3 = echarts3.init(document.getElementById('main3'));
      // const result=_.merge(res.data,this.options)
      const result3 = this.option3;
      // console.log(result);
      myChart3.setOption(result3);
    }, 1000);
  }
};
</script>
<style lang="less" scoped>
.float {
  float: left;
  padding: 50px;
}
</style>
