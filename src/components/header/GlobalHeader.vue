<script setup lang="ts">
import Button from '../ui/button/Button.vue'
import AccountButton from './AccountButton.vue'
import ThemeSelect from './ThemeSelect.vue'
import { LayoutGrid } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <div class="flex flex-row items-center justify-between px-8 pt-5">
    <h1
      class="font-title text-primary cursor-pointer text-2xl font-semibold"
      @click="router.push('/')"
    >
      HomeHub
    </h1>
    <div class="flex gap-2">
      <Button variant="ghost" size="icon" @click="router.push('/')"><LayoutGrid /></Button>
      <AccountButton />
      <ThemeSelect />
    </div>
  </div>
</template>
