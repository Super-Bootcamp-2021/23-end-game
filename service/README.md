# Task Manager Service

web service untuk melayani manajemen pekerjaan

## Sebelum Memulai

untuk dapat menjalankan aplikasi ini, pastikan runtime dan aplikasi dibawah ini sudah terpasang di sistem anda

1. database [PostgreSQL](https://www.postgresql.org/download/) versi 13 keatas
1. database [redis](https://redis.io/download) versi 3 keatas
1. message bus [nats](https://nats.io/download/) versi 2
1. [minio server](https://min.io/download)
1. [nodejs](https://nodejs.org/en/download/) versi 14 keatas

## Mulai

pastikan semua database, nats dan minio sudah berjalan.

1. install `dependency` dari aplikasi ini

    ```bash
    npm install
    ```

1. build source codenya

    ```bash
    npm run svc:build
    ```

1. jalankan servernya, tambahkan argument `worker`, `task` atau `performance` untuk memilih server apa yang ingin dijalankan.

    ```bash
    # contoh untuk worker
    npm run svc:start -- worker
    ```

