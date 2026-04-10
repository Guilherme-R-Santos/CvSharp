# 🚀 Quick Start - CvGenSharp

Comece em 5 minutos! Siga este guia rápido para colocar a aplicação rodando.

## ⚡ 5 Minutos - Setup

### 1️⃣ Instale Dependências (2 min)

```bash
# Terminal 1: Frontend
cd cvgensharp.client
npm install

# Terminal 2: Backend
cd CvGenSharp.Server
dotnet restore
```

### 2️⃣ Configure HTTPS (1 min)

```bash
dotnet dev-certs https --trust
```

### 3️⃣ Inicie os Serviços (2 min)

```bash
# Terminal 1: Frontend
cd cvgensharp.client
npm run dev

# Terminal 2: Backend
cd CvGenSharp.Server
dotnet run
```

### ✅ Pronto!

Abra seu navegador: **https://localhost:57830**

---

## 📝 Usando a Aplicação

### 1. Preencha suas Informações

- Nome, email, telefone
- Localização e resumo profissional
- Links para LinkedIn e portfólio

### 2. Adicione Experiência

- Empresa, cargo, datas
- Descrição e destaques

### 3. Complete Educação

- Instituição, grau, área
- Datas de início/conclusão

### 4. Liste Habilidades

- 5-10 habilidades principais
- Indique seu nível

### 5. Mostre Projetos

- Descrição
- Tecnologias utilizadas

### 6. Gere seu CV!

- Clique "Ver Prévia" para revisar
- Clique "Gerar e Baixar CV (PDF)"
- Seu currículo está pronto! 🎉

---

## 🔍 Acompanhe o Score ATS

O widget **"Score ATS"** aparece no topo e mostra:
- 📊 Pontuação de 0-100
- 💡 Sugestões de melhoria
- 🔑 Palavras-chave detectadas
- ✅ Seções preenchidas

---

## 🆘 Problemas?

### "Port already in use"
```bash
# Mude a porta em launchSettings.json (Backend)
# ou em vite.config.ts (Frontend)
```

### "Module not found"
```bash
npm install
dotnet restore
```

### "Certificate error"
```bash
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```

---

## 📚 Documentação Completa

- 📖 [Setup Detalhado](SETUP.md)
- 💡 [Exemplos](EXAMPLES.md)
- 🚀 [Deployment](DEPLOYMENT.md)
- 📝 [README](README.md)

---

## 🎯 Dica Pro

Para melhorar seu score ATS:

1. ✅ Adicione **5+ habilidades** técnicas específicas
2. ✅ Descreva **experiência com números** (aumentou 40%, etc)
3. ✅ Use **nomes reconhecidos** de tecnologias
4. ✅ Inclua **1+ projetos** relevantes
5. ✅ Complete **educação** formal

---

**Divirta-se criando seu currículo! 🎉**
