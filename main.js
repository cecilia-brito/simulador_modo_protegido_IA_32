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
import xcgh from "./modules/moves/xcgh.js";

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
    xcgh,
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
            limit:0x0FFF,
            access:0b11,
        },
        2:{
            base:0x1000,
            limit:0x1FFF,
            access:0b11,
        },
        3:{
            base:0x2000,
            limit:0x2FFF,
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

// Função responsável por alterar os valores dos registradores cujo valor é apresentado ao usuário.
function setVisualRegister(type, register, value){
    if(type === "ram"){
        cpu.ram[register] = value;
        for(let i = 0; i < 4; i++){
            const resto = value%(16*16);
            document.getElementById(`ram-${register}`).value = '0'.repeat(Math.max(0,2-resto.toString(16).length))+resto.toString(16);
            value = value >> 8;
        }
        searchRam((register+3).toString(16));
        
    }else{
        let valueTo16 = value.toString(16);
        cpu[type+"Register"][register] = value;
        valueTo16 = '0'.repeat(Math.max(0,(type==="segment"?4:8)-valueTo16.length))+valueTo16;
        document.getElementById(register).textContent = valueTo16;
    }
};

// Função responsável por alterar visualmente a área entre os dados do registradores e a tabela da ram.
function cpuXram(desc, type, data){
    busText.textContent = desc;
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
        searchRam(data);
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
        throw new Error(message+ `. Programa tentou acessar valor em ${sum}, porém o limite é ${segment.limit}`);
    };
    return sum;
}

async function start(){
    // Essa parte será nosso "assembler". Aqui será checada cada linha do código para conferir se ela é válida.
    try{
        codeInput.contentEditable = false;
        setTableButton.disabled = true;
        const lineList = {}
        codeInput.textContent.split("\n").reduce((prev,singleLine,i)=>{
            const validLine = checkLine(singleLine);
            if(validLine){
                lineList[prev] = {
                    number:i,
                    line:validLine
                };
                return prev+4*validLine.length;
            };
            //TODO: mudar o loop para que não seja necessário pará-lo dessa forma
            console.log(singleLine);
            throw new Error(i);
        }, 0)
        await changeRamEdit(false);
        cpu.controlUnity.code = lineList;
        cpu.controlUnity.line = lineList[0].line;
        cpu.controlUnity.instruction = lineList[0].line[0];
        setVisualRegister("offset", "ip", 0);
        const ss = cpu.segmentRegister.ss;
        const stackSegment = cpu.segmentTable[ss];
        console.log(cpu)
        let spValue = stackSegment.limit - stackSegment.base;
        setVisualRegister("offset", "sp", spValue);
        setVisualRegister("offset", "bp", spValue);
        return true;
    }catch(e){
        console.log(e);
        codeInput.contentEditable = true;
        setTableButton.disabled = false;
        alert(`Código inadequado na linha ${e.message}`);
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
        if(control.instruction === "hlt"){
            end();
            return;
        }
        let instructionResult = instructionList
            [control.instruction][control.step]
            (setVisualRegister, cpuXram, getLinearAddress, cpu);
        clockButton.textContent = clockButton.textContent == "tick"? "tock":"tick";
        if(instructionResult){
            control.line = control.code[cpu.offsetRegister.ip];
            control.instruction = control.line[0];
            control.step = 1;
        }else{cpu.controlUnity.step++};
    }catch(e){
        end();
        alert(e.message);
        console.error(e);
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
    }
    cpuXram("", "", 0);
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


//Função para setar valores na tabela de segmentos
function setTableData(data){
    const [selection, base, limit, access] = data;
    cpu.segmentTable[parseInt(selection,16)] = {
        base: parseInt(base,16),
        limit: parseInt(limit,16),
        access: parseInt(access, 10)
    };
};
segmentForm.onsubmit = e=>{
    e.preventDefault();
    console.log(e);
    const formRef = e.target;
    if(segmentForm.checkValidity()){
        for(let i = 0; i < formRef.length-1; i += 4){
            setTableData([formRef[i].value, formRef[i+1].value, formRef[i+2].value, formRef[i+3].value])
        }
        console.log(cpu.segmentTable)
    }else{
        segmentForm.reportValidity();
    };
};

const hexadecimalRegex = /^[0-9a-fA-F]{2}$/
function ramEdit(e){
    console.log(e)
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
const codeLineRegex = /^(\w+)[\s^\n]*(( ([0-9a-fA-F]{8})[\s^\n]*((,[\s^\n]+([0-9a-fA-F]{8})[\s^\n]*(;.*)?)|(;.*))?)|(;.*))?$/gi;
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