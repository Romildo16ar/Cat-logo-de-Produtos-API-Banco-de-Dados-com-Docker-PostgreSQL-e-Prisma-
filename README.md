# API — Catálogo de Itens de Ata de Registro de Preços (CIESP)

API REST em **Node.js + TypeScript + Express**, com persistência em **PostgreSQL 15** (Docker Compose) e **Prisma** para modelagem, migrations e seed.

Tarefa avaliativa da disciplina — o enunciado permite substituir o catálogo de produtos por um domínio análogo. Aqui o "produto" é um **item de Ata de Registro de Preços** (Lei 14.133/2021): cada registro guarda a descrição do item licitado, o **preço unitário registrado** (em `Decimal`, nunca `float`), o fornecedor detentor, a quantidade registrada e a vigência da ata.

> Os dados do seed são **fictícios**, criados apenas para demonstração.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Runtime | Node.js 20+ (testado no 24) |
| Linguagem | TypeScript 5.7 |
| HTTP | Express 4 (sem frameworks adicionais) |
| ORM | Prisma 6 |
| Banco | PostgreSQL 15 (Alpine) em container |
| Execução em dev | tsx |
| Testes manuais | Insomnia |

---

## Pré-requisitos

- [Node.js](https://nodejs.org) 20.19+ (ou 22.12+ / 24+)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) com Docker Compose v2
- [Insomnia](https://insomnia.rest/download)

---

## Passo a passo (do zero, em qualquer máquina)

### 1. Clonar e instalar dependências

```bash
git clone <url-do-repositorio>
cd api-ata-registro-precos
npm install
```

### 2. Criar o arquivo `.env`

```bash
# Linux / macOS
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

O `.env.example` já vem com valores prontos que combinam com o `docker-compose.yml`:

```env
POSTGRES_USER=ciesp
POSTGRES_PASSWORD=ciesp_dev_2026
POSTGRES_DB=ata_registro_precos
POSTGRES_PORT=5432

DATABASE_URL="postgresql://ciesp:ciesp_dev_2026@localhost:5432/ata_registro_precos?schema=public"

PORT=3000
```

### 3. Subir o PostgreSQL no Docker

```bash
docker compose up -d
```

Conferir se o container está saudável:

```bash
docker compose ps
```

Esperado: `ciesp_ata_postgres` com status `Up (healthy)`.

### 4. Criar e aplicar a migration inicial

```bash
npx prisma migrate dev --name init
```

Isso cria a tabela `ata_items`, gera a pasta `prisma/migrations/` e roda o `prisma generate`.

### 5. Popular o banco (seed)

```bash
npm run seed
```

Insere **7 itens de ata**. Saída esperada:

```
Limpando a tabela ata_items...
Inserindo 7 itens de ata...
  [1] Notebook corporativo 14" i5 16GB - R$ 4890.50
  ...
Seed concluido. Total de itens no banco: 7
```

### 6. Subir a API

```bash
npm run dev
```

```
Conectado ao PostgreSQL.
API ouvindo em http://localhost:3000
```

### 7. Conferir os dados no Prisma Studio

```bash
npx prisma studio
```

Abre em `http://localhost:5555` — clique na model **AtaItem** para ver os registros.

---

### Atalho

Com o `.env` já criado, os passos 3 a 5 cabem em um comando:

```bash
npm run setup
```

---

## Endpoints

Base: `http://localhost:3000`

| Método | Rota | Descrição | Status |
|---|---|---|---|
| GET | `/` | Status da API | 200 |
| GET | `/products` | Lista todos os itens | 200 |
| GET | `/products/:id` | Busca um item por id | 200 / 404 |
| POST | `/products` | Cria um item | 201 / 400 |
| PUT | `/products/:id` | Atualiza um item | 200 / 400 / 404 |
| DELETE | `/products/:id` | Remove um item | 204 / 404 |

> A rota `/products` é a exigida no enunciado. O alias `/itens-ata` aponta para o mesmo controller, apenas por clareza de domínio.

### Exemplos

**`GET /`**

```json
{
  "status": "ok",
  "api": "Catalogo de Itens de Ata de Registro de Precos - CIESP",
  "version": "1.0.0",
  "timestamp": "2026-09-07T12:00:00.000Z",
  "endpoints": ["GET /products", "GET /products/:id", "..."]
}
```

**`GET /products`**

```json
{
  "count": 7,
  "data": [
    {
      "id": 1,
      "title": "Notebook corporativo 14\" i5 16GB",
      "description": "Notebook 14 polegadas, processador Intel Core i5...",
      "unit": "UN",
      "quantity": 120,
      "price": "4890.50",
      "totalValue": "586860.00",
      "supplier": "Tecnolog Suprimentos de Informatica LTDA",
      "ataNumber": "ARP 012/2026",
      "validUntil": "2026-12-31",
      "createdAt": "2026-09-07T12:00:00.000Z",
      "updatedAt": "2026-09-07T12:00:00.000Z"
    }
  ]
}
```

**`GET /products/9999` → 404**

```json
{
  "error": "Not Found",
  "message": "Nenhum item de ata encontrado com o id 9999."
}
```

**`POST /products`**

```json
{
  "title": "Impressora multifuncional laser monocromatica",
  "description": "Impressora laser com duplex automatico e rede Gigabit.",
  "unit": "UN",
  "quantity": 40,
  "price": "3190.9000",
  "supplier": "Tecnolog Suprimentos de Informatica LTDA",
  "ataNumber": "ARP 012/2026",
  "validUntil": "2026-12-31"
}
```

---

## Sobre o `Decimal`

`price` é `Decimal(12, 4)` no banco e `Prisma.Decimal` na aplicação — `float`/`double` introduzem erro de arredondamento inaceitável em valor monetário de licitação.

Na resposta JSON o preço sai como **string** (`"4890.50"`), não como número. Serializar como `Number` devolveria o valor ao ponto flutuante e desfaria toda a precisão que o `Decimal` garante. O campo `totalValue` é calculado com aritmética decimal (`price.mul(quantity)`).

---

## Testes no Insomnia

1. Abrir o Insomnia → **Create** → **Import from File**
2. Selecionar `insomnia/insomnia-workspace.json`
3. A coleção **API Ata de Registro de Preços - CIESP** aparece com duas pastas:
   - **1 - Status** → `GET /`
   - **2 - Itens da Ata (CRUD)** → `GET /products`, `GET /products/:id`, um 404 proposital, `POST`, `PUT` e `DELETE`

Variáveis de ambiente já configuradas: `base_url` (`http://localhost:3000`) e `item_id` (`1`).

---

## Estrutura do projeto

```
api-ata-registro-precos/
├── docker-compose.yml          # PostgreSQL 15 + volume + healthcheck
├── .env.example                # modelo de variáveis (copiar para .env)
├── tsconfig.json
├── package.json
├── insomnia/
│   └── insomnia-workspace.json # coleção de requisições
├── prisma/
│   ├── schema.prisma           # model AtaItem
│   ├── seed.ts                 # 7 itens
│   └── migrations/             # gerado por prisma migrate dev
└── src/
    ├── server.ts               # bootstrap e graceful shutdown
    ├── app.ts                  # instância do Express
    ├── lib/prisma.ts           # PrismaClient singleton
    ├── routes/
    │   ├── index.ts            # GET / e montagem de /products
    │   └── ata-item.routes.ts
    ├── controllers/
    │   └── ata-item.controller.ts
    ├── middlewares/
    │   ├── not-found.ts        # 404 para rota inexistente
    │   └── error-handler.ts    # tradutor central de erros
    ├── validators/
    │   └── ata-item.validator.ts
    └── utils/
        ├── http-error.ts
        └── serialize.ts
```

---

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Sobe a API com hot reload (tsx watch) |
| `npm run build` | Compila TypeScript para `dist/` |
| `npm start` | Roda a versão compilada |
| `npm run typecheck` | Checagem de tipos sem gerar arquivos |
| `npm run seed` | Popula o banco |
| `npm run prisma:migrate` | `prisma migrate dev` |
| `npm run prisma:studio` | Abre o Prisma Studio |
| `npm run prisma:reset` | Zera o banco, reaplica migrations e roda o seed |
| `npm run db:up` / `db:down` | Sobe / derruba o container |
| `npm run db:logs` | Logs do PostgreSQL |
| `npm run setup` | install + docker up + migrate + seed |

---

## Solução de problemas

**`Can't reach database server at localhost:5432`**
O container não está no ar. Rode `docker compose ps` e, se preciso, `docker compose up -d`.

**`port is already allocated`**
Já existe um PostgreSQL usando a 5432. Mude `POSTGRES_PORT` no `.env` (ex.: `5433`) e ajuste a porta dentro da `DATABASE_URL` também.

**`P1000: Authentication failed`**
O volume foi criado antes com outra senha. Apague e recrie:

```bash
docker compose down -v
docker compose up -d
npx prisma migrate dev
npm run seed
```

**A API responde 503**
É o `error-handler` avisando que o Prisma não conseguiu conectar — mesma causa do primeiro item.

---

## Autor

Romildo Aparecido Rezende — Pós-graduação, tarefa avaliativa de API + Banco de Dados.
