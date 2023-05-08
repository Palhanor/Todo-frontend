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
- Tirar o JWT do localStorage para os cookies (evitar XSS)

### Ferramentas

- Lembretes seriam tarefas sem data (apagada quando dão check mas tarefas normais caso recebam data)
- Lembretes devem ir para uma visualização propria chamada de lembretes
- Fazer atualizações automaticamente (quando virar o dia já atualizar as tarefas)
- Permitir reajustar a ordem das categorias e ordenar as tarefas de acordo com a ordem das categorias (foras tarefas realizadas por ordem de realização e tarefas importantes que vão para cima)
- Ordenar as tarefas realizadas de acordo com a ordem de realização (timestamp)
- Criar um sistema de lembrete, onde uma tarefa marcada como nota é apagada quando leva check
- Adicionar uma visualização de matedados da tarefas - numero de tentativas, quantidade de tempo focado (pomodoro), criação, modificação, check...
- Criar um sistema de metas de longo prazo (pode vincular as tarefas às metas)
- Adicionar notas para os dias que passaram, como uma impressão do dia
- Permitir criar planos anuais, mensais ou semanais, e vincular as tarefas a esses planos
- Permitir o compartilhamento de tarefas (apenas ler ou apenas editar)
- Permitir a criação de workplaces para que todas as tarefas marcadas com esse workplace sejam compartilhadas entre as pessoas que estão dentro do workplace em questão
- Adicionar um review geral dos dias, semanas, meses, trimestres e anos (taxa de sucesso, numero de tentativas e afins)
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

Lembretes
Rotinas

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
