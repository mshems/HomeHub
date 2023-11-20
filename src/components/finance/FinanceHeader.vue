<script setup>
import NavChip from 'src/components/finance/NavChip.vue'
import { useQuasar } from 'quasar'
import { useSettingsStore } from 'src/stores/settings'

const $q = useQuasar()
const settings = useSettingsStore()
</script>

<template>
  <q-toolbar>
    <q-toolbar-title class="title row items-center">
      <nav-chip path="/finance" icon="mdi-piggy-bank" label="Finance"/>
      <slot></slot>
    </q-toolbar-title>
    <div class="row items-center no-wrap">
      <q-btn round size="md" dense flat color="primary" icon="mdi-home" :to="'/'"/>
      <q-btn round size="md" dense flat color="primary" icon="mdi-compare" @click="$q.dark.toggle()"/>
      <q-btn round size="md" dense flat color="primary" icon="mdi-cog" @click="settings.showMenu = true"/>
    </div>
  </q-toolbar>
</template>
