import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
import user from './modules/user'

// default router permission control
import permission from './modules/permission'

// dynamic router permission control (Experimental)
// import permission from './modules/async-router'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    user,
    permission
  },
  state: {
    userInfo: {},
    editWeight: [],
    activeKey: '1'
  },
  mutations: {
    changeActiveKey(state, key) {
      console.log('KKKKK', key)

      state.activeKey = key
    }
  },
  actions: {
    changeActiveKey(ctx, key) {
      ctx.commit('changeActiveKey', key) //派发
    }
  },
  getters: {
    getActiveKey(state) {
      return state.activeKey
    }
  }
})
