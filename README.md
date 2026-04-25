# 🏋️ Encuesta CrossFit — Guía de Deploy

Formulario de investigación para tu app de CrossFit. 100% gratis.

**Stack:** React + Vite + Supabase (DB gratis) + Vercel (hosting gratis)

---

## Paso 1: Crear la base de datos en Supabase (5 min)

1. Andá a [supabase.com](https://supabase.com) y creá una cuenta gratis
2. Creá un nuevo proyecto (elegí una contraseña y la región **South America - São Paulo**)
3. Esperá ~2 min a que se cree
4. Andá a **SQL Editor** (menú izquierdo) → **New Query**
5. Copiá y pegá todo el contenido del archivo `supabase-setup.sql` y dale **Run**
6. Andá a **Settings** → **API** y copiá:
   - **Project URL** (ej: `https://xxxxx.supabase.co`)
   - **anon / public key** (la clave larga que empieza con `eyJ...`)

---

## Paso 2: Configurar el proyecto (2 min)

1. Copiá el archivo `.env.example` y renombralo a `.env`:

```bash
cp .env.example .env
```

2. Editá `.env` y pegá tus datos de Supabase:

```
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

---

## Paso 3: Probar en local (opcional)

```bash
npm install
npm run dev
```

Abrí `http://localhost:5173` y probá enviar una respuesta.

---

## Paso 4: Subir a GitHub (3 min)

1. Creá un repo nuevo en [github.com/new](https://github.com/new)
2. Desde la carpeta del proyecto:

```bash
git init
git add .
git commit -m "encuesta crossfit"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/crossfit-survey.git
git push -u origin main
```

> ⚠️ Asegurate de agregar `.env` al `.gitignore` para no subir tus claves.

---

## Paso 5: Deploy en Vercel (3 min)

1. Andá a [vercel.com](https://vercel.com) y logueate con GitHub
2. Click en **"Add New Project"** → importá tu repo `crossfit-survey`
3. En **Environment Variables** agregá:
   - `VITE_SUPABASE_URL` → tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` → tu anon key
4. Click en **Deploy**
5. En ~1 minuto tenés tu URL pública (ej: `crossfit-survey.vercel.app`)

---

## Cómo usar

| Acción | URL |
|--------|-----|
| Completar encuesta | `tu-app.vercel.app` |
| Ver resultados | `tu-app.vercel.app/#resultados` |

**Contraseña de resultados:** `xxxxxxxxxxxx` (podés cambiarla en `src/App.jsx`, buscá `ADMIN_PASSWORD`)

---

## Compartir con el box

Mandá el link por WhatsApp o imprimí un QR. Cada persona completa el form desde su celular y las respuestas se guardan automáticamente en Supabase.

Para generar un QR gratis: [qr.io](https://qr.io)

---

## Ver datos crudos

Podés ver todas las respuestas directamente en Supabase:
- Andá a tu proyecto → **Table Editor** → tabla `responses`
- También podés exportar a CSV desde ahí
