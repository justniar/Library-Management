# Library Management

## Pendahuluan
Proyek ini merupakan aplikasi manajemen perpustakaan yang dikembangkan menggunakan Next.js untuk frontend dan Golang (Gin) untuk backend. [Postman Documentation](https://documenter.getpostman.com/view/33048335/2sAYkGLzhP)

## Instalasi dan Menjalankan Proyek

### 1. Fork dan Clone Repository
```sh
git clone https://github.com/justniar/Library-Management.git
cd Library-Management
```

### 2. Buat Database
Buat database di PostgreSQL sesuai dengan konfigurasi yang digunakan dalam proyek.

### 3. Jalankan Script SQL
Import atau jalankan skrip SQL yang disediakan untuk menyiapkan tabel dan data awal.

### 4. Jalankan Backend (Golang)
```sh
cd backend
go run main.go
```

### 5. Jalankan Frontend (Next.js)
```sh
cd frontend
npm install
npm run dev
```

Aplikasi frontend akan berjalan di `http://localhost:3000` dan backend di `http://localhost:8080` (sesuai dengan konfigurasi default).

## Demo
Demo dapat dilihat di:
<!-- [Tautan Demo](#)  -->

---
**Catatan:** Pastikan Anda memiliki `Go`, `Node.js`, dan `npm` yang sudah terinstal di sistem Anda sebelum menjalankan proyek ini.
