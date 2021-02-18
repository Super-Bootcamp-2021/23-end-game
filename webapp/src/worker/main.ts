/* eslint-disable @typescript-eslint/no-explicit-any */
import './main.css';
import { getList } from './async-action';
import { store$ } from './store';
import Vue, { CreateElement } from 'vue';
import { RegistrationForm } from './components/registration-form';
import { WorkerList } from './components/worker-list';

new Vue({
  el: '#app',
  components: {
    'registration-form': RegistrationForm,
    'worker-list': WorkerList,
  },
  render(createElement: CreateElement) {
    return createElement('div', [
      createElement(
        'p',
        { domProps: { id: 'error-text' }, class: 'error' },
        this.state?.error
      ),
      createElement(
        'p',
        {
          domProps: { id: 'loading-text' },
          class: 'primary',
          style: { display: this.state?.loading ? null : 'none' },
        },
        'memuat...'
      ),
      createElement('registration-form', {
        props: { loading: this.state?.loading },
      }),
      createElement('hr'),
      createElement('worker-list', {
        props: { workers: this.state?.workers },
      }),
    ]);
  },
  data: {
    state: null,
  },
  mounted() {
    this.state = store$.getState();
    store$.subscribe(() => {
      this.state = store$.getState();
    });
    store$.dispatch<any>(getList);
  },
});
