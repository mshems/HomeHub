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
        class="hoverable cursor-pointer bg-credit-bg"
        @click="router.push('/finance')"
      >
        <q-card-section class="row no-wrap items-baseline card-title text-on-credit">
          <q-icon
            name="mdi-piggy-bank"
            class="col-2"
            size="md"
          />
          <div class="col-auto">
            Finance
          </div>
        </q-card-section>
        <q-card-section />
      </q-card>
      <a
        href="https://recipes.mshems.dev"
        target="recipes.mshems.dev"
        style="text-decoration: none;"
      >
        <q-card
          class="hoverable cursor-pointer bg-recipes-bg"
        >
          <q-card-section class="row no-wrap items-baseline card-title text-on-recipes">
            <q-icon
              name="mdi-pot-steam"
              class="col-2"
              size="lg"
            />
            <div class="col-auto">Recipes</div>
          </q-card-section>
          <q-card-section />
        </q-card>
      </a>
      <q-card
        class="hoverable cursor-pointer bg-recipes-bg"
        @click="router.push('/mealprep')"
      >
        <q-card-section class="row no-wrap items-baseline card-title text-on-recipes">
          <q-icon
            name="mdi-food"
            class="col-2"
            size="md"
          />
          <div class="col-auto">
            Meal Prep
          </div>
        </q-card-section>
        <q-card-section />
      </q-card>
    </div>
  </q-page>
</template>
