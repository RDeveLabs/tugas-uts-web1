// simpen sementara
var peringatanStorageMuncul = false;

function ambilDataSementara(namaData, dataAwal) {
    try {
        var dataTersimpan = sessionStorage.getItem(namaData);

        if (dataTersimpan == null) {
            return dataAwal;
        }

        return JSON.parse(dataTersimpan);
    } catch (error) {
        return dataAwal;
    }
}

function simpanDataSementara(namaData, isiData) {
    try {
        sessionStorage.setItem(namaData, JSON.stringify(isiData));
        return true;
    } catch (error) {
        if (peringatanStorageMuncul == false) {
            alert("Penyimpanan sementara tidak tersedia. Jalankan website melalui Live Server agar data bisa tersimpan selama tab terbuka.");
            peringatanStorageMuncul = true;
        }
        return false;
    }
}

function hapusDataSementara(namaData) {
    try {
        sessionStorage.removeItem(namaData);
    } catch (error) {
    }
}

// Data tambahan disimpan terpisah
var akunTambahan = ambilDataSementara("akunTambahan", []);
var bukuTambahan = ambilDataSementara("bukuTambahan", []);
var dataPenggunaAktif = dataPengguna.concat(akunTambahan);
var dataKatalogAktif = dataKatalogBuku.concat(bukuTambahan);
var daftarPesanan = ambilDataSementara("daftarPesanan", []);
var dataRiwayat = ambilDataSementara("dataRiwayat", []);
var trackingPesanan = ambilDataSementara("trackingPesanan", {});

function ambilAkunLogin() {
    return ambilDataSementara("akunLogin", null);
}

// LOGIN DAN MODAL
var formLogin = document.getElementById("formLogin");

if (formLogin) {
    formLogin.addEventListener("submit", function(event) {
        event.preventDefault();

        var email = document.getElementById("email").value.trim();
        var password = document.getElementById("password").value;
        var akunDitemukan = null;

        // cek akun data.js
        for (var i = 0; i < dataPenggunaAktif.length; i++) {
            if (email == dataPenggunaAktif[i].email && password == dataPenggunaAktif[i].password) {
                akunDitemukan = dataPenggunaAktif[i];
                break;
            }
        }

        if (akunDitemukan != null) {
            simpanDataSementara("akunLogin", {
                nama: akunDitemukan.nama,
                email: akunDitemukan.email,
                role: akunDitemukan.role
            });
            window.location.href = "dashboard.html";
        } else {
            alert("email/password yang anda masukkan salah");
        }
    });
}

// Membuka modal lupa password dan daftar.
var btnLupa = document.getElementById("btnLupa");
var btnDaftar = document.getElementById("btnDaftar");

if (btnLupa) {
    btnLupa.addEventListener("click", function() {
        document.getElementById("modalLupa").style.display = "flex";
    });
}

if (btnDaftar) {
    btnDaftar.addEventListener("click", function() {
        document.getElementById("modalDaftar").style.display = "flex";
    });
}

// close modal.
var tombolTutup = document.querySelectorAll("[data-tutup]");
for (var i = 0; i < tombolTutup.length; i++) {
    tombolTutup[i].addEventListener("click", function() {
        var idModal = this.getAttribute("data-tutup");
        document.getElementById(idModal).style.display = "none";
    });
}

var kirimLupa = document.getElementById("kirimLupa");
if (kirimLupa) {
    kirimLupa.addEventListener("click", function() {
        var email = document.getElementById("emailLupa").value.trim();

        if (email == "") {
            alert("Email harus diisi.");
        } else {
            alert("Jika email terdaftar, petunjuk reset akan dikirim.");
            document.getElementById("modalLupa").style.display = "none";
        }
    });
}

// Menambahkan akun baru ke daftar akun sementara.
var kirimDaftar = document.getElementById("kirimDaftar");
if (kirimDaftar) {
    kirimDaftar.addEventListener("click", function() {
        var nama = document.getElementById("namaDaftar").value.trim();
        var email = document.getElementById("emailDaftar").value.trim();
        var password = document.getElementById("passwordDaftar").value;

        if (nama == "" || email == "" || password == "") {
            alert("Semua data harus diisi.");
            return;
        }

        var emailSudahAda = false;
        for (var i = 0; i < dataPenggunaAktif.length; i++) {
            if (dataPenggunaAktif[i].email.toLowerCase() == email.toLowerCase()) {
                emailSudahAda = true;
                break;
            }
        }

        if (emailSudahAda) {
            alert("Email tersebut sudah terdaftar. Silakan gunakan email lain.");
            return;
        }

        var akunBaru = {
            id: dataPenggunaAktif.length + 1,
            nama: nama,
            email: email,
            password: password,
            role: "User"
        };

        akunTambahan.push(akunBaru);
        dataPenggunaAktif.push(akunBaru);
        simpanDataSementara("akunTambahan", akunTambahan);

        alert("Akun berhasil dibuat. Silakan login menggunakan akun baru.");
        document.getElementById("modalDaftar").style.display = "none";
        document.getElementById("namaDaftar").value = "";
        document.getElementById("emailDaftar").value = "";
        document.getElementById("passwordDaftar").value = "";
    });
}

// BAGIAN DASHBOARD
var greeting = document.getElementById("greeting");
if (greeting) {
    var jam = new Date().getHours();
    var sapaan = "Selamat malam";

    if (jam >= 5 && jam < 11) {
        sapaan = "Selamat pagi";
    } else if (jam >= 11 && jam < 15) {
        sapaan = "Selamat siang";
    } else if (jam >= 15 && jam < 18) {
        sapaan = "Selamat sore";
    }

    var akunAktif = ambilAkunLogin();
    var namaPengguna = "Pengunjung";

    if (akunAktif != null && akunAktif.nama != "") {
        namaPengguna = akunAktif.nama;
    }

    greeting.innerHTML = sapaan + ", " + namaPengguna + "!";

    var tanggalSekarang = new Date();
    document.getElementById("tanggalHariIni").innerHTML = tanggalSekarang.toLocaleDateString("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
    });
}

// logout = akun yang sedang login.
// Data akun, katalog, dan transaksi = aman smpe tab ditutup.
var btnKeluar = document.getElementById("btnKeluar");
if (btnKeluar) {
    btnKeluar.addEventListener("click", function(event) {
        event.preventDefault();
        hapusDataSementara("akunLogin");
        window.location.href = "index.html";
    });
}

// BAGIAN KATALOG / STOK BUKU
var tabelKatalog = document.getElementById("tabelKatalog");

function tampilkanKatalog() {
    if (tabelKatalog) {
        tabelKatalog.innerHTML = "";

        for (var i = 0; i < dataKatalogAktif.length; i++) {
            var buku = dataKatalogAktif[i];
            var baris = document.createElement("tr");

            baris.innerHTML =
                "<td>" + (i + 1) + "</td>" +
                "<td><img class='cover-buku' src='" + buku.cover + "' alt='Cover buku'></td>" +
                "<td>" + buku.kodeBarang + "</td>" +
                "<td>" + buku.namaBarang + "</td>" +
                "<td>" + buku.jenisBarang + "</td>" +
                "<td>" + buku.edisi + "</td>" +
                "<td>" + buku.stok + "</td>" +
                "<td>" + buku.harga + "</td>";

            tabelKatalog.appendChild(baris);
        }
    }
}
tampilkanKatalog();

// Menambahkan buku baru dan menyimpan datanya smentara.
var formTambahBuku = document.getElementById("formTambahBuku");
if (formTambahBuku) {
    formTambahBuku.addEventListener("submit", function(event) {
        event.preventDefault();

        var kodeBaru = document.getElementById("kodeBaru").value.trim();
        var kodeSudahAda = false;

        for (var i = 0; i < dataKatalogAktif.length; i++) {
            if (dataKatalogAktif[i].kodeBarang.toLowerCase() == kodeBaru.toLowerCase()) {
                kodeSudahAda = true;
                break;
            }
        }

        if (kodeSudahAda) {
            alert("Kode barang sudah digunakan.");
            return;
        }

        var bukuBaru = {
            kodeBarang: kodeBaru,
            namaBarang: document.getElementById("namaBaru").value.trim(),
            jenisBarang: document.getElementById("jenisBaru").value.trim(),
            edisi: document.getElementById("edisiBaru").value,
            stok: document.getElementById("stokBaru").value,
            harga: "Rp " + Number(document.getElementById("hargaBaru").value).toLocaleString("id-ID"),
            cover: "img/pengantar_komunikasi.jpg"
        };

        bukuTambahan.push(bukuBaru);
        dataKatalogAktif.push(bukuBaru);
        simpanDataSementara("bukuTambahan", bukuTambahan);
        tampilkanKatalog();
        formTambahBuku.reset();
        alert("Buku berhasil ditambahkan ke katalog.");
    });
}

// BAGIAN CHECKOUT / PEMESANAN
var pilihBuku = document.getElementById("pilihBuku");

function isiPilihanBuku() {
    if (pilihBuku) {
        pilihBuku.innerHTML = "";

        for (var i = 0; i < dataKatalogAktif.length; i++) {
            var pilihan = document.createElement("option");
            pilihan.value = i;
            pilihan.text = dataKatalogAktif[i].namaBarang;
            pilihBuku.appendChild(pilihan);
        }
    }
}

function angkaHarga(harga) {
    return Number(String(harga).replace(/[^0-9]/g, ""));
}

function rupiah(angka) {
    return "Rp " + Number(angka).toLocaleString("id-ID");
}

function simpanDaftarPesanan() {
    simpanDataSementara("daftarPesanan", daftarPesanan);
}

function tampilkanPesanan() {
    var tabelPesanan = document.getElementById("tabelPesanan");

    if (tabelPesanan) {
        tabelPesanan.innerHTML = "";
        var total = 0;

        for (var i = 0; i < daftarPesanan.length; i++) {
            var item = daftarPesanan[i];
            var subtotal = item.harga * item.jumlah;
            total = total + subtotal;

            var baris = document.createElement("tr");
            baris.innerHTML =
                "<td>" + item.nama + "</td>" +
                "<td>" + rupiah(item.harga) + "</td>" +
                "<td><input type='number' min='1' value='" + item.jumlah + "' class='input-jumlah' data-index='" + i + "' style='width:70px'></td>" +
                "<td>" + rupiah(subtotal) + "</td>" +
                "<td><button type='button' class='link-button hapus-item' data-index='" + i + "'>Hapus</button></td>";
            tabelPesanan.appendChild(baris);
        }

        document.getElementById("totalHarga").innerHTML = rupiah(total);

        // Mengubah jumlah barang.
        var inputJumlah = document.querySelectorAll(".input-jumlah");
        for (var j = 0; j < inputJumlah.length; j++) {
            inputJumlah[j].addEventListener("change", function() {
                var index = Number(this.getAttribute("data-index"));
                var jumlahBaru = Number(this.value);

                if (jumlahBaru < 1 || isNaN(jumlahBaru)) {
                    jumlahBaru = 1;
                }

                daftarPesanan[index].jumlah = jumlahBaru;
                simpanDaftarPesanan();
                tampilkanPesanan();
            });
        }

        // Menghapus barang dari pesanan.
        var tombolHapus = document.querySelectorAll(".hapus-item");
        for (var k = 0; k < tombolHapus.length; k++) {
            tombolHapus[k].addEventListener("click", function() {
                var index = Number(this.getAttribute("data-index"));
                daftarPesanan.splice(index, 1);
                simpanDaftarPesanan();
                tampilkanPesanan();
            });
        }
    }
}

if (pilihBuku) {
    isiPilihanBuku();
}

// Mengisi nama dan email dari akun yang sedang login.
var akunUntukCheckout = ambilAkunLogin();
if (akunUntukCheckout != null) {
    var namaInput = document.getElementById("namaPemesan");
    var emailInput = document.getElementById("emailPemesan");

    if (namaInput && namaInput.value == "") {
        namaInput.value = akunUntukCheckout.nama;
    }
    if (emailInput && emailInput.value == "") {
        emailInput.value = akunUntukCheckout.email;
    }
}

// Menambahkan buku ke keranjang.
var tambahPesanan = document.getElementById("tambahPesanan");
if (tambahPesanan) {
    tambahPesanan.addEventListener("click", function() {
        var indexBuku = Number(pilihBuku.value);
        var jumlah = Number(document.getElementById("jumlahBuku").value);
        var bukuDipilih = dataKatalogAktif[indexBuku];

        if (bukuDipilih == undefined) {
            alert("Silakan pilih buku terlebih dahulu.");
            return;
        }

        if (jumlah < 1 || isNaN(jumlah)) {
            alert("Jumlah buku minimal 1.");
            return;
        }

        var sudahAda = false;
        for (var i = 0; i < daftarPesanan.length; i++) {
            if (daftarPesanan[i].kode == bukuDipilih.kodeBarang) {
                daftarPesanan[i].jumlah = daftarPesanan[i].jumlah + jumlah;
                sudahAda = true;
                break;
            }
        }

        if (sudahAda == false) {
            daftarPesanan.push({
                kode: bukuDipilih.kodeBarang,
                nama: bukuDipilih.namaBarang,
                harga: angkaHarga(bukuDipilih.harga),
                jumlah: jumlah
            });
        }

        simpanDaftarPesanan();
        tampilkanPesanan();
        document.getElementById("jumlahBuku").value = 1;
    });
}

// BAGIAN CHECKOUT DAN HISTORY TRANSAKSI
var formCheckout = document.getElementById("formCheckout");
if (formCheckout) {
    formCheckout.addEventListener("submit", function(event) {
        event.preventDefault();

        if (daftarPesanan.length == 0) {
            alert("Silakan tambahkan buku terlebih dahulu.");
            return;
        }

        var totalBayar = 0;
        var daftarBukuDibeli = [];

        for (var i = 0; i < daftarPesanan.length; i++) {
            totalBayar = totalBayar + (daftarPesanan[i].harga * daftarPesanan[i].jumlah);
            daftarBukuDibeli.push({
                nama: daftarPesanan[i].nama,
                jumlah: daftarPesanan[i].jumlah
            });
        }

        // kode resi baru
        var nomorBaru = "DO" + (1001 + dataRiwayat.length);
        var tanggalSekarang = new Date();
        var tanggalKirim = tanggalSekarang.toLocaleDateString("id-ID", {
            day: "numeric", month: "long", year: "numeric"
        });

        var transaksi = {
            nomor: nomorBaru,
            nama: document.getElementById("namaPemesan").value.trim(),
            email: document.getElementById("emailPemesan").value.trim(),
            alamat: document.getElementById("alamatPemesan").value.trim(),
            total: rupiah(totalBayar),
            pembayaran: document.getElementById("metodeBayar").value,
            buku: daftarBukuDibeli
        };

        dataRiwayat.push(transaksi);
        simpanDataSementara("dataRiwayat", dataRiwayat);

        // track pesanan baru
        trackingPesanan[nomorBaru] = {
            nomorDO: nomorBaru,
            nama: transaksi.nama,
            status: "Pesanan Diproses",
            ekspedisi: "JNE",
            tanggalKirim: tanggalKirim,
            paket: "Reguler",
            total: transaksi.total,
            perjalanan: [
                {
                    waktu: tanggalSekarang.toLocaleString("id-ID"),
                    keterangan: "Pesanan diterima dan sedang diproses oleh toko."
                }
            ]
        };
        simpanDataSementara("trackingPesanan", trackingPesanan);

        tampilkanRiwayat();
        alert("Pesanan berhasil dibuat. Nomor DO kamu: " + nomorBaru);

        // kosongkan keranjang setelahchekout.
        daftarPesanan = [];
        simpanDaftarPesanan();
        tampilkanPesanan();
        formCheckout.reset();
    });
}

function tampilkanRiwayat() {
    var tabelRiwayat = document.getElementById("tabelRiwayat");

    if (tabelRiwayat) {
        tabelRiwayat.innerHTML = "";

        for (var i = 0; i < dataRiwayat.length; i++) {
            var baris = document.createElement("tr");
            baris.innerHTML =
                "<td>" + dataRiwayat[i].nomor + "</td>" +
                "<td>" + dataRiwayat[i].nama + "</td>" +
                "<td>" + dataRiwayat[i].total + "</td>" +
                "<td>" + dataRiwayat[i].pembayaran + "</td>";
            tabelRiwayat.appendChild(baris);
        }
    }
}

tampilkanPesanan();
tampilkanRiwayat();

// BAGIAN TRACKING PENGIRIMAN
var formTracking = document.getElementById("formTracking");
if (formTracking) {
    formTracking.addEventListener("submit", function(event) {
        event.preventDefault();

        var nomor = document.getElementById("nomorDO").value.trim();
        var hasil = document.getElementById("hasilTracking");
        var data = trackingPesanan[nomor];

        // Kalau bukan pesanan baru, cari nomor dari data contoh di data.js.
        if (data == undefined) {
            data = dataTracking[nomor];
        }

        hasil.hidden = false;

        if (data == undefined) {
            hasil.innerHTML = "<h2>Data tidak ditemukan</h2><p>Nomor Delivery Order tidak tersedia. Silakan periksa kembali nomor DO.</p>";
        } else {
            var daftarPerjalanan = "";
            for (var i = 0; i < data.perjalanan.length; i++) {
                daftarPerjalanan = daftarPerjalanan +
                    "<li><strong>" + data.perjalanan[i].waktu + "</strong><br>" +
                    data.perjalanan[i].keterangan + "</li>";
            }

            var persen = 25;
            if (data.status == "Dalam Perjalanan") {
                persen = 70;
            } else if (data.status == "Dikirim") {
                persen = 100;
            }

            hasil.innerHTML =
                "<h2>Detail Pengiriman</h2>" +
                "<p><strong>Nomor DO:</strong> " + data.nomorDO + "</p>" +
                "<p><strong>Nama Pemesan:</strong> " + data.nama + "</p>" +
                "<p><strong>Status:</strong> <span class='status'>" + data.status + "</span></p>" +
                "<div class='progress'><div style='width:" + persen + "%'></div></div>" +
                "<p><strong>Ekspedisi:</strong> " + data.ekspedisi + "</p>" +
                "<p><strong>Tanggal Kirim:</strong> " + data.tanggalKirim + "</p>" +
                "<p><strong>Jenis Paket:</strong> " + data.paket + "</p>" +
                "<p><strong>Total Pembayaran:</strong> " + data.total + "</p>" +
                "<h3>Riwayat Perjalanan</h3><ol class='detail-list'>" + daftarPerjalanan + "</ol>";
        }
    });
}
