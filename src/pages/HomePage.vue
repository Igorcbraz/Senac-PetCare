<template>
  <q-page class="q-pa-md">

    <div class="row q-col-gutter-md">

      <!-- Cards superiores: Compromisso, Lembrete, Saúde -->
      <div class="col-xs-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Próximo Compromisso</div>
            <div>{{ nextAppointment }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Lembrete do Dia</div>
            <div>{{ dailyReminder }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-md-4">
        <q-card>
          <q-card-section>
            <div class="text-h6">Resumo da Saúde</div>
            <div>Status: {{ pet.status || '---' }}</div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Linha de baixo: Pet Atual e Notificações -->
      <div class="col-xs-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Pet Atual</div>
            <div><strong>Nome:</strong> {{ pet.name }}</div>
            <div><strong>Espécie:</strong> {{ pet.species }}</div>
            <div><strong>Raça:</strong> {{ pet.breed }}</div>
            <div><strong>Idade:</strong> {{ pet.age }}</div>
            <div><strong>Status:</strong> {{ pet.status }}</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-xs-12 col-md-6">
        <q-card>
          <q-card-section>
            <div class="text-h6">Notificações</div>
            <q-separator class="q-my-sm" />
            <q-list bordered dense>
              <q-item v-for="(n, i) in notifications" :key="i">
                <q-item-section>{{ n }}</q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>

    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import moment from 'moment'

const pet = ref({})
const notifications = ref([
  'Consulta marcada para 20/05',
  'Vacina atrasada',
  'Nova mensagem do veterinário'
])

const nextAppointment = '20/05/2025 às 14:00'
const dailyReminder = 'Dar remédio antipulgas às 18h'

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
