<script setup>
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useSettingsStore } from 'src/stores/settings'

const $q = useQuasar()
const router = useRouter()
const settings = useSettingsStore()

</script>
<template>
  <q-dialog
    :position="$q.screen.lt.sm ? 'bottom' : 'top'"
    :full-width="$q.screen.lt.sm"
  >
    <q-card
      :style="$q.screen.gt.xs ? 'width: 50%;' : ''"
      class="q-mx-xs"
    >
      <q-card-section class="card-title">
        <div class="row items-center no-wrap">
          <q-icon name="mdi-cog" color="secondary" class="q-mr-sm"/>
          Settings
        </div>
      </q-card-section>
      <q-card-section class="q-pb-md q-pt-sm q-px-none">
        <q-list>
          <q-item v-if="settings.user.authorized">
            <q-item-section side avatar>
              <q-icon name="mdi-account-circle" color="secondary" size="md"/>
            </q-item-section>
            <q-item-section>
              <q-item-label class="item-caption text-secondary">
                Account
              </q-item-label>
              <q-item-label>{{ settings.user.email }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat label="Log Out" color="negative" @click="settings.user.logout()" v-close-popup />
            </q-item-section>
          </q-item>
          <q-item v-else clickable @click="router.push('/login')">
            <q-item-section>
              <q-item-label class="item-caption text-secondary">
                Account
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn flat icon="mdi-login" color="primary" @click="settings.user.logout()" v-close-popup />
            </q-item-section>
          </q-item>
          <q-item
            clickable
            @click="$q.dark.set(!$q.dark.isActive)"
          >
            <q-item-section>
              <q-item-label class="item-caption text-secondary">
                Theme
              </q-item-label>
              <q-item-label>
                Use Dark Mode
              </q-item-label>
            </q-item-section>
            <q-item-section side>
                <q-toggle :modelValue="$q.dark.isActive === true" @update:model-value="$q.dark.set($event)"/>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
