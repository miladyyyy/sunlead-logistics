<template>
  <div class="app-wrapper">
    <el-container>
      <el-aside class="app-siderbar" width="227px">
        <div class="sidebar-logo-container">
          <img class="sidebar-logo" src="@/assets/img/logo.png" alt=""/>
        </div>
        <div class="menu-container">
          <el-menu router unique-opened>
            <template v-for="item in menusList">
              <el-submenu
                v-if="item.children"
                :key="item.id"
                :index="item.path"
              >
                <template #title>
                  <i :class="item.meta.icon"></i>
                  <span>{{ item.meta.title }}</span>
                </template>
                <el-menu-item
                  v-for="subitem in item.children"
                  :key="subitem.id"
                  :index="subitem.path"
                >
                  {{ subitem.meta.title }}
                </el-menu-item>
              </el-submenu>
              <el-menu-item v-else :key="item.id" :index="item.path">
                <template #title>
                  <i :class="item.meta.icon"></i>
                  <span>{{ item.meta.title }}</span>
                </template>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </el-aside>
      <el-container>
        <el-header class="app-headerbar">
          <el-row type="flex" justify="space-between" style="align-items: center">
            <div class="title" v-if="!$route.meta.hidden">{{$route.meta.title}}</div>
            <el-page-header v-else @back="$router.back()" :content="$route.meta.title">
            </el-page-header>

            <el-row class="right-menu" type="flex">
              <div class="avatar-wrapper">
                <img src="@/assets/img/default.jpg" alt=""/>
                <span class="username">{{ user.name }}</span>
              </div>
              <el-divider direction="vertical"></el-divider>
              <div class="logout-wrapper" @click="logout">
                <img src="@/assets/img/logout.png" alt=""/>
              </div>
            </el-row>
          </el-row>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'LayoutView',
  data () {
    return {
      menusList: []
    }
  },

  computed: {
    ...mapState('user', ['user', 'menu'])
  },

  created () {
    this.menusList = this.menu
  },

  methods: {
    // async getMenus () {
    //   if (this.menu) {
    //     this.menusList = this.menu
    //   } else {
    //     const { data } = await getMenusAPI()
    //     this.menusList = data.data
    //     this.$store.commit('user/setMenu', data.data)
    //   }
    // },

    logout () {
      this.$store.dispatch('user/logoutAction')
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  min-width: 1366px;
}

.app-siderbar {
  transition: width 0.28s;
  background-color: #fff;
  height: 100%;
  position: fixed;
  // font-size: 0;
  top: 0;
  bottom: 0;
  z-index: 1001;
  overflow: hidden;

  .sidebar-logo-container {
    position: relative;
    width: 100%;
    height: 120px;
    line-height: 70px;
    text-align: center;
    overflow: hidden;
    padding: 20px 20px 0;
    margin-bottom: 15px;

    .sidebar-logo {
      width: 152px;
    }
  }
}

.app-headerbar {
  //background-color: #fff;
  position: fixed;
  z-index: 100;
  top: 0;
  right: 0;
  width: calc(100% - 227px);
  transition: width 0.28s;
  background-color: #f3f5f9;
  padding: 25px 18px 0 18px;

  .avatar-wrapper {
    img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      vertical-align: middle;
      cursor: pointer;
    }

    .username {
      color: #072c56;
      margin-left: 5px;
    }
  }

  .logout-wrapper {
    img {
      width: 18px;
      vertical-align: middle;
      margin-left: 8px;
    }
  }
}

.el-menu-item.is-active {
  background: #fafafb;
}

.el-divider {
  height: 100%;
}

.el-main {
  //  background-color: pink;
  min-height: 100vh;
  position: relative;
  margin-left: 227px;
  margin-top: 60px;
}

::v-deep .el-page-header__content,.title {
  font-size: 18px;
  color: #303133;
  font-weight: bold;
}
</style>
