/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue, { CreateElement } from 'vue';
import { Worker } from '../reducer';
import { add } from '../async-action';
import { store$, errorAction, clearErrorAction } from '../store';

export const AddForm = Vue.extend({
  props: ['loading', 'workers'],
  render(createElement: CreateElement) {
    return createElement('div', [
      createElement('h4', 'Buat tugas baru'),
      createElement(
        'form',
        {
          domProps: { id: 'form', method: 'post' },
          on: {
            submit: this.submitForm,
          },
        },
        [
          createElement('br'),
          createElement('label', { domProps: { for: 'job' } }, 'Tugas:'),
          createElement('br'),
          createElement('textarea', {
            domProps: {
              value: this.job,
              name: 'job',
              id: 'job',
              cols: 30,
              rows: 3,
              placeholder: 'deskripsi pekerjaan',
            },
            props: {
              disabled: this.loading,
            },
            on: {
              input: (event: Event) => {
                this.job = (event.target as HTMLInputElement).value;
              },
            },
          }),
          createElement('br'),
          createElement('label', { domProps: { for: 'assignee' } }, 'Pekerja:'),
          createElement('br'),
          createElement(
            'select',
            {
              domProps: {
                name: 'assignee',
                id: 'assignee',
              },
              props: {
                disabled: this.loading,
              },
              on: {
                input: (event: Event) => {
                  const idx = (event.target as HTMLSelectElement).selectedIndex;
                  if (idx > -1) {
                    this.assigneeId = this.workers[idx]?.id;
                  }
                },
              },
            },
            this.workers?.map((worker: Worker) =>
              createElement('option', {
                domProps: { text: worker.name, value: worker.id },
              })
            ) ?? []
          ),
          createElement('br'),
          createElement(
            'label',
            { domProps: { for: 'attachment' } },
            'Lampiran:'
          ),
          createElement('br'),
          createElement('input', {
            domProps: {
              type: 'file',
              name: 'attachment',
              id: 'attachment',
            },
            props: {
              disabled: this.loading,
            },
            on: {
              input: (event: Event) => {
                const files = (event.target as HTMLInputElement).files;
                if (files?.length) {
                  this.attachment = files[0];
                }
              },
            },
          }),
          createElement('br'),
          createElement('button', { domProps: { type: 'submit' } }, 'kirim'),
        ]
      ),
    ]);
  },
  data() {
    return {
      job: '',
      assigneeId: 0,
      attachment: null,
    };
  },
  methods: {
    submitForm(event: Event) {
      event.preventDefault();
      store$.dispatch(clearErrorAction());
      if (!this.job || !this.assigneeId || !this.attachment) {
        store$.dispatch(errorAction('form isian tidak lengkap!'));
        return;
      }

      // add task
      store$.dispatch<any>(
        add({
          job: this.job,
          attachment: this.attachment,
          assignee_id: this.assigneeId,
        })
      );
      this.job = '';
      this.attachment = null;
      this.assignee_id = 0;
      (event.target as HTMLFormElement).reset();
    },
  },
});
