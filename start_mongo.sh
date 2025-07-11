#!/bin/bash

# Ruta donde se guardarán los datos de Mongo
DATA_DIR="$(pwd)/mongo-data"


# Crear el folder si no existe
mkdir -p "$DATA_DIR"

# Ruta del log
LOG_FILE="$DATA_DIR/mongod.log"

# Iniciar mongod en segundo plano
mongod --dbpath "$DATA_DIR" --fork --logpath "$LOG_FILE"

echo "✅ MongoDB iniciado en segundo plano con dbpath: $DATA_DIR"
