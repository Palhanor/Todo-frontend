## DATA E HORA

- Permitir tarefa sem data - colocar um x para resetar o state e data_final deve ser NULL
- Modificar o nome da tabela para data_realizaco
- Jogar tarefas sem data em uma visualização distinta (desmarcada)
- Permitir adicionar as horas - mudar database (datetime), inputs (datetime-local) e tratamento de data no sistema

## AVANÇADOS

### Backend

- Fazer CRUD de tarefas usando Models com Sequelize, ORM ou Prisma
- Fazer validacao de dados (senha)
- Adicinar outras opcoes de login (Google)
- Adicionar um campo que pega o momento que a atividade recebeu o check
- Adicionar campos de criação e modificação em todas as tabelas
- Implementar lazy load nas tarefas que estão mais para o futuro (atuais) ou passado (historico) - passar uma querie para a API

### Frontend

- Fazer os ajustes de performance - atualizaçao de estado, funções, requisições (useMemo, useCallback e afins)
- Adicionar os numeros das categorias e mudar para o campo de edicao no hover
- Fazer validacao de dados (senha)
- Utilizar o Axios para fazer as conexões com a API do sistema
- Filtro por intervalo de dias - precisa de uma nova interface de selecão

### Ferramentas

- Criar um sistema de metas de longo prazo (pode vincular as tarefas às metas)
- Otimizar o sistema de atualização automática na edição das notas (titulo e descrição)
- Configurações de usuário: permitir apagar todas as tarefas de uma categoria
- Permitir que um usuário veja ou edite as tarefas do outro - Compartilhar tarefa, categorias ou tudo...
- Criar rotinas (habitos) - diario, range, repetido na semana, repetido no mes, personalizado...
- Sistema de seleção multipla de tarefas (para apagar ou editar)
- Criar sub tarefas dentro das tarefas
- Drag and drop parar ajustar a ordem de tarefas
- Drag and drop parar ajustar a ordem de categorias
- Adicionar um sistema de relatório de sucesso diário, semanal, mensal e anual
- Adicionar um campo de notas para adicionar uma impressão para os dias que passaram (consolidados), como um diário

### OUTROS

Atuais
Atrsadas

Realiadas
Perdidas
Historico (realizadas e perdidas)

Excluidas
// Adicionar sistema de tarefas excluidas
// Recuperar tarefas excluidas
// Apagar as tarefas excluidas
// Apagar todas as tarefas excluidas

Remarcar - quando muda a data de uma tarefa que já está atrasada ela fica como perida no dia que devia ser feita e vai para o dia que foi remarcada
Check - Quando marca uma atrasada ela vai pra o dia que foi marcada e fica como perdida no dia que devia ter sido feita
E se uma atividade dada como perdida for reagendada? deve bloquear reagendamento? deve remover de perdida caso seja par ao futuro?
Alem de um campo de perdido, deve ter um campo de tentativas (que eh incrementado a cada nova falha)
Deve ainda permitir desistir explicitamente de uma tarefa (atrasada ou futura)

data - passada, futura, sem
realizada - sim, nao
excluida - sim, nao
e a desistencia?
...
atuais - futura
desmarcadas - sem data
excluidas - escluida
atrasadas - passadas & nao feitas
historico - passadas & feitas | nao feita
realizadas - passadas | futuras | sem & feitas
