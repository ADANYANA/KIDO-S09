# S09 — Consistencia distribuida en procesos de negocio

**Estudiante:** Adan Yana Rojas
**Proyecto utilizado:** KIDO
**Entrega:** Tarea de la sesión S09

## Objetivo

Demostrar idempotencia y compensación en el proceso distribuido de compra de un curso e inscripción mediante eventos Kafka.

## Aporte realizado en esta sesión

- Revisé el flujo Saga existente del proyecto.
- Corregí el consumidor de Pago para filtrar los eventos académicos ajenos a la Saga antes de validar la orden.
- Añadí cinco pruebas unitarias; el módulo completó ocho pruebas sin fallos ni errores.
- Amplié el guion de pruebas con consultas PostgreSQL, verificación de logs y pausas para capturas.
- Ajusté el diagrama de estados a las transiciones implementadas.
- Ejecuté y documenté las pruebas de compra, duplicados, fallo y compensación.
- Reenvié el evento de compensación desde Kafka UI y comprobé que no produjo un segundo efecto.

## Resultados comprobados

| Caso | Resultado |
|---|---|
| Compra normal, orden 15 | APROBADA e inscripción sincronizada |
| Evento de compra repetido | Ignorado; una sola inscripción |
| Fallo de inscripción, orden 16 | Orden REEMBOLSADA y venta REVERTIDA |
| Compensación repetida desde Kafka UI | Ignorada; mismo movimiento de venta |
| Pruebas unitarias de Pago | 8 ejecutadas, 0 fallos y 0 errores |

## Evidencias

La documentación de S09 reúne el procedimiento, el diagrama de estados y las evidencias reales de las pruebas.

## Alcance

Esta entrega documenta el trabajo de la sesión S09 sobre KIDO. La plataforma y su Saga cuentan con avances previos del equipo.
