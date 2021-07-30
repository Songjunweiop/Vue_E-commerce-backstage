<template>
  <el-container class="home-container">
    <el-header>
      <div
        style="
          width: 210px;
          background-color: #222d31;
          height: 60px;
          text-align: center;
        "
      >
        <!-- <div class="tog_button" @click="toggleCollapse">| | |</div> -->
        <div class="tog_button" @click="toggleCollapse">
          <i class="fab fa-accusoft"></i>
        </div>
      </div>
      <div>
        <img src="../assets/images/loginX.png" alt />
        后台管理系统
        <div style="margin-left: 10px"></div>
        <div style="font-size: 20px">
          <i class="fab fa-accusoft"></i>
        </div>

        <!-- <div> -->
        <!-- <el-input placeholder="请输入内容" prefix-icon="el-icon-search" v-model="seainfo"></el-input> -->
        <!-- <el-button type="primary" round @click="search">Go</el-button> -->
        <!-- </div> -->
      </div>
      <div>
        <!-- <div style="margin-right:20px">欢迎！ {{ master }}</div> -->
        <img class="touxiang" src="../assets/images/login_img.jpg" />
        |
        <!-- <el-button style="margin-left: 10px" type="info" @click="logout"
          >退出</el-button
        > -->
        <el-dropdown
          trigger="click"
          @command="handleCommand"
          style="margin-left: 10px"
        >
          <span class="el-dropdown-link">
            {{ master }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="b">欢迎 {{ master }}</el-dropdown-item>
            <el-dropdown-item command="a" style="text-align: center"
              >退出</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边区域开始 -->
      <el-aside :width="isCollapse ? '56px' : '210px'">
        <!-- <div class="tog_button" @click="toggleCollapse">| | |</div> -->
        <el-menu
          background-color="#222d31"
          text-color="#bdc9d0"
          active-text-color="#409EFF"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu index="1-4">
            <template slot="title">
              <i :class="iconsOBJ[125]"></i>
              <span>会员管理</span>
            </template>
            <el-menu-item index="vips">
              <i :class="myiconsOBJ[110]"></i>
              &nbsp;
              <span>会员列表</span>
            </el-menu-item>
          </el-submenu>

          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单模板 -->
            <template slot="title">
              <i :class="iconsOBJ[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <template slot="title">
                <i :class="myiconsOBJ[subItem.id]"></i>
                &nbsp;
                <span>{{ subItem.authName }}</span>
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
  created() {
    this.getMenuList(),
      (this.master = window.sessionStorage.getItem('username'))
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      master: '',
      seainfo: '',
      menulist: [],
      iconsOBJ: {
        125: 'el-icon-s-custom',
        103: 'el-icon-s-claim',
        101: 'el-icon-s-goods',
        102: 'el-icon-s-operation',
        145: 'el-icon-s-marketing',
      },
      myiconsOBJ: {
        110: 'fas fa-users',
        111: 'fas fa-user-tag',
        112: 'fas fa-hand-paper',
        104: 'fas fa-box-open',
        115: 'fas fa-clipboard-check',
        121: 'fas fa-paste',
        107: 'fas fa-file-alt',
        146: 'fas fa-chart-line',
      },
      isCollapse: false, //是否折叠
      activePath: '', //被激活的链接地址
    }
  },
  methods: {
    search() {},
    handleCommand(command) {
      if (command === 'a') {
        window.sessionStorage.clear()
        this.$router.push('/login')
      }
    },
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      console.log(this.menulist)
    },
    //点击按钮，切换展开收缩
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
    },
  },
}
</script>

<style lang="less" scoped>
.el-dropdown-link {
  cursor: pointer;
  // color: #409eff;
}
.el-icon-arrow-down {
  font-size: 19px;
}
.el-header {
  .tog_button {
    margin-left: 100px;
    // width: 20px;
    // height: 20px;
    background-color: #2b333e;
    font-size: 19px;
    line-height: 24px;
    color: white;
    text-align: center;
    cursor: pointer;
  }
  background-color: rgba(255, 255, 255, 0.445);
  font-size: 17px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px;
  padding-right: 50px;
  min-width: 500px;
  .el-button.is-round {
    border-radius: 50%;
    padding: 10px;
    line-height: 18px;
    margin-left: 2px;
  }
  > div {
    display: flex;
    align-items: center;
    .el-input {
      width: 240px;
      margin-left: 30px;
    }
  }

  .touxiang {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  img {
    width: 130px;
    height: 40px;
    margin-right: 10px;
    // margin: 10px 20px;
  }
}
.el-aside {
  // position:relative;
  // top: -60px;
  // height: 100%;
  overflow: hidden;
  background-color: #2b333e;
  .el-menu {
    border-right: none;
  }
  .el-submenu {
    margin-right: 0px;
  }
}

.el-main {
  background-color: #f6f5fa;
}
.home-container {
  height: 100%;
}
</style>
