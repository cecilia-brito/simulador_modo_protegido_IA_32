//ADD DST, SRC     Add SRC to DST
//TODO adicionar flags
//TODO lidar com números negativos

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
            dados: ${showHexa(data.toString)}`,
            "get",
            codeSegment.base+cpu.offsetRegister.si
        );
        setVisualRegister("geral", "ebx", data);
        console.log("step 9")
        return false;
    },//step 10
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        let n1 = cpu.geralRegister.eax.toString(2);
        let n2 = cpu.geralRegister.ebx.toString(2);
        let sum = cpu.geralRegister.eax + cpu.geralRegister.ebx;
        cpu.flag.carry = n1[0] == n2[0] && n1[0] == 1; 
        setVisual("geral", "eax", cpu.geralRegister.eax);
        const dataSegment = cpu.segmentTable[cpu.segmentRegister.ds];
        const linearAddress = getLinearAddress("di");
        cpuXram(
            `bus dados<br/>
            endereço linear = ${showHexa(dataSegment.base)} + ${showHexa(cpu.offsetRegister.di)}<br/>
            endereço linear = ${showHexa(linearAddress)}<br/>
            dados: ${showHexa(sum)}`,
            "request",
            linearAddress
        )
        console.log("step 10");
        cpu.geralRegister.eax = sum;
        setVisual("ram", linearAddress, cpu.geralRegister.eax);
        let twoComp = (cpu.geralRegister.eax>>>0).toString(2);
        cpu.flag.zero = twoComp == 0;
        let test_parity = twoComp;
        test_parity = test_parity.slice(test_parity.length - 8, test_parity.length - 1);
        cpu.flag.parity = test_parity == "11111111";
        cpu.flag.overflow = (n1[0] == n2[0] && n2[0] == '-' && sum[0] != '-') || (n1[0] != '-' && n2[0] != '-' && sum[0] == '-')
        cpu.flag.sign = twoComp[0];
        return true;
    }
];
export default add;

function showHexa(value, pad = 8){
    return value.toString(16).padStart(pad, "0");
}
  
// Status Flags
//  The status flags (bits 0, 2, 4, 6, 7, and 11) of the EFLAGS register indicate the results of arithmetic instructions, 
// such as the ADD, SUB, MUL, and DIV instructions. The status flag functions are:
//  CF (bit 0)
//  PF (bit 2)
//  AF (bit 4)
//  ZF (bit 6)
//  SF (bit 7)
//  OF (bit 11)
//  Carry flag — Set if an arithmetic operation generates a carry or a borrow out of the most
// significant bit of the result; cleared otherwise. This flag indicates an overflow condition for 
// unsigned-integer arithmetic. It is also used in multiple-precision arithmetic.
//  Parity flag — Set if the least-significant byte of the result contains an even number of 1 bits; 
// cleared otherwise.
//  Auxiliary Carry flag — Set if an arithmetic operation generates a carry or a borrow out of bit 
// 3 of the result; cleared otherwise. This flag is used in binary-coded decimal (BCD) arithmetic.
//  Zero flag — Set if the result is zero; cleared otherwise.
//  Sign flag — Set equal to the most-significant bit of the result, which is the sign bit of a signed 
// integer. (0 indicates a positive value and 1 indicates a negative value.)
//  Overflow flag — Set if the integer result is too large a positive number or too small a negative 
// number (excluding the sign-bit) to fit in the destination operand; cleared otherwise. This flag 
// indicates an overflow condition for signed-integer (two’s complement) arithmetic.
//  Of these status flags, only the CF flag can be modified directly, using the STC, CLC, and CMC instructions. Also the 
// bit instructions (BT, BTS, BTR, and BTC) copy a specified bit into the CF flag

 
// DF Flag
//  The direction flag (DF, located in bit 10 of the EFLAGS register) controls string instructions (MOVS, CMPS, SCAS, 
// LODS, and STOS). Setting the DF flag causes the string instructions to auto-decrement (to process strings from 
// high addresses to low addresses). Clearing the DF flag causes the string instructions to auto-increment 
// (process strings from low addresses to high addresses).
//  The STD and CLD instructions set and clear the DF flag, respectively.
//  3.4.3.3  
// System Flags and IOPL Field
//  The system flags and IOPL field in the EFLAGS register control operating-system or executive operations. They 
// should not be modified by application programs. The functions of the system flags are as follows:
//  TF (bit 8)
//  Trap flag — Set to enable single-step mode for debugging; clear to disable single-step mode.
//  IF (bit 9)
//  Interrupt enable flag — Controls the response of the processor to maskable interrupt 
// requests. Set to respond to maskable interrupts; cleared to inhibit maskable interrupts.
//  IOPL (bits 12 and 13)
//  I/O privilege level field — Indicates the I/O privilege level of the currently running program 
// or task. The current privilege level (CPL) of the currently running program or task must be less 
// than or equal to the I/O privilege level to access the I/O address space. The POPF and IRET 
// instructions can modify this field only when operating at a CPL of 0.
//  NT (bit 14)
//  RF (bit 16)
//  VM (bit 17)
//  AC (bit 18)
//  VIF (bit 19)
//  VIP (bit 20)
//  ID (bit 21)
//  Nested task flag — Controls the chaining of interrupted and called tasks. Set when the 
// current task is linked to the previously executed task; cleared when the current task is not 
// linked to another task.
//  Resume flag — Controls the processor’s response to debug exceptions.
//  Virtual-8086 mode flag — Set to enable virtual-8086 mode; clear to return to protected 
// mode without virtual-8086 mode semantics.
//  Alignment check (or access control) flag — If the AM bit is set in the CR0 register, align
// ment checking of user-mode data accesses is enabled if and only if this flag is 1.
//  If the SMAP bit is set in the CR4 register, explicit supervisor-mode data accesses to user-mode 
// pages are allowed if and only if this bit is 1. See Section 5.6, “Access Rights,” in the Intel® 64 
// and IA-32 Architectures Software Developer’s Manual, Volume 3A.
//  Virtual interrupt flag — Virtual image of the IF flag. Used in conjunction with the VIP flag. 
// (To use this flag and the VIP flag the virtual mode extensions are enabled by setting the VME 
// flag in control register CR4.)
//  Virtual interrupt pending flag — Set to indicate that an interrupt is pending; clear when no 
// interrupt is pending. (Software sets and clears this flag; the processor only reads it.) Used in 
// conjunction with the VIF flag.
//  Identification flag — The ability of a program to set or clear this flag indicates support for 
// the CPUID instruction.
//  Vol. 1 3-17
// BASIC EXECUTION ENVIRONMENT
//  For a detailed description of these flags: see Chapter 3, “Protected-Mode Memory Management,” in the Intel® 64 
// and IA-32 Architectures Software Developer’s Manual, Volume 3A.

// Flags Affected
// The OF, and flags are set according to the result.