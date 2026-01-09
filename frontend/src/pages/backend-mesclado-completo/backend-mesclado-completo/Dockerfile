FROM python:3.11-slim

WORKDIR /app

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements e instalar dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código da aplicação
COPY . .

# Criar pasta de uploads
RUN mkdir -p /app/uploads && chmod 755 /app/uploads

# Expor porta
EXPOSE 5000

# Comando para rodar
CMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=5000"]
