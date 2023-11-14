const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
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
      { path: '', component: () => import('src/pages/finance/FinanceHome.vue') }
    ]
  },
  {
    path: '/finance/transactions',
    component: () => import('layouts/FinanceLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/finance/TransactionsView.vue') },
      { path: ':id', props: true, component: () => import('src/pages/finance/TransactionView.vue') },
      { path: ':id/edit', props: true, component: () => import('src/pages/finance/EditTransaction.vue') },
      { path: 'new', component: () => import('src/pages/finance/NewTransaction.vue') }
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
