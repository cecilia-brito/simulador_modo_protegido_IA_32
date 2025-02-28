//POP DST          Pop a word from the stack to DST
const pop = [
    line => {
        return(line[0]&&line[1]&&!line[2]&&[line[0], line[1]]);
    },
    // Pegando Endereço pop
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const cs = cpu.segmentRegister.cs
        const codeSegment = cpu.segmentTable[cs]
        cpuXram(
            `bus endereço<br/>
            end. linear = ${codeSegment.base.toString(16) + cpu.offsetRegister.ip.toString(16)}<br/>
            end. linear = ${(codeSegment.base + cpu.offsetRegister.ip).toString(16)}`,
            'request',
            codeSegment.base + cpu.offsetRegister.ip
        )
        getLinearAddress('ip')
        console.log('p1')
    },
    // Passo 2 Lendo Pop
    (setVisual, cpuXram, getLinearAddress, cpu, data = 'POP') => {
        const linearAddress = getLinearAddress('ip')
        cpuXram(
            `bus dado<br/>
            dado: ${data}`,
            'get',
            linearAddress
        )   
        setVisual('offset','ip', cpu.offsetRegister.ip + 4)
    },
    // Passo 3 Retirar dados da Pilha
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const ss = cpu.segmentRegister.ss
        const stackSegment = cpu.segmentTable[ss]
        cpuXram(
            `bus endereço<br/>
            endereço linear = ${showHexa(stackSegment.base)} + ${showHexa(cpu.offsetRegister.sp)}<br/>
            endereço linear = ${showHexa(stackSegment.base + cpu.offsetRegister.sp)}`,
            "request",
            stackSegment.base + cpu.offsetRegister.sp
        )
        getLinearAddress('sp')
    },
    // Escrever em EAX os dados da pilha
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const ram = cpu.ram
        const linearAddress = getLinearAddress('sp')
        setVisual('offset', 'sp', cpu.offsetRegister.sp+4);
        getLinearAddress('sp')
        const data = 
            ram[linearAddress + 4] * 0x1000000 +
            ram[linearAddress + 3] * 0x10000 +
            ram[linearAddress + 2] * 0x100 +
            ram[linearAddress + 1]
        cpuXram(
            `bus dados<br/>
            dados `,
            'get',
            linearAddress
        )
        setVisual('geral','eax', data)
    },

    // Passo 3 (Passo 1 - Reconhecimento DST)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        pop[1](setVisual, cpuXram, getLinearAddress, cpu)
        console.log('p3')   
    },


    //Passo 4 (Controle dos Ponteiros de DI)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const control = cpu.controlUnity
        const linearAddress = getLinearAddress('ip')
        pop[2](setVisual, cpuXram, getLinearAddress, cpu, control.line[1])
        setVisual('offset', 'di', parseInt(control.line[1], 16))
    },


    // Passo 7 (Escrever dados de EAX no Destino)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const ds = cpu.segmentRegister.ds
        const dataSegment = cpu.segmentTable[ds]
        cpuXram(
            `bus endereço<br/>
            endereço linear = ${dataSegment.base.toString(16)} + ${cpu.offsetRegister.di.toString(16)}<br/>
            endereço linear = ${(dataSegment.base + cpu.offsetRegister.di).toString(16)}`,
            'get',
            dataSegment.base + cpu.offsetRegister.di
        )
        getLinearAddress('di')
    },
    

    // Passo 8
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const eax = cpu.geralRegister.eax.toString(16)
        const linearAddress = getLinearAddress('di')
        cpuXram(
            `bus dados <br/>
            dado: ${cpu.geralRegister.eax.toString(16)}`,
            'request',
            linearAddress
        )
        setVisual('ram', linearAddress, cpu.geralRegister.eax)
        cpu.flag.zero = cpu.geralRegister.eax === 0;
        cpu.flag.carry = !cpu.flag.zero;
        cpu.flag.overflow = eax === cpu.geralRegister.eax;
        return true
    }
];
export default pop;


function showHexa(value, pad = 8){
    return value.toString(16).padStart(pad, "0");
}