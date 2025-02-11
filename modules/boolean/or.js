//OR DST, SRC       Boolean OR SRC into DST
//TODO adicionar flags
const or  = [
    (array) =>{
        if(array[0] !== undefined && array[1] !== undefined && array[2] !== undefined){
            return array;
        }
    },//step 1
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
           +`OR`,
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
       or[1](setVisualRegister, cpuXram, getLinearAddress, cpu);
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
    }, (setVisual, cpuXram, getLinearAddress, cpu)=>{
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
    (setVisualRegister, cpuXram, getLinearAddress, cpu)=>{
        or[3](setVisualRegister, cpuXram, getLinearAddress, cpu);
    },(setVisualRegister, cpuXram, getLinearAddress, cpu)=>{
        const control = cpu.controlUnity;
        const linearAddress = getLinearAddress("ip");
        const data = control.line[2];
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
        setVisualRegister("offset", "si", parseInt(control.line[2],16));
       
        setVisualRegister("offset", "ip", cpu.offsetRegister.ip + 4);
        console.log("step 7")
        return false;
        //step 8
    },(setVisualRegister, cpuXram, getLinearAddress, cpu)=>{
        or[5](setVisualRegister, cpuXram, getLinearAddress, cpu);
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
            dados: ${showHexa(data)}`,
            "get",
            codeSegment.base+cpu.offsetRegister.si
        );
        setVisualRegister("geral", "ebx", data);
        console.log("step 9")
        return false;
    },//step 10
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
       
        
        const dataSegment = cpu.segmentTable[cpu.segmentRegister.ds];
        const linearAddress = getLinearAddress("di");
        cpuXram(
            `bus dados<br/>
            endereço linear = ${showHexa(dataSegment.base)} + ${showHexa(cpu.offsetRegister.di)}<br/>
            endereço linear = ${showHexa(linearAddress)}<br/>`,
            "request",
            linearAddress
        )
        
        return false;
    }, (setVisual, cpuXram, getLinearAddress, cpu) => {
        const linearAddress = getLinearAddress("di");
        cpu.geralRegister.eax = cpu.geralRegister.eax | cpu.geralRegister.ebx
        cpuXram(
            `bus dados<br/>
            dados: ${showHexa(cpu.geralRegister.eax)}`,
            "request",
            linearAddress
        )
        setVisual("geral", "eax", cpu.geralRegister.eax);
        cpu.flag.overflow =  false;
        cpu.flag.carry = false;
        cpu.flag.zero = cpu.geralRegister == 0;
        let twoComp = (cpu.geralRegister.eax>>>0).toString(2);
        cpu.flag.zero = twoComp == 0;
        let test_parity = twoComp;
        test_parity = test_parity.slice(test_parity.length - 8, test_parity.length - 1);
        cpu.flag.parity = test_parity == "11111111";        
        cpu.flag.sign = twoComp[0]==="1"&&!twoComp.split("").every(a=>a==="1")
        console.log("step 10")
        setVisual("ram", linearAddress, cpu.geralRegister.eax)
        return true;
    }
];
export default or;

function showHexa(value, pad = 8){
    return value.toString(16).padStart(pad, "0");
}