# 📦 Guia de Deployment - CvGenSharp

Este documento descreve como fazer deploy da aplicação CvGenSharp em ambientes de produção.

## 🌍 Opções de Deployment

### Opção 1: Azure App Service (Recomendado)

#### Pré-requisitos
- Conta Azure ativa
- Azure CLI instalado
- Visual Studio Community 2026 ou similar

#### Passos

1. **Crie um recurso App Service no Azure**

```bash
az group create --name CvGenSharp-RG --location eastus
az appservice plan create --name CvGenSharp-Plan --resource-group CvGenSharp-RG --sku F1
az webapp create --name cvgensharp-app --resource-group CvGenSharp-RG --plan CvGenSharp-Plan --runtime "dotnet|10"
```

2. **Publique a aplicação**

```bash
# Do diretório do servidor
cd CvGenSharp.Server
dotnet publish -c Release -o ./publish

# Comprima e faça upload
Compress-Archive -Path ./publish -DestinationPath app.zip
az webapp deployment source config-zip --resource-group CvGenSharp-RG --name cvgensharp-app --src app.zip
```

### Opção 2: Docker (Container)

#### Dockerfile

O projeto já inclui um `Dockerfile`. Para usar:

```bash
# Build da imagem
docker build -t cvgensharp:latest .

# Run do container
docker run -p 5000:5000 -p 5001:5001 cvgensharp:latest
```

#### Docker Compose

```yaml
version: '3.8'
services:
  app:
    image: cvgensharp:latest
    ports:
      - "5000:5000"
      - "5001:5001"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=https://+:5001;http://+:5000
    volumes:
      - ./cvs:/app/wwwroot/cvs
```

### Opção 3: GitHub Actions (CI/CD)

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup .NET
      uses: actions/setup-dotnet@v3
      with:
        dotnet-version: '10.x'
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Build Frontend
      run: |
        cd cvgensharp.client
        npm install
        npm run build
    
    - name: Publish Backend
      run: |
        cd CvGenSharp.Server
        dotnet publish -c Release -o ./publish
    
    - name: Deploy to Azure
      uses: azure/webapps-deploy@v2
      with:
        app-name: cvgensharp-app
        publish-profile: ${{ secrets.AZURE_PUBLISH_PROFILE }}
        package: ./publish
```

## 🔧 Configuração de Produção

### 1. Variáveis de Ambiente

Crie `appsettings.Production.json`:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "AllowedHosts": "*",
  "CvSettings": {
    "OutputDirectory": "/var/cvs",
    "MaxFileSize": 10485760
  }
}
```

### 2. Certificados HTTPS

```bash
# Gere certificado Let's Encrypt
certbot certonly --standalone -d seu-dominio.com

# Configure no appsettings
# Veja documentação ASP.NET Core
```

### 3. Banco de Dados (Opcional)

Se adicionara persistência:

```csharp
// Program.cs
builder.Services.AddSqlServer(
    builder.Configuration.GetConnectionString("DefaultConnection")
);
```

## 📊 Monitoramento

### Application Insights (Azure)

```csharp
// Program.cs
builder.Services.AddApplicationInsightsTelemetry();
```

### Logs

Configure rotação de logs:

```json
{
  "Logging": {
    "File": {
      "Path": "/var/logs/cvgensharp/",
      "MaxRollingFiles": 10,
      "MaxFileSize": 52428800
    }
  }
}
```

## 🔒 Segurança

### 1. HTTPS Obrigatório

```csharp
// Program.cs
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
    app.UseHttpsRedirection();
}
```

### 2. Rate Limiting

```csharp
// Program.cs
builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter(policyName: "fixed", options =>
    {
        options.PermitLimit = 100;
        options.Window = TimeSpan.FromMinutes(1);
    });
});
```

### 3. CORS (se necessário)

```csharp
// Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins",
        policy => policy
            .WithOrigins("https://seu-dominio.com")
            .AllowAnyHeader()
            .AllowAnyMethod()
    );
});
```

## 📈 Performance

### 1. Compressão

```csharp
// Program.cs
app.UseResponseCompression();
```

### 2. Caching

```csharp
// Startup
builder.Services.AddResponseCaching();
app.UseResponseCaching();
```

### 3. CDN

Configure CloudFlare ou similar para servir assets estáticos.

## 📋 Checklist de Deployment

- [ ] Ambiente `.NET 10` configurado
- [ ] Node.js v18+ instalado
- [ ] Certificados HTTPS válidos
- [ ] Variáveis de ambiente configuradas
- [ ] Build de produção testado localmente
- [ ] Testes unitários passando
- [ ] CORS configurado corretamente
- [ ] Pasta `/wwwroot/cvs` com permissões corretas
- [ ] Logs configurados
- [ ] Backup de dados configurado
- [ ] Monitoramento ativo
- [ ] Rate limiting ativo

## 🚀 Escalabilidade

### Load Balancer

Configure Nginx ou Azure Load Balancer para distribuir tráfego.

### Cache Distribuído

```csharp
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
});
```

### Horizontal Scaling

Use Kubernetes ou Docker Swarm para gerenciar múltiplas instâncias.

## 🆘 Troubleshooting

### Erro: "Connection string not found"
Defina em variáveis de ambiente ou `appsettings.Production.json`

### Erro: "Permission denied" em `/wwwroot/cvs`
Execute:
```bash
sudo chown -R app-user:app-user /var/cvs
sudo chmod -R 755 /var/cvs
```

### Erro: "HTTPS connection refused"
Verifique se certificados estão no caminho correto e porta 443 está aberta

## 📞 Suporte

Para problemas de deployment:
1. Verifique logs: `docker logs container-id`
2. Teste local antes de deployed
3. Use ferramentas de diagnóstico do seu host

---

**Happy Deploying! 🚀**
