<script setup>
import { useUserStore } from 'src/stores/user'
import { useSettingsStore } from './stores/settings'

const store = useUserStore()
const settings = useSettingsStore()
store.initialize()
settings.initialize()
</script>

<template>
  <router-view />
</template>
