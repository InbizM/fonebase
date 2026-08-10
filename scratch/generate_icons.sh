#!/bin/bash

# ============================================================
# generate_icons.sh — Generar recursos de iconos de Android
# ============================================================

set -e

CONVERT_BIN="/data/data/com.termux/files/usr/bin/convert"
FAVICON_SVG="public/favicon.svg"
FAVICON_FG_SVG="public/favicon_foreground.svg"
RES_DIR="android/app/src/main/res"

echo "Iniciando generación de iconos..."

# 1. Generar iconos normales y redondos a partir del favicon.svg original (con fondo blanco)
echo "Generando ic_launcher.png y ic_launcher_round.png..."

# mipmap-mdpi: 48x48
mkdir -p "$RES_DIR/mipmap-mdpi"
$CONVERT_BIN -background none "$FAVICON_SVG" -resize 48x48 "$RES_DIR/mipmap-mdpi/ic_launcher.png"
$CONVERT_BIN -background none "$FAVICON_SVG" -resize 48x48 "$RES_DIR/mipmap-mdpi/ic_launcher_round.png"

# mipmap-hdpi: 72x72
mkdir -p "$RES_DIR/mipmap-hdpi"
$CONVERT_BIN -background none "$FAVICON_SVG" -resize 72x72 "$RES_DIR/mipmap-hdpi/ic_launcher.png"
$CONVERT_BIN -background none "$FAVICON_SVG" -resize 72x72 "$RES_DIR/mipmap-hdpi/ic_launcher_round.png"

# mipmap-xhdpi: 96x96
mkdir -p "$RES_DIR/mipmap-xhdpi"
$CONVERT_BIN -background none "$FAVICON_SVG" -resize 96x96 "$RES_DIR/mipmap-xhdpi/ic_launcher.png"
$CONVERT_BIN -background none "$FAVICON_SVG" -resize 96x96 "$RES_DIR/mipmap-xhdpi/ic_launcher_round.png"

# mipmap-xxhdpi: 144x144
mkdir -p "$RES_DIR/mipmap-xxhdpi"
$CONVERT_BIN -background none "$FAVICON_SVG" -resize 144x144 "$RES_DIR/mipmap-xxhdpi/ic_launcher.png"
$CONVERT_BIN -background none "$FAVICON_SVG" -resize 144x144 "$RES_DIR/mipmap-xxhdpi/ic_launcher_round.png"

# mipmap-xxxhdpi: 192x192
mkdir -p "$RES_DIR/mipmap-xxxhdpi"
$CONVERT_BIN -background none "$FAVICON_SVG" -resize 192x192 "$RES_DIR/mipmap-xxxhdpi/ic_launcher.png"
$CONVERT_BIN -background none "$FAVICON_SVG" -resize 192x192 "$RES_DIR/mipmap-xxxhdpi/ic_launcher_round.png"

# 2. Generar ic_launcher_foreground.png a partir del favicon_foreground.svg (transparente)
echo "Generando ic_launcher_foreground.png..."

# Crear copia temporal y remover la etiqueta rect (linea 7) para dejarlo transparente
cp "$FAVICON_SVG" "$FAVICON_FG_SVG"
sed -i '7d' "$FAVICON_FG_SVG"

# mipmap-mdpi: 108x108
$CONVERT_BIN -background none "$FAVICON_FG_SVG" -resize 108x108 "$RES_DIR/mipmap-mdpi/ic_launcher_foreground.png"

# mipmap-hdpi: 162x162
$CONVERT_BIN -background none "$FAVICON_FG_SVG" -resize 162x162 "$RES_DIR/mipmap-hdpi/ic_launcher_foreground.png"

# mipmap-xhdpi: 216x216
$CONVERT_BIN -background none "$FAVICON_FG_SVG" -resize 216x216 "$RES_DIR/mipmap-xhdpi/ic_launcher_foreground.png"

# mipmap-xxhdpi: 324x324
$CONVERT_BIN -background none "$FAVICON_FG_SVG" -resize 324x324 "$RES_DIR/mipmap-xxhdpi/ic_launcher_foreground.png"

# mipmap-xxxhdpi: 432x432
$CONVERT_BIN -background none "$FAVICON_FG_SVG" -resize 432x432 "$RES_DIR/mipmap-xxxhdpi/ic_launcher_foreground.png"

# Eliminar el archivo temporal
rm "$FAVICON_FG_SVG"

echo "¡Iconos generados exitosamente!"
