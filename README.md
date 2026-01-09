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
<img width="1897" height="908" alt="Capturar" src="https://github.com/user-attachments/assets/fadc82a6-360a-44ab-ba90-b9de528f4f2e" />
<img width="1909" height="908" alt="Capturar05" src="https://github.com/user-attachments/assets/e8a5504d-371a-43a5-9957-efc425a77e33" />
<img width="1901" height="891" alt="04" src="https://github.com/user-attachments/assets/49e4564a-4099-4372-a3ea-ba0a4d29756a" />
<img width="1904" height="900" alt="03" src="https://github.com/user-attachments/assets/e3128407-ff93-41da-a164-8119d9d81c77" />
<img width="1905" height="907" alt="02" src="https://github.com/user-attachments/assets/1c204bfc-a511-4673-ba3e-1a6c83ee3194" />
<img width="1894" height="907" alt="01" src="https://github.com/user-attachments/assets/1a295c69-0edd-426b-ae31-6546d018b4a6" />


