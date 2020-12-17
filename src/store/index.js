import Vue from 'vue';
import Vuex from 'vuex';
import user from './modules/user';
import common from './modules/common';
import tags from './modules/tags';
import logs from './modules/logs';
import models from './modules/models';
import getters from './getters';

Vue.use(Vuex);
const store = new Vuex.Store({
  modules: {
    user,
    common,
    logs,
    tags,
    models
  },
  getters
});

export default store;
