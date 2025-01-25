//ADD DST, SRC     Add SRC to DST
//TODO adicionar flags
const add = [
    (array) =>{
        if(array[0] != undefined && array[1] != undefined && array[2] != undefined){
            return array;
        }
    },
    //step 1
    (setVisualRegister, cpuXram, getLinearAddress, cpu)=>{
        const cs = cpu.segmentRegister.cs;
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
        console.log("step 1")
        return false;
    },
    //step 2
    (setVisualRegister, cpuXram, getLinearAddress, cpu)=>{
       
        const linearAddress = getLinearAddress('ip');
       
        cpuXram(
            //desc
            `Bus Dados<br>`
           +`add`,
            //request = "->"
            //get = "<-"
            //"" = [] (quadrado)
            "get",
            //posição na ram
            linearAddress
        );
        setVisualRegister("offset", "ip", cpu.offsetRegister.ip + 4);
        console.log("step 2")
        return false;
    },
    //step 3
    (setVisualRegister, cpuXram, getLinearAddress, cpu)=>{    
       add[1](setVisualRegister, cpuXram, getLinearAddress, cpu);
       console.log("step 3")
        return false;
    },
    //step 4
    (setVisualRegister, cpuXram, getLinearAddress, cpu)=>{
     
        const control = cpu.controlUnity;
        const linearAddress = getLinearAddress("ip");
        const data = control.line[1];
        console.log(data)
        cpuXram(
            //desc
            `Bus Dados<br>`
           +`${data.toString(16)}`,
            //request = "->"
            //get = "<-"
            //"" = [] (quadrado)
            "get",
            //posição na ram
            linearAddress
        );
        setVisualRegister("offset", "si", parseInt(control.line[1],16));
        setVisualRegister("offset", "di", parseInt(control.line[1],16));
        setVisualRegister("offset", "ip", cpu.offsetRegister.ip + 4);
        console.log("step 4")
        return false;
    },  
    //step 5
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const ds = cpu.segmentRegister.ds;
        const dataSegment = cpu.segmentTable[ds];
        cpuXram(
            `bus endereço<br/>
            endereço linear = ${dataSegment.base.toString(16)} + ${cpu.offsetRegister.si.toString(16)}<br/>
            endereço linear = ${(dataSegment.base + cpu.offsetRegister.si).toString(16)}`,
            "request",
            dataSegment.base+cpu.offsetRegister.si
        );
        console.log("step 5")
        getLinearAddress("si");
    },//step 6
    (setVisualRegister, cpuXram, getLinearAddress, cpu)=>{
        const ram = cpu.ram;
        const ds = cpu.segmentRegister.ds;
        const codeSegment = cpu.segmentTable[ds];
        const linearAddress = getLinearAddress("si");
        const data = ram[linearAddress+3]*0x1000000 + ram[linearAddress+2]*0x10000 + ram[linearAddress+1]*0x100 + ram[linearAddress];
        console.log(ram[linearAddress+3])
        console.log(linearAddress)
        cpuXram(
            `bus dados<br/>
            dados: ${data.toString(16)}`,
            "get",
            codeSegment.base+cpu.offsetRegister.si
        );
        setVisualRegister("geral", "eax", data);
        console.log("step 6")
        return false;
    },  // //step 7
    (setVisualRegister, cpuXram, getLinearAddress, cpu)=>{
        add[3](setVisualRegister, cpuXram, getLinearAddress, cpu);
    },(setVisualRegister, cpuXram, getLinearAddress, cpu)=>{
        const control = cpu.controlUnity;
        const linearAddress = getLinearAddress("ip");
        const data = control.line[2];
        console.log(data)
        cpuXram(
            //desc
            `Bus Dados<br>`
           +`${data.toString(16)}`,
            //request = "->"
            //get = "<-"
            //"" = [] (quadrado)
            "get",
            //posição na ram
            linearAddress
        );
        setVisualRegister("offset", "si", parseInt(control.line[2],16));
       
        setVisualRegister("offset", "ip", cpu.offsetRegister.ip + 4);
        console.log("step 7")
        return false;
        //step 8
    },(setVisualRegister, cpuXram, getLinearAddress, cpu)=>{
        add[5](setVisualRegister, cpuXram, getLinearAddress, cpu);
        console.log("step 8")
    },
    //step 9
    (setVisualRegister, cpuXram, getLinearAddress, cpu)=>{
        const ram = cpu.ram;
        const ds = cpu.segmentRegister.ds;
        const codeSegment = cpu.segmentTable[ds];
        const linearAddress = getLinearAddress("si");
        const data = ram[linearAddress+3]*0x1000000 + ram[linearAddress+2]*0x10000 + ram[linearAddress+1]*0x100 + ram[linearAddress];
        console.log(ram[linearAddress+3])
        console.log(linearAddress)
        cpuXram(
            `bus dados<br/>
            dados: ${data.toString(16)}`,
            "get",
            codeSegment.base+cpu.offsetRegister.si
        );
        setVisualRegister("geral", "ebx", data);
        console.log("step 9")
        return false;
    },//step 10
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        cpu.geralRegister.eax = cpu.geralRegister.eax + cpu.geralRegister.ebx
        setVisual("geral", "eax", cpu.geralRegister.eax);
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
        console.log("step 10")
        setVisual("ram", linearAddress, cpu.geralRegister.eax)
        return true;
    }
];
export default add;

