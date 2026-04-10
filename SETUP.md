# 🚀 Guia de Inicialização - CvGenSharp

Este documento guia você através da configuração e execução do projeto CvGenSharp.

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js**: v18 ou superior ([download](https://nodejs.org))
- **.NET SDK**: versão 10 ou superior ([download](https://dotnet.microsoft.com/download))
- **Git**: para controle de versão ([download](https://git-scm.com))

## 🔧 Instalação

### Passo 1: Instale as Dependências do Cliente

```bash
cd cvgensharp.client
npm install
```

**Dependências principais que serão instaladas:**
- React 19
- Tailwind CSS 3
- Lucide React (ícones)
- TypeScript

### Passo 2: Instale as Dependências do Servidor

```bash
cd CvGenSharp.Server
dotnet restore
```

**Dependências principais:**
- ASP.NET Core 10
- iText7 (geração de PDF)

### Passo 3: Configure Certificados HTTPS (Primeiro uso)

Gere certificados para desenvolvimento seguro:

```bash
dotnet dev-certs https --trust
```

Escolha "Sim" quando solicitado para confiar no certificado.

## 🎯 Executando a Aplicação

### Opção 1: Executar Tudo de Uma Vez (Recomendado)

#### No Windows (PowerShell):
```bash
# Terminal 1: Backend
cd CvGenSharp.Server
dotnet run

# Terminal 2: Frontend
cd cvgensharp.client
npm run dev
```

#### No macOS/Linux:
```bash
# Terminal 1: Backend
cd CvGenSharp.Server
dotnet run

# Terminal 2: Frontend
cd cvgensharp.client
npm run dev
```

### Opção 2: Usando Visual Studio Community 2026

1. Abra a solução `CvGenSharp.sln`
2. Clique em **Play** para executar
3. O Visual Studio iniciará automaticamente cliente e servidor

## 🌐 Acessando a Aplicação

Após iniciar ambos os serviços, abra seu navegador:

```
https://localhost:57830
```

## 📊 Estrutura do Projeto

```
CvGenSharp/
├── cvgensharp.client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── PersonalInfoForm.tsx
│   │   │   ├── ExperienceForm.tsx
│   │   │   ├── EducationForm.tsx
│   │   │   ├── SkillsForm.tsx
│   │   │   ├── ProjectsForm.tsx
│   │   │   ├── CertificatesForm.tsx
│   │   │   ├── CVPreview.tsx
│   │   │   └── CVGenerator.tsx (componente principal)
│   │   ├── types/
│   │   │   └── cv.ts (tipos TypeScript)
│   │   ├── utils/
│   │   │   └── helpers.ts (funções auxiliares)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── CvGenSharp.Server/
│   ├── Controllers/
│   │   └── CVController.cs
│   ├── Models/
│   │   └── CVModels.cs
│   ├── Services/
│   │   └── CVGeneratorService.cs
│   ├── Program.cs
│   └── CvGenSharp.Server.csproj
│
└── README.md
```

## 🛠️ Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| React | 19.2 | Biblioteca UI |
| TypeScript | 6.0 | Linguagem com tipagem |
| Tailwind CSS | 3.4 | Framework CSS utilitário |
| Vite | 8.0 | Build tool e dev server |
| Lucide React | 0.408 | Biblioteca de ícones |

### Backend
| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| .NET | 10.0 | Framework |
| ASP.NET Core | 10.0 | Web framework |
| iText7 | 7.2.8 | Geração de PDF |

## 📝 Usando a Aplicação

### 1. Preencha as Informações Pessoais
- Nome completo
- Email e telefone
- Localização
- Resumo profissional

### 2. Adicione Experiência Profissional
- Clique em "Adicionar Experiência"
- Preencha empresa, cargo, datas e descrição
- Adicione destaques de realizações

### 3. Complete Educação
- Adicione graus acadêmicos
- Informe instituições e datas

### 4. Liste Habilidades
- Adicione skills com nível de proficiência
- Organize por proficiência

### 5. Mostre Projetos
- Descreva projetos relevantes
- Indique tecnologias utilizadas

### 6. Incluindo Certificações
- Adicione certificações profissionais
- Forneça informações do emissor

### 7. Visualize e Gere
- Clique em "Ver Prévia" para revisar
- Clique em "Gerar e Baixar CV (PDF)" para obter o arquivo

## 🐛 Solução de Problemas

### Erro: "Address already in use"
O servidor já está rodando em outra instância.

**Solução:**
- Feche outras instâncias do Visual Studio ou terminal
- Ou mude a porta em `launchSettings.json`

### Erro: "Cannot find module"
Dependências não foram instaladas.

**Solução:**
```bash
cd cvgensharp.client
npm install

cd ../CvGenSharp.Server
dotnet restore
```

### Erro: "Invalid certificate"
Certificados HTTPS não são confiáveis.

**Solução:**
```bash
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```

### Erro ao gerar PDF
A pasta de output não existe.

**Solução:**
O servidor criará automaticamente em `CvGenSharp.Server/wwwroot/cvs`

### Frontend não conecta ao backend
Verifique o proxy no Vite.

**Verifique:** `vite.config.ts` tem proxy configurado para `/api`

## 🔍 Checklist de Verificação

- [ ] Node.js instalado (`node --version`)
- [ ] .NET SDK instalado (`dotnet --version`)
- [ ] Dependências instaladas (`npm install` e `dotnet restore`)
- [ ] Certificados HTTPS configurados
- [ ] Backend rodando em `https://localhost:5001`
- [ ] Frontend rodando em `https://localhost:57830`
- [ ] Aplicação abrindo em navegador sem erros

## 📚 Próximos Passos

1. **Personalize**: Modifique cores em `tailwind.config.js`
2. **Expanda**: Adicione novas seções ao currículo
3. **Implante**: Faça deploy em ambiente de produção
4. **Otimize**: Use o endpoint `/api/cv/optimize` para sugestões ATS

## 💡 Dicas de Desenvolvimento

### Hot Reload
Tanto o frontend (Vite) quanto o backend (.NET) suportam hot reload. Suas mudanças são refletidas automaticamente.

### Debugging
- **Frontend**: Use DevTools do navegador (F12)
- **Backend**: Use Visual Studio debugger ou VSCode

### Logs
- **Frontend**: Veja console do navegador
- **Backend**: Veja console do terminal ou Debug Output do Visual Studio

## 📞 Suporte

Se encontrar problemas:

1. Verifique o arquivo `CHANGELOG.md`
2. Consulte este guia novamente
3. Abra uma issue no GitHub

---

**Bom desenvolvimento! 🚀**
