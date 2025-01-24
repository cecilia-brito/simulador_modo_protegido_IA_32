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
            `bus endereço\n`
            + `endereço linear = ${codeSegment.base} + ${cpu.offsetRegister.ip}\n`
            + `endereço linear = ${codeSegment.base + cpu.offsetregister.ip}`,
            "request",
            codeSegment.base+cpu.offsetRegister.ip
        )
        const linearAddress = getLinearAddress("ip")
        return false //porque?
    },
    // Passo 2 (Reconhecimento do Comando Mov)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const cs = cpuRegister.cs
        const codeSegment = cpu.segmentTable[cs];
        const linearAddress = getLinearAddress('ip')
        cpuXram(
            `bus dados\n`
            + `Informações do endereço = MOV`,
            'get',
            codeSegment.base+cpu.offsetRegister.ip
        )
        setVisual('offset', 'ip', cpu.offsetRegister.ip + 8)
        return false
    },
    // Passo 3 (Fetch end. SRC)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const cs = cpu.segmentRegister.cs
        const codeSegment = cpu.segmentTable[cs]
        const linearAddress = getLinearAddress('ip')
        cpuXram(
            `bus endereço\n`
            + `endereço linear = ${codeSegment.base} + ${cpu.offsetRegister.ip}\n`
            + `endereço linear = ${codeSegment.base + cpu.offsetregister.ip}`,
            "request",
            codeSegment.base+cpu.offsetRegister.ip
        )
        return false
    },
    // Passo 4 (Alterar EBX)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const cs = cpuRegister.cs
        const codeSegment = cpu.segmentTable[cs];
        const linearAddress = getLinearAddress('ip')
        cpuXram(
            `bus dados\n`
            + `Informações do endereço = MOV (SRC)`,
            'get',
            codeSegment.base+cpu.offsetRegister.ip
        )
        setVisual('offset', 'ip', cpu.offsetRegister.ip - 4)
        setVisual('geral','ebx', ram[linearAddress])
        return false
    },
    // Passo 5 (Fetch end. DST)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const cs = cpu.segmentRegister.cs
        const codeSegment = cpu.segmentTable[cs]
        cpuXram(
            `bus endereço\n`
            + `endereço linear = ${codeSegment.base} + ${cpu.offsetRegister.ip}\n`
            + `endereço linear = ${codeSegment.base + cpu.offsetregister.ip}`,
            "request",
            codeSegment.base+cpu.offsetRegister.ip
        )
        return false
    },
    // Passo 6 (Alteração EAX)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const cs = cpuRegister.cs
        const codeSegment = cpu.segmentTable[cs];
        const linearAddress = getLinearAddress('ip')
        cpuXram(
            `bus dados\n`
            + `Informações do endereço = MOV (DST)`,
            'get',
            codeSegment.base+cpu.offsetRegister.ip
        )
        setVisual('offset', 'ip', cpu.offsetRegister.ip + 4)
        setVisual('geral','eax', ram[linearAddress])        
        return false
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