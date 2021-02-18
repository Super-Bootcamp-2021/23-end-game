/* eslint-disable @typescript-eslint/no-explicit-any */
import './main.css';
import { summary } from './async-action';
import { store$ } from './store';
import Vue, { CreateElement } from 'vue';

new Vue({
  el: '#app',
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
          style: { display: this.state?.loading ? 'none' : null },
        },
        'memuat...'
      ),
      createElement(
        'button',
        { domProps: { id: 'refresh' }, on: { click: this.refresh } },
        'refresh'
      ),
      createElement('ul', [
        createElement('li', [
          'jumlah pekerja:',
          createElement(
            'span',
            { domProps: { id: 'workers' } },
            this.state?.summary?.total_worker?.toString()
          ),
        ]),
        createElement('li', [
          'jumlah tugas:',
          createElement(
            'span',
            { domProps: { id: 'tasks' } },
            this.state?.summary?.total_task?.toString()
          ),
        ]),
        createElement('li', [
          'yang selesai:',
          createElement(
            'span',
            { domProps: { id: 'task-done' } },
            this.state?.summary?.task_done?.toString()
          ),
        ]),
        createElement('li', [
          'yang dibatalkan:',
          createElement(
            'span',
            { domProps: { id: 'task-canceled' } },
            this.state?.summary?.task_cancelled?.toString()
          ),
        ]),
      ]),
    ]);
  },
  data: {
    state: null,
  },
  methods: {
    refresh() {
      store$.dispatch<any>(summary);
    },
  },
  mounted() {
    this.state = store$.getState();
    store$.subscribe(() => {
      this.state = store$.getState();
    });
    store$.dispatch<any>(summary);
  },
});
