#!/bin/sh

# Script de inicialización de base de datos para choppi-backend
# Versión optimizada para producción

set -e  # Salir en caso de error

echo "🚀 Iniciando inicialización de base de datos (producción)..."

# Función para verificar si PostgreSQL está listo
wait_for_postgres() {
    echo "⏳ Esperando a que PostgreSQL esté listo..."
    while ! nc -z $DB_HOST $DB_PORT; do
        echo "PostgreSQL no está listo, esperando..."
        sleep 2
    done
    echo "✅ PostgreSQL está listo!"
}

# Función para verificar si ya hay datos sembrados
check_data_exists() {
    echo "🔍 Verificando si ya hay datos en la base de datos..."
    # Usar node directamente con el archivo compilado
    NODE_ENV=production node -e "
    const { createConnection } = require('typeorm');
    const { Store } = require('./dist/entities');

    createConnection({
      type: 'postgres',
      host: process.env.DB_HOST || 'postgres',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Store],
      synchronize: false,
    }).then(async connection => {
      const storeCount = await connection.getRepository(Store).count();
      console.log(storeCount > 0 ? 'DATA_EXISTS' : 'NO_DATA');
      await connection.close();
      process.exit(storeCount > 0 ? 0 : 1);
    }).catch(() => {
      console.log('NO_DATA');
      process.exit(1);
    });
    " 2>/dev/null
}

# Función para ejecutar seeding
run_seeding() {
    echo "🌱 Ejecutando seeding de datos..."
    # Ejecutar el script compilado directamente con node
    NODE_ENV=production node seed.js
    echo "✅ Seeding completado!"
}

# Función principal
main() {
    # Verificar variables de entorno requeridas
    if [ -z \"$DB_HOST\" ] || [ -z \"$DB_PORT\" ]; then
        echo \"❌ Error: Variables de entorno DB_HOST y DB_PORT son requeridas\"
        exit 1
    fi

    # Esperar a PostgreSQL
    wait_for_postgres

    # Verificar si ya hay datos sembrados
    if check_data_exists; then
        echo \"ℹ️ Ya hay datos sembrados en la base de datos, saltando seeding\"
    else
        echo \"ℹ️ No hay datos sembrados, ejecutando seeding...\"
        run_seeding
    fi

    echo "🎉 Inicialización de base de datos completada!"
    echo "🚀 Iniciando aplicación en modo producción..."

    # Ejecutar la aplicación compilada
    exec node dist/src/main
}

# Ejecutar función principal
main