<template>
  <mc-modal title="Version list">
    <div class="modal-body" style="min-height: 180px">
      <div class="list-group">
        <div class="list-group-item d-flex align-items-center" :key="profile.id" :class="{'active': selected(profile.id)}"
             :title="'last usage ' + new Date(profile.lastUsed).toString()" v-for="profile in profiles">
          <p class="mb-0">
            <b class="d-block">{{ (profile.name !== "")? profile.name : profile.lastVersionId }}</b>
            <small class="d-block">{{ profile.lastVersionId }}</small>
          </p>
          <div class="ms-auto">
            <button class="btn btn-success">Play</button>
            <div class="dropdown d-inline-block ms-1 no-arrow">
              <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <img src="../assets/icons/color-more.svg" alt="edit" height="19">
              </button>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li v-on:click="toggle_profile(profile.id)">
                  <span class="dropdown-item cursor-pointer">Select Profile</span>
                </li>
                <li v-on:click="select_profile(profile.id)"
                    data-bs-toggle="modal" data-bs-target="#new-profile">
                  <span class="dropdown-item cursor-pointer">Edit</span>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li v-on:click="del_profile(profile.id)">
                  <span class="dropdown-item cursor-pointer">Delete Profile</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      <button type="button" class="btn btn-success"
              v-on:click="get_profiles().then(data => this.profiles = data)"
      >Reload Profile List</button>
      <button type="button" class="btn btn-success"
              data-bs-toggle="modal" data-bs-target="#new-profile">New Profile</button>
    </div>
  </mc-modal>
</template>

<script>
import PixelModal from "@/components/PixelModal.vue";
import { get_profile, get_profiles } from "@/utils";
import { appStore } from "@/stores/counter";

export default {
  name: "ProfileList",
  data() {
    return {
      profiles: []
    }
  },
  components: {
    'mc-modal': PixelModal
  },
  methods: {
    async select_profile(profile_id) {
      let profile = await this.get_profile(profile_id)
      this.$emit('select_profile', profile)
    },
    get_profiles, get_profile,
    async del_profile(profile_id) {
      let url = appStore().go('launcher', 'profiles')
      url = url + `/?id=${profile_id}`
      await (await fetch(url, {method: 'DELETE'})).json()
      let profile = this.profiles.find(profile =>
        (profile.id === profile_id))
      profile_id = this.profiles.indexOf(profile)
      this.profiles.splice(profile_id, 1)
    },
    toggle_profile(profile_id) {
      let selected = localStorage.getItem('profile_id')
      let value = (selected === profile_id)? null : profile_id
      localStorage.setItem('profile_id', value)
    },
    selected(id) {
      return localStorage.getItem('profile_id') === id
    }
  },
  mounted() {get_profiles().then(data => this.profiles = data)}
};
</script>

<style scoped>

</style>