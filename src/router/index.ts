import { DateTime } from 'luxon'
import { createRouter, createWebHistory } from 'vue-router'
import { getCurrentUser } from 'vuefire'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LogInView.vue')
    },
    {
      path: '/mealprep',
      name: 'meal-prep',
      component: () => import('@/views/mealprep/MealPrepView.vue'),
      props: (route) => ({
        d: route.query.d || DateTime.now().startOf('week').toISODate()
      })
    },
    {
      path: '/recipes',
      name: 'recipes',
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'recipes-list',
          component: () => import('@/views/recipes/RecipesView.vue')
        },
        {
          path: 'edit',
          name: 'recipe-edit',
          meta: { requiresAuth: true },
          props: (route) => ({
            id: route.query.id
          }),
          component: () => import('@/views/recipes/EditRecipeView.vue')
        },
        {
          path: ':id',
          name: 'recipe-detail',
          props: true,
          component: () => import('@/views/recipes/RecipeDetailView.vue')
        }
      ]
    },
    {
      path: '/finance/transactions',
      name: 'transactions',
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'transactions-list',
          props: (route) => ({
            m: route.query.m ? Number.parseInt(route.query.m.toString()) : DateTime.now().month,
            y: route.query.y ? Number.parseInt(route.query.y.toString()) : DateTime.now().year
          }),
          component: () => import('@/views/finance/TransactionsView.vue')
        },
        {
          path: 'edit',
          name: 'transaction-edit',
          meta: { requiresAuth: true },
          props: (route) => ({
            id: route.query.id
          }),
          component: () => import('@/views/finance/EditTransactionView.vue')
        },
        {
          path: 'metrics',
          name: 'transaction-metrics',
          meta: { requiresAuth: true },
          props: (route) => ({
            m: route.query.m ? Number.parseInt(route.query.m.toString()) : DateTime.now().month,
            y: route.query.y ? Number.parseInt(route.query.y.toString()) : DateTime.now().year
          }),
          component: () => import('@/views/finance/TransactionsMetricsView.vue')
        },
        {
          path: ':id',
          name: 'transaction-detail',
          props: true,
          component: () => import('@/views/finance/TransactionDetailView.vue')
        }
      ]
    }
  ]
})

router.beforeEach(async (to) => {
  // routes with `meta: { requiresAuth: true }` will check for
  // the users, others won't
  if (to.meta.requiresAuth) {
    const currentUser = await getCurrentUser()
    // if the user is not logged in, redirect to the login page
    if (!currentUser) {
      return {
        path: '/login',
        query: {
          // we keep the current path in the query so we can
          // redirect to it after login with
          // `router.push(route.query.redirect || '/')`
          redirect: to.fullPath
        }
      }
    }
  }
})

export default router
