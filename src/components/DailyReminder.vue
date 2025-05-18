<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Lembrete do Dia</div>
      <div>{{ reminder }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

const reminder = ref('Dar remédio antipulgas às 18h')
</script>
