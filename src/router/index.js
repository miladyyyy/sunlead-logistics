import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '@/views/login'
import LayoutView from '@/views/layout'
import store from '@/store'
import { getMenusAPI } from '@/api'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'layout',
    component: LayoutView,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard')
      },
      {
        path: 'branches',
        component: () => import('@/views/branches'),
        redirect: 'operational',
        children: [
          {
            path: 'organization-manage',
            component: () => import('@/views/branches/organization-manage')
          },
          {
            path: 'institutions-jobs-area',
            component: () => import('@/views/branches/institutions-jobs-area')
          },
          {
            path: 'operational-range',
            component: () => import('@/views/branches/operational-range')
          },
          {
            path: 'pickUptask',
            component: () => import('@/views/branches/pickUptask')
          },
          {
            path: 'dispatchTask',
            component: () => import('@/views/branches/dispatchTask')
          },
          {
            path: 'MapContent',
            component: () => import('@/views/branches/operational-range/components/MapContent')
          }
        ]
      },

      {
        path: 'transit',
        component: () => import('@/views/transit'),
        redirect: 'car-models',
        children: [
          {
            path: 'freight-manage',
            component: () => import('@/views/transit/freight-manage')
          },
          {
            path: 'car-models',
            component: () => import('@/views/transit/car-models')
          },
          {
            path: 'vehicle',
            component: () => import('@/views/transit/vehicle')
          },
          {
            path: 'car-register',
            component: () => import('@/views/transit/car-register')
          },
          {
            path: 'driver',
            component: () => import('@/views/transit/driver')
          },
          {
            path: 'workArrange-manage',
            component: () => import('@/views/transit/workArrange-manage')
          },
          {
            path: 'car-register-info',
            component: () => import('@/views/transit/car-register/components/car-register-info')
          },
          {
            path: 'vehicle-detail',
            component: () => import('@/views/transit/vehicle/components/vehicle-detail')
          },
          {
            path: 'driver-detail',
            component: () => import('@/views/transit/driver/components/driver-detail')
          },
          {
            path: 'workArrange-setting',
            component: () => import('@/views/transit/workArrange-manage/components/workArrange-setting.vue')
          }
        ]
      },
      {
        path: 'business',
        component: () => import('@/views/business'),
        children: [
          {
            path: 'order-manage',
            component: () => import('@/views/business/order-manage')
          },
          {
            path: 'waybill',
            component: () => import('@/views/business/waybill')
          },
          {
            path: 'edit-order',
            component: () => import('@/views/business/order-manage/components/edit-order')
          },
          {
            path: 'waybill-detail',
            component: () => import('@/views/business/waybill/components/waybill-detail.vue')
          }
        ]
      },
      {
        path: 'transport',
        component: () => import('@/views/transport'),
        redirect: 'transport-task',
        children: [
          {
            path: 'transport-task',
            component: () => import('@/views/transport/transport-task')
          },
          {
            path: 'line-manage',
            component: () => import('@/views/transport/line-manage')
          },
          {
            path: 'task-detail',
            component: () => import('@/views/transport/transport-task/components/task-detail')
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  }
]

const router = new VueRouter({
  routes
})

// const whitelist = ['/login', '/404']

// router.beforeEach(async (to, from, next) => {
//   if (store.state.user.user.id) {
//     if (!store.state.user.menuList.length) {
//       const { data } = await getMenusAPI()
//       this.$store.commit('user/setMenu', data.data)
//       next(to.path)
//     }
//     // if (to.path === '/login') next('/')
//     // else next()
//   }
//   // if (store.state.user.user.id) {
//   //   if (!store.getters.userId) {
//   //     const { data } = await getMenusAPI()
//   //
//   //     next(to.path)
//   //   }
//   //   if (to.path === '/login') next('/')
//   //   else next()
//   // } else {
//   //   if (whitelist.includes(to.path)) next()
//   //   else next('/login')
//   // }
// })

export default router
