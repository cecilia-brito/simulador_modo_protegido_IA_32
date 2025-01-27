//LOOPXX         Loop until condition met
const loop = [
    line=>line[0]&&line[1]&&(line[1].length===2||line[1].split("").slice(0,-2).every(a=>!a))&&!line[2]&&[line[0],line[1]],
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
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const ecx = cpu.geralRegister.ecx-1;
        const linearAddress = getLinearAddress("ip");
        cpuXram(
            `bus dados<br/>
            dados: instrução LOOP`,
            "get",
            linearAddress
        );
        setVisual("geral", "ecx", ecx);
        setVisual("offset", "ip", cpu.offsetRegister.ip+(ecx?4:5));
        return ecx===0;
    },
    //step 3
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        loop[1](setVisual, cpuXram, getLinearAddress, cpu);
    },
    //step 4
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const linearAddress = getLinearAddress("ip");
        console.log(cpu.controlUnity)
        const disp = cpu.controlUnity.line[1];
        let realDisp = parseInt(disp,16)
            .toString(2);
        if(realDisp.length===8){
            console.log(realDisp)
            realDisp = realDisp
                .replaceAll("0", "2")
                .replaceAll("1", "0")
                .replaceAll("2", "1");
            realDisp = -1*(parseInt(realDisp.slice(-7), 2)+1)
        }else realDisp = parseInt(realDisp);
        cpuXram(
            `bus dados<br/>
            dados: ${disp}`,
            "get",
            linearAddress
        );
        setVisual("offset","ip",cpu.offsetRegister.ip+realDisp);
        return true;
    }
];
export default loop;

function showHexa(value, pad = 8){
    return value.toString(16).padStart(pad, "0");
}