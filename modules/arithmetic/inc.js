//INC DST       Add 1 to DST
const inc = [
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
            endereço linear = ${codeSegment.base} + ${cpu.offsetRegister.ip}<br/>
            endereço linear = ${codeSegment.base + cpu.offsetRegister.ip}`,
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
            Informações do endereço = INC`,
            `get`,

            codeSegment.base+cpu.offsetRegister.ip
        );
        setVisual("offset", "ip", cpu.offsetRegister.ip + 4)
        return false
    },
    //step 3
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const cs = cpu.segmentRegister.cs;
        const codeSegment = cpu.segmentTable[cs];

        const linearAddress = getLinearAddress("ip");

        cpuXram(
            `bus endereço<br/>
            endereço linear = ${codeSegment.base} + ${cpu.offsetRegister.ip}<br/>
            endereço linear = ${codeSegment.base + cpu.offsetRegister.ip}`,
            "request",
            codeSegment.base+cpu.offsetRegister.ip
        );
        return false
    },
    //step 4
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const cs = cpu.segmentRegister.cs;
        const codeSegment = cpu.segmentTable[cs];
        
        const control = cpu.controlUnity
        const linearAddress = getLinearAddress("ip");   
        cpuXram(
            `bus dados<br/>
            informações do endereço = ${control.line[1]}`,
            `get`,

            codeSegment.base+cpu.offsetRegister.ip
        );
        setVisual("offset", "ip", cpu.offsetRegister.ip + 4)
        setVisual("offset", "si", control.line[1])
        return false
    },
    //step 5
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const ds = cpu.segmentRegister.ds;
        const codeSegment = cpu.segmentTable[ds];

        const linearAddress = getLinearAddress("si");

        cpuXram(
            `bus endereço<br/>
            endereço linear = ${codeSegment.base} + ${cpu.offsetRegister.si}<br/>
            endereço linear = ${codeSegment.base + cpu.offsetRegister.si}`,
            "request",
            codeSegment.base+cpu.offsetRegister.si
        );
        return false
    },
    //step 6
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const ds = cpu.segmentRegister.ds;
        const codeSegment = cpu.segmentTable[ds];
        const ram = cpu.ram

        const linearAddress = getLinearAddress("si");
        const data = ram[linearAddress+3]*0x1000000 + ram[linearAddress+2]*0x10000 + ram[linearAddress+1]*0x100 + ram[linearAddress];

        cpuXram(
            `bus dados<br/>
            informações do endereço = ${data}`,
            `get`,

            codeSegment.base+cpu.offsetRegister.si
        );
        setVisual("geral", "eax", data)
        setVisual("ram", linearAddress, data + 1)
        return false
    },
    //step 7
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        setVisual("offset", "di", control.line[1])

        const ds = cpu.segmentRegister.ds;
        const codeSegment = cpu.segmentTable[ds];

        const linearAddress = getLinearAddress("di");

        cpuXram(
            `bus endereço<br/>
            endereço linear = ${codeSegment.base} + ${cpu.offsetRegister.di}<br/>
            endereço linear = ${codeSegment.base + cpu.offsetRegister.di}`,
            "request",
            codeSegment.base+cpu.offsetRegister.di
        );
        return false
    },
    //step 8
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const ds = cpu.segmentRegister.ds;
        const codeSegment = cpu.segmentTable[ds];
        const ram = cpu.ram

        const linearAddress = getLinearAddress("di");
        const data = ram[linearAddress+3]*0x1000000 + ram[linearAddress+2]*0x10000 + ram[linearAddress+1]*0x100 + ram[linearAddress];

        cpuXram(
            `bus dados<br/>
            informações do endereço = ${data}`,
            `get`,

            codeSegment.base+cpu.offsetRegister.si
        );
        return true
    },
];
export default inc;