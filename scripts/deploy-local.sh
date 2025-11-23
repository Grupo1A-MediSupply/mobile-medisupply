#!/bin/bash

# 🚀 Local Deployment Script for MediSupply React Native Web
# Este script te permite desplegar localmente a AWS S3 y CloudFront

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes con colores
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Configuración por defecto
ENVIRONMENT="staging"
S3_BUCKET=""
CLOUDFRONT_DISTRIBUTION=""
AWS_REGION="us-east-1"

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [OPCIONES]"
    echo ""
    echo "Opciones:"
    echo "  -e, --environment ENV    Ambiente a desplegar (staging|production)"
    echo "  -b, --bucket BUCKET      Nombre del bucket S3"
    echo "  -d, --distribution DIST  ID de distribución CloudFront"
    echo "  -r, --region REGION      Región de AWS (default: us-east-1)"
    echo "  -h, --help              Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 --environment staging --bucket medi-supply-staging --distribution E1234567890STAGING"
    echo "  $0 -e production -b medi-supply-production -d E0987654321PROD"
}

# Parsear argumentos
while [[ $# -gt 0 ]]; do
    case $1 in
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -b|--bucket)
            S3_BUCKET="$2"
            shift 2
            ;;
        -d|--distribution)
            CLOUDFRONT_DISTRIBUTION="$2"
            shift 2
            ;;
        -r|--region)
            AWS_REGION="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            print_error "Opción desconocida: $1"
            show_help
            exit 1
            ;;
    esac
done

# Validar argumentos requeridos
if [[ -z "$S3_BUCKET" ]]; then
    print_error "Bucket S3 es requerido. Usa --bucket"
    exit 1
fi

if [[ -z "$CLOUDFRONT_DISTRIBUTION" ]]; then
    print_error "ID de distribución CloudFront es requerido. Usa --distribution"
    exit 1
fi

if [[ "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "production" ]]; then
    print_error "Environment debe ser 'staging' o 'production'"
    exit 1
fi

print_header "🚀 MediSupply Local Deployment"
print_message "Environment: $ENVIRONMENT"
print_message "S3 Bucket: $S3_BUCKET"
print_message "CloudFront Distribution: $CLOUDFRONT_DISTRIBUTION"
print_message "AWS Region: $AWS_REGION"

# Verificar que AWS CLI esté instalado
if ! command -v aws &> /dev/null; then
    print_error "AWS CLI no está instalado. Instálalo desde: https://aws.amazon.com/cli/"
    exit 1
fi

# Verificar credenciales de AWS
print_message "Verificando credenciales de AWS..."
if ! aws sts get-caller-identity &> /dev/null; then
    print_error "No se pudieron verificar las credenciales de AWS. Configura aws configure"
    exit 1
fi

# Verificar que Node.js esté instalado
if ! command -v node &> /dev/null; then
    print_error "Node.js no está instalado"
    exit 1
fi

# Verificar que npm esté instalado
if ! command -v npm &> /dev/null; then
    print_error "npm no está instalado"
    exit 1
fi

print_header "🧪 Ejecutando Tests"
print_message "Ejecutando tests unitarios..."
if ! npm run test:ci; then
    print_error "Los tests fallaron. Deployment cancelado."
    exit 1
fi

print_header "🏗️ Construyendo Aplicación"
print_message "Instalando dependencias..."
npm ci

print_message "Construyendo aplicación para web..."
npm run build:production

# Verificar que el build se completó
if [[ ! -d "dist" ]]; then
    print_error "El directorio dist no se creó. Build falló."
    exit 1
fi

print_header "🚀 Desplegando a AWS"
print_message "Sincronizando archivos con S3..."

# Sincronizar archivos con cache headers apropiados
aws s3 sync dist/ s3://$S3_BUCKET --delete --cache-control "public, max-age=31536000" --region $AWS_REGION

# Subir index.html con no-cache
print_message "Subiendo index.html con no-cache..."
aws s3 cp dist/index.html s3://$S3_BUCKET/index.html --cache-control "no-cache, no-store, must-revalidate" --region $AWS_REGION

print_header "⚡ Invalidando CloudFront"
print_message "Creando invalidación de CloudFront..."
INVALIDATION_ID=$(aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION --paths "/*" --query 'Invalidation.Id' --output text --region $AWS_REGION)

print_message "Invalidación creada con ID: $INVALIDATION_ID"

print_header "✅ Deployment Completado"
print_message "Aplicación desplegada exitosamente a $ENVIRONMENT"
print_message "S3 Bucket: $S3_BUCKET"
print_message "CloudFront Distribution: $CLOUDFRONT_DISTRIBUTION"
print_message "Invalidación ID: $INVALIDATION_ID"

print_warning "Nota: Los cambios pueden tardar 15-20 minutos en propagarse completamente debido al cache de CloudFront."

print_message "Para verificar el deployment:"
print_message "aws s3 ls s3://$S3_BUCKET/ --region $AWS_REGION"
print_message "aws cloudfront get-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION --id $INVALIDATION_ID --region $AWS_REGION"
