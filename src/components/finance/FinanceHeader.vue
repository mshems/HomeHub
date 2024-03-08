<script setup>
import NavHeader from '../NavHeader.vue'
import NavChip from 'src/components/NavChip.vue'
</script>

<template>
  <nav-header>
    <template #default>
      <nav-chip path="/finance" icon="mdi-piggy-bank" label="Finance"/>
      <slot></slot>
    </template>
    <template #buttons>
      <q-btn size="md" dense flat color="muted" icon="mdi-view-grid" :to="'/'"/>
    </template>
  </nav-header>
</template>
