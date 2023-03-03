import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginView from '@/views/login'
import LayoutView from '@/views/layout'

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

export default router
