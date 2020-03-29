import DualTreeview from './components/DualTreeview.vue';
import Typeahead from './components/Typeahead.vue';
import './styles/index.scss';

const plugin = {
  install,
  DualTreeview,
  Typeahead
};

(function (plugin) {
  if (typeof window !== 'undefined' && window.Vue) {
    Vue.use(plugin);
  }
})(plugin);

export function install(Vue, options) {
  Vue.component(DualTreeview.name, DualTreeview);
  Vue.component(Typeahead.name, Typeahead);
}

export default plugin;
