import DualTreeview from './components/DualTreeview.vue';
import './styles/index.scss';

const plugin = {
  install,
  DualTreeview
};

(function (plugin) {
  if (typeof window !== 'undefined' && window.Vue) {
    Vue.use(plugin);
  }
})(plugin);

export function install(Vue, options) {
  Vue.component(DualTreeview.name, DualTreeview);
}

export default plugin;
