<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="row bg-grey-1" style="height: 80px">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
          color="grey"
        />
        <q-toolbar-title class="text-weight-bold" style="flex: none">
          <img :src="logoPetcare" class="q-mt-sm" alt="PetCare Logo" style="height: 45px" />
        </q-toolbar-title>
        <q-toolbar-title>
          <div
            v-if="selectedPet"
            class="pet-info-bar q-px-lg q-py-xs q-mx-auto q-my-sm"
            :class="petInfoBarColor"
            style="max-width: 520px; border-radius: 20px"
          >
            <div class="row items-center no-wrap">
              <q-avatar size="40px" class="q-mr-md">    
                <q-icon :name="selectedPet.avatar" size="28px" color="white" />
              </q-avatar>
              <div>
                <div class="text-weight-bold">{{ selectedPet.name }}</div>
                <div class="text-caption">
                  {{ selectedPet.breed }} • {{ selectedPet.age }} ano(s)
                </div>
              </div>
              <q-space />
              <q-chip color="green-7" class="text-white" v-if="selectedPet.status === 'healthy'">
                <q-icon name="check_circle" left />
                Saudável
              </q-chip>
              <q-chip
                color="amber-7"
                class="text-white"
                v-else-if="selectedPet.status === 'attention'"
              >
                <q-icon name="warning" left />
                Atenção
              </q-chip>
            </div>
          </div>
        </q-toolbar-title>
        <q-btn round flat>
          <q-avatar size="42px" color="secondary">
            {{ usernameFirstLetter }}
          </q-avatar>

          <q-menu>
            <q-list style="min-width: 200px">
              <q-item class="bg-secondary text-white">
                <q-item-section avatar>
                  <q-avatar>
                    {{ usernameFirstLetter }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ user.name }}</q-item-label>
                  <q-item-label caption class="text-grey-4">{{ user.email }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-separator />

              <q-item clickable v-ripple @click="logout">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>
                <q-item-section>Sair</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered :width="280" class="bg-grey-1">
      <q-scroll-area class="fit">
        <q-list padding>
          <q-item-label header class="text-grey-8 text-weight-bold">MENU PRINCIPAL</q-item-label>

          <q-item clickable v-ripple to="/home" exact>
            <q-item-section avatar>
              <q-icon name="home" color="primary" />
            </q-item-section>
            <q-item-section>Início</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/reminders">
          <q-item-section avatar>
            <q-icon name="notifications_active" color="primary" />
              </q-item-section>
            <q-item-section>Lembretes</q-item-section>
          </q-item>


          <q-item clickable v-ripple to="/veterinarians" disable>
            <q-item-section avatar>
              <q-icon name="local_hospital" color="primary" />
            </q-item-section>
            <q-item-section>Veterinários (Em breve)</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/social" disable>
            <q-item-section avatar>
              <q-icon name="people" color="primary" />
            </q-item-section>
            <q-item-section>Social (Em breve)</q-item-section>
          </q-item>

          <q-separator class="q-my-md" />

          <q-item-label header class="text-grey-8 text-weight-bold">MEUS PETS</q-item-label>

          <template v-if="loading === 'get_pets'">
            <q-item v-for="i in 3" :key="i">
              <q-item-section avatar>
                <q-skeleton type="QAvatar" size="40px" />
              </q-item-section>
              <q-item-section>
                <q-skeleton type="text" width="70%" />
                <q-skeleton type="text" width="40%" class="q-mt-xs" />
              </q-item-section>
              <q-item-section side>
                <q-skeleton type="QBadge" size="xs" />
              </q-item-section>
            </q-item>
          </template>

          <template v-else>
            <q-slide-item
              v-for="pet in pets"
              :key="pet.id"
              @right="(evt) => confirmDelete(pet, evt)"
              right-color="red"
            >
              <template v-slot:right>
                <q-icon name="delete" class="text-white" />
              </template>

              <q-item
                clickable
                v-ripple
                :active="selectedPet && selectedPet.id === pet.id"
                active-class="bg-pink-1 text-primary border-left-4 border-primary"
                @click="selectPet(pet)"
              >
                <q-item-section avatar>
                  <q-avatar class="bg-grey-3">
                    <q-icon :name="pet.avatar" size="sm" color="primary" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ pet.name }}</q-item-label>
                  <q-item-label caption>{{ pet.breed }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div class="row items-center">
                    <q-icon
                      name="circle"
                      :color="pet.status === 'healthy' ? 'green' : 'orange'"
                      size="xs"
                    />
                    <q-btn
                      round
                      flat
                      dense
                      color="grey-7"
                      icon="edit"
                      size="sm"
                      class="q-ml-sm"
                      @click.stop="openAddPetDialog(pet)"
                    >
                      <q-tooltip>Editar pet</q-tooltip>
                    </q-btn>
                  </div>
                </q-item-section>
              </q-item>
            </q-slide-item>
          </template>

          <q-item clickable v-ripple @click="openAddPetDialog" class="q-mt-md">
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" icon="add" />
            </q-item-section>
            <q-item-section>Adicionar novo pet</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-drawer>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-dialog v-model="addPetDialogOpen" persistent>
      <q-card style="min-width: 400px" class="q-pa-none">
        <q-card-section class="bg-primary text-white q-py-md">
          <div class="text-h6">{{ newPet.id ? 'Editar pet' : 'Adicionar novo pet' }}</div>
          <q-btn icon="close" flat round dense v-close-popup class="absolute-right q-mr-sm" />
        </q-card-section>

        <q-card-section class="q-pa-md q-pt-lg">
          <q-form @submit="newPet.id ? updatePet(newPet.id) : savePet()">
            <div class="row justify-center q-mb-md">
              <q-avatar size="100px" class="bg-grey-3 shadow-3">
                <q-icon
                  :name="petAvatars[newPet.species] || petAvatars.default"
                  size="60px"
                  color="primary"
                />
              </q-avatar>
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="newPet.name"
                  label="Nome"
                  :rules="[(val) => !!val || 'Nome é obrigatório']"
                  filled
                  class="q-mb-sm"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="newPet.species"
                  :options="speciesOptions"
                  label="Espécie"
                  :rules="[(val) => !!val || 'Espécie é obrigatória']"
                  filled
                  @update:model-value="updateAvatar"
                  class="q-mb-sm"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="newPet.breed"
                  label="Raça"
                  :rules="[(val) => !!val || 'Raça é obrigatória']"
                  filled
                  class="q-mb-sm"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-input
                  v-model="newPet.birth_date"
                  label="Data de nascimento"
                  filled
                  type="date"
                  :rules="[(val) => !!val || 'Data de nascimento é obrigatória']"
                  class="q-mb-sm"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="newPet.sex"
                  :options="sexOptions"
                  label="Sexo"
                  :rules="[(val) => !!val || 'Sexo é obrigatório']"
                  filled
                  class="q-mb-sm"
                />
              </div>
              <div class="col-12 col-sm-6">
                <q-select
                  v-model="newPet.size"
                  :options="sizeOptions"
                  label="Porte"
                  :rules="[(val) => !!val || 'Porte é obrigatório']"
                  filled
                  class="q-mb-sm"
                />
              </div>
              <div class="col-12">
                <q-select
                  v-model="newPet.status"
                  :options="statusOptions"
                  label="Status de saúde"
                  filled
                  class="q-mb-sm"
                  emit-value
                  map-options
                  option-label="label"
                  option-value="value"
                  options-dense
                >
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-icon
                          :name="scope.opt.value === 'healthy' ? 'check_circle' : 'warning'"
                          :color="scope.opt.value === 'healthy' ? 'green' : 'orange'"
                          size="sm"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
            <div class="row justify-end q-mt-lg">
              <q-btn label="Cancelar" color="grey-7" v-close-popup flat class="q-mr-sm" />
              <q-btn
                :label="newPet.id ? 'Atualizar' : 'Salvar'"
                color="primary"
                type="submit"
                unelevated
                :loading="loading === 'save_pet'"
                :disable="loading === 'save_pet'"
              >
                <template v-slot:loading>
                  <q-spinner-dots color="white" />
                </template>
              </q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    
  </q-layout>
</template>
<script>
import { api } from 'boot/axios'
import { LocalStorage, Notify } from 'quasar'
import moment from 'moment'
import logoPetcare from 'src/assets/logo-petcare-horizontal.png'

export default {
  name: 'MainLayout',
  async mounted() {
    await this.getPets()
  },
  data() {
    return {
      logoPetcare,
      loading: null,
      addPetDialogOpen: false,
      leftDrawerOpen: false,
      selectedPet: null,
      pets: [],
      user: LocalStorage.getItem('@petcare-user'),
      newPet: {
        name: '',
        breed: '',
        species: '',
        birth_date: '',
        sex: '',
        size: '',
        avatar: '',
        status: 'healthy',
      },
      speciesOptions: ['Cachorro', 'Gato', 'Pássaro', 'Réptil', 'Outro'],
      sexOptions: ['Macho', 'Fêmea'],
      sizeOptions: ['Pequeno', 'Médio', 'Grande'],
      statusOptions: [
        { label: 'Saudável', value: 'healthy' },
        { label: 'Atenção', value: 'attention' },
      ],
      petAvatars: {
        Cachorro: 'fas fa-dog',
        Gato: 'fas fa-cat',
        Pássaro: 'fas fa-dove',
        Réptil: 'fas fa-dragon',
        default: 'fas fa-paw',
      },
    }
  },
  computed: {
    petInfoBarColor() {
      if (!this.selectedPet) return ''
      return this.selectedPet.status === 'healthy'
        ? 'bg-green-6'
        : this.selectedPet.status === 'attention'
          ? 'bg-amber-5'
          : ''
    },
    usernameFirstLetter() {
      return this.user?.name.charAt(0).toUpperCase()
    },
  },
  methods: {
    toggleLeftDrawer() {
      this.leftDrawerOpen = !this.leftDrawerOpen
    },
    selectPet(pet) {
      this.selectedPet = pet
    },
    logout() {
      LocalStorage.remove('@petcare-user')
      LocalStorage.remove('@petcare-token')
      this.$router.push({ path: '/' })
    },
    openAddPetDialog(pet) {
      if (pet) {
        this.newPet = { ...pet }
        this.newPet.birth_date = moment(pet.birth_date).format('YYYY-MM-DD')
      } else {
        this.newPet = {
          name: '',
          breed: '',
          species: '',
          birth_date: '',
          sex: '',
          size: '',
          avatar: '',
          status: 'healthy',
        }
      }

      this.addPetDialogOpen = true
    },
    calculateAge(birthDate) {
      if (!birthDate) return 0

      moment.locale('pt-br')

      return moment().diff(moment(birthDate), 'years')
    },
    updateAvatar() {
      this.newPet.avatar = this.petAvatars[this.newPet.species] || this.petAvatars.default
    },
    confirmDelete(pet, slideEvt) {
      this.$q
        .dialog({
          title: 'Confirmar exclusão',
          message: `Deseja realmente excluir o pet "${pet.name}"?`,
          persistent: true,
          color: 'negative',
          ok: {
            label: 'Excluir',
            color: 'negative',
            flat: false,
            unelevated: true,
          },
          cancel: {
            label: 'Cancelar',
            color: 'grey-7',
            flat: true,
          },
        })
        .onOk(() => {
          this.deletePet(pet.id)
        })
        .onDismiss(() => {
          if (slideEvt && slideEvt.reset) slideEvt.reset()
        })
    },
    async getPets() {
      this.loading = 'get_pets'
      try {
        const { data } = await api.get('/pets')
        this.pets = data.map((pet) => ({
          ...pet,
          age: this.calculateAge(pet.birth_date),
        }))
      } catch (err) {
        console.error(err)
      } finally {
        this.loading = null
      }
    },
    async savePet() {
      this.loading = 'save_pet'
      try {
        await api.post('/pets', {
          ...this.newPet,
          avatar: this.newPet.avatar || this.petAvatars.default,
        })
        this.addPetDialogOpen = false
        await this.getPets()
      } catch (err) {
        console.error(err)
        Notify.create({
          type: 'negative',
          message: 'Falha ao cadastrar o pets',
          position: 'top',
          actions: [{ icon: 'close', color: 'white' }],
        })
      } finally {
        this.loading = null
      }
    },
    async updatePet(id) {
      this.loading = 'save_pet'
      try {
        await api.put(`/pets/${id}`, {
          ...this.newPet,
          avatar: this.newPet.avatar || this.petAvatars.default,
        })
        this.addPetDialogOpen = false
        await this.getPets()
      } catch (err) {
        console.error(err)
        Notify.create({
          type: 'negative',
          message: 'Falha ao atualizar o pet',
          position: 'top',
          actions: [{ icon: 'close', color: 'white' }],
        })
      } finally {
        this.loading = null
      }
    },
    async deletePet(id) {
      this.loading = 'save_pet'
      try {
        await api.delete(`/pets/${id}`)
        this.addPetDialogOpen = false
        await this.getPets()
      } catch (err) {
        console.error(err)
        Notify.create({
          type: 'negative',
          message: 'Falha ao deletar o pet',
          position: 'top',
          actions: [{ icon: 'close', color: 'white' }],
        })
      } finally {
        this.loading = null
      }
    },
  },
}




</script>
<style lang="scss">
.pet-info-bar {
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
}

.pet-active {
  background: #e3f2fd;
  border-left: 3px solid $primary;
  color: $primary;
}

.q-item {
  transition: all 0.3s;

  &:hover {
    background: rgba(0, 0, 0, 0.03);
  }
}
</style>
