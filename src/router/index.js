import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/components/Login.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/components/Login.vue')
  }, {
    path: '/notebooks',
    name: 'NotebookList',
    component: () => import('@/components/NotebookList.vue')
  }, {
    path: '/note',
    name: 'NoteDetail',
    component: () => import('@/components/NoteDetail.vue')
  }, {
    path: '/trash',
    name: 'TrashDetail',
    component: () => import('@/components/TrashDetail')
  }
]
const router = new VueRouter({
  routes
})

export default router
