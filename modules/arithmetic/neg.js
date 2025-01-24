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
            endereço linear = ${codeSegment.base.toString(16)} + ${cpu.offsetRegister.ip.toString(16)}<br/>
            endereço linear = ${(codeSegment.base + cpu.offsetRegister.ip).toString(16)}`,
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
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const ds = cpu.segmentRegister.ds;
        const dataSegment = cpu.segmentTable[ds];
        cpuXram(
            `bus endereço<br/>
            endereço linear = ${dataSegment.base.toString(16)} + ${cpu.offsetRegister.si.toString(16)}<br/>
            endereço linear = ${(dataSegment.base + cpu.offsetRegister.di).toString(16)}`,
            "request",
            dataSegment.base+cpu.offsetRegister.si
        );
        getLinearAddress("si");
    },
    //step 6
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const ram = cpu.ram;
        const linearAddress = getLinearAddress("si");
        const data = ram[linearAddress+3]*0x1000000 + ram[linearAddress+2]*0x10000 + ram[linearAddress+1]*0x100 + ram[linearAddress];
        cpuXram(
            `bus dados<br/>
            dados: ${data.toString(16)}`,
            "get",
            linearAddress
        );
        setVisual("geral", "eax", data);
    },
    //step 7
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        neg[5](setVisual, cpuXram, getLinearAddress, cpu);
    },
    //step 8
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const eax = cpu.geralRegister.eax;
        let twoComp = (eax>>>0).toString(2);
        twoComp = twoComp.padStart(Math.max(0,33-twoComp.length), "0")
            .replaceAll("0", "2")
            .replaceAll("1", "0")
            .replaceAll("2", "1");
        setVisual("geral", "eax", parseInt((parseInt(twoComp, 2)+1).toString(2).slice(-32),2));
        const dataSegment = cpu.segmentTable[cpu.segmentRegister.ds];
        const linearAddress = getLinearAddress("di");
        cpuXram(
            `bus dados<br/>
            endereço linear = ${dataSegment.base.toString(16)} + ${cpu.offsetRegister.di.toString(16)}<br/>
            endereço linear = ${linearAddress.toString(16)}<br/>
            dados: ${cpu.geralRegister.eax.toString(16)}`,
            "request",
            linearAddress
        )
        setVisual("ram", linearAddress, cpu.geralRegister.eax)
        return true;
    }
];
export default neg