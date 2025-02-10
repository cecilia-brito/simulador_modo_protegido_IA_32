# Simulador modo protegido IA-32

## Sumário

## Sobre o projeto

Este projeto foi desenvolvido como um trabalho para a matéria MATA48 - Arquitetura de computadores com o intuito de aperfeiçoar os conhecimentos dos alunos acerca do funcionamento de um microprocessador IA-32 em modo protegido.

## Ferramentas utilizadas

- [HTML](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
- [CSS](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
- [Javascript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)

## Manual do usuário

Se deseja simplesmente testar suas funcionalidades, acesse o [>site<](https://github.com/cecilia-brito/simulador_modo_protegido_IA_32).

### Interface

### Fluxo de execução

### Exemplos de instruções

#### Booleana

- *OR*

  A instrução "OR" faz a seguinte operação DEST = DEST OR SRC, sendo que a instrução OR assim como as outras é implementada utilizando um array de arrow functions que é percorrido pela função clock, dessa forma cada elemento/função do array de uma instrução é um passo. 
  A instrução OR é composta por 12 passos: o primeiro é responsável por validar a entrada verificando se a quantidade de operandos está correta; o segundo é responsável por calcular o endereço linear do opcode; o terceiro é responsável por acessar o endereço linear e mostrar o dado que está nele ao fim da instrução IP é incrementado em 4 unidades; o quarto é responsável por calcular o endereço linear do primeiro operando; o quinto é responsável por acessar o endereço linear do passo anterior e encontrar o endereço para o dado do operando, DI e SI são setados com o endereço acessado; o sexto passo é responsável por calcular o endereço linear do operando no segmento de dados; no sétimo passo o endereço linear calculado é utilizado para acessar o dado do primeiro operando e salvar o valor do registrador EAX; o quarto, o quinto, o sexto e o sétimo passos se repetem para o segundo operando seu valor é guardado em EBX; o décimo segundo é responsável por fazer a operação or entre os valores de EAX e EBX salvando o resultado em EAX e depois alterando o valor na RAM, por fim ele setará os flags pertinentes de acordo com o resultado.

#### Aritmética

- *ADD*

  A instrução ADD faz a seguinte operação: DEST = DEST + SRC e possui 12 passos. 

#### Comparação e teste

###### JCC

#### Movimento

###### PUSH

## Para desenvolvedores

Caso deseje instalar em sua própria máquina, siga os passos a seguir:

### Pré-requisitos

antes de baixar o projeto você vai precisar ter instalado na sua máquina as seguintes ferramentas:

- [Git](https://git-scm.com)
- Algum tipo de servidor web. Ex: [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- Ou, algum instalador de pacotes Como:
  - [npm](https://www.npmjs.com)
  - [yarn](https://yarnpkg.com)

### Em seguida

```bash
# Clone o repositório
$ git clone https://github.com/cecilia-brito/simulador_modo_protegido_IA_32.git

# Acesse a pasta do projeto
$ cd simulador_modo_protegido_IA_32

# Abra essa pasta em seu editor de texto favorito
$ code .

# Caso ainda não tenha, instale seu servidor web
$ npm install live-server
ou
$ yarn add live-server

# Por fim, execute o programa
$ live-server .

```

### Estrutura interna

Essa seção é voltada para o entendimento da estrutura e funcionamento interno do programa para desenvolvedores que desejam clonar o repositório e experimentar.

#### O objeto cpu

No início da [main.js](./main.js) é declarado o objeto cpu que conterá os dados mais importantes que serão usados pelas outras funções e instruções do programa.

As propriedades desse objeto são as seguintes:

- *geralRegister*:

Contém os registradores eax, ebx, ecx e edx, números de até 4 bytes. Eles servirão para armazenamento de dados entre as intruções do programa. Inicialmente se encontram vazios mas são inicializados ao final do arquivo. Para bom funcionamento do código, não se deve alterar diretamente os valores desses registradores pois seus valores estão ligados diretamente com dados apresentado na interface pelo usuário. Deve ser atualizado apenas através da função setVisualRegister que sera explicada mais a frente.

- *segmentRegister*:

Contém os registradores cs, ss e ds, números de até 2 bytes. Estes representarão as chaves de entrada na tabela de segmentos, outra propriedade da cpu. Eles devem ser alterados apenas pelo usuário já que não existem instruções que alterem diretamente o registrador de segmentos. Apesar disso, a função setVisualRegister consegue modificá-los para sua inicialização ao fim do arquivo.

- *offsetRegister*:

Contém os registradores ip, sp, bp, di e si, números de até 4 bytes. Eles servirão como "offset" ou "deslocamento" a partir da base de um certo segmento. Estes segmentos são obtidos através da tabela de segmentos acessada pelo seu respetivo registrador de segmento. Após somado o offset com a base de segmento, será encontrado o indice na ram que está o dado em questão. Como os dois anteriores, os registradores deste tipo podem ser modificado apenas através da função setVisualRegister e inicializados ao fim do arquivo.

- *ram*:

Um Array que guarda os dados que são armazenados na memória ram e são apresentados para o usuário na tabela rolável. Os dados presentes na ram também devem ser alterados através da função setVisualRegister

- *flag*:

Objeto que possui diversas propriedades booleanas que se referem ao estado do programa ao fim de uma dada instrução e são utilizados por funções específicas. Pode ser editado diretamente pois não aparece visualmente para o usuário.

- *segmentTable*:

Objeto cujas chaves são números de até 2 bytes, em especial os valores dos registradores de segmento. Essa tabela é representada na interface abaixo do input de código.
