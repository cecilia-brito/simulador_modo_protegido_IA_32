import add from "./modules/arithmetic/add.js";
import dec from "./modules/arithmetic/dec.js";
import inc from "./modules/arithmetic/inc.js";
import mul from "./modules/arithmetic/mul.js";
import neg from "./modules/arithmetic/neg.js";
import sub from "./modules/arithmetic/sub.js";
import and from "./modules/boolean/and.js";
import not from "./modules/boolean/not.js";
import or from "./modules/boolean/or.js";
import xor from "./modules/boolean/xor.js";
import call from "./modules/compare_test/call.js";
import cmp from "./modules/compare_test/cmp.js";
import iret from "./modules/compare_test/iret.js";
import jmp from "./modules/compare_test/jmp.js";
import jxx from "./modules/compare_test/jxx.js";
import loop from "./modules/compare_test/loop.js";
import ret from "./modules/compare_test/ret.js";
import hlt from "./modules/moves/hlt.js";
import mov from "./modules/moves/mov.js";
import pop from "./modules/moves/pop.js";
import push from "./modules/moves/push.js";
import xchg from "./modules/moves/xchg.js";

// Criação de um objeto com todas as referências de instruções para acesso dinâmico
const instructionList = {
    add,
    dec,
    inc,
    mul,
    neg,
    sub,
    and,
    not,
    or,
    xor,
    call,
    cmp,
    iret,
    jmp,
    jxx,
    loop,
    ret,
    hlt,
    mov,
    pop,
    push,
    xchg,
    algo:[(line)=>line],
};

// Criação do objeto 
const cpu = {
    geralRegister: {},
    offsetRegister: {},
    segmentRegister: {},
    flag: {
        zero: false,
        carry: false,
        overflow: false,
        sign: false,
        parity: false,
        auxiliary: false,
        direction: false,
        trap: false,
        interrupt: false,
        privilage: false,
        nested: false,
        resume: false,
        virtual: false,
        alignment: false,
        virtualInterrupt: false,
        pending: false,
        id: false,
    },
    controlUnity:{
        instruction: "",
        step: 0,
        code: [],
        line: [],
    },
    segmentTable:{
        1:{
            base:0x0000,
            limit:0x00FF,
            access:0b11,
        },
        2:{
            base:0x100,
            limit:0x1FF,
            access:0b11,
        },
        3:{
            base:0x200,
            limit:0x2FF,
            access:0b11,
        },
    },
    ram: Array.apply(null, Array(0xFFF)).map(()=>0),
};

// Guardando a referência de elementos importantes do html
const clockButton = document.getElementById("clock"); //botão start/tick/tock
const codeInput = document.getElementById("code"); //local onde o usuário escreve o código
const ramTable = document.getElementById("ram"); //tabela de registradores da ram
const busText = document.getElementById("bus-text"); //texto descrevendo a atividade no barramento
const busArrow = document.getElementById("bus-arrow"); //seta para o lado que as informações passam pelo barramento
const searchRamForm = document.getElementById("search-ram-form"); //formulário para busca de posição na ram
const segmentForm = document.getElementById("segment-form"); //elemento formulário de segmentos
const segmentTable = document.getElementById("segment-table"); //tabela de segmentos
const setTableButton = document.getElementById("set-table-button"); //botão que define os novos valores da tabela
const segmentSelectors = document.querySelectorAll("input.segment-selector"); //Lista com os elementos que representam os seletores de segmento

// Função responsável por alterar os valores dos registradores cujo valor é apresentado ao usuário.
function setVisualRegister(type, register, value, amount="word"){
    if(type === "ram"){
        if(amount==="word"){
            for(let i = 0; i < 4; i++){
                if(typeof value === "number"){
                    console.log(value);
                    const resto = (value>>>0)%(0x100);
                    cpu.ram[register+i] = resto;
                    document.getElementById(`ram-${register+i}`).value = (resto>>>0).toString(16).padStart(2,"0");
                    value = value >>> 8;
                }else{
                    cpu.ram[register+i] = value;
                    document.getElementById(`ram-${register+i}`).value = value;
                }
            }
        }else if(amount==="single"){
            document.getElementById(`ram-${register}`).value = value.toString(16).padStart(2,"0");
            cpu.ram[register] = value;
        }
        searchRam((register+3).toString(16));  
    }else{
        let valueTo16 = (value>>>0).toString(16);
        cpu[type+"Register"][register] = value;
        valueTo16 = valueTo16.padStart(type==="segment"?4:8, '0');
        document.getElementById(register)[type==="segment"?"value":"textContent"] = valueTo16;
    }
};

// Função responsável por alterar visualmente a área entre os dados do registradores e a tabela da ram.
function cpuXram(desc, type, data){
    busText.innerHTML = desc;
    switch(type){
        case "request":
            busArrow.innerHTML = "&#x2192"; //seta pra direita
            break;
        case "get":
            busArrow.innerHTML = "&#x2190"; //seta pra esquerda
            break;
        default:
            busArrow.innerHTML = "&#x2B1A"; //quadrado pontilhado(sujeito a mudança)
            break;
    };
    if(data){
        searchRam(data.toString(16));
    };
};

//
function getLinearAddress(offset){
    let gpf = false;
    let message = "Programa terminado devido a falha de proteção geral no segmento de ";
    let segment;
    const offsetValue = cpu.offsetRegister[offset];
    switch(offset){
        case "ip":
            segment = cpu.segmentTable[cpu.segmentRegister.cs];
            message += "código";
        break;
        case "sp":
            segment = cpu.segmentTable[cpu.segmentRegister.ss];
            message += "pilha";
        break;
        case "bp":
            segment = cpu.segmentTable[cpu.segmentRegister.ss];
            message += "pilha";
            break;
        case "si":
            segment = cpu.segmentTable[cpu.segmentRegister.ds];
            message += "dados";
            break;
        case "di":
            segment = cpu.segmentTable[cpu.segmentRegister.ds];
            message += "dados";
        break;
    }
    const sum = segment.base+offsetValue;
    gpf = sum>segment.limit;
    if(gpf){
        throw new Error(message+ `. Programa tentou acessar valor em ${sum.toString(16).padStart(8,"0")}, porém o limite é ${segment.limit.toString(16).padStart(8,"0")}`);
    };
    return sum;
}

async function start(){
    // Essa parte será nosso "assembler". Aqui será checada cada linha do código para conferir se ela é válida.
    try{
        cpuXram("","",0);
        Object.keys(cpu.segmentRegister).forEach(val=>{
            if(!Object.keys(cpu.segmentTable).includes(cpu.segmentRegister[val].toString())){
                throw new Error(val);
            };
        });
        codeInput.contentEditable = false;
        setTableButton.disabled = true;
        const lineList = {}
        const base = cpu.segmentTable[cpu.segmentRegister.cs].base;
        codeInput.textContent.split("\n").reduce((prev,singleLine,i)=>{
            const validLine = checkLine(singleLine);
            if(validLine){
                const size =validLine.reduce((ant, str, i)=>{
                    setVisualRegister(
                        "ram",
                        prev+ant,
                        i===0?str:parseInt(str,16),
                        i===0||str.length===2   ?"word":"single"
                    );
                    return ant+(i>0&&str.length===2?1:4);
                }, 0);
                lineList[prev] = {
                    number:i,
                    line:validLine
                };
                return prev+size;
            };
            //TODO: mudar o loop para que não seja necessário pará-lo dessa forma
            console.log(singleLine);
            throw new Error(i+1);
        }, base);
        await changeRamEdit(false);
        //lineList será o objeto com todas as linhas selecionadas por sua posição na memória.
        cpu.controlUnity.code = lineList;
        //na posição 0, estará a primeira linha. Ela será um objeto com o número da linha e a array linha em si.
        cpu.controlUnity.line = lineList[0].line;
        //Essa será a instrução (primeiro elemento da linha), da primeira linha.
        cpu.controlUnity.instruction = lineList[0].line[0];
        cpu.controlUnity.step = 1;
        setVisualRegister("offset", "ip", 0);
        const ss = cpu.segmentRegister.ss;
        const stackSegment = cpu.segmentTable[ss];
        let spValue = stackSegment.limit - stackSegment.base;
        setVisualRegister("offset", "sp", spValue);
        setVisualRegister("offset", "bp", spValue);
        return true;
    }catch(e){
        codeInput.contentEditable = true;
        setTableButton.disabled = false;
        const cause = e.message;
        if(!isNaN(parseInt(cause))){
            alert(`Código inadequado na linha ${cause}`);
        }else if(Object.keys(cpu.segmentRegister).includes(cause)){
            alert(`Seletor de segmento ${cause} não aponta para nenhum segmento válido`);
        }else{
            alert(`Erro encontrado: ${e.message}`);
        };
        return false;
    };
};

//Função para avançar em um ciclo de clock ou iniciar o programa.
async function clock(){
    try{
        //TODO: mudar o que quer que seja isso aqui
        if(clockButton.textContent.includes("start")){
            const result = await start(); 
            if(result)clockButton.textContent = "tick";
            return;
        }
        const control = cpu.controlUnity;
        let instructionResult = instructionList
            [control.instruction][control.step]
            (setVisualRegister, cpuXram, getLinearAddress, cpu);
        clockButton.textContent = clockButton.textContent == "tick"? "tock":"tick";
        if(instructionResult){
            control.line = control.code[getLinearAddress("ip")].line;
            control.instruction = control.line[0];
            control.step = 1;
        }else{cpu.controlUnity.step++};
    }catch(e){
        end();
        if(e.message !== "hlt"){
            alert(e.message);
            console.error(e);
        }else{
            cpuXram("","",0);
            alert("Execução terminada com sucesso");
        }
    };
};
clockButton.onclick = clock;

async function end(){
    await changeRamEdit(true);
    codeInput.contentEditable = true;
    setTableButton.disabled = false;
    clockButton.textContent = "start";
    cpu.controlUnity = {
        instruction: "",
        step: 0,
        code: [],
        line: [],
    };
};
document.getElementById("click").onclick = end;

//Torna a Ram ineditável durante a execução
async function changeRamEdit(edit){
    return Promise.resolve().then(()=>{
        let num = cpu.ram.length;
        for(let i = 0; i < num; i++){document.getElementById(`ram-${i}`).disabled = !edit;}
    });
};

//scrolla a tela até a posição informada da ram estar visível.
function searchRam(input){
    const input16 = parseInt(input, 16);
    if(input16 !== NaN && input16 < cpu.ram.length){
        input = input16;
        document.getElementById(`ram-${input16}`).scrollIntoView();
    }else{
        alert("Endereço inválido");
        return;
    }
};
searchRamForm.lastElementChild.onclick = e=>{
    e.preventDefault();
    let input = searchRamForm.firstElementChild.value;
    input = input.includes("10x")?
        parseInt(input.slice(3)).toString(16):
        input.includes("2x")?
        parseInt(input.slice(2), 2).toString(16):
        input;
    searchRam(input);
};

const hexadecimalRegex4 = /^[0-9a-fA-F]{4}$/
function segmentSelectorEdit(e, name){
    const target = e.target;
    if(hexadecimalRegex4.test(target.value)){
        const index = parseInt(target.value,16);
        const isSelector = Object.keys(cpu.segmentTable).includes(index.toString(10));
        const isUnique = !Object.keys(cpu.segmentRegister)
        .filter(val=>val!==name)
        .map(val=>cpu.segmentRegister[val])
        .includes(index);
        if(isSelector && isUnique){
            setVisualRegister("segment", name, index);
            return;
        }
    }
    target.value = cpu.segmentRegister[name].toString(16).padStart(4, "0");
}
segmentSelectors.forEach((val, i)=>{
    const name = [
        "cs",
        "ds",
        "ss"
    ][i];
    val.onchange = e=>segmentSelectorEdit(e,name);
})

//Função para setar valores na tabela de segmentos
function setTableData(data, obj){
    const [selection, base, limit, access] = data;
    obj[parseInt(selection,16)] = {
        base: parseInt(base,16),
        limit: parseInt(limit,16),
        access: parseInt(access, 10)
    };
};
segmentForm.onsubmit = e=>{
    e.preventDefault();
    const formRef = e.target;
    if(segmentForm.checkValidity()){
        let validTable = true;
        const selectors = new Set();
        let len = 0;
        for(let i = 0; i < formRef.length-1; i += 4){
            selectors.add(formRef[i].value);
            len++;
            if(parseInt(formRef[i+1].value,16) >= parseInt(formRef[i+2].value,16)){
                formRef[i+2].setCustomValidity("O endereço limite deve ser maior que o endereço base.");
                validTable = false;
            }else if(parseInt(formRef[i+1].value,16)>=cpu.ram.length){
                formRef[i+1].setCustomValidity("O endereço deve ser menor que o maior índice da ram.");
                validTable = false;
            }else if(parseInt(formRef[i+2].value,16)>=cpu.ram.length){
                formRef[i+2].setCustomValidity("O endereço deve ser menor que o maior índice da ram.");
                validTable = false;
            }else if((i>2 && parseInt(formRef[i+1].value, 16) !== parseInt(formRef[i-2].value, 16)+1)){
                formRef[i+1].setCustomValidity("O endereço base de um segmento deve ser imediatamente após o seu anterior.");
                validTable = false;
            }
        }
        if(validTable && selectors.size === len){
            const obj = {};
            for(let i = 0; i < formRef.length-1; i += 4){
                setTableData([formRef[i].value, formRef[i+1].value, formRef[i+2].value, formRef[i+3].value], obj);
            }
            cpu.segmentTable = obj; 
            console.log(cpu.segmentTable)
            return
        }
    };
    segmentForm.reportValidity();
    for(let i = 0; i < formRef.length-1; i++){
        formRef[i].setCustomValidity("")
    }
};

//Função para checar a alteração na ram
const hexadecimalRegex = /^[0-9a-fA-F]{2}$/
function ramEdit(e){
    const target = e.target;
    const i = target.id.slice(4);
    if(!hexadecimalRegex.test(target.value)){
        target.value = '0'.repeat(Math.max(0,2-cpu.ram[i].toString(16).length))+cpu.ram[i].toString(16);
    }else{
        cpu.ram[i] = parseInt(target.value, 16);
    }
}

//funções utilitárias
//Aqui será feita checagem de uma singular linha.
const codeLineRegex = /^(\w+)[\s^\n]*(( ([0-9a-fA-F]{2,8}|e[abcd]x|#[0-9]+)[\s^\n]*((,[\s^\n]+([0-9a-fA-F]{8}|e[abcd]x|#[0-9]+)[\s^\n]*(;.*)?)|(;.*))?)|(;.*))?$/gi;
function checkLine(line){
    let lineMatch = [...line.matchAll(codeLineRegex)];
    if(lineMatch.length && instructionList[lineMatch[0][1].toLowerCase()]){
        lineMatch = lineMatch[0];
        lineMatch = [lineMatch[1].toLowerCase(), lineMatch[4], lineMatch[7]];
        return instructionList[lineMatch[0]][0](lineMatch);
    }else if(line==="")return[];
}

// Inicializando alguns registradores
setVisualRegister("geral", "eax", 81);
setVisualRegister("geral", "ebx", 0);
setVisualRegister("geral", "ecx", 15);
setVisualRegister("geral", "edx", 4239);

setVisualRegister("segment", "cs", 1);
setVisualRegister("segment", "ds", 2);
setVisualRegister("segment", "ss", 3);

setVisualRegister("offset", "ip", 100);
setVisualRegister("offset", "sp", 563);
setVisualRegister("offset", "bp", 435);
setVisualRegister("offset", "si", 233);
setVisualRegister("offset", "di", 100);


document.addEventListener("DOMContentLoaded", function() {
    clockButton.disabled = true;
    (async()=>(
        Promise.resolve().then(()=>{
            let num = cpu.ram.length;
            for(let i = 0; i < num; i++){
                const newLi = document.createElement("li");
                newLi.classList.add("box");
                newLi.classList.add("ram-item");

                const newLiSpan = document.createElement("span");
                newLiSpan.textContent = '0'.repeat(Math.max(0,8-i.toString(16).length))+i.toString(16);
                newLiSpan.classList.add("box");
                newLiSpan.classList.add("ram-desc");
                newLi.appendChild(newLiSpan);

                const newLiInput = document.createElement("input");
                newLiInput.id = `ram-${i}`;
                newLiInput.classList.add("ram-input");
                newLiInput.value = '0'.repeat(Math.max(0,2-cpu.ram[i].toString(16).length))+cpu.ram[i].toString(16);
                newLiInput.type = "text";
                newLiInput.pattern = "#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?";
                newLiInput.onchange = ramEdit;
                newLi.appendChild(newLiInput);

                ramTable.insertBefore(newLi, ramTable.firstChild);
            }
            document.getElementById("ram-0").scrollIntoView();
        })
    ))().then(()=>clockButton.disabled = false);
}, false);