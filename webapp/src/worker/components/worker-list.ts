/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue, { CreateElement } from 'vue';
import { remove } from '../async-action';
import { store$ } from '../store';
import { Worker } from '../reducer';

export const WorkerList = Vue.extend({
  props: ['workers'],
  render(createElement: CreateElement) {
    return createElement('div', [
      createElement('h4', 'Daftar pekerja'),
      createElement('div', { domProps: { id: 'list' } }, [
        ...this.state?.workers.map((worker: Worker) =>
          createElement('div', [
            createElement('img', {
              domProps: {
                src: worker.photo,
                width: '30px',
                height: '30px',
              },
            }),
            createElement('span', worker.name),
            createElement(
              'btn',
              {
                on: {
                  click: this.removeWorker(worker.id),
                },
              },
              'hapus'
            ),
          ])
        ),
      ]),
    ]);
  },
  methods: {
    removeWorker(id: number): () => void {
      return () => {
        store$.dispatch<any>(remove(id));
      };
    },
  },
});
