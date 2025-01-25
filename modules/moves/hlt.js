//HLT;
const hlt = [
    line=>{
        return (line[0]&&!line[1]&&!line[2])&&[line[0]]
    },
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const cs = cpu.segmentRegister.cs;
        const codeSegment = cpu.segmentTable[cs];
        cpuXram(
            `bus endereço<br/>
            endereço linear = ${showHexa(codeSegment.base)} + ${showHexa(cpu.offsetRegister.ip)}<br/>
            endereço linear = ${showHexa(codeSegment.base + cpu.offsetRegister.ip)}`,
            "request",
            codeSegment.base+cpu.offsetRegister.ip
        );
        getLinearAddress("ip");
    }
];
export default hlt;


function showHexa(value, pad = 8){
    return value.toString(16).padStart(pad, "0");
}