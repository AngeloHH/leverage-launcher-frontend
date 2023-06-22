<template>
  <mc-modal :title="dirname + ' list'">
    <div class="modal-body">
      <table class="table table-bordered mc-table w-100">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">File Name</th>
            <th scope="col">File Hash</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(file, index) in file_list" :key="index">
            <td>{{ index }}</td>
            <td>{{ file.filename }}</td>
            <td>{{ file.filehash }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      <button type="button" class="btn btn-success" v-on:click="get_files()">Reload</button>
    </div>
  </mc-modal>
</template>

<script>
import PixelModal from "@/components/PixelModal.vue"
import { appStore } from "@/stores/counter"
export default {
  name: "FileManager",
  props: ['dirname'],
  data() {
    return {
      file_list: []
    }
  },
  methods: {
    async get_files() {
      let arg = new URLSearchParams()
      arg.append('dirname', this.$props.dirname)
      let url = appStore().go('game', 'files/')
      url = url + '?'
      let res = await fetch(url + arg.toString())
      this.file_list = await res.json()
    }
  },
  components: {
    'mc-modal': PixelModal
  },
  mounted() {
    this.get_files()
  }
};
</script>

<style scoped>
.mc-table {
  --bs-table-bg: transparent !important;
  --bs-table-border-color: black !important;
}
.mc-table td {
  max-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

}
</style>