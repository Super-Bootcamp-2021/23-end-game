# Task Manager Webapp

Aplikasi web sederhana untuk manajemen pekerjaan

## Sebelum memulai

pastikan runtime [nodejs](https://nodejs.org/en/download/) versi 14 ketas sudah terinstall

## Mulai

pastikan semua layanan webservice dari task manager sudah berjalan

1. install `dependency` dari aplikasi ini

   ```bash
   npm install
   ```

1. build aplikasinya

```bash
npm run web:build
```

1. aplikasi yang sudah dibuild akan tersedia di direktori `/webapp/www`. Kamu dapat menggunakan static server apapun untuk menjalankan aplikasi webnya

```bash
# contoh menggunakan live-server
live-server --port=80 ./webapp/www
```
