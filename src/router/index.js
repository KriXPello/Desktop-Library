import Vue from 'vue'
import Router from 'vue-router'

import Home from '../views/Home'
import Books from '../views/Books'
import Readers from '../views/Readers'
import Extradition from '../views/Extradition'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/index.html',
      name: 'книги',
      component: Books,
    },
    {
      path: '/readers',
      name: 'читатели',
      component: Readers
    },
    {
      path: '/extradition',
      name: 'выдача',
      component: Extradition,
    },
  ]
})
