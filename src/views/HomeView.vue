<script>
import FileManager from "@/components/FileManager.vue"
import ProfileList from "@/components/ProfileList.vue"
import NewProfile from "@/components/NewProfile.vue"
import AccountList from "@/components/AccountList.vue"
import {check_files, list_accounts} from "@/utils"
import { appStore } from "@/stores/counter"

export default {
  name: "HomeView",
  components: {
    'file-manager': FileManager,
    'accounts': AccountList,
    'profile-list': ProfileList,
    'new-profile': NewProfile
  },
  methods: {
    select_profile(data) {this.selected = data},
    async play_game() {
      let profile = localStorage.getItem('profile_id');
      let uuid = localStorage.getItem('select_account')
      let account = (await list_accounts()).find(account =>
        (account.uuid === uuid)
      )
      let data = {account: account, profile_id: profile}
      data = JSON.stringify(data)
      data = {method: 'POST', body: data, headers: {
        'Content-Type': 'application/json'
      }}
      let url = appStore().go('game', 'play/')
      this.pid = await (await fetch(url, data)).json()
      if (account.token) await check_files()
    },
    async check_accounts() {
      let accounts = (await list_accounts()).length
      let routes = '/login'
      if (accounts === 0) this.$router.push(routes)
    }
  },
  data() {return {selected: null, pid: null, text: 'Play Minecraft'}},
  mounted() {this.check_accounts()}
};
</script>

<template>
  <div class="bg-mc-globe">
    <div class="bg-blur min-vh-100 d-flex flex-wrap">
      <div class="me-auto mt-5 px-4">
        <div class="cursor-pointer mb-5 text-center" data-bs-toggle="modal" data-bs-target="#file-manager-modal">
          <img src="../assets/icons/x.svg" alt="" height="60">
          <p class="font-mc-five text-white">Mods</p>
        </div>

        <div class="cursor-pointer mt-5 text-center" data-bs-toggle="modal" data-bs-target="#profile-modal">
          <img src="../assets/icons/color-grass.svg" alt="" height="60">
          <p class="font-mc-five text-white">Versions</p>
        </div>
      </div>

      <div class="ms-auto mt-5 px-4">
        <div class="cursor-pointer mb-5 text-center">
          <img src="../assets/icons/color-paper.svg" alt="" height="60">
          <p class="font-mc-five text-white">News</p>
        </div>

        <div class="cursor-pointer mt-5 text-center" data-bs-toggle="modal" data-bs-target="#accounts-modal">
          <img src="../assets/icons/color-alex.svg" alt="" height="60">
          <p class="font-mc-five text-white">Accounts</p>
        </div>
      </div>

      <file-manager dirname="mods" id="file-manager-modal"></file-manager>
      <profile-list id="profile-modal"  @select_profile="select_profile"></profile-list>
      <new-profile :profile="selected" @del_profile="selected = null"></new-profile>
      <accounts id="accounts-modal"></accounts>
      <div class="mt-auto w-100 bg-mc-dark text-center">
        <button class="btn btn-success mc-btn px-5 h1 font-mc-ten"
                v-on:click="(pid === null)? play_game() : null"
                style="margin-top: -25px; --btn-border: 6px"
        >{{ (pid)? '. . . . .' : text }}</button>
      </div>
    </div>
  </div>
</template>

<style>
 .bg-blur {
   backdrop-filter: saturate(1) blur(.5em);
 }

 .bg-mc-dark {
   background-color: #171615
 }
</style>
