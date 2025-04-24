# Waste Food Classification Project

Proyek ini bertujuan untuk mengklasifikasikan gambar sampah makanan menjadi kategori organik atau daur ulang menggunakan model machine learning yang dijalankan di server Node.js.

## Deskripsi

Aplikasi web sederhana yang memungkinkan pengguna mengunggah gambar sampah makanan. Server akan memproses gambar tersebut menggunakan model TensorFlow.js dan mengembalikan hasil klasifikasi (Organik atau Recycle).

## Instalasi

1.  **Clone repositori:**
    ```bash
    git clone <https://github.com/maulana-tech/waste-food.git>
    cd waste-food
    ```
2.  **Install dependensi Node.js:**
    ```bash
    npm install
    ```
3.  **(Opsional) Setup Python Environment (jika diperlukan untuk training/konversi model):**
    *   Pastikan Anda memiliki Python dan pip terinstall.
    *   Buat virtual environment (jika belum ada): `python -m venv myenv`
    *   Aktifkan environment:
        *   macOS/Linux: `source myenv/bin/activate`
        *   Windows: `myenv\Scripts\activate`
    *   Install dependensi Python: `pip install -r requirements.txt` (Anda perlu membuat file `requirements.txt` jika ada dependensi Python)

## Menjalankan Server

```bash
node server.js
