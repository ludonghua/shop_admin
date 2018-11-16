import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Users from '@/components/Users.vue'
// 导入角色列表
import Roles from '@/components/Roles.vue'
// 导入权限列表
import Rights from '@/components/Rights.vue'
// 导入商品分类页
import Categories from '@/components/categories/categories.vue'
// 导入Goods
import Goods from '@/components/categories/Goods.vue'
// 导入Goodsadd
import GoodsAdd from '@/components/categories/GoodsAdd.vue'
Vue.use(Router)

const router = new Router({
  routes: [

    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [

        {
          path: '/users',
          component: Users
        },
        {
          path: '/roles',
          component: Roles
        },
        {
          path: '/rights',
          component: Rights
        },
        {
          path: '/categories',
          component: Categories
        },
        {
          path: '/goods',
          component: Goods
        },
        {
          path: '/goods-add',
          component: GoodsAdd
        }
      ]
    }
  ]
})
// 路由守卫
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  if (token || to.path === '/login') {
    next()
  } else {
    next('/login')
  }
})
export default router
