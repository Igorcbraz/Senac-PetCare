<template>
  <div
    class="column items-center justify-center bg-cream relative-position overflow-hidden"
    style="height: 100vh; width: 100vw"
  >
    <q-card
      class="q-pa-lg shadow-10"
      style="width: 520px; max-width: 90vw; border-radius: 24px; z-index: 1"
      bordered
    >
      <q-card-section class="text-center q-pb-none">
        <q-img
          src="src/assets/logo-petcare-text.png"
          class="pet-avatar"
          style="width: 200px; height: 200px"
          contain
        />
        <div class="text-subtitle1 text-grey-7">Cuide do seu melhor amigo</div>
      </q-card-section>
      <q-card-section class="q-pa-md">
        <q-form @submit.prevent="login" class="q-gutter-y-lg">
          <q-input
            v-model="email"
            label="Email"
            type="email"
            filled
            required
            :disable="loading"
            :rules="[(val) => !!val || 'Digite seu email']"
          >
            <template v-slot:prepend>
              <q-icon name="o_email" color="grey-6" />
            </template>
          </q-input>
          <q-input
            v-model="password"
            label="Senha"
            :type="isPwd ? 'password' : 'text'"
            filled
            required
            :disable="loading"
            :rules="[(val) => !!val || 'Digite sua senha']"
            :error="!!password && password.length < 6"
            :error-message="password.length < 6 ? 'A senha deve ter pelo menos 6 caracteres' : ''"
          >
            <template v-slot:prepend>
              <q-icon name="o_lock" color="grey-6" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'o_visibility_off' : 'o_visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <div class="q-mt-lg">
            <q-btn
              type="submit"
              label="Entrar"
              color="primary"
              class="full-width login-button"
              rounded
              unelevated
              :loading="loading"
              size="lg"
              :disable="!canSubmit || loading"
            >
              <template v-slot:loading>
                <q-spinner-dots color="white" />
              </template>
            </q-btn>
          </div>
          <div class="row items-center justify-center text-center q-mt-md">
            <p class="col-auto text-grey-7 q-mb-none">Não tem uma conta?</p>
            <q-btn
              label="Cadastre-se"
              color="secondary"
              class="col-auto"
              rounded
              flat
              :disable="loading"
              @click="goToSignup"
            />
          </div>
        </q-form>
      </q-card-section>
      <q-card-section class="text-center text-grey-7 text-caption q-pa-none q-mt-sm">
        <div class="row justify-center items-center q-mt-md">© 2025 PetCare</div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
import { api } from 'boot/axios'
import { LocalStorage, Notify } from 'quasar'

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      isPwd: true,
      loading: false,
    }
  },
  computed: {
    canSubmit() {
      return this.email.length > 0 && this.password.length > 0
    },
  },
  methods: {
    async login() {
      this.loading = true
      try {
        const response = await api.post('/users/login', {
          email: this.email,
          password: this.password,
        })
        console.log(response.data)
        const token = response.data.token
        LocalStorage.set('token', token)

        Notify.create({
          type: 'positive',
          message: 'Login realizado com sucesso!',
          position: 'top',
          timeout: 2000,
        })

        this.$router.push('/home')
      } catch (err) {
        Notify.create({
          type: 'negative',
          message: err.response?.data?.message || 'Falha no login',
          position: 'top',
          actions: [{ icon: 'close', color: 'white' }],
        })
      } finally {
        this.loading = false
      }
    },
    goToSignup() {
      this.$router.push('/register')
    },
  },
}
</script>

<style scoped>
.pet-title {
  letter-spacing: 1px;
}

.login-button {
  height: 56px;
  font-size: 18px;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

.login-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 7px 15px rgba(0, 0, 0, 0.1);
}
</style>
