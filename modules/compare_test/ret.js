//RET               Return from procedure
const ret = [
    line=>line[0]&&!line[1]&&!line[2]&&[line[0]],
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
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const linearAddress = getLinearAddress("ip");
        cpuXram(
            `bus dados<br/>
            dados: instrução RET`,
            "get",
            linearAddress
        );
        setVisual("offset", "ip", cpu.offsetRegister.ip+4);
    },
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const ss = cpu.segmentRegister.ss;
        const stackSegment = cpu.segmentTable[ss];
        cpuXram(
            `bus endereço<br/>
            endereço linear = ${showHexa(stackSegment.base)} + ${showHexa(cpu.offsetRegister.sp)}<br/>
            endereço linear = ${showHexa(stackSegment.base+cpu.offsetRegister.sp)}`,
            "request",
            stackSegment.base+cpu.offsetRegister.sp
        );
        getLinearAddress("sp");
    },
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const address = getLinearAddress("sp");
        const ram = cpu.ram;
        const data =
        ram[address+1] 
        + ram[address+2] * 0x100
        + ram[address+3] * 0x10000
        + ram[address+4] * 0x1000000;
        cpuXram(
            `bus dados<br/>
            dados: ${data}`,
            "get",
            address
        );
        setVisual("offset", "ip", data);
        setVisual("offset", "sp", cpu.offsetRegister.sp+4);
        return true;
    },
];
export default ret;

function showHexa(value, pad = 8){
    return value.toString(16).padStart(pad, "0");
}