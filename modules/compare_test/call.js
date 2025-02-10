//CALL ADDR       Call procedure at ADDR
const call = [
    line=>line[0]&&line[1]&&!line[2]&&[line[0],line[1]],
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
        getLinearAddress("ip");
    },
    //step 2
    (setVisual, cpuXram, getLinearAddress, cpu, data="CALL")=>{
        const linearAddress = getLinearAddress("ip");
        cpuXram(
            `bus dados<br/>
            dados: instrução ${data}`,
            "get",
            linearAddress
        );
        setVisual("offset", "ip", cpu.offsetRegister.ip+4);
    },
    //step 3
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        call[1](setVisual, cpuXram, getLinearAddress, cpu)
    },
    //step 4
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const line = cpu.controlUnity.line;
        call[2](setVisual, cpuXram, getLinearAddress, cpu, line[1]);
        setVisual("geral", "eax", parseInt(line[1],16));
    },
    //step 5
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const ss = cpu.segmentRegister.ss;
        const stackSegment = cpu.segmentTable[ss];
        cpuXram(
            `bus endereço<br/>
            endereço linear = ${showHexa(stackSegment.base)} + ${showHexa(cpu.offsetRegister.sp)}<br/>
            endereço linear = ${showHexa(stackSegment.base + cpu.offsetRegister.sp)}`,
            "request",
            stackSegment.base + cpu.offsetRegister.sp
        )
        getLinearAddress("sp")
    },
    //step 6
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const address = getLinearAddress("sp")
        setVisual("offset", "sp", cpu.offsetRegister.sp-4);
        getLinearAddress("sp")
        cpuXram(
            `bus dados<br/>
            dados = ${showHexa(cpu.offsetRegister.ip)}`,
            "request",
            address-3
        )
        setVisual("ram", address-3, cpu.offsetRegister.ip);
        setVisual("offset", "ip", cpu.geralRegister.eax);
        return true;
    },

];
export default call;

function showHexa(value, pad = 8){
    return value.toString(16).padStart(pad, "0");
}