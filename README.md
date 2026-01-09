# 🌱 Caça Verde – Time Monza

Repositório oficial do **Time Monza**, responsável pelo **módulo de catalogação de itens** do projeto **Caça Verde**, desenvolvido no programa **MoviTalent (Moviplu)**.

O Caça Verde é uma solução inspirada no conceito do *Pokémon GO*, com foco em **ESG, sustentabilidade e economia circular**, conectando pessoas que desejam descartar itens reutilizáveis com outras que possam reaproveitá-los.

---

## 🎯 Objetivo do Time Monza

Desenvolver a aplicação voltada para **quem disponibiliza itens**, permitindo:

* Catalogar resíduos reutilizáveis
* Informar localização
* Acompanhar pontuação
* Interagir com o sistema administrativo

Este módulo se integra diretamente com:

* **Time Verona** (resgate/coleta de itens)
* **Time Roma** (administração central)

---

## 🧩 Escopo do Módulo

O Time Monza é responsável por:

* Cadastro e autenticação de usuários
* Catalogação de itens com imagens
* Registro de localização geográfica
* Controle inicial de pontuação
* Funcionalidades administrativas básicas

---

## 📁 Estrutura do Projeto

```
Time_Monza/
├── frontend/          # Frontend em React + Vite
├── backend/           # Backend em Flask + PostgreSQL
└── README.md
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend

* React
* Vite
* JavaScript / JSX
* Consumo de API REST

### Backend

* Python
* Flask
* PostgreSQL
* Docker & Docker Compose

---

## 🚀 Como Rodar o Projeto Localmente

### 🔹 Pré-requisitos

* Node.js (versão recomendada LTS)
* Docker
* Docker Compose

---

### 🔹 Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse no navegador:

```
http://localhost:5174
```

---

### 🔹 Backend

```bash
cd backend
docker-compose up -d
```

API disponível em:

```
http://localhost:5000
```

---

## 📋 Funcionalidades

### ✅ Implementadas

* 🔐 Autenticação de usuários (cadastro e login)
* 📸 Catalogação de itens com múltiplas imagens
* 📍 Geolocalização dos itens cadastrados
* ⭐ Sistema de pontos (implementação parcial)
* 🛠️ Funcionalidades administrativas:

  * Adicionar pontos
  * Remover pontos
  * Banir usuários

---

### 🚧 Em Desenvolvimento

* 🎁 Sistema de recompensas
* 🔄 Integração com o **Time Verona** (fluxo de coleta e resgate)
* 🏛️ Integração completa com o **Time Roma** (admin centralizado)
* 📣 Sistema completo de reclamações

---

## 🔗 Integrações

* **Time Verona:** Consumo e atualização do status dos itens coletados
* **Time Roma:** Governança, resolução de conflitos e controle global de pontos

---

## 🌍 Impacto ESG

Este módulo contribui diretamente para:

* Redução do descarte inadequado de resíduos
* Incentivo à reutilização de itens com valor
* Promoção da economia circular
* Engajamento social por meio de gamificação

---

## 📅 Contexto Acadêmico / Corporativo

Projeto desenvolvido no âmbito do **MoviTalent – Moviplu (2024/2025)**, com foco na avaliação de:

* Organização
* Planejamento
* Comunicação entre times
* Execução técnica

---

## 👥 Time Monza

Projeto desenvolvido pelo **Time Monza** para o Caça Verde.
Mariana Hoffmann, Gustavo Coelho da Costa e Paula Pelizer

---

## 📄 Licença

Projeto de caráter educacional e demonstrativo, desenvolvido para fins de aprendizado e avaliação técnica.
