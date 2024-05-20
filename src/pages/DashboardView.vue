<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <q-page
    padding
    class="container"
  >
    <div class="column q-gutter-sm">
      <q-card
        class="hoverable cursor-pointer"
        @click="router.push('/finance')"
      >
        <q-card-section class="row no-wrap items-baseline title">
          <q-icon
            name="mdi-piggy-bank"
            class="col-2"
            size="md"
          />
          <div class="col-auto">
            Finance
          </div>
        </q-card-section>
      </q-card>
      <q-card
        class="hoverable cursor-pointer"
        @click="router.push('/recipes')"
      >
        <q-card-section class="row no-wrap items-baseline title">
          <q-icon
            name="mdi-pot-steam"
            class="col-2"
            size="md"
          />
          <div class="col-auto">
            Recipes
          </div>
        </q-card-section>
      </q-card>
      <q-card
        class="hoverable cursor-pointer"
        @click="router.push('/recipes/schedule')"
      >
        <q-card-section class="row no-wrap items-baseline title">
          <q-icon
            name="mdi-food"
            class="col-2"
            size="md"
          />
          <div class="col-auto">
            Meal Prep
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
