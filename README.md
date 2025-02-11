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

![Print do site. O site está divido em 4 seções sendo a principal um grande campo onde o usuário deve inserir seu código, abaixo do campo há 3 botões: set; end; auto. Abaixo dos botões há uma tabela que representa a tabela de descritores de segmento ao lado do campo de código estão os registradores gerais e de offeset e ao lado à direita há um espaço onde irá aparecer o fluxo de barramento e ao lado à direita há a memória ram que é representada por uma grande tabela de 2 campos: valor, endereço. Há um input acima da RAM para pesquisar seu conteúdo.](image.png)

### Fluxo de execução

![Print da interface destacando o fluxo de barramento. O texto escrito na seção de fluxo é:"bus dados
dados: 33333333→"](<WhatsApp Image 2025-02-10 at 21.48.12.jpeg>)

### Exemplos de instruções

  Todas instruções são implementadas utilizando um array de arrow functions que é percorrido pela função clock, dessa forma cada elemento/função do array de uma instrução é um passo. Por exemplo, a instrução OR tem 12 passos, ou seja, 12 funções dentro do array que será iterado pela função clock. No caso da instrução OR o primeiro passo é responsável por validar a entrada verificando se a quantidade de operandos está correta; o segundo é responsável por calcular o endereço linear do opcode ; o terceiro é responsável por acessar o endereço linear e mostrar o dado que está nele ao fim da instrução IP é incrementado em 4 unidades; o quarto é responsável por calcular o endereço linear do primeiro operando; o quinto é responsável por acessar o endereço linear do passo anterior e encontrar o endereço para o dado do operando, DI e SI são setados com o endereço acessado; o sexto passo é responsável por calcular o endereço linear do operando no segmento de dados; no sétimo passo o endereço linear calculado é utilizado para acessar o dado do primeiro operando e salvar o valor do registrador EAX; o quarto, o quinto, o sexto e o sétimo passos se repetem para o segundo operando seu valor é guardado em EBX; o décimo segundo é responsável por fazer a operação or entre os valores de EAX e EBX salvando o resultado em EAX e depois alterando o valor na RAM, por fim ele setará os flags pertinentes de acordo com o resultado. 

#### Booleana

- *AND*

  A instrução AND realiza a operação lógica bit a bit: DEST = DEST & SRC. Ela possui 12 passos e utiliza os registradores CS, DS, EDI, ESI, EPI, EAX e EBX, além de modificar o registrador EFLAG.
  
  ```assembly
  AND OP1, OP2;
  ```

- *OR*

  A instrução "OR" faz a seguinte operação DEST = DEST OR SRC, possui 12 passos e utiliza os registradores EAX, EBX, DS, EPI, EDI, ESI e CS. 

```assembly
  OR OP1, OP2;
  ```
- *XOR*
  
  Realiza a operação de "disjunção exclusiva" entre dois operandos, armazenando o resultado no primeiro operando.

  ```assembly
  XOR OP1, OP2;
  ```
- *NOT*
  A instrução NOT realiza a operação lógica bit a bit. Ela possui 8 passos e utiliza os registradores CS, DS, EDI, ESI, EPI, EAX, além de modificar o registrador EFLAG.
  ```assembly
  NOT OP;
  ```
#### Aritmética

- *ADD*

  A instrução ADD faz a seguinte operação: **DEST = DEST + SRC** e possui 12 passos. Ela utiliza os registradores CS, DS, EDI, ESI, EPI, EAX e EBX e também o registrador EFLAG.

  ```assembly
  ADD OP1, OP2;
  ```

  A instrução ADD faz a seguinte operação: DEST = DEST + SRC e possui 12 passos. Ela utiliza os registradores CS, DS, EDI, ESI, EPI, EAX e EBX e também o registrador EFLAG.

- *INC*

  A instrução INC incrementa o valor do operando em 1: DEST = DEST + 1. Ela possui 8 passos e utiliza os registradores CS, DS, EDI, ESI, EIP e EAX, além de modificar o registrador EFLAG.

  ``` assembly
  INC OP1;
  ```
- *NEG*

  A instrução NEG faz a seguinte operação: **DEST = -DEST** e possui 8 passos. Ela utiliza os registradores CS, DS, EDI, ESI, EIP e EAX, além de alterar o registrador EFLAG. O formato da instrução deve ser:

  ```assembly
  NEG OP1;
  ```
- *DEC*

  Seleciona um endereço de memória e diminui o valor armazenado em uma unidade.

  ```assembly
  DEC OP1;
  ```

- *MUL*

  Seleciona um endereço de memória e multiplica seu valor pelo valor armazenado em EAX, em seguida armazenando os bits menos significativos do resultado em EAX, enquanto os bits mais significativos são armazenados em EDX. Essa instrução afeta as flags de Overflow e de Carry.

   ```assembly
  MUL OP1, OP2;
  ```
- *SUB*

  A instrução SUB faz a seguinte operação: **DEST = DEST - SRC** e possui 12 passos. Ela utiliza os registradores CS, DS, EDI, ESI, EPI, EAX e EBX e também o registrador EFLAG.

  ```assembly
  ADD OP1, OP2;
  ```

#### Comparação e teste
- *CMP*

  A instrução CMP realiza o procedimento igual o procedimento `SUB`, entretando o mesmo não atualiza nenhum registrador, apenas altera as EFLAGS para ser usada no procedimento `JXX`.

  ```assembly
  CMP OP1, OP2
  ```
- *CALL*

  A instrução CALL realiza uma chamada para um procedimento e seta ip para o endereço informado na isntrução. Além disso, o endereço da instrução seguinte é armazanado no topo da pilha. O formato da instrução deve ser:

  ```assembly
  CALL OP1;
  ```

- *JCC*

  A instrução JCC - **JCC OFFSET** - analisa as flags e dependendo dos valores das flags e da condição testada salta para o endereço END mudando o valor do registrador IP. Utiliza os registradores CS e IP e possui 6 passos.

  ```assembly
  JCC OFFSET;
  ```

  Além disso existem 6 condições que podem ser testadas: 
  - JG - >
  - JGE - >=
  - JE - =
  - JNE -!=
  - JL - <
  - JLE - <=

- *JMP*

  A instrução JMP altera o fluxo de execução, definindo o registrador IP para um novo endereço sem verificar nenhuma condição. Ela possui 4 passos e utiliza os registradores CS e IP.

  ```assembly
  JMP OP1;
  ```

- *CALL*

  A instrução CALL realiza uma chamada para um procedimento e seta ip para o endereço informado na isntrução. Além disso, o endereço da instrução seguinte é armazanado no topo da pilha. O formato da instrução deve ser:

  ```assembly
  CALL OP1;
  ```

- *JCC*

  A instrução JCC - JCC END - analisa as flags e dependendo dos valores das flags e da condição testada salta para o endereço END. Utiliza os registradores CS e IP.

- *LOOP*

  A instrução LOOP checa o valor de ECX, caso ele seja não seja zero, realiará a operção ECX = ECX - 1 e será somado o atual valor de ip ao deslocamento informado pelo operando de 1 byte em complemento de 2. Caso ECX seja 0, o programa seguirá para a instrução seguinte. O formato da instrução deve ser:

  ```assembly
  LOOP XX; 
  ```

  com XX sendo um operando de um único byte.

- *RET*

  A instrução RET recupera o valor no topo da pilha e substitui ip por este valor. Caso a pilha esteja vazia haverá GPF. A instrução deve seguir o seguinte formato:

  ```assembly
  RET;
  ```

#### Movimento

- *MOV*

  A instrução MOV copia o valor da origem para o destino sem modificar flags: DEST = SRC. Ela possui 10 passos e utiliza os registradores CS, DS, EDI, ESI, EPI, EAX e EBX.

  ```assembly
  MOV OP1, OP2;
  ```

- *HLT*

  Realiza a parada da execução. A instrução deve seguir o seguinte formato:

  ```assembly
  HLT;
  ```

- *PUSH*

  A instrução PUSH - PUSH END - decrementa 4 unidades do valor guardado no registrador ESP e coloca o valor do endereço END no topo da pilha. Utiliza os registradores ESP, EEPI, CS, DS, EESI, EEEDI,

  ```assembly
  PUSH OP;
  ```
- *XCHG*

  Troca os valores armazenados entre dois endereços de memória.

  ```assembly
  PUSH OP1, OP2;
  ```
- *POP*

  A instrução POP - `POP END` - incrementa 4 unidades do valor guardado no registrador ESP e coloca o valor guardado no topo da pilha para o DST. Utiliza os registradores ESP, EEPI, CS, DS, EESI, EEEDI,

  ```
  POP OP1;
  ```

## Para desenvolvedores

Caso deseje instalar o programa em sua própria máquina, siga os passos a seguir:

### Pré-requisitos

antes de baixar o projeto você vai precisar ter instalado na sua máquina as seguintes ferramentas:

- [Git](https://git-scm.com)
- Algum tipo de servidor web. Ex: [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
- Ou, algum instalador de pacotes Como:
  - [npm](https://www.npmjs.com)
  - [yarn](https://yarnpkg.com)

### Em seguida

em um terminal localizado na pasta onde se deseja baixar o repositório.

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

  Contém os registradores EAX, EBX, ECX e EDX, números de até 4 bytes. Eles servirão para armazenamento de dados entre as intruções do programa. Inicialmente se encontram vazios mas são inicializados ao final do arquivo. Para bom funcionamento do código, não se deve alterar diretamente os valores desses registradores pois seus valores estão ligados diretamente com dados apresentado na interface pelo usuário. Deve ser atualizado apenas através da função setVisualRegister que sera explicada mais a frente.

- *segmentRegister*:

  Contém os registradores CS, SS e DS, números de até 2 bytes. Estes representarão as chaves de entrada na tabela de segmentos, outra propriedade da cpu. Eles devem ser alterados apenas pelo usuário já que não existem instruções que alterem diretamente o registrador de segmentos. Apesar disso, a função setVisualRegister consegue modificá-los para sua inicialização ao fim do arquivo.

- *offsetRegister*:

  Contém os registradores EPI, ESP, EBP, EDI e ESI, números de até 4 bytes. Eles servirão como "offset" ou "deslocamento" a partir da base de um certo segmento. Estes segmentos são obtidos através da tabela de segmentos acessada pelo seu respetivo registrador de segmento. Após somado o offset com a base de segmento, será encontrado o indice na ram que está o dado em questão. Como os dois anteriores, os registradores deste tipo podem ser modificado apenas através da função setVisualRegister e inicializados ao fim do arquivo.

- *ram*:

  Um Array que guarda os dados que são armazenados na memória ram e são apresentados para o usuário na tabela rolável. Os dados presentes na ram também devem ser alterados através da função setVisualRegister e são números de 1 byte ou strings.

- *flag*:

  Objeto que possui diversas propriedades booleanas que se referem ao estado do programa ao fim de uma dada instrução e são utilizados por funções específicas. Pode ser editado diretamente pois não aparece visualmente para o usuário.

- *segmentTable*:

  Objeto cujas chaves são números de até 2 bytes, em especial os valores dos registradores de segmento. Essa tabela é representada na interface abaixo do input de código. Onde podem ser adicionados novos seletores e atualizados aqueles já existentes.

  Cada elemento é um objeto com as propriedades base, limit e access. Está consiste de um número de 0 a 3, enquanto aquelas serão números de 0 até o limite da ram. Com isso é formado um segmento. Os segmentos não podem possuir intersecções.

- *controlUnity*:

  Objeto que armazená todos os dados relevantes para execução do código e controle de fluxo. Possui 4 propriedades que são extensivamente usadas pelas funções start e clock que serão explicadas a frente.

  A primeira propriedade da unidade de controle é "instruction", cujo valor é o nome da instrução sendo executada atualmente pelo programa. A segunda propriedade é "step", um número referente ao passo interno da instrução. A terceira propriedade é "line", uma array de string, com tamanho variando de 1 à 3, seguindo padrão: [operação, operando, operando]. A quarta e ultima propriedade é "code", um objeto cujas chaves são o endereço físico na memória de uma dada linha de código seguindo o formato da propriedade line.

#### As funções de intermediação

Essa funções são responsáveis por fazer intermédio entre as ações lógicas do código e a interface. Todas as instruções tem acesso apenas a essa funções para representa o fluxo das instruções.

- *setVisualRegister*:

  Função responsável por modificar valores da cpu que possuem representação visual na interface. A função recebem como parâmetros o tipo de registrador a ser atualizado, o nome do registrador, o valor a ser inserido e uma string de identificação opcional para tamanho do dado podendo ser "word" ou "single".

  O tipo de dado pode ser "geral", "segment", "offset" ou "ram". Nos três primeiros casos o nome do registrador deverá ser o nome de uma de suas propriedades na cpu enquanto no último será o indice do registrador na ram. Assim que chamada, a função atualizará o valor da propriedade adequada dentro do objeto cpu e seu respectivo valor na interface convertido para hecadecimal com a quantidade adequada de bytes.

- *cpuXram*:

  Função responsável por alterar o texto que se apresenta entre os registradores e a ram, representando os barramentos utilizados pelo programa. Ela recebe como parâmetros, desc, um texto que descreve o que acontece entre os barramentos, type, podendo ser "request", ou "get" ou "", representando a direção ou falta dela em que o barramento opera. O terceiro parâmetro, data, é o indice da ram como número. E, por fim, o parâmetro opcional dataType que pode ser "single" para representar um único registrador da ram.

- *getLinearAddress*:

  Função responsável por calcular o endereço linear representado por um certo registrador de offset. Recebe o nome desse offset como string, calcula a soma do endereço base do segmento adequado e checa se houve gpf. Caso aconteça gpf, o programa é terminado e é informado ao usuário.

#### As funções de fluxo

- *start*:

  Essa é a função que muda o programa para sua fase de "execução". Para isso, ela checa a validade das linhas e registradores, mudando os valores da unidade de controle de acordo. Caso o código ou registradores estejam preenchido de maneira inválida, o programa será impedido de mudar para essa próxima fase.

  Com essa operação sendo concluída, o programa passará para a etapa de "execução" melhor descrita no manual do usuário.

- *clock*:

  Na etapa de "execução", o botão start troca de nome para tick/tock e passa a executar os passos do programa. A forma com as instruções são executadas depende do "passo", step, registrado na unidade de controle e sera explicada em mais detalhe abaixo:

  Primeiramente, se checa a primeira instrução, que foi guardada na propriedade line na unidade de controle por start. Então é executada a instrução com este nome no passo atual do programa e seu retorno é guardado. Caso o retorno seja um valor verdadeiro, será considera a instrução como concluida e será adiquirida a nova instrução através de ip. O programa para em caso de erro, seja erro intencional com código de parada, ou erro de execução.

- *end*:

  Essa instrução restaura os inputs para serem editáveis novamente e volta para a etapa de "configuração".

- *auto*:

  torna o uso da função clock repetido a cada segmento de tempo.

#### Funções menores

Abaixo das declarações das funções citadas acima estão funções menores usadas por elas para realizar operações que serão repetidas entre funções. Também são declaradas funções de "handle" para eventos disparados pelo usuário ao interagir com a interface.