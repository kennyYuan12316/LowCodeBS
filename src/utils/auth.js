import hsz from '@/utils/hsz'

export function getToken() {
  return hsz.storageGet('token')
}

export function setToken(token) {
  return hsz.storageSet({ token })
}

export function removeToken() {
  return hsz.storageRemove('token')
}

export function getLock() {
  return hsz.storageGet('lock')
}

export function setLock(lock) {
  return hsz.storageSet({ lock })
}
export function removeLock() {
  return hsz.storageRemove('lock')
}