//SUB DST,SRC      Subtract DST from SRC
const sub = [
    line => {
        return(line[0]&&line[1]&&line[2]&&[line[0], line[1], line[2]]);
    },
    // Passo 1 (Leitura do Comando MOV)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const cs = cpu.segmentRegister.cs
        const codeSegment = cpu.segmentTable[cs]
        cpuXram(
            `bus endereço<br/>
            endereço linear = ${codeSegment.base} + ${cpu.offsetRegister.ip}<br/>
            endereço linear = ${codeSegment.base + cpu.offsetRegister.ip}`,
            "request",
            codeSegment.base+cpu.offsetRegister.ip
        )
        const linearAddress = getLinearAddress("ip")
    },
    // Passo 2 (Reconhecimento do Comando Mov)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const cs = cpu.segmentRegister.cs
        const codeSegment = cpu.segmentTable[cs];
        const linearAddress = getLinearAddress('ip')
        cpuXram(
            `bus dados<br/>`
            + `Informações do endereço = MOV`,
            'get',
            codeSegment.base+cpu.offsetRegister.ip
        )
        setVisual('offset', 'ip', cpu.offsetRegister.ip + 8)
    },
    // Passo 3 (Fetch end. SRC)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const cs = cpu.segmentRegister.cs
        const codeSegment = cpu.segmentTable[cs]
        const linearAddress = getLinearAddress('ip')
        cpuXram(
            `bus endereço<br/>`
            + `endereço linear = ${codeSegment.base} + ${cpu.offsetRegister.ip}<br/>`
            + `endereço linear = ${codeSegment.base + cpu.offsetRegister.ip}`,
            "request",
            codeSegment.base+cpu.offsetRegister.ip
        )
        
    },
    // Passo 4 (Alterar EBX)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const cs = cpu.segmentRegister.cs
        const codeSegment = cpu.segmentTable[cs]
        const linearAddress = getLinearAddress('ip')
        const ram = cpu.ram
        cpuXram(
            `bus dados<br/>`
            + `Informações do endereço = MOV (SRC)`,
            'get',
            codeSegment.base+cpu.offsetRegister.ip
        )
        
        setVisual('offset', 'ip', cpu.offsetRegister.ip - 4)
        alert('oii')
        setVisual('geral','ebx', ram[linearAddress])
        
    },
    // Passo 5 (Fetch end. DST)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const cs = cpu.segmentRegister.cs
        const codeSegment = cpu.segmentTable[cs]
        cpuXram(
            `bus endereço<br/>`
            + `endereço linear = ${codeSegment.base} + ${cpu.offsetRegister.ip}<br/>`
            + `endereço linear = ${codeSegment.base + cpu.offsetRegister.ip}`,
            "request",
            codeSegment.base+cpu.offsetRegister.ip
        )
        
    },
    // Passo 6 (Alteração EAX)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const cs = cpu.segmentRegister.cs
        const codeSegment = cpu.segmentTable[cs];
        const linearAddress = getLinearAddress('ip')
        const ram = cpu.ram
        cpuXram(
            `bus dados<br/>`
            + `Informações do endereço = MOV (DST)`,
            'get',
            codeSegment.base+cpu.offsetRegister.ip
        )
        setVisual('offset', 'ip', cpu.offsetRegister.ip + 4)
        setVisual('geral','eax', ram[linearAddress])        
        
    },
    // Passo 7 (Conta)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const ds = cpu.segmentRegister.ds
        const codeSegment = cpu.segmentTable[ds]
        const ram = cpu.ram

        const linearAddress = getLinearAddress('si')
        cpuXram(
            `bus dados<br/>`
            + `informações do endereço = ${ram[linearAddress]}`,
            codeSegment.base+cpu.offsetRegister.si
        )
        const conta = cpu.geralRegister.eax -= cpu.geralRegister.ebx
        setVisual('offset', 'eax', conta)
        if(conta < 0){
            // mexer na flag
        }
        return true
    }
];

/* 
Passos:
1. Request p/ RAM da orgiem
2. Informações da RAM origem (Edita EBX)
3. Request p/ RAM destino 
4. Informações da Ram Destino (Edita EAX)
5. Operação EAX -> EAX - EBX (Edita EAX)
6. Atualiza Flags

*/
export default sub;