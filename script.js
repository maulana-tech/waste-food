const imageUpload = document.getElementById('imageUpload');
const imagePreview = document.getElementById('imagePreview');
const classifyButton = document.getElementById('classifyButton');
const resultDiv = document.getElementById('result');

let imageData = null;

imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
            classifyButton.style.display = 'block';
            resultDiv.textContent = ''; // Clear previous result
            imageData = e.target.result; // Store image data (base64)
        }
        reader.readAsDataURL(file);
    } else {
        imagePreview.style.display = 'none';
        classifyButton.style.display = 'none';
        imageData = null;
    }
});

classifyButton.addEventListener('click', async () => {
    if (!imageData) {
        alert('Silakan pilih gambar terlebih dahulu.');
        return;
    }

    resultDiv.textContent = 'Memproses...';

    try {
        // TODO: Ganti '/classify' dengan endpoint server yang sebenarnya
        const response = await fetch('/classify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: imageData }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        resultDiv.textContent = `Hasil Klasifikasi: ${data.result}`;

    } catch (error) {
        console.error('Error classifying image:', error);
        resultDiv.textContent = 'Terjadi kesalahan saat klasifikasi.';
    }
});