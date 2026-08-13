#!/usr/bin/env bash
set -euo pipefail
cd /home/lucas/Documentos/projetos/portfolio
run_segment() {
  local id="$1" nome="$2" terms="$3"
  IFS='|' read -ra parts <<< "$terms"
  node propostas/mapear_maps.js "$id" "$nome" "${parts[@]}" > "propostas/mapeamentos/$id.log" 2>&1
}
export -f run_segment
tail -n +1 propostas/segmentos-maps.tsv | xargs -P 3 -d '\n' -I '{}' bash -c 'IFS=$'"'"'\t'"'"' read -r id nome terms <<< "$1"; run_segment "$id" "$nome" "$terms"' _ '{}'
