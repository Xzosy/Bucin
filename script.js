// script.js

const theBook = document.getElementById('theBook');
const bookCover = document.getElementById('bookCover');
const closeBookBtn = document.getElementById('closeBookBtn');
const backgroundMusic = document.getElementById('backgroundMusic');
const acceptBtn = document.getElementById('acceptBtn'); // Tombol Terima
const rejectBtn = document.getElementById('rejectBtn'); // Tombol Tolak
const contentPage = document.querySelector('.content-page'); // Container konten

let isBookOpen = false;

function openBook() {
    if (!isBookOpen) {
        theBook.classList.add('open');
        isBookOpen = true;
        // Reset posisi tombol tolak saat buku dibuka
        resetRejectButtonPosition();
        if (backgroundMusic) {
            backgroundMusic.currentTime = 0;
            backgroundMusic.play().catch(error => {
                console.warn("Autoplay musik dicegah:", error);
            });
        }
    }
}

function closeBook(event) {
     if (event) { event.stopPropagation(); }
    if (isBookOpen) {
        theBook.classList.remove('open');
        isBookOpen = false;
        if (backgroundMusic) {
            backgroundMusic.pause();
        }
        // Reset posisi tombol tolak juga saat ditutup
        resetRejectButtonPosition();
    }
}

// Fungsi untuk mereset posisi tombol Tolak
function resetRejectButtonPosition() {
     if(rejectBtn) {
        rejectBtn.style.position = 'relative'; // Pastikan relative
        rejectBtn.style.top = '0px';
        rejectBtn.style.left = '0px';
     }
}


// --- Logika Tombol Tolak Bergerak ---
function moveRejectButton() {
    if (!rejectBtn || !contentPage) return;

    const btnRect = rejectBtn.getBoundingClientRect();
    const containerRect = contentPage.getBoundingClientRect(); // Batas area gerak

    // Hitung batas maksimum pergerakan di dalam container (kurangi ukuran tombol)
    // Kurangi padding container juga agar tidak terlalu mepet
    const maxX = containerRect.width - btnRect.width - 60; // 60 = 2 * padding horizontal content-page
    const maxY = containerRect.height - btnRect.height - 100; // 100 = padding atas+bawah+jarak dari elemen lain

    // Hasilkan posisi acak (relative to current flow)
    // Angka ini bisa disesuaikan untuk jarak lompatan
    const randomX = Math.random() * 150 - 75; // -75px to +75px horizontal shift
    const randomY = Math.random() * 80 - 40; // -40px to +40px vertical shift

    // Dapatkan posisi saat ini (jika sudah digeser sebelumnya)
    let currentTop = parseFloat(rejectBtn.style.top) || 0;
    let currentLeft = parseFloat(rejectBtn.style.left) || 0;

    // Hitung posisi baru
    let newTop = currentTop + randomY;
    let newLeft = currentLeft + randomX;

    // Batasi agar tidak keluar container (perhitungan kasar)
    // Ini perlu disesuaikan tergantung layout tombol lain
    const parentPaddingTop = 30;
    const parentPaddingBottom = 80;
    const parentPaddingHoriz = 40;

    const minTopAllowed = - (btnRect.top - containerRect.top - parentPaddingTop); // Batas atas
    const maxTopAllowed = (containerRect.bottom - btnRect.bottom - parentPaddingBottom); // Batas bawah
    const minLeftAllowed = - (btnRect.left - containerRect.left - parentPaddingHoriz); // Batas kiri
    const maxLeftAllowed = (containerRect.right - btnRect.right - parentPaddingHoriz); // Batas kanan

    newTop = Math.max(minTopAllowed, Math.min(newTop, maxTopAllowed));
    newLeft = Math.max(minLeftAllowed, Math.min(newLeft, maxLeftAllowed));


    // Terapkan posisi baru
    rejectBtn.style.top = `${newTop}px`;
    rejectBtn.style.left = `${newLeft}px`;

    console.log(`Button moved to: top=${newTop.toFixed(0)}px, left=${newLeft.toFixed(0)}px`);
}


// --- Event Listeners ---
if (bookCover) { bookCover.addEventListener('click', openBook); }
if (closeBookBtn) { closeBookBtn.addEventListener('click', closeBook); }

// Pindahkan tombol tolak saat mouse hover di atasnya
if (rejectBtn) {
    rejectBtn.addEventListener('mouseover', moveRejectButton);
     // Opsional: Pindahkan juga saat fokus (untuk aksesibilitas keyboard, tapi bisa jadi sulit)
     // rejectBtn.addEventListener('focus', moveRejectButton);
}

// (Event listener opsional untuk tutup saat klik luar - sama seperti sebelumnya)
// document.addEventListener('click', function(event) {
//     if (isBookOpen && !theBook.contains(event.target)) { closeBook(); }
// });

// Panggil initGame jika ada (atau pastikan state awal benar)
resetRejectButtonPosition(); // Pastikan posisi reset di awal