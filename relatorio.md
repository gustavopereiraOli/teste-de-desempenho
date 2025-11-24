# Relatório de Teste de Desempenho

## Resumo Executivo

Com a API rodando localmente, foi possível executar os testes de desempenho. Os testes de smoke, carga e spike passaram com sucesso, atendendo aos critérios de SLA (p95 < 500ms e erros < 1%). No entanto, o teste de estresse revelou o ponto de ruptura da aplicação no endpoint CPU-bound (/checkout/crypto), onde a partir de certa carga, o servidor começou a recusar conexões, resultando em 98.94% de falhas.

Para cenários I/O-bound (/checkout/simple), a aplicação suportou até 300 usuários simultâneos com p95 de 298.39ms. Para cenários CPU-bound (/checkout/crypto), o ponto de ruptura foi identificado em torno de 200 usuários, onde o servidor não conseguiu mais processar as requisições devido à indisponibilidade.

## Evidências

### Teste de Smoke

- **Cenário**: Verificação básica de disponibilidade do endpoint /health.
- **Configuração**: 1 VU por 30 segundos.
- **Resultado**: 100% de sucesso (37016 requisições bem-sucedidas).
- **Razão**: Endpoint acessível e respondendo corretamente.

### Teste de Carga

- **Cenário**: Teste de carga para /checkout/simple com SLA de p95 < 500ms e erros < 1%.
- **Configuração**: Ramp up de 0-50 VUs em 1m, hold 50 por 2m, ramp down em 30s.
- **Resultado**: 100% de sucesso (39850 requisições bem-sucedidas), p95 = 296.81ms.
- **Razão**: Aplicação suportou a carga dentro dos limites de SLA.

### Teste de Estresse

- **Cenário**: Teste de estresse para /checkout/crypto para encontrar o ponto de ruptura.
- **Configuração**: Ramp up de 0-200 em 2m, 200-500 em 2m, 500-1000 em 2m.
- **Resultado**: 98.94% de falhas (198841 falhas de 200965 requisições).
- **Razão**: Servidor recusou conexões devido à sobrecarga no processamento CPU-bound.

### Teste de Spike

- **Cenário**: Teste de spike para /checkout/simple simulando venda relâmpago.
- **Configuração**: 10 VUs por 30s, ramp 10-300 em 10s, hold 300 por 1m, ramp down em 0s.
- **Resultado**: 100% de sucesso (94763 requisições bem-sucedidas), p95 = 298.39ms.
- **Razão**: Aplicação lidou bem com o pico de carga no endpoint I/O-bound.

## Prints dos Testes

- **Teste de Smoke**: prints/smoke/
- **Teste de Carga**: prints/load/
- **Teste de Estresse**: prints/stress/
- **Teste de Spike**: prints/spike/

## Análise de Estresse

O teste de estresse foi configurado para aumentar gradualmente a carga até 1000 VUs no endpoint /checkout/crypto. A aplicação começou a falhar quando a carga atingiu aproximadamente 200 VUs, com o servidor recusando conexões devido ao processamento intensivo de CPU. Não foi possível identificar o ponto de ruptura exato além disso, pois a maioria das requisições falhou.

Recomenda-se otimizar o processamento do endpoint /checkout/crypto, possivelmente através de melhorias no código, cache ou escalabilidade horizontal, para suportar cargas maiores.
