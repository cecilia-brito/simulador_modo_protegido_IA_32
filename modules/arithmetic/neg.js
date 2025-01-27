//NEG DST         Negate DST (subtract it from 0)
const neg = [
    //line é uma array de três posições. 
    //Os elementos são as partes relevantes de uma linha.
    line=>{
        if(line[0] !== undefined && line[1] !== undefined && line[2] === undefined){
            return [line[0], line[1]]
        }
        //return (line[0]&&line[1]&&!line[2])&&[line[0], line[1]];
    },
    //step 1
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        //registrador cs
        const cs = cpu.segmentRegister.cs;
        //acesso na tabela de segmentos referente a cs
        const codeSegment = cpu.segmentTable[cs];
        cpuXram(
            //desc
            `bus endereço<br/>
            endereço linear = ${showHexa(codeSegment.base)} + ${showHexa(cpu.offsetRegister.ip)}<br/>
            endereço linear = ${showHexa(codeSegment.base + cpu.offsetRegister.ip)}`,
            //request = "->"
            //get = "<-"
            //"" = [] (quadrado)
            "request",
            //posição na ram
            codeSegment.base+cpu.offsetRegister.ip
        );
        getLinearAddress("ip");
    },
    //step 2
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const linearAddress = getLinearAddress("ip");
        cpuXram(
            `bus dados<br/>
            dados: instrução NEG`,
            "get",
            linearAddress
        );
        setVisual("offset", "ip", cpu.offsetRegister.ip+4);
    },
    //step 3
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        neg[1](setVisual, cpuXram, getLinearAddress, cpu);
    },
    //step 4
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const control = cpu.controlUnity;
        const linearAddress = getLinearAddress("ip");
        cpuXram(
            `bus dados<br/>
            dados: ${control.line[1]}`,
            "get",
            linearAddress
        );
        setVisual("offset", "si", parseInt(control.line[1],16));
        setVisual("offset", "di", parseInt(control.line[1],16));
        setVisual("offset", "ip", cpu.offsetRegister.ip + 4);
    },
    //step 5
    (setVisual, cpuXram, getLinearAddress, cpu, address="si")=>{
        const ds = cpu.segmentRegister.ds;
        const dataSegment = cpu.segmentTable[ds];
        cpuXram(
            `bus endereço<br/>
            endereço linear = ${showHexa(dataSegment.base)} + ${showHexa(cpu.offsetRegister[address])}<br/>
            endereço linear = ${showHexa(dataSegment.base + cpu.offsetRegister[address])}`,
            "request",
            dataSegment.base+cpu.offsetRegister.si
        );
        getLinearAddress(address);
    },
    //step 6
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const ram = cpu.ram;
        const linearAddress = getLinearAddress("si");
        const data = ram[linearAddress+3]*0x1000000 + ram[linearAddress+2]*0x10000 + ram[linearAddress+1]*0x100 + ram[linearAddress];
        cpuXram(
            `bus dados<br/>
            dados: ${showHexa(data)}`,
            "get",
            linearAddress
        );
        setVisual("geral", "eax", data);
    },
    //step 7
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        neg[5](setVisual, cpuXram, getLinearAddress, cpu, "di");
    },
    //step 8
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const eax = cpu.geralRegister.eax;
        let twoComp = (eax>>>0).toString(2);
        twoComp = twoComp.padStart(32, "0")
            .replaceAll("0", "2")
            .replaceAll("1", "0")
            .replaceAll("2", "1");
        setVisual("geral", "eax", parseInt((parseInt(twoComp, 2)+1).toString(2).slice(-32),2));
        const dataSegment = cpu.segmentTable[cpu.segmentRegister.ds];
        const linearAddress = getLinearAddress("di");
        cpuXram(
            `bus dados<br/>
            endereço linear = ${showHexa(dataSegment.base)} + ${showHexa(cpu.offsetRegister.di)}<br/>
            endereço linear = ${showHexa(linearAddress)}<br/>
            dados: ${showHexa(cpu.geralRegister.eax)}`,
            "request",
            linearAddress
        );
        setVisual("ram", linearAddress, cpu.geralRegister.eax);
        cpu.flag.zero = cpu.geralRegister.eax === 0;
        cpu.flag.carry = !cpu.flag.zero;
        cpu.flag.sign = twoComp[0]==="1"&&!twoComp.split("").every(a=>a==="1");
        cpu.flag.overflow = eax === cpu.geralRegister.eax;
        return true;
    }
];
export default neg;

function showHexa(value, pad = 8){
    return value.toString(16).padStart(pad, "0");
}