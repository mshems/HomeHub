import { DateTime } from 'luxon'

const now = DateTime.now()

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/DashboardView.vue') }
    ]
  },
  {
    path: '/login',
    component: () => import('layouts/EmptyLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LogIn.vue') }
    ]
  },
  {
    path: '/finance',
    component: () => import('layouts/FinanceLayout.vue'),
    children: [
      { path: '', props: true, component: () => import('src/pages/finance/FinanceHome.vue') }
    ]
  },
  {
    path: '/finance/bills',
    component: () => import('layouts/FinanceLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/finance/BillsView.vue') }
    ]
  },
  {
    path: '/finance/transactions',
    component: () => import('layouts/FinanceLayout.vue'),
    children: [
      {
        path: '',
        props: route => ({
          m: route.query.m ? Number.parseInt(route.query.m) : now.month,
          y: route.query.y ? Number.parseInt(route.query.y) : now.year
        }),
        component: () => import('src/pages/finance/TransactionsView.vue')
      },
      { path: ':id', props: true, component: () => import('src/pages/finance/TransactionView.vue') },
      { path: 'new', component: () => import('src/pages/finance/NewTransaction.vue') }
    ]
  },
  {
    path: '/finance/month',
    component: () => import('layouts/FinanceLayout.vue'),
    children: [
      {
        path: '',
        props: route => ({
          m: route.query.m ? Number.parseInt(route.query.m) : now.month,
          y: route.query.y ? Number.parseInt(route.query.y) : now.year
        }),
        component: () => import('src/pages/finance/MonthView.vue')
      }
    ]
  },
  {
    path: '/finance/users',
    component: () => import('layouts/FinanceLayout.vue'),
    children: [
      {
        path: ':id',
        props: route => ({
          id: route.params.id,
          m: route.query.m ? Number.parseInt(route.query.m) || now.month : now.month,
          y: route.query.y ? Number.parseInt(route.query.y) || now.year : now.year
        }),
        component: () => import('src/pages/finance/UserView.vue')
      }
    ]
  },

  {
    path: '/mealprep',
    component: () => import('layouts/RecipesLayout.vue'),
    children: [
      {
        path: '',
        props: route => ({
          d: route.query.d || now.startOf('week').toISODate()
        }),
        component: () => import('src/pages/recipes/MealPrepView.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
