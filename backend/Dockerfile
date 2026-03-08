FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/SmartHire.API/SmartHire.API.csproj", "src/SmartHire.API/"]
COPY ["src/SmartHire.Application/SmartHire.Application.csproj", "src/SmartHire.Application/"]
COPY ["src/SmartHire.Domain/SmartHire.Domain.csproj", "src/SmartHire.Domain/"]
COPY ["src/SmartHire.Infrastructure/SmartHire.Infrastructure.csproj", "src/SmartHire.Infrastructure/"]
RUN dotnet restore "src/SmartHire.API/SmartHire.API.csproj"
COPY . .
WORKDIR "/src/src/SmartHire.API"
RUN dotnet build "SmartHire.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SmartHire.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SmartHire.API.dll"]
