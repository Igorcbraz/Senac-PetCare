<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Próximo Compromisso</div>
      <div>{{ nextAppointment.date }} às {{ nextAppointment.time }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const nextAppointment = ref({ date: '20/05/2025', time: '14:00' }) // substitua por dados da API futuramente

onMounted(() => {
  // buscar dados da API no futuro
})
</script>
