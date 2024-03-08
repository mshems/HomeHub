<script setup>
import NavChip from 'src/components/NavChip.vue'
import NavHeader from 'src/components/NavHeader.vue'
import SettingsDialog from 'src/components/SettingsDialog.vue'
import { useSettingsStore } from 'src/stores/settings'

const settings = useSettingsStore()
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <nav-header>
        <nav-chip path="/" icon="mdi-view-grid" label="Dashboard"/>
      </nav-header>
      <router-view />
      <settings-dialog v-model="settings.showMenu"/>
    </q-page-container>
  </q-layout>
</template>
