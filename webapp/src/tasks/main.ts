/* eslint-disable @typescript-eslint/no-explicit-any */
import './main.css';
import { getList, getWorkersList } from './async-action';
import { store$ } from './store';
import Vue, { CreateElement } from 'vue';
import { AddForm } from './components/add-form';
import { TaskList } from './components/task-list';

new Vue({
  el: '#app',
  components: {
    'add-form': AddForm,
    'task-list': TaskList,
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
      createElement('add-form', {
        props: { loading: this.state?.loading, workers: this.state?.workers },
      }),
      createElement('hr'),
      createElement('task-list', {
        props: { tasks: this.state?.tasks },
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
    store$.dispatch<any>(getWorkersList);
  },
});
