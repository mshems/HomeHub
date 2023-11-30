<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<template>
  <q-page padding>
    <div class="container column q-gutter-sm">
      <q-card
        class="finance-card cursor-pointer bg-credit-bg"
        @click="router.push('/finance')"
      >
        <q-card-section class="row no-wrap items-center card-title text-on-credit">
          <q-icon name="mdi-piggy-bank" class="q-mr-md" size="lg"/>
          <div>Finance</div>
        </q-card-section>
        <q-card-section></q-card-section>
      </q-card>
      <a
        href="https://recipes.mshems.dev"
        target="recipes.mshems.dev"
      >
      <q-card
        class="recipe-card cursor-pointer bg-red-2"
      >
        <q-card-section class="row no-wrap items-center card-title text-red-10">
          <q-icon name="mdi-pot-steam" class="q-mr-md" size="lg"/>
          <div>Recipes</div>
        </q-card-section>
        <q-card-section></q-card-section>
      </q-card>
      </a>
    </div>
  </q-page>
</template>
