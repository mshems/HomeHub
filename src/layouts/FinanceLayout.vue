<script setup>
import SettingsDialog from 'src/components/SettingsDialog.vue'

import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useSettingsStore } from 'src/stores/settings'

const $q = useQuasar()
const router = useRouter()
const settings = useSettingsStore()
</script>

<template>
  <q-layout view="lHh Lpr lFf">
    <q-toolbar>
      <q-toolbar-title class="title row items-center">
        <q-chip clickable icon="mdi-piggy-bank" color="green-10" text-color="on-color" class="q-ma-none text-bold" label="Finance" @click="router.push('/finance')"/>
        <div id="toolbar" class="row items-center"></div>
      </q-toolbar-title>
      <div class="row items-center no-wrap">
        <q-btn round size="md" dense flat color="primary" icon="mdi-home" :to="'/'"/>
        <q-btn round size="md" dense flat color="primary" icon="mdi-compare" @click="$q.dark.toggle()"/>
        <q-btn round size="md" dense flat color="primary" icon="mdi-cog" @click="settings.showMenu = true"/>
      </div>
    </q-toolbar>
    <q-page-container>
      <router-view />
      <settings-dialog v-model="settings.showMenu"/>
    </q-page-container>
  </q-layout>
</template>
