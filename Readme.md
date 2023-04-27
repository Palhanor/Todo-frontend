## EXCLUSÃO

- Adicionar sistema de tarefas excluidas
- Recuperar tarefas excluidas
- Apagar as tarefas excluidas
- Apagar todas as tarefas excluidas

## DATA E HORA

- Permitir tarefa sem data - colocar um x para resetar o state e data_final deve ser NULL
- Jogar tarefas sem data em uma visualização distinta (desmarcada)
- Permitir adicionar as horas - mudar database (datetime), inputs (datetime-local) e tratamento de data no sistema

## AVANÇADOS

- Adicionar os numeros das categorias e mudar para o campo de edicao no hover
- Fazer validacao de dados (senha)
- Verificar o logout no backend (?)
- Adicinar outras opcoes de login (Google)
- Fazer CRUD de tarefas usando Models com Sequelize, ORM ou Prisma
- Adicionar o Redux para fazer o tratamento de estados de forma global e centralizada
- Filtro por intervalo de dias - precisa de uma nova interface de selecão
- Criar sistemas de ordenamento de tarefas (titulo, data - mais antiga ou mais nova)
- Implementar lazy load nas tarefas que estão mais para o futuro
- Otimizar o sistema de atualização automática na edição das notas
- Dentro das configurações permitir apagar todas as tarefas de uma determinada categoria (e todas as tarefas no geral)
- Se marcar check na atividade atrasada ela entra omo perdida no dia que estava agendada e realizada no dia que foi checkada
- Se remarcar depois de ter vencido tambem vai para tarefas perdidas dentro do historico
- Adicionar um sistema de desistência (você remarca a atividade e deixa a atrasada como desistida)
- Adicionar um campo que pega o momento que a atividade recebeu o check
- Permitir que um usuário veja ou edite as tarefas do outro - Compartilhar tarefa, categorias ou tudo...
- Criar rotinas (habitos) - diario, range, repetido na semana, repetido no mes, personalizado...
- Sistema de seleção multipla de tarefas
- Criar sub tarefas dentro das tarefas
- Drag and drop entre tarefas

## Organização das visualizações

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
