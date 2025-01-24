//SUB DST,SRC      Subtract DST from SRC
const sub = [
    line => {
        return(line[0]&&line[1]&&line[2]&&[line[0], line[1], line[2]]);
    },
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        // Passo 1
        const cs = cpu.segmentRegister.cs
        const codeSegment = cpu.segmentTable[cs]
        // Mensagem barramento
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
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        // Passo 2
        const cs = cpuRegister.cs
        const codeSegment = cpu.segmentTable[cs];
        const linearAddress = getLinearAddress('ip')
        cpuXram(
            `bus dados\n`
            + `Informações do endereço = MOV (SRC)`,
            'get',
            codeSegment.base+cpu.offsetRegister.ip
        )
        setVisual('offset', 'ip', cpu.offsetRegister.ip + 8)
        return false
    } 
    
];

/* 
Passos:
1. 
*/
export default sub;