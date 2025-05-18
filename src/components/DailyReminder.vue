<template>
  <div class="text-h6">Lembrete do Dia</div>
  <div>{{ reminder }}</div>
</template>

<script setup>
import { ref } from 'vue'

const reminder = ref('Dar remédio antipulgas às 18h')
</script>
