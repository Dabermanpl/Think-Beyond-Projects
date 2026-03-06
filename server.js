const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.static(__dirname)); // Serwujemy pliki z obecnego folderu, żeby mozna bylo pobrac mp4

app.get('/api/render-v10', (req, res) => {
    console.log('Otrzymano żądanie wyrenderowania Wersji 10...');

    // Uruchamiamy skrypt w tle
    exec('node generate_v10_media.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`Błąd renderowania: ${error.message}`);
            return res.status(500).json({ success: false, error: error.message });
        }

        console.log('Renderowanie zakończone sukcesem!');

        // Zwracamy informację o sukcesie i ścieżki do pobrania plików
        res.json({
            success: true,
            mp4Url: '/api/download-v10'
        });
    });
});

app.get('/api/download-v10', (req, res) => {
    const filePath = path.join(__dirname, 'Wersja_10_animacja.mp4');
    if (fs.existsSync(filePath)) {
        res.download(filePath, 'Wersja_10_animacja.mp4');
    } else {
        res.status(404).send('Plik jeszcze nie został wygenerowany.');
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serwer renderujący API uruchomiony na http://localhost:${PORT}`);
    console.log(`Możesz teraz kliknąć przycisk "Pobierz" w Wersji 10!`);
});
