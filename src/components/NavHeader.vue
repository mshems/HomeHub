<script setup>
import { useQuasar } from 'quasar'
import { useSettingsStore } from 'src/stores/settings'

const $q = useQuasar()
const settings = useSettingsStore()
</script>

<template>
  <q-toolbar>
    <q-toolbar-title class="title row items-center">
      <slot></slot>
    </q-toolbar-title>
    <div class="row items-center no-wrap">
      <slot name="buttons"></slot>
      <q-btn round size="md" dense flat color="primary" icon="mdi-compare" @click="$q.dark.toggle()"/>
      <q-btn round size="md" dense flat color="primary" icon="mdi-cog" @click="settings.showMenu = true"/>
    </div>
  </q-toolbar>
</template>
