<template>
  <div class="bg-mc-globe d-flex min-vh-100 align-items-center">
    <div class="row mx-0 w-100">
      <div class="col-8 col-lg-4 offset-2 offset-lg-4 bg-white py-2 ">
        <h1 class="text-center font-mc-ten">Log in</h1>
        <hr>
        <mc-alert btn-bg="danger" alert-bg="secondary">
          Do not share your account! Protect your privacy.
        </mc-alert>
        <label class="d-block mb-4">
          <small class="d-block text-muted">Username</small>
          <input type="text" class="form-control" v-model="form.username" :readonly="has_username">
        </label>
        <label class="d-block mb-4">
          <small class="d-block text-muted">Password</small>
          <input type="password" class="form-control" v-model="form.password" :readonly="is_offline">
        </label>
        <div class="d-flex mb-2">
          <div class="mc-switch d-inline-block ms-auto">
            <input id="mc-offline" type="checkbox" class="d-none" v-model="is_offline">
            <label for="mc-offline"><small>Offline mode</small></label>
          </div>
        </div>
        <p class="text-center mb-0">
          <button class="btn btn-success btn-lg w-75" v-on:click="log_in">Log in</button>
        </p>
      </div>
      <div class="col-8 col-lg-4 offset-2 offset-lg-4 bg-white py-2 mt-2">
        <small>Avoid logging in using a premium account.</small>
      </div>
    </div>

    <div id="hostname-modal" class="modal bg-blur" data-bs-backdrop="false">
      <button id="hostname-trigger" class="d-none"
              data-bs-target="#hostname-modal" data-bs-toggle="modal"
      ></button>
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header d-block">
            <h1 class="font-mc-ten text-center">Set the Host</h1>
          </div>
          <div class="modal-body">
            <label class="w-100 d-block">
              <small class="d-block">Server url</small>
              <input class="form-control" type="text" placeholder="https://..."
                     v-model="hostname">
            </label>
            <div class="alert alert-danger mt-3 font-mc-seven">
              Please specify the <u>hostname</u> where you will log in.
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-success" data-bs-dismiss="modal"
                    v-on:click="set_server" type="button">Set Host
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { appStore } from "@/stores/counter";
import PixelAlert from "@/components/PixelAlert.vue";

export default {
  name: "LoginView",
  data() {
    return {
      is_offline: false,
      form: {
        username: null,
        password: null
      },
      hostname: null
    }
  },
  computed: {
    has_username() {
      let params = window.location.search
      params = new URLSearchParams(params)
      return params.get('username')
    }
  },
  methods: {
    async save_player() {
      let url = appStore().go('account', 'login/')
      return (await fetch(url, {
        body: JSON.stringify(this.form),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })).json()
    },
    async log_in() {
      let form = this.form, status = true, data, error
      let title = 'An error occurred while sending the form.'
      form.type = (this.is_offline)? 'Offline' : 'Authenticated'
      if (!this.is_offline) {
        try {
          data = await fetch(this.hostname)
          let { uuid, type, token } = await data.json()
          form.token = token; form.uuid = uuid
          form.type = (type)? type : form.type
        }
        catch (err) { status = false; error = err }
      }
      if (!status) return appStore().notify(title, error)
      form.uuid = (await this.save_player())['uuid']
      appStore().accounts[form.uuid] = form
      this.$router.push('/')
    },
    async get_server() {
      let url = appStore().go('launcher', 'options/')
      let data = (await (await fetch(url)).json())['hostname']
      if (data) return this.hostname = data
      document.getElementById('hostname-trigger').click()
    },
    async set_server() {
      let url = appStore().go('launcher', 'options/')
      let data = JSON.stringify({hostname: this.hostname})
      await fetch(url, {method: 'post', body: data, headers: {
        'Content-Type': 'application/json'
      }})
    }
  },
  mounted() {
    this.form.username = this.has_username
    this.get_server()
  },
  components: {
    'mc-alert': PixelAlert
  }
};
</script>

<style scoped>
.bg-mc-globe {
  background-image: url("../assets/images/backgrounds/mc-globe.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
}

</style>