import variables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'
import hsz from '@/utils/hsz'

const {
  showSettings,
  tagsView,
  tagsIcon,
  showLanguage,
  showSearch,
  useCache,
  fixedHeader,
  sidebarLogo,
  themeClass,
  slideClass,
  layoutType,
  sysConfig
} = defaultSettings

const state = {
  theme: variables.theme,
  loginNeedCode: hsz.storageGet('loginNeedCode') === null ? false : hsz.storageGet('loginNeedCode'),
  showSettings: showSettings,
  tagsView: hsz.storageGet('tagsView') === null ? tagsView : hsz.storageGet('tagsView'),
  tagsIcon: hsz.storageGet('tagsIcon') === null ? tagsIcon : hsz.storageGet('tagsIcon'),
  showLanguage: hsz.storageGet('showLanguage') === null ? showLanguage : hsz.storageGet('showLanguage'),
  showSearch: hsz.storageGet('showSearch') === null ? showSearch : hsz.storageGet('showSearch'),
  useCache: hsz.storageGet('useCache') === null ? useCache : hsz.storageGet('useCache'),
  fixedHeader: hsz.storageGet('fixedHeader') === null ? fixedHeader : hsz.storageGet('fixedHeader'),
  sidebarLogo: hsz.storageGet('sidebarLogo') === null ? sidebarLogo : hsz.storageGet('sidebarLogo'),
  themeClass: hsz.storageGet('themeClass') === null ? themeClass : hsz.storageGet('themeClass'),
  slideClass: hsz.storageGet('slideClass') === null ? slideClass : hsz.storageGet('slideClass'),
  layoutType: hsz.storageGet('layoutType') === null ? layoutType : hsz.storageGet('layoutType'),
  sysConfig: hsz.storageGet('sysConfig') === null ? sysConfig : hsz.storageGet('sysConfig')
}

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    if (state.hasOwnProperty(key)) {
      state[key] = value
      hsz.storageSet({
        [key]: value
      })
    }
  }
}

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}