#!/bin/bash
# Script para rastrear tempo de execução de tarefas

TRACKER_FILE="PERFORMANCE_TRACKER.md"
LOG_FILE="task-times.log"

case "$1" in
  start)
    TASK_TYPE="$2"
    TASK_DESC="$3"
    START_TIME=$(date -u +%Y-%m-%d\ %H:%M\ UTC)
    echo "$START_TIME|$TASK_TYPE|$TASK_DESC|START" >> "$LOG_FILE"
    echo "⏱️  Iniciando: $TASK_DESC ($TASK_TYPE)"
    echo "   Hora: $START_TIME"
    ;;
    
  end)
    COMMIT_HASH="$2"
    END_TIME=$(date -u +%Y-%m-%d\ %H:%M\ UTC)
    
    # Pegar última tarefa iniciada
    LAST=$(tail -1 "$LOG_FILE")
    START_TIME=$(echo "$LAST" | cut -d'|' -f1)
    TASK_TYPE=$(echo "$LAST" | cut -d'|' -f2)
    TASK_DESC=$(echo "$LAST" | cut -d'|' -f3)
    
    # Calcular duração (simplificado - assumindo mesmo dia)
    echo "$END_TIME|$TASK_TYPE|$TASK_DESC|END|$COMMIT_HASH" >> "$LOG_FILE"
    
    echo "✅ Finalizado: $TASK_DESC"
    echo "   Início: $START_TIME"
    echo "   Fim: $END_TIME"
    echo "   Commit: $COMMIT_HASH"
    echo ""
    echo "📊 Registrado em $LOG_FILE"
    ;;
    
  *)
    echo "Uso:"
    echo "  ./track-task.sh start [TIPO] [DESCRIÇÃO]"
    echo "  ./track-task.sh end [COMMIT_HASH]"
    echo ""
    echo "Exemplo:"
    echo "  ./track-task.sh start 'Frontend-Formulário' 'Cadastro de anúncio'"
    echo "  # ... trabalhar na tarefa ..."
    echo "  ./track-task.sh end abc1234"
    ;;
esac
