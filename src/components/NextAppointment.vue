<template>
  <div class="text-h6">Próximo Compromisso</div>
  <div>{{ nextAppointment.date }} às {{ nextAppointment.time }}</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const nextAppointment = ref({ date: '20/05/2025', time: '14:00' })

onMounted(() => {
})
</script>
