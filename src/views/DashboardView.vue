<script setup lang="ts">
import { useRouter } from 'vue-router'

import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import FinanceWidget from '@/components/widgets/FinanceWidget.vue'

const router = useRouter()
</script>

<template>
  <div class="container grid max-w-[800px] grid-cols-12 gap-5 py-8">
    <div class="col-span-12 flex gap-5">
      <FinanceWidget />
    </div>
    <Card class="col-span-6" @click="router.push('/recipes')" :hoverable="true">
      <CardHeader>
        <CardTitle>Recipes</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
    <Card class="col-span-6" @click="router.push('/mealprep')" :hoverable="true">
      <CardHeader>
        <CardTitle>Meal Prep</CardTitle>
      </CardHeader>
      <CardContent></CardContent>
    </Card>

    <!-- <Card class="col-span-3 bg-primary p-5 text-primary-foreground">primary</Card>
    <Card class="text-muted-secondary col-span-3 bg-secondary p-5">secondary</Card>
    <Card class="hover:bg-accent-focus col-span-3 bg-accent p-5 text-accent-foreground"
      >accent</Card
    >
    <Card class="col-span-3 p-5 text-accent-typography">accent</Card>

    <Card class="hover:bg-positive-focus col-span-3 bg-positive p-5 text-positive-foreground"
      >positive</Card
    >
    <Card class="col-span-3 p-5 text-positive-typography">positive</Card>

    <Card class="bg-warning text-warning-foreground hover:bg-warning-focus col-span-3 p-5"
      >warning</Card
    >
    <Card class="text-warning-typography col-span-3 p-5">warning</Card>

    <Card class="hover:bg-negative-focus col-span-3 bg-negative p-5 text-negative-foreground"
      >negative</Card
    >
    <Card class="col-span-3 p-5 text-negative-typography">negative</Card>

    <Card
      class="hover:bg-destructive-focus col-span-3 bg-destructive p-5 text-destructive-foreground"
      >destructive</Card
    >
    <Card class="text-destructive-typography col-span-3 p-5">destructive</Card>

    <Card class="col-span-3 p-5">
      <Card class="bg-muted p-5 text-muted-foreground">muted</Card>
    </Card> -->
  </div>
</template>
