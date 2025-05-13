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
        <q-img :src="logoPetcare" class="pet-avatar" style="width: 200px; height: 200px" contain />
        <div class="text-subtitle1 text-grey-7">Crie sua conta e cuide do seu melhor amigo</div>
      </q-card-section>
      <q-card-section class="q-pa-md">
        <q-form @submit.prevent="register" class="q-gutter-y-lg">
          <q-input
            v-model="name"
            label="Nome"
            filled
            :disable="loading"
            hide-bottom-space
            :rules="[(val) => !!val || 'Digite seu nome']"
            :error="!!name && name.length < 3"
            :error-message="name.length < 3 ? 'O nome deve ter pelo menos 3 caracteres' : ''"
          >
            <template v-slot:prepend>
              <q-icon name="person" color="grey-6" />
            </template>
          </q-input>
          <q-input
            v-model="email"
            label="Email"
            type="email"
            filled
            :disable="loading"
            hide-bottom-space
            :rules="[(val) => !!val || 'Digite seu email']"
            :error="!!email && !email.includes('@')"
            :error-message="!email.includes('@') ? 'Email inválido' : ''"
          >
            <template v-slot:prepend>
              <q-icon name="o_email" color="grey-6" />
            </template>
          </q-input>
          <div class="row q-col-gutter-md">
            <q-input
              v-model="password"
              class="col"
              label="Senha"
              :type="isPwd ? 'password' : 'text'"
              filled
              required
              :disable="loading"
              hide-bottom-space
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
            <q-input
              v-model="confirmPassword"
              class="col"
              label="Confirmar senha"
              :type="isPwd ? 'password' : 'text'"
              filled
              required
              :disable="loading"
              hide-bottom-space
              :rules="[
                (val) => !!val || 'Confirme sua senha',
                (val) => val === password || 'As senhas não coincidem',
              ]"
              :error="!!confirmPassword && confirmPassword !== password"
              :error-message="confirmPassword !== password ? 'As senhas não coincidem' : ''"
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
          </div>
          <div class="q-mt-lg">
            <q-btn
              type="submit"
              label="Cadastrar"
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
            <p class="col-auto text-grey-7 q-mb-none">Já tem uma conta?</p>
            <q-btn
              label="Entrar"
              color="secondary"
              class="col-auto"
              rounded
              flat
              :disable="loading"
              @click="goToLogin"
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
import { Notify } from 'quasar'
import logoPetcare from 'src/assets/logo-petcare-text.png'

export default {
  name: 'RegisterPage',
  data() {
    return {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      isPwd: true,
      loading: false,
      logoPetcare,
    }
  },
  computed: {
    canSubmit() {
      return (
        this.name.length >= 3 &&
        this.email.length > 0 &&
        this.email.includes('@') &&
        this.password.length >= 6 &&
        this.confirmPassword.length >= 6 &&
        this.password === this.confirmPassword
      )
    },
  },
  methods: {
    async register() {
      if (this.password !== this.confirmPassword) {
        Notify.create({
          type: 'negative',
          message: 'As senhas não coincidem',
          position: 'top',
        })
        return
      }
      this.loading = true
      try {
        await api.post('/users', {
          name: this.name,
          email: this.email,
          password: this.password,
        })
        Notify.create({
          type: 'positive',
          message: 'Cadastro realizado com sucesso!',
          position: 'top',
          timeout: 2000,
        })
        this.$router.push('/')
      } catch (err) {
        Notify.create({
          type: 'negative',
          message: err.response?.data?.message || 'Falha no cadastro',
          position: 'top',
          actions: [{ icon: 'close', color: 'white' }],
        })
      } finally {
        this.loading = false
      }
    },
    goToLogin() {
      this.$router.push('/')
    },
  },
}
</script>
