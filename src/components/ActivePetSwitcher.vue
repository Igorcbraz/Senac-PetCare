<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import moment from 'moment'



const pet = ref(null)
const loading = ref(true)
onMounted(async () => {
  try {
    const { data } = await api.get('/pets')
    if (Array.isArray(data) && data.length > 0) {
      pet.value = data[0]
      pet.value.age = calculateAge(pet.value.birth_date)

    } else {
      console.warn('Nenhum pet encontrado')
    }
  } catch (err) {
    console.error('Erro ao carregar pets:', err)
  } finally {
    loading.value = false
  }
})

function calculateAge(birthDate) {
  console.log( birthDate)
  if (!birthDate) return 0
  return moment().diff(moment(birthDate), 'years')
}

</script>

<template>
  <q-card class="q-pa-md q-mb-md shadow-2">
    <q-card-section>
      <div class="text-h6">Pet Atual</div>
    </q-card-section>

    <q-separator />

    <q-card-section v-if="loading">
      <q-spinner color="primary" size="30px" />
      <div>Carregando dados do pet...</div>
    </q-card-section>

    <q-card-section v-else-if="pet">
      <div><strong>Nome:</strong> {{ pet.name }}</div>
      <div><strong>Espécie:</strong> {{ pet.species }}</div>
      <div><strong>Raça:</strong> {{ pet.breed }}</div>
      <div><strong>Idade:</strong> {{ pet.age }}</div>
      <div><strong>Status:</strong> {{ pet.status }}</div>
    </q-card-section>

    <q-card-section v-else>
      <div class="text-negative">Pet não encontrado.</div>
    </q-card-section>
  </q-card>
</template>
