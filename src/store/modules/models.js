import { setStore, getStore } from '@/util/store';

const models = {
  state: {
    models: getStore({ name: 'models' }) || {}
  },
  mutations: {
    SET_MODEL(state, model) {
      state.models[model.id] = model;
      setStore({
        name: 'models',
        content: state.models
      });
    }
  }
};

export default models;
