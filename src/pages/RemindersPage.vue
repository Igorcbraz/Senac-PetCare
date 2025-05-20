<template>  
    <div class="text-h5 q-mb-md">Lembretes</div>

    <q-btn label="Adicionar Lembrete" icon="add" color="primary" @click="openDialog" />

    <q-list bordered class="q-mt-md">
      <q-item v-for="reminder in reminders" :key="reminder.id" clickable>
        <q-item-section avatar>
          <q-icon :name="getIcon(reminder.type)" />
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ reminder.title }}</q-item-label>
          <q-item-label caption>{{ reminder.time }} • {{ reminder.frequency }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-btn icon="edit" flat round @click.stop="editReminder(reminder)" />
          <q-btn icon="delete" flat round color="negative" @click.stop="deleteReminder(reminder.id)" />
        </q-item-section>
      </q-item>
    </q-list>

    <!-- Diálogo para adicionar/editar -->
    <q-dialog v-model="dialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ editedReminder.id ? 'Editar' : 'Novo' }} Lembrete</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="editedReminder.title" label="Título" />
          <q-select
            v-model="editedReminder.type"
            label="Tipo"
            :options="['Medicação', 'Alimentação', 'Passeio', 'Higiene']"
          />
          <q-input v-model="editedReminder.time" type="time" label="Horário" />
          <q-select
            v-model="editedReminder.frequency"
            label="Frequência"
            :options="['Diariamente', 'Semanalmente', 'Mensalmente']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Salvar" @click="saveReminder" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>



<script>

export default {
  data() {
    return {
      reminders: [],
      dialogOpen: false,
      editedReminder: {},
    };
  },
  methods: {
    openDialog() {
      this.editedReminder = {};
      this.dialogOpen = true;
    },
    editReminder(reminder) {
      this.editedReminder = { ...reminder };
      this.dialogOpen = true;
    },
    saveReminder() {
      if (this.editedReminder.id) {
        const index = this.reminders.findIndex(r => r.id === this.editedReminder.id);
        this.reminders[index] = { ...this.editedReminder };
      } else {
        this.editedReminder.id = Date.now();
        this.reminders.push({ ...this.editedReminder });
      }
      this.dialogOpen = false;
    },
    deleteReminder(id) {
      this.reminders = this.reminders.filter(r => r.id !== id);
    },
    getIcon(type) {
      const icons = {
        Medicação: 'medication',
        Alimentação: 'restaurant',
        Passeio: 'directions_walk',
        Higiene: 'cleaning_services',
      };
      return icons[type] || 'notifications';
    },
  },
};
</script>
