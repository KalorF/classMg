import Vue from 'vue'
import Router from 'vue-router'
import LoginRegister from './views/login_register/login_register'
import Home from './views/user_home/home'
import adminHome from './views/admin_home/admin_home'
import upPwd from './views/admin_home/pages/upPwd'
import hadSendMsg from './views/admin_home/pages/hadSendMsg'
import sendMsg from './views/admin_home/pages/sendMsg'
import setManage from './views/admin_home/pages/setManage'
import topaAdminHome from './views/top_admin_home/top_admin_home'
import addClass from './views/top_admin_home/pages/addClass'
import addStdId from './views/top_admin_home/pages/addStdId'
import stdMsg from './views/top_admin_home/pages/stdMsg'
Vue.use(Router)

const router = new Router({
  // mode: 'history',
  // base: process.env.BASE_URL,
  routes: [
    { path: '/', name: 'LoginRegister', component: LoginRegister },
    { path: '/home', meta: { requiresAuth: true }, name: 'home', component: Home },
    { path: '/adminHome',
      meta: { requiresAuth: true },
      name: 'adminHome',
      component: adminHome,
      redirect: { name: 'hadSendMsg' },
      children: [
        {
          path: '/hadSendMsg',
          name: 'hadSendMsg',
          meta: { requiresAuth: true },
          component: hadSendMsg
        },
        {
          path: '/upPwd',
          name: 'upPwd',
          meta: { requiresAuth: true },
          component: upPwd
        },
        {
          path: '/sendMsg',
          name: 'sendMsg',
          meta: { requiresAuth: true },
          component: sendMsg
        },
        {
          path: '/setManage',
          name: 'setManage',
          meta: { requiresAuth: true },
          component: setManage
        }
      ]
    },
    {
      path: '/topaAdminHome',
      name: 'topaAdminHome',
      meta: { requiresAuth: true },
      component: topaAdminHome,
      redirect: { name: 'addClass' },
      children: [
        {
          path: '/addClass',
          name: 'addClass',
          meta: { requiresAuth: true },
          component: addClass
        },
        {
          path: '/addStdId',
          name: 'addStdId',
          meta: { requiresAuth: true },
          component: addStdId
        },
        {
          path: '/stdMsg',
          name: 'stdMsg',
          meta: { requiresAuth: true },
          component: stdMsg
        }
      ]
    }

  ]
})
router.beforeEach((to, from, next) => {
  let status = window.sessionStorage.getItem('status')
  if (to.matched.some(record => record.meta.requiresAuth) && (status === null)) {
    next({
      path: '/',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
})
export default router
