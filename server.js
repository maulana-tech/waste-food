const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const path = require('path');

const app = express();
const port = 3000; // Anda bisa mengganti port jika diperlukan

// Middleware untuk parsing JSON body
app.use(express.json({ limit: '50mb' })); // Tingkatkan batas jika perlu untuk gambar besar
app.use(express.static(__dirname)); // Sajikan file statis dari direktori root

let model;
const modelPath = 'file://' + path.join(__dirname, 'data', 'model.json'); // Path ke model Anda

// Fungsi untuk memuat model
async function loadModel() {
    try {
        console.log(`Mencoba memuat model dari: ${modelPath}`);
        model = await tf.loadLayersModel(modelPath);
        console.log('Model berhasil dimuat.');
        // Lakukan pemanasan model jika diperlukan (opsional)
        // const zeros = tf.zeros([1, 224, 224, 3]); // Sesuaikan shape dengan input model Anda
        // model.predict(zeros);
        // zeros.dispose();
        // console.log('Model siap.');
    } catch (error) {
        console.error('Gagal memuat model:', error);
        process.exit(1); // Keluar jika model gagal dimuat
    }
}

// Endpoint untuk klasifikasi gambar
app.post('/classify', async (req, res) => {
    if (!model) {
        return res.status(503).json({ error: 'Model belum siap.' });
    }
    if (!req.body || !req.body.image) {
        return res.status(400).json({ error: 'Data gambar tidak ditemukan.' });
    }

    try {
        const imageData = req.body.image; // Data gambar base64 dari frontend
        // Hapus header data URL (misal, 'data:image/jpeg;base64,')
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, 'base64');

        // Decode dan preprocess gambar
        // Ukuran input model (sesuai model.json: 100x100). Sesuaikan dengan model Anda!
        const imageSize = 100;
        let tensor = tf.node.decodeImage(imageBuffer, 3) // 3 channel warna (RGB)
            .resizeNearestNeighbor([imageSize, imageSize]) // Sesuaikan ukuran
            .toFloat()
            .expandDims(); // Tambahkan dimensi batch

        // Normalisasi gambar jika diperlukan oleh model Anda
        // Contoh: normalisasi ke rentang [0, 1]
        tensor = tensor.div(tf.scalar(255.0));
        // Contoh lain: normalisasi dengan mean/std dev jika model dilatih demikian

        // Lakukan prediksi
        const predictions = await model.predict(tensor).data();
        tensor.dispose(); // Bebaskan memori tensor

        // Proses hasil prediksi
        // Asumsikan output model adalah probabilitas untuk 2 kelas [Organik, Recycle]
        // Anda mungkin perlu menyesuaikan logika ini berdasarkan output model Anda
        const result = predictions[0] > predictions[1] ? 'Organik' : 'Recycle'; // Contoh sederhana
        // Jika outputnya berbeda, sesuaikan cara mendapatkan hasilnya
        // const predictedClassIndex = tf.argMax(predictions).dataSync()[0];
        // const classes = ['Organik', 'Recycle'];
        // const result = classes[predictedClassIndex];

        console.log('Prediksi:', predictions, 'Hasil:', result);
        res.json({ result: result });

    } catch (error) {
        console.error('Error saat klasifikasi:', error);
        res.status(500).json({ error: 'Terjadi kesalahan internal saat klasifikasi.' });
    }
});

// Rute default untuk menyajikan index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Mulai server setelah model dimuat
loadModel().then(() => {
    app.listen(port, () => {
        console.log(`Server berjalan di http://localhost:${port}`);
    });
});