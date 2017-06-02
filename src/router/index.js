import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import billboardDetail from '@/components/billboard-detail'
import song from '@/components/song'


Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
    	path:'/billboardDetail',
    	name:'billboardDetail',
    	component:billboardDetail
    },
    {
    	path:'/song',
    	name:'song',
    	component:song
    }
  ]
})
