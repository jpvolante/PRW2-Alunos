# API de Gerenciamento de Alunos — PRW2

**Avaliação 3 · Programação para a Web II**  
**Node.js · Express · Autenticação JWT**

## Integrantes

| Nome | RA |
|---|---|
| **Luigi Antonio Loddi Vanzella** | SC3033953 |
| **João Pedro Volante** | SC303034X |

## Sobre o projeto

API REST para gerenciar alunos e suas notas. O sistema permite cadastrar usuários, autenticar com **JSON Web Token (JWT)** e realizar operações de consulta, cadastro, atualização e exclusão de alunos. Também calcula médias e informa a situação de aprovação, considerando **média maior ou igual a 6,0**.

O armazenamento é feito em **arrays em memória**, conforme permitido no enunciado. **Não é necessário instalar ou configurar MongoDB.**

## Requisitos

- **Node.js** e **npm** instalados.
- Um cliente HTTP para testar as requisições, como **Postman**, **Thunder Client** ou o próprio **PowerShell**.

## Como executar

1. Baixe ou clone este repositório e abra o terminal na pasta que contém `package.json`.
2. Instale as dependências:

   ```bash
   npm install
   ```

3. Inicie o servidor:

   ```bash
   npm start
   ```

4. Acesse a API pelo endereço **`http://localhost:3000`** (porta padrão).

   Quando o servidor iniciar corretamente, o terminal exibirá:

   ```text
   Servidor rodando na porta 3000
   ```

> **No PowerShell do Windows:** se a execução de `npm.ps1` estiver bloqueada, use `npm.cmd install` e `npm.cmd start` no lugar dos comandos acima. Não é necessário alterar a política de execução do Windows.

### Configuração

O projeto inclui um arquivo `.env` com as variáveis `PORT`, `JWT_SECRET` e `JWT_EXPIRES_IN`. Ele já está preparado para a execução local da atividade. A chave JWT desse arquivo é destinada **somente ao ambiente demonstrativo** e não deve ser reutilizada em aplicações reais.

## Autenticação: sequência para testar

**Não existe usuário ou senha predefinidos.** Primeiro, crie um usuário com as credenciais que desejar; depois, faça login para obter um token.

### 1. Registrar um usuário

**`POST http://localhost:3000/register`**  
Cabeçalho: `Content-Type: application/json`

```json
{
  "username": "professor",
  "password": "senha123"
}
```

Resposta esperada em caso de sucesso:

```json
{ "message": "Usuário criado!" }
```

### 2. Fazer login

**`POST http://localhost:3000/login`**  
Cabeçalho: `Content-Type: application/json`

Envie o mesmo `username` e a mesma `password` usados no cadastro. A resposta contém:

```json
{
  "message": "Login efetuado pelo usuário professor",
  "jwt": "<TOKEN_JWT_GERADO_PELO_SERVIDOR>"
}
```

### 3. Acessar as rotas protegidas

Nas requisições para `/alunos`, envie o token recebido no login no cabeçalho:

```http
Authorization: Bearer <TOKEN_JWT_GERADO_PELO_SERVIDOR>
```

O token expira conforme a configuração do `.env`. Se expirar, basta realizar um novo login.

## Endpoints

| Método | Rota | Função | Autenticação |
|:---:|---|---|:---:|
| `POST` | `/register` | Cadastrar usuário | Não |
| `POST` | `/login` | Autenticar e obter JWT | Não |
| `GET` | `/alunos` | Listar todos os alunos | Sim |
| `GET` | `/alunos/:id` | Consultar aluno pelo ID | Sim |
| `GET` | `/alunos/medias` | Listar nome e média de cada aluno | Sim |
| `GET` | `/alunos/aprovados` | Listar nome e status (`aprovado` ou `reprovado`) | Sim |
| `POST` | `/alunos` | Cadastrar aluno | Sim |
| `PUT` | `/alunos/:id` | Atualizar dados de um aluno | Sim |
| `DELETE` | `/alunos/:id` | Excluir aluno | Sim |

### Estrutura de um aluno

```json
{
  "id": 4,
  "nome": "Pedro Oliveira",
  "ra": "2021004",
  "nota1": 8.5,
  "nota2": 7.0
}
```

O `id` deve ser inteiro positivo, o nome e o RA são textos, e as notas devem estar entre 0 e 10. Na criação, os cinco campos são obrigatórios; na atualização, podem ser enviados apenas os campos a alterar.

### Dados de demonstração

A API já inicia com três alunos fictícios:

| ID | Nome | RA | Nota 1 | Nota 2 |
|---:|---|---|---:|---:|
| 1 | Ana Silva | 2021001 | 7,5 | 8,0 |
| 2 | Bruno Souza | 2021002 | 5,0 | 6,0 |
| 3 | Carla Mendes | 2021003 | 9,0 | 9,5 |

A rota `/alunos/medias` retorna as médias, e `/alunos/aprovados` retorna a propriedade `status`, com os valores `aprovado` (média ≥ 6) ou `reprovado` (média < 6).

## Observações para a avaliação

- Todas as rotas de alunos exigem um JWT válido no cabeçalho `Authorization`.
- As mensagens e respostas da aplicação são fornecidas em **JSON**, inclusive os erros tratados pela API.
- As informações são mantidas **apenas em memória**: quando o servidor é reiniciado, os usuários cadastrados são apagados e a lista de alunos volta aos três registros iniciais. Portanto, após reiniciar, é necessário registrar um novo usuário antes de fazer login.
- O projeto foi desenvolvido para execução local e **não depende de um banco de dados externo**.

---

**Trabalho desenvolvido por Luigi Antonio Loddi Vanzella e João Pedro Volante para a Avaliação 3 de Programação para a Web II.**
