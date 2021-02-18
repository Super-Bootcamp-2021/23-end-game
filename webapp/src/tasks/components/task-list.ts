/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue, { CreateElement } from 'vue';
import { cancel, done } from '../async-action';
import { store$ } from '../store';
import { Task } from '../reducer';

export const TaskList = Vue.extend({
  props: ['tasks'],
  render(createElement: CreateElement) {
    return createElement('div', [
      createElement('h4', 'Daftar tugas'),
      createElement('div', { domProps: { id: 'list' } }, [
        ...(this.tasks?.map((task: Task) =>
          createElement('div', [
            createElement(
              'a',
              { domProps: { href: task.attachment, target: '_blank' } },
              'lampiran'
            ),
            createElement('span', task.job),
            createElement('span', task.assignee),
            ...(task.done
              ? [createElement('span', 'sudah selesai')]
              : [
                  createElement(
                    'button',
                    { on: { click: this.cancelTask(task.id) } },
                    'batal'
                  ),
                  createElement(
                    'button',
                    { on: { click: this.finishTask(task.id) } },
                    'selesai'
                  ),
                ]),
          ])
        ) ?? []),
      ]),
    ]);
  },
  methods: {
    cancelTask(id: number): () => void {
      return () => {
        store$.dispatch<any>(cancel(id));
      };
    },
    finishTask(id: number): () => void {
      return () => {
        store$.dispatch<any>(done(id));
      };
    },
  },
});
