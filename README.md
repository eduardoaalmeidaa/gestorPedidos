
# Sistema de Pedidos Simplificado

## Tecnologias utilizadas:

- **Backend:** .NET 8 (C#)
- **Frontend:** React + TypeScript
- **Banco de dados:** SQLite
- **Autenticação:** JWT
- **Containerização:** Docker + Docker Compose
- **Testes unitários:** xUnit

---

## Funcionalidades Implementadas:

### Backend (.NET 8 API):

- Autenticação JWT com cadastro e login de usuário.
- Cadastro de produtos.
- Listagem de produtos.
- Edição e exclusão de produtos.
- Criação de pedidos com simulação de pagamento interno (80% sucesso / 20% falha + delay de 2-5 segundos).
- Atualização automática do status do pedido após o pagamento.
- Simulação de reserva de estoque (logs no console).
- Listagem de todos os pedidos do usuário autenticado.
- Consulta individual de pedidos.
- Edição da quantidade de um pedido.
- Exclusão de pedidos.
- Validações de entrada (ex: quantidade, produto existente, autenticação obrigatória).

### Frontend (React + TypeScript):

- Tela de Login com validação de e-mail.
- Tela de Registro de Usuário com validação de senha forte.
- Tela de Produtos com listagem, botão de "Fazer Pedido", edição e exclusão.
- Tela de Cadastro/Edição de Produtos.
- Tela de Pedidos com listagem, edição de quantidade e exclusão.
- Navegação protegida por token JWT.
- Feedback ao usuário com PrimeReact Toast e ConfirmDialog.
- UX simples, objetivo e responsivo.

### Docker:

- Backend, Frontend e Banco (SQLite) dockerizados.
- Arquivos incluídos:
  - `Dockerfile` (backend)
  - `Dockerfile` (frontend)
  - `docker-compose.yml` (na raiz do projeto)

### Testes Unitários:

- Criados testes básicos no projeto `PedidosAPI.Tests` utilizando **xUnit**.
- Testado o serviço de pagamento (`PagamentoService`), verificando:
  - Alteração de status de pedidos.
  - Garantia de que o status original não permaneça após o processamento.

---

## Como rodar o projeto via Docker:

### 1. Clone o repositório:

```bash
git clone https://github.com/eduardoaalmeidaa/gestorPedidos.git
cd gestorPedidos
```

### 2. Rode o Docker Compose:

```bash
docker-compose up --build
```

Isso irá subir:

- API (.NET 8)
- Frontend (React)
- Banco de dados SQLite (embutido no backend)

---

## Como acessar:

| Serviço | URL |
|--------|---|
| Frontend | http://localhost:3000/ |
| Backend (Swagger UI) | http://localhost:5000/swagger |

---

## Funcionalidades Extras:

- Validação de senha forte no cadastro de usuário.
- Uso de PrimeReact para melhor experiência de UI.
- Diálogos de confirmação para exclusões.

---

## Bibliotecas/frameworks adicionais utilizados:

| Tecnologia     | Motivo                                   |
| -------------- | ---------------------------------------- |
| **BCrypt.Net** | Armazenamento seguro de senha no backend |
| **PrimeReact** | Componentes de UI modernos no frontend   |
| **Axios**      | Requisições HTTP no frontend             |
| **xUnit**      | Testes unitários no backend              |

---

## Instruções para execução manual (sem Docker):

### Backend:

```bash
cd backend
dotnet build
dotnet run
```

### Frontend:

```bash
cd frontend
npm install
npm start
```

---
