<script setup>
import NavChip from 'src/components/NavChip.vue'

import NavHeader from '../NavHeader.vue'
</script>

<template>
  <nav-header>
    <template #default>
      <nav-chip
        path="/recipes"
        icon="mdi-pot-steam"
        label="Recipes"
      />
      <slot />
    </template>
    <template #buttons>
      <q-btn
        size="md"
        dense
        flat
        color="muted"
        icon="mdi-view-grid"
        :to="'/'"
      />
    </template>
  </nav-header>
</template>
