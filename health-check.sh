#!/bin/bash

# Script de verificação de saúde do projeto CvGenSharp
# Execute este script para verificar se tudo está funcionando

echo "🔍 CvGenSharp Health Check"
echo "================================"
echo ""

# Verificar Node.js
echo "✓ Verificando Node.js..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "  ✅ Node.js $NODE_VERSION instalado"
else
    echo "  ❌ Node.js não encontrado"
    exit 1
fi

# Verificar npm
echo ""
echo "✓ Verificando npm..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "  ✅ npm $NPM_VERSION instalado"
else
    echo "  ❌ npm não encontrado"
    exit 1
fi

# Verificar .NET SDK
echo ""
echo "✓ Verificando .NET SDK..."
if command -v dotnet &> /dev/null; then
    DOTNET_VERSION=$(dotnet --version)
    echo "  ✅ .NET $DOTNET_VERSION instalado"
else
    echo "  ❌ .NET SDK não encontrado"
    exit 1
fi

# Verificar estrutura do projeto
echo ""
echo "✓ Verificando estrutura do projeto..."

CHECKS=(
    "cvgensharp.client:Frontend"
    "cvgensharp.client/src:Frontend Source"
    "cvgensharp.client/package.json:Frontend Dependencies"
    "CvGenSharp.Server:Backend"
    "CvGenSharp.Server/Program.cs:Backend Program"
    "CvGenSharp.Server/CvGenSharp.Server.csproj:Backend Project"
    "README.md:Documentação"
    "SETUP.md:Guia de Setup"
)

for check in "${CHECKS[@]}"; do
    path="${check%%:*}"
    desc="${check##*:}"
    if [ -e "$path" ]; then
        echo "  ✅ $desc"
    else
        echo "  ❌ $desc ($path não encontrado)"
    fi
done

# Verificar dependências do frontend
echo ""
echo "✓ Verificando dependências do frontend..."
if [ -f "cvgensharp.client/node_modules/.package-lock.json" ]; then
    echo "  ✅ Dependências instaladas"
else
    echo "  ⚠️  Dependências não instaladas"
    echo "  Execute: cd cvgensharp.client && npm install"
fi

# Verificar certificados HTTPS
echo ""
echo "✓ Verificando certificados HTTPS..."
if [ -d "$HOME/.aspnet/https" ] || [ -d "$APPDATA/ASP.NET/https" ]; then
    echo "  ✅ Certificados encontrados"
else
    echo "  ⚠️  Certificados não encontrados"
    echo "  Execute: dotnet dev-certs https --trust"
fi

echo ""
echo "================================"
echo "✅ Health check concluído!"
echo ""
echo "Próximos passos:"
echo "1. cd cvgensharp.client && npm install"
echo "2. cd ../CvGenSharp.Server && dotnet restore"
echo "3. dotnet dev-certs https --trust"
echo "4. Execute o servidor: dotnet run"
echo "5. Em outro terminal, execute o cliente: npm run dev"
echo ""
