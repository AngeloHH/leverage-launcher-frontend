<template>
  <mc-modal id="new-profile" :title="get_title">
    <div class="modal-body">
      <label class="d-block w-100 mb-3">
        <small class="d-block">Profile Name</small>
        <input type="text" class="form-control" v-model="form.name" :readonly="profile">
      </label>
      <label class="d-block w-100 mb-3">
        <small class="d-block">Java Arguments</small>
        <input type="text" class="form-control" v-model="form.args">
      </label>
      <label class="d-block w-100 mb-3">
        <small class="d-block">Select version</small>
        <select class="form-control" v-model="form.version">
          <option v-for="version in versions" :key="version.id"
                  :value="version.id">{{ version.id }} ({{ version.type }})
          </option>
        </select>
      </label>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal"
              v-on:click="reset_data()">Close</button>
      <button type="button" class="btn btn-success" data-bs-dismiss="modal"
              v-on:click="add_profile()">Save</button>
    </div>
  </mc-modal>
</template>

<script>
import PixelModal from "@/components/PixelModal.vue";
import { appStore } from "@/stores/counter";

export default {
  name: "NewProfile",
  props: ['profile'],
  components: {
    'mc-modal': PixelModal
  },
  data() {
    let args = '-Xmx4G -Xms2G'
    return {
      form: {
        name: null,
        version: null,
        args: args,
        java_dir: null
      },
      versions: [],
      java_args: args
    }
  },
  methods: {
    async get_versions() {
      let url = appStore().go('versions')
      url = url + '/?offline=true'
      let data = await (await fetch(url)).json()
      this.versions = data['versions']
    },
    reset_data() {
      Object.keys(this.form).forEach(key => {
        this.form[key] = null
      }); this.form.args = this.java_args
      this.$emit('del_profile', undefined)
    },
    async add_profile() {
      let url = appStore().go('launcher', 'profiles/')
      // eslint-disable-next-line no-unused-vars
      let data = await (await fetch(url, {
        method: 'POST', body: JSON.stringify(this.form),
        headers: {'Content-Type': 'application/json'}
      })).json()
      this.reset_data()
    }
  },
  computed: {
    get_title() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.form = (!this.profile)? this.form : this.profile
      return (this.form.name)? this.form.name : 'New Profile'
    }
  },
  mounted() {this.get_versions()}
};
</script>

<style scoped>
#new-profile .form-control {
  background-color: rgba(0,0,0,.01);
}
</style>