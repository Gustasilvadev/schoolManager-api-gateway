# 🚪 SchoolManager: API Gateway

## 1. Visão Geral do Projeto
O SchoolManager é um sistema de gestão escolar desenvolvido para digitalizar e acelerar processos administrativos e acadêmicos de escolas. O foco está na produtividade da secretaria e dos professores.

O sistema possui uma arquitetura baseada em **microsserviços**, utilizando este API Gateway como ponto de entrada (validando tokens gerados pelo MS1) e comunicação híbrida (HTTP/REST para requisições síncronas e RabbitMQ para operações assíncronas). O ecossistema completo conta com 6 microsserviços isolados com seus próprios bancos de dados (MariaDB).

---

## 2. Sobre o API Gateway
Este repositório contém exclusivamente o código do **API Gateway**. Ele é o único ponto de entrada externo para o ecossistema SchoolManager, concentrando responsabilidades transversais de borda.

**Domínio:** Roteamento, autenticação de borda e proteção de rede.

### Responsabilidades Principais
* **Roteamento** — encaminha requisições para o microsserviço correto com base no prefixo da URL.
* **Autenticação de borda (JWT)** — valida o token Bearer antes de proxiar; bloqueia requisições anônimas com `401`.
* **CORS** — habilita o acesso a partir do frontend configurado em `CORS_ORIGIN`.
* **Rate limiting** — limita requisições por IP (configurável via `.env`).
* **Logging** — loga todas as requisições via Morgan.
* **Resiliência** — retorna `503` quando um MS alvo está indisponível ou ultrapassa o `PROXY_TIMEOUT_MS`.

### Stack
- **Node.js + Express 5**
- **http-proxy-middleware** para reverse proxy
- **jsonwebtoken** para validação do JWT
- **express-rate-limit** + **cors** + **morgan**

---

## 3. Padrão de Commits

**Formato:** `<tipo>: <mensagem curta>`

**Tipos permitidos:**
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `chore`: Configurações, dependências e estrutura
- `docs`: Atualização de documentação
- `refactor`: Refatoração sem alterar regra de negócio
- `style`: Formatação de código
- `test`: Criação/alteração de testes

---

# 🗺️ Tabela de Roteamento

| Prefixo da URL          | MS  | Porta | Variável de ambiente |
|-------------------------|-----|-------|----------------------|
| `/api/auth/*`           | MS1 | 3001  | `MS1_URL`            |
| `/api/users/*`          | MS1 | 3001  | `MS1_URL`            |
| `/api/students/*`       | MS2 | 3002  | `MS2_URL`            |
| `/api/teachers/*`       | MS3 | 3003  | `MS3_URL`            |
| `/api/classes/*`        | MS4 | 3004  | `MS4_URL`            |
| `/api/tests/*`          | MS5 | 3005  | `MS5_URL`            |
| `/api/grades/*`         | MS5 | 3005  | `MS5_URL`            |
| `/api/finalAverages/*`  | MS5 | 3005  | `MS5_URL`            |
| `/api/notices/*`        | MS6 | 3006  | `MS6_URL`            |

---

# 🔐 Autenticação no Gateway

| Método | Endpoint               | Auth no Gateway | Observação                                                      |
|--------|------------------------|-----------------|-----------------------------------------------------------------|
| GET    | `/health`              | ❌              | Health check próprio do gateway, não é proxiado                 |
| POST   | `/api/auth/login`      | ❌              | Rota pública (`PUBLIC_ROUTES`) — passa direto para o MS1        |
| `*`    | Demais rotas `/api/*`  | ✅              | Exige `Authorization: Bearer <token>` válido (mesmo `JWT_SECRET` do MS1) |

Headers propagados ao MS alvo após validar o JWT:
- `Authorization` (preservado intacto — cada MS valida internamente)
- `x-user-id` (extraído do payload `id`/`user_id`)
- `x-user-role` (extraído do payload `role`)

---

## ❤️ Health Check

| Método | Endpoint   | Descrição                            | Auth |
|--------|-----------|--------------------------------------|------|
| GET    | `/health` | Verifica status do próprio Gateway   | ❌   |

---

## 4. Estrutura de Pastas

```
src/
├── config/
│   └── services.js         # PROXY_MAP + PUBLIC_ROUTES
├── middlewares/
│   ├── corsConfig.js       # CORS configurado por env
│   ├── rateLimiter.js      # express-rate-limit
│   ├── authMiddleware.js   # valida JWT, propaga x-user-id/role
│   └── errorHandler.js     # captura erros não tratados
├── proxy/
│   └── proxyRouter.js      # monta http-proxy-middleware por prefixo
└── server.js               # entry point
```

---

## 5. Scripts

| Comando        | Descrição                                |
|----------------|------------------------------------------|
| `npm start`    | Inicia o gateway em modo produção        |
| `npm run dev`  | Inicia com nodemon (hot-reload)          |

---

## 6. Códigos de Resposta do Gateway

| Status | Significado                                                                  |
|--------|------------------------------------------------------------------------------|
| `200`  | Resposta bem-sucedida (encaminhada do MS alvo)                               |
| `401`  | `TOKEN_MISSING` ou `TOKEN_INVALID` — bloqueado pelo `authMiddleware`         |
| `429`  | Rate limit excedido — bloqueado pelo `rateLimiter`                           |
| `503`  | MS alvo indisponível, timeout ou prefixo sem URL configurada                 |
