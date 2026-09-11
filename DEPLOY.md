# 🚀 Cara Deploy ke Vercel

## Struktur File
```
kelulusan/
├── index.html
├── style.css
├── script.js
├── download (31).jpg
└── vercel.json
```

## Cara 1 — Drag & Drop (Paling Mudah)

1. Buka [vercel.com](https://vercel.com) → Login / Daftar
2. Klik **"Add New… → Project"**
3. Pilih **"Deploy without Git"** / Import dari folder
4. **Drag seluruh folder** `kelulusan/` ke browser Vercel
5. Klik **Deploy** → Tunggu ~30 detik
6. ✅ Link langsung aktif! Format: `https://nama-proyek.vercel.app`

---

## Cara 2 — Vercel CLI

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Masuk ke folder project
cd d:\kuliah\kelulusan

# 3. Login
vercel login

# 4. Deploy
vercel --prod
```

---

## Cara 3 — GitHub + Vercel (Auto-Deploy)

1. Upload folder ke **GitHub** (repo baru)
2. Buka [vercel.com](https://vercel.com) → **Import Git Repository**
3. Pilih repo tersebut
4. Framework Preset: **Other**
5. Klik **Deploy**
6. Setiap kali `git push`, Vercel otomatis update

---

## Catatan Penting

- **Nama file gambar** jangan pakai spasi → rename `download (31).jpg` jadi `foto.jpg`
  dan update di `index.html`: `src="foto.jpg"`
- File sudah include `vercel.json` untuk routing yang benar

