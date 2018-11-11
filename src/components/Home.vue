<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="logout">个人中心
        <a href="javascript:;" @click="logout">退出</a>
      </div>
      <h1 class="title">品牌后台管理系统</h1>
    </el-header>
    <el-container>
      <el-aside width="200">
        <el-menu
          default-active="/users"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          unique-opened
          router
          active-text-color="#ffd04b">
          <el-submenu index="/users">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户列表</span>
            </template>
            <el-menu-item index="/users">
              <i class="el-icon-menu"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品列表</span>
            </template>
            <el-menu-item index="2-1">
              <i class="el-icon-menu"></i>
              <span slot="title">商品管理</span>
            </el-menu-item>
            <el-menu-item index="2-2">
              <i class="el-icon-menu"></i>
              <span slot="title">管理</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view/></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    logout() {
      this.$confirm('您确定要退出吗？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        this.$router.push('/login')
      })
    }
  }
}
</script>

<style lang=less scoped>
.home {
  height: 100%;
  .el-header {
    height: 60px;
    background-color: #b3c1cd;
    .logo {
      width: 200px;
      height: 60px;
      background: url('../assets/logo.png') no-repeat center center;
      float: left;
      background-size: contain;
    }
    .logout {
      float: right;
      width: 200px;
      line-height: 60px;
      text-align: right;
      color: #333;
      a {
        color: red;
      }
    }
    .title {
      overflow: hidden;
      text-align: center;
      line-height: 60px;
      color: #fff;
      font-size: 30px;
    }
  }
  .el-container {
    height: 100%;
    .el-aside {
      width: 200px;
      height: 100%;
      background-color: #545c64;
      .el-menu {
        width: 200px;
      }
    }
    .el-main {
      width: 100%;
      height: 100%;
      background-color: #d4dfe4;
    }
  }
}
</style>
