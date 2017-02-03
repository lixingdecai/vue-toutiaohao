import Vue from 'vue';
import Vuex from 'vuex';
import _ from '../util/tools';

Vue.use(Vuex);

const vuex = new Vuex.Store({
  state: {
    user: {
      isLogin: _.isLogin()
    },
    loading: false
  },
  getters: {
    getUserInfo: state => state.user || {},
    getLoading: state => state.loading
  },
  mutations: {
    setUserInfo: (state, user) => {
      state.user = Object.assign({}, state.user, user);
    },
    clearUserInfo: state => {
      state.user = {
        auth: '',
        nickName: '',
        avatar: '',
        sign: ''
      };
    },
    setValue: (state, obj) => {
      if (obj && obj.key) {
        state.user[obj.key] = obj.value;
      }
    },
    setLoading: (state, loading) => {
      state.loading = loading;
    }
  },
  actions: {
    setUserInfo: ({
      commit
    }, user) => new Promise(resolve => {
      commit('setUserInfo', user);
      resolve();
    }),
    clearUserInfo: ({
      commit
    }) => new Promise(resolve => {
      commit('clearUserInfo');
      resolve();
    })
  }
});

export default vuex;
