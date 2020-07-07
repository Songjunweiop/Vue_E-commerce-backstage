<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/images/loginX.png" alt />
        后台管理系统
        <!-- <div> -->
        <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="seainfo"></el-input>
        <el-button type="primary" round @click="search">Go</el-button>
        <!-- </div> -->
      </div>
      <div>
        <img
          class="touxiang"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
        <el-button type="info" @click="logout">退出</el-button>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边区域开始 -->
      <el-aside :width="isCollapse ? '56px' : '200px'">
        <div class="tog_button" @click="toggleCollapse">| | |</div>
        <el-menu
          unique-opened
          background-color="#2b333e"
          text-color="#fff"
          active-text-color="#409EFF"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <i :class="iconsOBJ[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/'+subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 侧边区域结束 -->
      <!-- 主显示区开始 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
      <!-- 主显示区结束 -->
    </el-container>
  </el-container>
</template>

<script>
export default {
  created(){
    this.getMenuList(),
    this.activePath= window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      seainfo:'',
      menulist:[],
      iconsOBJ:{
        '125':'el-icon-s-custom',
        '103':'el-icon-s-claim',
        '101':'el-icon-s-goods',
        '102':'el-icon-s-operation',
        '145':'el-icon-s-marketing',
      },
      isCollapse: false,//是否折叠
      activePath:'',//被激活的链接地址
    }
  },
  methods:{
    search(){

    },
    logout(){
      window.sessionStorage.clear()
      this.$router.push("/login");
    },
    // 获取所有菜单
    async getMenuList(){
      const {data: res}= await this.$http.get('menus')
      // console.log(res)
      if(res.meta.status !==200) return this.$message.error(res.meta.msg)
      this.menulist=res.data
    },
    //点击按钮，切换展开收缩
    toggleCollapse(){
      this.isCollapse= !this.isCollapse
    },
    //保存链接的激活状态 
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
    }
  }
}
</script>

<style lang="less" scoped>

.el-header{
  background-color: rgba(255, 255, 255, 0.445);
  font-size: 20px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 50px;
.el-button.is-round{
  border-radius: 50%;
  padding: 10px;
  line-height: 18px;
  margin-left: 2px;
}
  > div {
    display: flex;
    align-items: center;
    .el-input{
      width: 240px;
      margin-left: 30px;
      
    }
    
  }
  
  .touxiang{
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  img{
    width: 130px;
    height: 40px;
    margin-right: 30px;
    // margin: 10px 20px;
  }
}
.el-aside{
  background-color: #2b333e;
  .el-menu{
    border-right: none;
  }
  .el-submenu{
    margin-right: 10px;
  }
}
.tog_button{
  background-color: #2b333e;
  font-size: 10px;
  line-height: 24px;
  color: white;
  text-align: center;
  cursor: pointer;
}


.el-main{
  background-color: #f6f5fa;
}
.home-container{
  height: 100%;
}
</style>