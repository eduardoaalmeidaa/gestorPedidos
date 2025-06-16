# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia apenas o código fonte (ignorando bin/obj por causa do .dockerignore)
COPY ./PedidosAPI ./PedidosAPI

# Navega até a pasta onde está o .csproj real
WORKDIR /src/PedidosAPI/PedidosAPI

# Restaura dependências
RUN dotnet restore

# Publica apenas o projeto da API
RUN dotnet publish ./PedidosAPI.csproj -c Release -o /app/out

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/out .

EXPOSE 80

ENTRYPOINT ["dotnet", "PedidosAPI.dll"]