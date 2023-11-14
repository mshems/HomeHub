<script setup>
import { useUserStore } from 'src/stores/user'

const store = useUserStore()
store.initialize()
</script>

<template>
  <router-view />
</template>
