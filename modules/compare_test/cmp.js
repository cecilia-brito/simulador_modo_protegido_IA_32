//CMP SRC1,SRC2    Set flags based on SRC1 - SRC2

// temos que XX representa:

// G        >

// GE       >=

// E          =

// NE       !=

// L            

// LE        

// Na instrução LOOP XX

// XX representa o endereço ou label

// que indica o inicio do loop

const cmp = [
    line => {
        return(line[0]&&line[1]&&line[2]&&[line[0], line[1], line[2]]);
    },
    // step 1 (Reconhecimento SUB)
    /*
    Procedimentos:
    Selecionar registrador cs
    Selecionar seguimento de código da tabela

    Somar endereço base da tabela com o endereço de offset
    verificar gpf
    */

    // Passo 1
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const cs = cpu.segmentRegister.cs
        const codeSegment = cpu.segmentTable[cs]
        cpuXram(
            `bus endereço<br/>
            end. linear = ${showHexa(codeSegment.base)} + ${showHexa(cpu.offsetRegister.ip)}<br/>
            end. linear = ${showHexa(codeSegment.base + cpu.offsetRegister.ip)}`,
            'request',
            codeSegment.base + cpu.offsetRegister.ip
        )
        getLinearAddress('ip')
        console.log('p1')
    },


    // Passo 2
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const linearAddress = getLinearAddress('ip')
        cpuXram(
            `bus dado<br/>
            dado: CMP`,
            'get',
            linearAddress
        )   
        setVisual('offset','ip', cpu.offsetRegister.ip + 4)
        console.log('p2')
    },


    // Passo 3
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        cmp[1](setVisual, cpuXram, getLinearAddress, cpu)
        console.log('p3')   
    },


    //Passo 4
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const control = cpu.controlUnity
        const linearAddress = getLinearAddress('ip')
        cpuXram(
            `bus dados<br/> dados: ${control.line[1]}`,
            'get',
            linearAddress
        )
        setVisual('offset', 'di', parseInt(control.line[1], 16))
        setVisual('offset', 'si', parseInt(control.line[1], 16))
        setVisual('offset', 'ip', cpu.offsetRegister.ip + 4)
    },


    // Passo 5 (Request de Dados do destino)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const ds = cpu.segmentRegister.ds
        const dataSegment = cpu.segmentTable[ds]
        cpuXram(
            `bus endereço<br/>
            endereço linear = ${showHexa(dataSegment.base)} + ${showHexa(cpu.offsetRegister.si)}<br/>
            endereço linear = ${showHexa(dataSegment.base + cpu.offsetRegister.si)}`,
            "request",
            dataSegment.base + cpu.offsetRegister.si
        )
        getLinearAddress('si')
    },


    // Passo 6
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const ram = cpu.ram
        const linearAddress = getLinearAddress('si')
        const data =
            ram[linearAddress + 3] * 0x1000000 +
            ram[linearAddress + 2] * 0x10000 +
            ram[linearAddress + 1] * 0x100 +
            ram[linearAddress]
        cpuXram(
            `bus dados<br/>
            dados ${showHexa(data)}`,
            'get',
            linearAddress
        )
        setVisual('geral', 'eax', data)
    },


    // Passo 7
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        cmp[1](setVisual, cpuXram, getLinearAddress, cpu)
    },


    // Passo 8
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const control = cpu.controlUnity
        const linearAddress = getLinearAddress('ip')
        cpuXram(
            `bus dados<br/> dados: ${control.line[2]}`,
            'get',
            linearAddress
        )
        setVisual('offset', 'si', parseInt(control.line[2], 16))
        setVisual('offset', 'ip', cpu.offsetRegister.ip + 4)
    },

    // Passo 9 (Request dos dados de SRC)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        cmp[5](setVisual, cpuXram, getLinearAddress, cpu)
    },

    // Passo 10
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const ram = cpu.ram
        const linearAddress = getLinearAddress('si')
        const data =
            ram[linearAddress + 3] * 0x1000000 +
            ram[linearAddress + 2] * 0x10000 +
            ram[linearAddress + 1] * 0x100 +
            ram[linearAddress]
        cpuXram(
            `bus dados<br/>
            dados ${showHexa(data)}`,
            'get',
            linearAddress
        )
        setVisual('geral', 'ebx', data)
    },

    // Passo 11 (Request da posição de escrita)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const ds = cpu.segmentRegister.ds
        const dataSegment = cpu.segmentTable[ds]
        cpuXram(
            `bus endereço<br/>
            endereço linear = ${showHexa(dataSegment.base)} + ${showHexa(cpu.offsetRegister.di)}<br/>
            endereço linear = ${showHexa(dataSegment.base + cpu.offsetRegister.di)}`,
            'request',
            dataSegment.base + cpu.offsetRegister.di
        )
        getLinearAddress('di')
    },
    

    // Passo 12
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const eax = cpu.geralRegister.eax
        const ebx = cpu.geralRegister.ebx
        let subtraction = eax - ebx
        let resto = (subtraction>>>0)%0x100000000
        const linearAddress = getLinearAddress('di')
        cpuXram(
            `bus dados <br/>
            dado: ${showHexa(cpu.geralRegister.eax)}`,
            'request',
            linearAddress
        )
        cpu.flag.zero = subtraction === 0
        cpu.flag.sign = subtraction.toString(2)[0] === "1"
        cpu.flag.overflow = resto !== subtraction
        return true
    }
];
export default cmp;
function showHexa(value, pad = 8){
    return value.toString(16).padStart(pad, "0");
}