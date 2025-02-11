//PUSH SRC        Push SRC onto the stack
const push = [
    (array)=>{
        if(array[0] != undefined && array[1] != undefined && array[2] == undefined){
            return [array[0], array[1]];
        }
        console.log(array);
    },
    (setVisualRegister, cpuXram, getLinearAddress, cpu)=>{
        const cs = cpu.segmentRegister.cs;
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
        console.log("step 1")
        return false;
    },
    //step 2
    (setVisualRegister, cpuXram, getLinearAddress, cpu)=>{
        const linearAddress = getLinearAddress('ip');
        cpuXram(
            //desc
            `Bus Dados<br>`
           +`Push`,
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
       push[1](setVisualRegister, cpuXram, getLinearAddress, cpu);
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
           +`${showHexa(data)}`,
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
            endereço linear = ${showHexa(dataSegment.base)} + ${showHexa(cpu.offsetRegister.si)}<br/>
            endereço linear = ${showHexa(dataSegment.base + cpu.offsetRegister.si)}`,
            "request",
            dataSegment.base+cpu.offsetRegister.si
        );
        console.log("step 5")
        getLinearAddress("si");
        return false;
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
            dados: ${showHexa(data)}`,
            "get",
            codeSegment.base+cpu.offsetRegister.si
        );
        setVisualRegister("geral", "eax", data);
        console.log("step 6")
        return false;
    },  // //step 7
//step 10
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        
        const linearAddress = getLinearAddress("si");
        const dataSegment = cpu.segmentTable[cpu.segmentRegister.ds];
        
        cpuXram(
            `bus dados<br/>
            endereço linear = ${showHexa(dataSegment.base)} + ${showHexa(cpu.offsetRegister.di)}<br/>
            endereço linear = ${showHexa(linearAddress)}<br/>`,
            "request",
            linearAddress
        )
        
        console.log("step 10")
        return false;
    },(setVisual, cpuXram, getLinearAddress, cpu)=>{
        const ram = cpu.ram;
       
        const linearAddress = getLinearAddress("si");
        const data = ram[linearAddress+3]*0x1000000 + ram[linearAddress+2]*0x10000 + ram[linearAddress+1]*0x100 + ram[linearAddress];
        cpuXram(
            `bus dados<br/>
            dados: ${showHexa(data)}<br/>`,
            "request",
            linearAddress
        )
        setVisual("offset", "sp", cpu.offsetRegister.sp - 4);
        setVisual("ram", getLinearAddress('sp')+1, data);
        return true;
    }
];
export default push;
function showHexa(value, pad = 8){
    return value.toString(16).padStart(pad, "0");
}