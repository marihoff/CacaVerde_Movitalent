# 🚀 Backend Mesclado - Time Monza

## ✅ O QUE FOI FEITO:

Este backend é a **MESCLAGEM COMPLETA** entre:
- **SEU backend** (estrutura organizada, sistema de pontos, admin)
- **Backend DELA** (upload de fotos, endpoints de items)

---

## 📦 ESTRUTURA:

```
backend-mesclado-completo/
├── backend/
│   ├── models/
│   │   └── __init__.py          # Modelos mesclados (ItemFoto adicionado)
│   ├── routes/
│   │   ├── user/
│   │   │   └── __init__.py      # Routes admin (mantido)
│   │   └── items/
│   │       └── __init__.py      # Routes de items (NOVO)
│   ├── repositories/
│   │   └── __init__.py          # Funções de admin (mantido)
│   └── app.py                   # App principal mesclado
├── alembic/                      # Migrations
├── docker-compose.yml
├── Dockerfile                    # Atualizado
├── requirements.txt              # Atualizado
├── wait_for_db.py
└── alembic.ini
```

---

## 🔧 INSTALAÇÃO:

### 1. Extrair o ZIP:

```bash
cd C:\Users\gusta\Meus-Projetos
# Extraia o backend-mesclado-completo.zip aqui
```

### 2. Parar o backend antigo:

```powershell
cd C:\Users\gusta\Meus-Projetos\backend-monza\backend-monza
docker-compose down
```

### 3. Entrar na pasta do novo backend:

```powershell
cd C:\Users\gusta\Meus-Projetos\backend-mesclado-completo
```

### 4. Criar migration (Alembic):

```powershell
# Gerar migration automática
docker-compose run app alembic revision --autogenerate -m "Adiciona ItemFoto e campos extras"

# Aplicar migration
docker-compose run app alembic upgrade head
```

### 5. Iniciar:

```powershell
docker-compose up -d
```

### 6. Verificar logs:

```powershell
docker-compose logs -f app
```

---

## ✅ TESTAR:

### Health Check:
```powershell
curl http://localhost:5000/health
```

### Criar Item (precisa estar logado):
```bash
curl -X POST http://localhost:5000/api/items \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Cadeira de escritório",
    "descricao": "Cadeira ergonômica",
    "categoria": "Móveis",
    "latitude": "-23.550520",
    "longitude": "-46.633308",
    "fotosBase64": ["data:image/jpeg;base64,/9j/4AAQ..."]
  }'
```

---

## 📋 ENDPOINTS DISPONÍVEIS:

### Admin (SEU - Mantido):
- POST `/user/pontos/adicionar/<id>`
- POST `/user/pontos/remover/<id>`
- POST `/user/banir/<id>`
- POST `/user/desbanir/<id>`

### Items (DELA - Adicionado):
- POST `/api/items` - Criar item com fotos
- GET `/api/items` - Listar todos
- GET `/api/items/me` - Meus items
- DELETE `/api/items/<id>` - Deletar

### Uploads (DELA - Adicionado):
- GET `/api/uploads/<filename>` - Servir imagem

---

## 🔐 O QUE FOI MANTIDO:

✅ Toda estrutura organizada
✅ Todos os modelos (Usuario, Coleta, Recompensa, etc.)
✅ Sistema de pontos
✅ Sistema de admin
✅ Autenticação JWT
✅ Migrations (Alembic)

## 🆕 O QUE FOI ADICIONADO:

✅ Modelo `ItemFoto` (múltiplas fotos)
✅ Campos extras em `Item` (categoria, endereco, cep, etc.)
✅ Upload de fotos base64
✅ Routes `/api/items`
✅ Flask-CORS
✅ Pasta `uploads/`

---

## ⚠️ MUDANÇAS IMPORTANTES:

1. **Item.latitude e Item.longitude** agora são **nullable** (opcional)
2. **ItemFoto** é um novo modelo (precisa migration)
3. **Flask-CORS** está habilitado

---

## 🎯 PRÓXIMOS PASSOS:

1. ✅ Testar criação de items com fotos
2. ✅ Conectar frontend com `/api/items`
3. ✅ Implementar sistema de pontos ao catalogar
4. ✅ Integrar com Time Verona

---

**TUDO PRONTO PARA USAR!** 🎉
