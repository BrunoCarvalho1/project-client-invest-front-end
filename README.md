
### `README-FRONTEND.md`

# Frontend - Gerenciador de Alocação de Ativos

Este documento descreve a camada de frontend do sistema, responsável pela interface do usuário, componentes visuais, gerenciamento de estado e interação com o usuário. A aplicação é construída com **Next.js**, **React**, **TypeScript** e **Tailwind CSS**.

---

## 🛠️ Tecnologias Principais

* **Framework:** [Next.js](https://nextjs.org/) & [React](https://react.dev/)
* **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) - Componentes acessíveis e reutilizáveis.
* **Gerenciamento de Estado de Servidor:** [React Query (`@tanstack/react-query`)](https://tanstack.com/query/latest) - Para fetching, caching e atualização de dados da API.
* **Formulários:** [React Hook Form](https://react-hook-form.com/) - Para construção de formulários performáticos.
* **Gráficos:** [Recharts](https://recharts.org/) - Para criação de gráficos de pizza e outros.
* **Notificações:** [Sonner](https://sonner.emilkowal.ski/) - Para exibição de toasts (alertas).
* **Ícones:** [Lucide React](https://lucide.dev/)

---

## 🚀 Configuração e Execução

Apesar deste ser o guia do frontend, a aplicação é um monólito integrado. Portanto, a configuração do backend e do banco de dados é um **pré-requisito indispensável** para rodar a interface.

### Pré-requisitos
* [Node.js](https://nodejs.org/en/) (v18.x ou superior)
* [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
* Uma instância do [MySQL](https://dev.mysql.com/downloads/mysql/) ativa.

### 1. Instalação
Clone o projeto, navegue até a pasta e instale todas as dependências:
```bash
git clone https://github.com/BrunoCarvalho1/project-client-invest-front-end
cd project-client-invest-front-end
npm install
Copie .env.example para um novo arquivo .env e configure sua string de conexão com o back-end
