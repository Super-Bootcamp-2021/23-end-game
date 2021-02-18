/* eslint-disable @typescript-eslint/no-explicit-any */
import './main.css';
import { register, getList, remove } from './async-action';
import { store$, errorAction, clearErrorAction } from './store';
import Vue, { CreateElement } from 'vue';
import { Worker } from './reducer';

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
      createElement('h4', 'Daftarkan pekerja baru'),
      createElement(
        'form',
        {
          domProps: { id: 'form', method: 'post' },
          on: {
            submit: this.submitForm,
          },
        },
        [
          createElement('label', { domProps: { for: 'name' } }, 'Nama:'),
          createElement('br'),
          createElement('input', {
            domProps: {
              value: this.name,
              type: 'text',
              name: 'name',
              id: 'name',
              placeholder: 'misal budiman',
            },
            on: {
              input: (event: Event) => {
                this.name = (event.target as HTMLInputElement).value;
              },
            },
          }),
          createElement('br'),
          createElement('label', { domProps: { for: 'age' } }, 'Umur:'),
          createElement('br'),
          createElement('input', {
            domProps: {
              value: this.age,
              type: 'number',
              name: 'age',
              id: 'age',
              placeholder: 'misal 23',
            },
            on: {
              input: (event: Event) => {
                this.name = (event.target as HTMLInputElement).value;
              },
            },
          }),
          createElement('br'),
          createElement('label', { domProps: { for: 'photo' } }, 'Foto:'),
          createElement('br'),
          createElement('input', {
            domProps: {
              type: 'file',
              name: 'photo',
              id: 'photo',
            },
            on: {
              input: (event: Event) => {
                const files = (event.target as HTMLInputElement).files;
                if (files?.length) {
                  this.photo = files[0];
                }
              },
            },
          }),
          createElement('br'),
          createElement(
            'label',
            { domProps: { for: 'bio' } },
            'Biodata singkat:'
          ),
          createElement('br'),
          createElement('textarea', {
            domProps: {
              value: this.bio,
              name: 'bio',
              id: 'bio',
              cols: 30,
              rows: 3,
              placeholder: 'biodata singkat pekerja',
            },
            on: {
              input: (event: Event) => {
                this.bio = (event.target as HTMLInputElement).value;
              },
            },
          }),
          createElement('br'),
          createElement('label', { domProps: { for: 'address' } }, 'Alamat:'),
          createElement('br'),
          createElement('textarea', {
            domProps: {
              value: this.bio,
              name: 'address',
              id: 'address',
              cols: 30,
              rows: 3,
              placeholder: 'alamat pekerja',
            },
            on: {
              input: (event: Event) => {
                this.address = (event.target as HTMLInputElement).value;
              },
            },
          }),
          createElement('br'),
          createElement('button', { domProps: { type: 'submit' } }, 'kirim'),
        ]
      ),
      createElement('hr'),
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
  data: {
    name: '',
    state: null,
  },
  methods: {
    submitForm(event: Event) {
      event.preventDefault();
      store$.dispatch(clearErrorAction());
      if (
        !this.name ||
        !this.age ||
        !this.photo ||
        !this.bio ||
        !this.address
      ) {
        store$.dispatch(errorAction('form isian tidak lengkap!'));
        return;
      }

      // register user
      store$.dispatch<any>(
        register({
          name: this.name,
          photo: this.photo,
          age: this.age,
          bio: this.bio,
          address: this.address,
        })
      );
      (event.target as HTMLFormElement).reset();
    },
    removeWorker(id: number): () => void {
      return () => {
        store$.dispatch<any>(remove(id));
      };
    },
  },
  mounted() {
    this.state = store$.getState();
    store$.subscribe(() => {
      this.state = store$.getState();
    });
    store$.dispatch<any>(getList);
  },
});
