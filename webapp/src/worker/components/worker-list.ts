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
        ...(this.workers?.map((worker: Worker) =>
          createElement('div', { class: 'item' }, [
            createElement('img', {
              domProps: {
                src: worker.photo,
                width: 30,
                height: 30,
              },
            }),
            createElement('span', worker.name),
            createElement(
              'button',
              {
                on: {
                  click: this.removeWorker(worker.id),
                },
                class: 'remove',
              },
              'hapus'
            ),
          ])
        ) ?? []),
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
