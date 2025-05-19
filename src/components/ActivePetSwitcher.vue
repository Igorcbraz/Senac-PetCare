<template>
  <div class="q-pa-md">
  <div v-if="pet" class="text-h6">
    <q-avatar class="q-mr-sm bg-grey-3">
      <q-icon :name="petAvatars[pet.species] || petAvatars.default" size="sm" color="primary" />
    </q-avatar>
    {{ pet.name }}
  </div>
  <div v-else class="text-h6">
    <q-skeleton type="text" width="120px" />
  </div>

    <q-separator spaced />

    <div v-if="loading">
      <q-spinner color="primary" size="30px" />
      <div>Carregando dados do pet...</div>
    </div>

    <div v-else-if="pet">
      <div><strong>Espécie:</strong> {{ pet.species }}</div>
      <div><strong>Raça:</strong> {{ pet.breed }}</div>
      <div><strong>Idade:</strong> {{ pet.age }}</div>
      <div><strong>Status:</strong> {{ pet.status }}</div>
    </div>

    <div v-else>
      <div class="text-negative">Pet não encontrado.</div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import moment from 'moment'

const petAvatars = {
  Cachorro: 'fas fa-dog',
  Gato: 'fas fa-cat',
  Pássaro: 'fas fa-dove',
  Réptil: 'fas fa-dragon',
  default: 'fas fa-paw',
}

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
  if (!birthDate) return 0
  return moment().diff(moment(birthDate), 'years')
}
</script>

