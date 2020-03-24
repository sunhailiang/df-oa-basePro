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
    activeKey: '1',
    toduUser: {},
    into: 0,
    todoCount: false
  },
  mutations: {
    changeActiveKey(state, key) {
      state.activeKey = key
    },
    setIntoStatus(state, key) {
      state.into = key
    },
    settoduUser(state, user) {
      Object.assign(state.toduUser, user)
    },
    resetTodoCount(state, count) {
      state.todoCount = count
    }
  },
  actions: {
    changeActiveKey(ctx, key) {
      ctx.commit('changeActiveKey', key) //派发
    }
  },
  getters: {
    resetTodoCount(state) {
      return state.todoCount
    },
    getActiveKey(state) {
      return state.activeKey
    },
    setIntoStatus(state) {
      return state.into
    },
    settoduUser(state) {
      return state.toduUser
    }
  }
})
