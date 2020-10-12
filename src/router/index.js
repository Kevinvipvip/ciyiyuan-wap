import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    meta: { title: '瓷艺园', title_bg: '#ffffff' },
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')//首页
  }, {
    meta: { title: '登录' },
    path: '/login',
    name: 'login',
    component: () => import( '../views/Login.vue')// 登录页
  }, {
    meta: { title: '关于我们' },
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')//关于我们
  }, {
    meta: { title: '馆藏精品', keepAlive: true },
    path: '/collections',
    name: 'collections',
    component: () => import('../views/Collections.vue')//馆藏精品
  }, {
    meta: { keepAlive: true, isBack: false },
    path: '/collectionsclassify',
    name: 'collectionsclassify',
    component: () => import('../views/CollectionsClassify.vue')//馆藏精品分类列表页
  }, {
    meta: { title: '藏品详情' },
    path: '/collectionsdetail',
    name: 'collectionsdetail',
    component: () => import('../views/CollectionsDetail.vue')// 藏品详情页
  }, {
    meta: { title: '门票' },
    path: '/ticket',
    name: 'ticket',
    component: () => import('../views/Ticket.vue')//门票
  }, {
    meta: { title: '门票预订' },
    path: '/booking',
    name: 'booking',
    component: () => import( '../views/TicketBooking.vue')// 门票预订
  }, {
    meta: { title: '历史订单', title_bg: '#ffffff' },
    path: '/history',
    name: 'history',
    component: () => import( '../views/TicketHistory.vue')// 历史订单
  }, {
    meta: { title: '订单详情' },
    path: '/ticket_detail',
    name: 'ticket_detail',
    component: () => import( '../views/TicketDetail.vue')// 订单详情
  }, {
    meta: { title: '核销' },
    path: '/ticket_check',
    name: 'ticket_check',
    component: () => import( '../views/TicketCheck.vue')// 扫码核销页
  }, {
    meta: { title: '我的核销历史' },
    path: '/check_history',
    name: 'check_history',
    component: () => import( '../views/TicketCheckHistory.vue')// 我的核销历史页
  }, {
    meta: { title: '个人中心' },
    path: '/mine',
    name: 'mine',
    component: () => import('../views/Mine.vue')//个人中心
  }
];

const router = new VueRouter({
  routes
});

export default router
