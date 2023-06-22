<template>
  <mc-modal title="Account List">
    <div class="modal-body" style="min-height: 180px">
      <div class="list-group">
        <div class="list-group-item d-flex align-items-center"
             :class="{'active': selected(account.uuid)}"
             v-for="account in accounts" :key="account.uuid">
          <div class="mc-face-viewer-5x" :style="'background-image: url(' + account.skin + ')'"></div>
          <div class="ms-2 barrier position-relative">
            <b class="d-block">{{ account.name }}</b>
            <small class="d-block text-muted">{{ account.type }}</small>
          </div>
          <div class="ms-auto">
            <div class="dropdown d-inline-block ms-1 no-arrow">
              <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <img src="../assets/icons/color-more.svg" alt="edit" height="19">
              </button>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li v-on:click="toggle_account(account)">
                  <span class="dropdown-item cursor-pointer">Select Account</span>
                </li>
                <li>
                  <router-link :to="'/login?username=' + account.name"
                               class="dropdown-item cursor-pointer">Log in
                  </router-link>
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
              v-on:click="list_accounts().then(a => accounts = a)"
      >Reload</button>
      <router-link to="/login" class="btn btn-success">Log in</router-link>
    </div>
  </mc-modal>
</template>

<script>
import PixelModal from "@/components/PixelModal.vue"
import { list_accounts } from "@/utils"

export default {
  name: "AccountList",
  components: {
    'mc-modal': PixelModal
  },
  data() {
    return {accounts: []}
  },
  methods: {
    list_accounts, toggle_account(account) {
      let selected = localStorage.getItem('select_account')
      let value = (selected === account.uuid)? null : account.uuid
      return localStorage.setItem('select_account', value)
    },
    selected(uuid) {
      return localStorage.getItem('select_account') === uuid
    }
  },
  mounted() {
    this.list_accounts().then(accounts => this.accounts = accounts)
  }
};
</script>

<style>
.barrier::after {
  position: absolute;
  width: 100%;
  height: 100%;
  content: "";
  top: 0;
  left: 0;
  cursor: pointer;
}
</style>