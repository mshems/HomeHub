<script setup lang="ts">
import { useRouter } from 'vue-router'

import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import FinanceWidget from '@/components/widgets/FinanceWidget.vue'
import MealPrepWidget from '@/components/widgets/MealPrepWidget.vue'
import RecipesWidget from '@/components/widgets/RecipesWidget.vue'

const router = useRouter()
</script>

<template>
  <div class="container grid max-w-[800px] grid-cols-12 gap-5 py-8">
    <div class="col-span-12 flex gap-5">
      <FinanceWidget />
    </div>
    <div class="col-span-12 h-fit sm:col-span-6">
      <MealPrepWidget />
    </div>
    <div class="col-span-12 h-fit sm:col-span-6">
      <RecipesWidget />
    </div>
    <!-- <Card
      class="col-span-12 h-fit sm:col-span-6"
      @click="router.push('/recipes')"
      :hoverable="true"
    >
      <CardHeader>
        <CardTitle>Recipes</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card> -->
  </div>
</template>
