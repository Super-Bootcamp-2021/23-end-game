/* eslint-disable @typescript-eslint/no-explicit-any */
import Vue, { CreateElement } from 'vue';
import { register } from '../async-action';
import { store$, errorAction, clearErrorAction } from '../store';

export const RegistrationForm = Vue.extend({
  props: ['loading'],
  render(createElement: CreateElement) {
    return createElement('div', [
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
            props: {
              disabled: this.loading,
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
            props: {
              disabled: this.loading,
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
            props: {
              disabled: this.loading,
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
            props: {
              disabled: this.loading,
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
            props: {
              disabled: this.loading,
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
    ]);
  },
  data: {
    name: '',
    age: '0',
    photo: null,
    bio: '',
    address: '',
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
  },
});
