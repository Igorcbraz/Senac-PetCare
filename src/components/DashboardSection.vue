<template>
  <div class="dashboard-grid">
    <q-card class="grid-card">
      <q-card-section>
        <ActivePetSwitcher />
      </q-card-section>
    </q-card>

    <q-card class="grid-card">
      <q-card-section>
        <NextAppointment />
      </q-card-section>
    </q-card>

    <q-card class="grid-card">
      <q-card-section>
        <DailyReminder />
      </q-card-section>
    </q-card>

  </div>
</template>

<script setup>
import { QCard, QCardSection } from 'quasar'
import ActivePetSwitcher from 'src/components/ActivePetSwitcher.vue'
import NextAppointment from 'src/components/NextAppointment.vue'
import DailyReminder from 'src/components/DailyReminder.vue'
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 16px;
}

.grid-card {
  min-height: 140px;
}


.half-width-card:nth-of-type(4) {
  grid-column: span 2;
}
.half-width-card:nth-of-type(5) {
  grid-column: span 1;
}
</style>
