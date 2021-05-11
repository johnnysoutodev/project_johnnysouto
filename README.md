# project_johnnysouto
Projeto do Web Site https://www.johnnysouto.com.br
 
## Framework utilizado
 
Neste projeto foi utilizado o [Materialize](https://materializecss.com) para realizar o design.

## Automatização de tarefas

Neste projeto foi utilizado o [Grunt](https://gruntjs.com) como gerenciador de tarefas com os seguintes plug-ins:

- grunt-contrib-clean
- grunt-contrib-concat
- grunt-contrib-copy
- grunt-contrib-cssmin
- grunt-contrib-uglify
- grunt-contrib-watch
- grunt-image

## Iniciando a utilização

Antes de iniciar a utilização deste projeto, rode o comando **`$npm install`** para instalar as dependencias e assim poder utilizar as tasks descritas abaixo.

## Tarefas para se trabalhar neste projeto

- **`$grunt compile`** - Com esta task você vai ajustar os arquivos e diretorios iniciais para iniciar o projeto
- **`$grunt watch`** - Com a task grunt watch, você pode ir trabalhando nos arquivos de html, css e javascript, nesta tarefa é realizada todo o trabalho de minificação e otimizando de imagens do projeto.
- **`$grunt publish`** - Com a task grunt publish, você prepara o diretorio /public/ para reazlizar o deploy do projeto.
