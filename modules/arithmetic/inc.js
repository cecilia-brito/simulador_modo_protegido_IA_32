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
            `bus endereço\n`
            +`endereço linear = ${codeSegment.base} + ${cpu.offsetRegister.ip}\n`
            +`endereço linear = ${codeSegment.base + cpu.offsetRegister.ip}`,
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
            `bus dados\n`
            +`Informações do endereço = INC`,
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
            `bus endereço\n`
            +`endereço linear = ${codeSegment.base} + ${cpu.offsetRegister.ip}\n`
            +`endereço linear = ${codeSegment.base + cpu.offsetRegister.ip}`,
            "request",
            codeSegment.base+cpu.offsetRegister.ip
        );
        return false
    },
    //step 4
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const cs = cpu.segmentRegister.cs;
        const codeSegment = cpu.segmentTable[cs];

        const linearAddress = getLinearAddress("ip");   
        cpuXram(
            `bus dados\n`
            +`informações do endereço = ${ram[linearAddress]}`,
            `get`,

            codeSegment.base+cpu.offsetRegister.ip
        );
        setVisual("offset", "ip", cpu.offsetRegister.ip + 4)
        alert("fazol")
        setVisual("offset", "si", cpu.offsetRegister.si = ram[linearAddress])// ver se o si atualiza aqui ---- possui erro aqui
        return false
    },
    //step 5
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const ds = cpu.segmentRegister.ds;
        const codeSegment = cpu.segmentTable[ds];

        const linearAddress = getLinearAddress("si");

        cpuXram(
            `bus endereço\n`
            +`endereço linear = ${codeSegment.base} + ${cpu.offsetRegister.si}\n`
            +`endereço linear = ${codeSegment.base + cpu.offsetRegister.si}`,
            "request",
            codeSegment.base+cpu.offsetRegister.si
        );
        return false
    },
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const ds = cpu.segmentRegister.ds;
        const codeSegment = cpu.segmentTable[ds];

        const linearAddress = getLinearAddress("si");   
        cpuXram(
            `bus dados\n`
            +`informações do endereço = ${ram[linearAddress]}`,
            `get`,

            codeSegment.base+cpu.offsetRegister.si
        );
        setVisual("offset", "si", cpu.offsetRegister.si += 1)
    }
];
export default inc;