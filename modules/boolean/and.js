//AND DST, SRC    Boolean AND SRC into DST
const and = [
    line=>{
        if(line[0] !== undefined && line[1] !== undefined && line[2] !== undefined){
            return [line[0], line[1], line[2]]
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
            Informações do endereço = AND`,
            `get`,

            codeSegment.base+cpu.offsetRegister.ip
        );
        setVisual("offset", "ip", cpu.offsetRegister.ip + 4)
        return false
    },
    //step 3
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        and[1](setVisual, cpuXram, getLinearAddress, cpu)
    },
    //step 4
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const cs = cpu.segmentRegister.cs;
        const codeSegment = cpu.segmentTable[cs];
        const control = cpu.controlUnity
        const dataAdress = (parseInt(control.line[1]));


        const linearAddress = getLinearAddress("ip");   
        cpuXram(
            `bus dados<br/>
            Informações do endereço =  ${control.line[1]}<br/>`,
            `get`,

            codeSegment.base+cpu.offsetRegister.ip
        );
        setVisual("offset", "ip", cpu.offsetRegister.ip + 4)
        setVisual("offset", "si", dataAdress)
        setVisual("offset", "di", dataAdress)

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
        return false
    },
    //step 7
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        and[1](setVisual, cpuXram, getLinearAddress, cpu)
    },
    //step 8
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const cs = cpu.segmentRegister.cs;
        const codeSegment = cpu.segmentTable[cs];
        const control = cpu.controlUnity
        const dataAdress = (parseInt(control.line[2]));


        const linearAddress = getLinearAddress("ip");   
        cpuXram(
            `bus dados<br/>
            Informações do endereço =  ${control.line[2]}<br/>`,
            `get`,

            codeSegment.base+cpu.offsetRegister.ip
        );
        setVisual("offset", "ip", cpu.offsetRegister.ip + 4)
        setVisual("offset", "si", dataAdress)

        return false
    },
    //step 9
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
    //step 10
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const ds = cpu.segmentRegister.ds;
        const codeSegment = cpu.segmentTable[ds];
        const ram = cpu.ram
        const eax =  cpu.geralRegister.eax
        
        const linearAddress = getLinearAddress("si");
        const data = ram[linearAddress+3]*0x1000000 + ram[linearAddress+2]*0x10000 + ram[linearAddress+1]*0x100 + ram[linearAddress];
        
        cpuXram(
            `bus dados<br/>
            informações do endereço = ${data}`,
            `get`,
            
            codeSegment.base+cpu.offsetRegister.di
        );
        setVisual("geral", "ebx", data)
        const ebx = cpu.geralRegister.ebx
        setVisual("geral", "eax", eax & ebx)
        return false
    },
    //step 11
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const ds = cpu.segmentRegister.ds;
        const codeSegment = cpu.segmentTable[ds];
        
        const linearAddress = getLinearAddress("di");
        
        cpuXram(
            `bus endereço<br/>
            endereço linear = ${codeSegment.base} + ${cpu.offsetRegister.di}<br/>
            endereço linear = ${linearAddress}`,
            "request",
            linearAddress
        );
        return false
    },
    //step 12
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const ds = cpu.segmentRegister.ds;
        const codeSegment = cpu.segmentTable[ds];
        const ram = cpu.ram
        const eax =  cpu.geralRegister.eax

        const linearAddress = getLinearAddress("di");
        const data = ram[linearAddress+3]*0x1000000 + ram[linearAddress+2]*0x10000 + ram[linearAddress+1]*0x100 + ram[linearAddress];
        setVisual("ram", linearAddress, eax)
        
        cpuXram(
            `bus dados<br/>
            informações do endereço = ${data}`,
            `get`,
            
            codeSegment.base+cpu.offsetRegister.di
        );
            const flag = cpu.flag
            flag.zero = data === 0
            flag.sign = data < 0
            flag.overflow = false

            return true
        }
];
export default and;