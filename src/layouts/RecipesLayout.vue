<script setup>
import SettingsDialog from 'src/components/SettingsDialog.vue'
import { useSettingsStore } from 'src/stores/settings'

const settings = useSettingsStore()
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <router-view />
      <settings-dialog v-model="settings.showMenu"/>
    </q-page-container>
  </q-layout>
</template>
