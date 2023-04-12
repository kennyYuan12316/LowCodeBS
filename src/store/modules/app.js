import hsz from '@/utils/hsz'
import { getLanguage } from '@/lang/index'

const state = {
  sidebar: {
    opened: hsz.storageGet('sidebarStatus') ? !!+hsz.storageGet('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  language: getLanguage(),
  size: hsz.storageGet('size') || 'medium'
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      hsz.storageSet({ sidebarStatus: 1 })
    } else {
      hsz.storageSet({ sidebarStatus: 0 })
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    hsz.storageSet({ sidebarStatus: 0 })
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  SET_LANGUAGE: (state, language) => {
    state.language = language
    hsz.storageSet({ language })
  },
  SET_SIZE: (state, size) => {
    state.size = size
    hsz.storageSet({ size })
  }
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  setLanguage({ commit }, language) {
    commit('SET_LANGUAGE', language)
  },
  setSize({ commit }, size) {
    commit('SET_SIZE', size)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}