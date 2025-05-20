<template>
  <div>
    <q-btn
      flat
      round
      dense
      icon="notifications"
      @click="menu = !menu"
      color="grey-8"
    >
      <q-badge v-if="reminders.length" color="red" floating>
        {{ reminders.length }}
      </q-badge>
    </q-btn>

    <q-menu v-model="menu" anchor="bottom right" self="top right" :offset="[0, 10]">
      <q-list style="min-width: 250px; max-width: 300px;">
        <q-item v-for="(item, index) in limitedReminders" :key="index" clickable>
          <q-item-section>
            <q-item-label>{{ item.title }}</q-item-label>
            <q-item-label caption>{{ item.date }}</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator />

        <q-item clickable @click="goToReminders">
          <q-item-section class="text-primary text-center">
            Ver todas
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </div>
</template>

<script>
export default {
  name: 'Notificacoes',
  data() {
    return {
      menu: false,
      reminders: [
        { title: 'Vacina do pet', date: '20/05/2025' },
        { title: 'Consulta marcada', date: '22/05/2025' },
        { title: 'Revisão do cadastro', date: '23/05/2025' },
        { title: 'Plano prestes a vencer', date: '25/05/2025' }
      ]
    };
  },
  computed: {
    limitedReminders() {
      return this.reminders.slice(0, 3);
    }
  },
  methods: {
    goToReminders() {
      this.$router.push('/reminders');
    }
  }
};
</script>
