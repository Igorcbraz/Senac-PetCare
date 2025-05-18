<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Notificações</div>
      <ul>
        <li v-for="note in notifications" :key="note">{{ note }}</li>
      </ul>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'

const notifications = ref([
  'Consulta marcada para 20/05',
  'Vacina atrasada',
  'Nova mensagem do veterinário'
])
</script>
