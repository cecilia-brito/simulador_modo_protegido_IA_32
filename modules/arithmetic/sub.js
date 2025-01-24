//SUB DST,SRC      Subtract DST from SRC
const sub = [
    line => {
        return(line[0]&&line[1]&&line[2]&&[line[0], line[1], line[2]]);
    },
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        // Passo 1
        const cs = cpu.segmentRegister.cs
        const codeSegment = cpu.segmentTable[cs]

        const linearAddress = getLinearAddress("ip")
        
    }
];

/* 
Passos:
1. 
*/
export default sub;