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
import mob from "./modules/moves/mov.js";
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
    mob,
    pop,
    push,
    xcgh,
    algo:[(line)=>line]
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
    ram: Array.apply(null, Array(64000)).map(()=>0),
};

// Guardando a referência de elementos importantes
const clockButton = document.getElementById("clock");
const codeInput = document.getElementById("code");
const ramTable = document.getElementById("ram");

// Função responsável por alterar os valores dos registradores cujo valor é apresentado ao usuário.
function setVisualRegister(type, register, value){
    cpu[type+"Register"][register] = value;
    let valueTo16 = value.toString(16);
    valueTo16 = '0'.repeat(Math.max(0,4-valueTo16.length))+valueTo16;
    document.getElementById(register).textContent = valueTo16;
};


async function start(){
    // Essa parte será nosso "assembler". Aqui será checada cada linha do código para conferir se ela é válida.
    try{
        codeInput.contentEditable = false;
        const lineList = codeInput.textContent.split("\n").map(singleLine=>{
            const validLine = checkLine(singleLine);
            if(validLine){
                return validLine;
            }
            throw new Error();
        })
        await changeRamEdit(false);
        cpu.controlUnity.code = lineList;
        cpu.controlUnity.line = lineList[0];
        cpu.controlUnity.instruction = lineList[0][0];
    }catch(e){
        console.log(e)
        codeInput.contentEditable = true;
        alert("Código inadequado")
    }
};

function clock(){
    if(clockButton.textContent.includes("start")){
        start(); 
        clockButton.textContent = "tick";
        return;
    }
    const control = cpu.controlUnity;
    let instructionResult = instructionList[control.instruction][control.step](setVisualRegister, cpu);
    clockButton.textContent = clockButton.textContent == "tick"? "tock":"tick";
    if(instructionResult){
        control.line = control.code[cpu.offsetRegister.ip];
        control.instruction = control.line[0];
        control.step = 1;
        if(control.instruction = "hlt")end();
    }else{cpu.controlUnity.step++};
};
clockButton.onclick = clock;

document.getElementById("click").onclick = async function end(){
    await changeRamEdit(true);
    codeInput.contentEditable = true;
    clockButton.textContent = "start";
};

async function changeRamEdit(edit){
    return Promise.resolve().then(()=>{
        let num = cpu.ram.length;
        for(let i = 0; i < num; i++){document.getElementById(`ram-${i}`).contentEditable = edit;}
    });
}

//#x2190 left
//#x2192 right
//&#x2B1 square

//funções utilitárias
//Aqui será feita checagem de uma singular linha.
const codeLineRegex = /^(\w+)[\s^\n]*(( (#?\d+|\w+)[\s^\n]*((,[\s^\n]+(#?\d+|\w+)[\s^\n]*(;.*)?)|(;.*))?)|(;.*))?$/gi;
function checkLine(line){
    let lineMatch = [...line.matchAll(codeLineRegex)];
    if(lineMatch.length && instructionList[lineMatch[0][1].toLowerCase()]){
        lineMatch = lineMatch[0];
        lineMatch = [lineMatch[1].toLowerCase(), lineMatch[4], lineMatch[7]];
        return instructionList[lineMatch[0]][0](lineMatch);
    }
}

// Inicializando alguns registradores
setVisualRegister("geral", "eax", 81);
setVisualRegister("geral", "ebx", 0);
setVisualRegister("geral", "ecx", 15);
setVisualRegister("geral", "edx", 4239);

setVisualRegister("segment", "cs", 0);
setVisualRegister("segment", "ds", 2**12);
setVisualRegister("segment", "ss", 2**13);

setVisualRegister("offset", "ip", 0);
setVisualRegister("offset", "sp", 563);
setVisualRegister("offset", "bp", 435);
setVisualRegister("offset", "si", 233);
setVisualRegister("offset", "di", 100);

clockButton.disabled = true;
(async()=>(
    Promise.resolve().then(()=>{
        let num = cpu.ram.length;
        for(let i = 0; i < num; i++){
            const newLi = document.createElement("li");
            newLi.classList.add("box");
            newLi.id = `ram-${i}`;
            newLi.textContent = cpu.ram[i].toString(16);
            newLi.contentEditable = true;
            ramTable.appendChild(newLi);
        }
    })
))().then(()=>clockButton.disabled = false);
