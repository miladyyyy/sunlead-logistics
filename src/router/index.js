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
        component: () => import('@/views/dashboard'),
        meta: {
          hidden: false,
          title: '工作台'
        }
      },
      {
        path: 'branches',
        component: () => import('@/views/branches'),
        redirect: 'operational',
        children: [
          {
            path: 'organization-manage',
            component: () => import('@/views/branches/organization-manage'),
            meta: {
              hidden: false,
              title: '机构管理'
            }
          },
          {
            path: 'institutions-jobs-area',
            component: () => import('@/views/branches/institutions-jobs-area'),
            meta: {
              hidden: false,
              title: '机构作业范围'
            }
          },
          {
            path: 'operational-range',
            component: () => import('@/views/branches/operational-range'),
            meta: {
              hidden: false,
              title: '快递员管理'
            }
          },
          {
            path: 'pickUptask',
            component: () => import('@/views/branches/pickUptask'),
            meta: {
              hidden: false,
              title: '取件作业管理'
            }

          },
          {
            path: 'dispatchTask',
            component: () => import('@/views/branches/dispatchTask'),
            meta: {
              hidden: false,
              title: '派件作业管理'
            }
          },
          {
            path: 'MapContent',
            component: () => import('@/views/branches/operational-range/components/MapContent'),
            meta: {
              hidden: true,
              title: '作业范围分配'
            }
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
            component: () => import('@/views/transit/freight-manage'),
            meta: {
              hidden: false,
              title: '运费管理'
            }
          },
          {
            path: 'car-models',
            component: () => import('@/views/transit/car-models'),
            meta: {
              hidden: false,
              title: '车型管理'
            }
          },
          {
            path: 'vehicle',
            component: () => import('@/views/transit/vehicle'),
            meta: {
              hidden: false,
              title: '车辆管理'
            }
          },
          {
            path: 'car-register',
            component: () => import('@/views/transit/car-register'),
            meta: {
              hidden: false,
              title: '回车登记'
            }
          },
          {
            path: 'driver',
            component: () => import('@/views/transit/driver'),
            meta: {
              hidden: false,
              title: '司机管理'
            }
          },
          {
            path: 'workArrange-manage',
            component: () => import('@/views/transit/workArrange-manage'),
            meta: {
              hidden: false,
              title: '排班管理'
            }
          },
          {
            path: 'car-register-info',
            component: () => import('@/views/transit/car-register/components/car-register-info'),
            meta: {
              hidden: true,
              title: '回单查看'
            }
          },
          {
            path: 'vehicle-detail',
            component: () => import('@/views/transit/vehicle/components/vehicle-detail'),
            meta: {
              hidden: true,
              title: '车辆详情'
            }
          },
          {
            path: 'driver-detail',
            component: () => import('@/views/transit/driver/components/driver-detail'),
            meta: {
              hidden: true,
              title: '司机详情'
            }
          },
          {
            path: 'workArrange-setting',
            component: () => import('@/views/transit/workArrange-manage/components/workArrange-setting.vue'),
            meta: {
              hidden: true,
              title: '排班设置'
            }
          }
        ]
      },
      {
        path: 'business',
        component: () => import('@/views/business'),
        children: [
          {
            path: 'order-manage',
            component: () => import('@/views/business/order-manage'),
            meta: {
              hidden: false,
              title: '订单管理'
            }
          },
          {
            path: 'waybill',
            component: () => import('@/views/business/waybill'),
            meta: {
              hidden: false,
              title: '运单管理'
            }
          },
          {
            path: 'edit-order',
            component: () => import('@/views/business/order-manage/components/edit-order'),
            meta: {
              hidden: true,
              title: '订单详情'
            }
          },
          {
            path: 'waybill-detail',
            component: () => import('@/views/business/waybill/components/waybill-detail.vue'),
            meta: {
              hidden: true,
              title: '运单详情'
            }
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
            component: () => import('@/views/transport/transport-task'),
            meta: {
              hidden: false,
              title: '运输任务管理'
            }
          },
          {
            path: 'line-manage',
            component: () => import('@/views/transport/line-manage'),
            meta: {
              hidden: false,
              title: '线路管理'
            }
          },
          {
            path: 'task-detail',
            component: () => import('@/views/transport/transport-task/components/task-detail'),
            meta: {
              hidden: true,
              title: '任务详情'
            }
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

router.beforeEach(async (to, from, next) => {
  if (store.state.user.token) {
    if (!store.state.user.menu.length) {
      const { data: { data } } = await getMenusAPI()
      store.commit('user/setMenu', data)
    }
  } else {
    if (to.path === '/login') next()
    else next('/login')
  }
  next()
  // else {
  //   if (to.path === '/login') next('/')
  //   else next()
  // }

  // if (store.state.user.user.id) {
  //   if (!store.getters.userId) {
  //     const { data } = await getMenusAPI()
  //
  //     next(to.path)
  //   }
  //   if (to.path === '/login') next('/')
  //   else next()
  // } else {
  //   if (whitelist.includes(to.path)) next()
  //   else next('/login')
  // }
})

export default router
