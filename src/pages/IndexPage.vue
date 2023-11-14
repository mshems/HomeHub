<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<template>
  <q-page padding>
    <div class="container column q-gutter-sm">
      <q-card
        class="finance-card cursor-pointer bg-green-2"
        @click="router.push('/finance')"
      >
        <q-card-section class="row no-wrap items-center text-green-10" style="font-size: 1.25rem;">
          <q-icon name="mdi-piggy-bank" class="q-mr-md" size="lg"/>
          <div>Finance</div>
        </q-card-section>
      </q-card>
      <a
        href="https://recipes.mshems.dev"
        target="recipes.mshems.dev"
      >
      <q-card
        class="recipe-card cursor-pointer bg-red-2"
      >
        <q-card-section class="row no-wrap items-center text-red-10" style="font-size: 1.25rem;">
          <q-icon name="mdi-pot-steam" size="lg" class="q-mr-md"/>
          <div>Recipes</div>
        </q-card-section>
      </q-card>
      </a>
    </div>
  </q-page>
</template>

<style lang="scss">
.finance-card {
  border: 1px solid $green-3;
}
.recipe-card {
  border: 1px solid $red-3;
}
</style>
