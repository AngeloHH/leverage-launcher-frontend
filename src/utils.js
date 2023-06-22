import { appStore } from "@/stores/counter";

async function get_profiles() {
  let url = appStore().go('launcher', 'profiles/')
  let response = await fetch(url)
  let data = (await response.json())['profiles']
  return Object.keys(data).map(key => {
    data[key]['id'] = key; return data[key]
  })
}

async function get_profile(profile_id) {
  let profiles = await get_profiles()
  let profile = profiles.find(obj => (obj.id === profile_id))
  return {
    args: profile.javaArgs, java_dir: profile.javaDir,
    name: profile.name, version: profile.lastVersionId
  }
}

async function get_skin(uuid) {
  let url = appStore().go('account', 'skin', uuid)
  let data = await (await fetch(url)).json()
  if (!data.default) return data[0]['skin']['url']
  return `/default-${data.default}.png`
}

async function list_accounts() {
  let url = appStore().go('account/')
  let data = await (await fetch(url)).json()
  let accounts = []
  for (let x in data) {
    let account = appStore().accounts[data[x].uuid]
    if (account) data[x].type = account['type']
    if (!data[x]['type']) data[x]['type'] = 'Offline'
    accounts.push(data[x])
    accounts[x]['skin'] = await get_skin(data[x].uuid)
  }
  return accounts
}

export { get_profiles, get_profile, get_skin, list_accounts }