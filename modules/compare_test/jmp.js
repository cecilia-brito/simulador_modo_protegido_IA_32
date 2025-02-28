//JMP ADDR        Jump to ADDR
const jmp = [
    line=>{
        if(line[0] !== undefined && line[1] !== undefined && line[2] === undefined){
            return [line[0], line[1]]
        }
    },
    //step 1
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
        const linearAddress = getLinearAddress("ip");
        return false
    },
    //step 2
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const cs = cpu.segmentRegister.cs;
        const codeSegment = cpu.segmentTable[cs];

        const linearAddress = getLinearAddress("ip");   
        cpuXram(
            `bus dados<br/>
            Informações do endereço = JMP`,
            `get`,

            codeSegment.base+cpu.offsetRegister.ip
        );
        setVisual("offset", "ip", cpu.offsetRegister.ip + 4)
        return false
    },
    //step 3
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        jmp[1](setVisual, cpuXram, getLinearAddress, cpu)
    },
    //step 4
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const cs = cpu.segmentRegister.cs;
        const codeSegment = cpu.segmentTable[cs];
        const control = cpu.controlUnity
        const dataAdress = (parseInt(control.line[1], 16));

        setVisual("offset", "ip", dataAdress)

        cpuXram(
            
            `Pulando para o endereço: ${control.line[1]}`,

            codeSegment.base+cpu.offsetRegister.ip
        );
        return true
    },
    
];
export default jmp;

function showHexa(value, pad = 8){
    return value.toString(16).padStart(pad, "0");
}