#!/bin/bash

# Este script está diseñado para ejecutarse diariamente vía cron (ej. a las 15:00 hrs)
# Despierta a Antigravity (agy) para que lea la skill de daily_briefing y procese los anuncios.

# Cargar PATH para cron (necesario para encontrar agy, node, python, etc.)
export PATH=/usr/local/bin:/opt/homebrew/bin:/opt/homebrew/sbin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH

AGENTE_P_DIR="/Users/pedro/Documents/UC/agenteP"
cd "$AGENTE_P_DIR" || exit 1

echo "Despertando a Agente P para el resumen diario..."

# Usar Antigravity CLI (agy) para ejecutar la skill 'daily_briefing' de manera headless
agy --skill daily_briefing "Ejecuta tu tarea diaria de briefing según las instrucciones de tu skill."

echo "Daily summary pipeline finalizado."
