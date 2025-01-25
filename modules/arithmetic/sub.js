//SUB DST,SRC      Subtract DST from SRC
const sub = [
    line => {
        return(line[0]&&line[1]&&line[2]&&[line[0], line[1], line[2]]);
    },
    // step 1 (Reconhecimento SUB)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const cs = cpu.segmentRegister.cs;
        const codeSegment = cpu.segmentTable[cs];
        cpuXram(
            `bus endereço<br/>
            endereço linear = ${codeSegment.base.toString(16)} + ${cpu.offsetRegister.ip.toString(16)}<br/>
            endereço linear = ${(codeSegment.base + cpu.offsetRegister.ip).toString(16)}`,
            'request', 
            codeSegment.base + cpu.offsetRegister.ip
        )
        getLinearAddress('ip');
    },
    // step 2 (Reconhecimento: SUB)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const linearAddress = getLinearAddress('ip');
        cpuXram(
            `bus dados<br/>
            dados: instrução SUB`,
            'get',
            linearAddress
        );
        setVisual('offset', 'ip', cpu.offsetRegister.ip + 4);
    },
    // step 3 Reconhecimento Destino
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        sub[1](setVisual, cpuXram, getLinearAddress, cpu);
    },
    // step 4 Alteração dos ponteiros Destino e Origem
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const control = cpu.controlUnity;
        const linearAddress = getLinearAddress('ip');
        cpuXram(
            `bus dados<br/>
            dados: ${control.line[1]}`,
            'get',
            linearAddress
        );
        setVisual('offset', 'di', parseInt(control.line[1], 16));
        setVisual('offset', 'si', parseInt(control.line[1], 16));
        setVisual('offset', 'ip', cpu.offsetRegister.ip + 4);
    },
    // step 5
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const ds = cpu.segmentRegister.ds;
        const dataSegment = cpu.segmentTable[ds];
        cpuXram(
            `bus endereço<br/>
            endereço linear = ${dataSegment.base.toString(16)} + ${cpu.offsetRegister.di.toString(16)}<br/>
            endereço linear = ${(dataSegment.base + cpu.offsetRegister.di).toString(16)}`,
            'request',
            dataSegment.base + cpu.offsetRegister.si
        );
        getLinearAddress('si');
    },
    // step 6 (Escrever dados em EAX)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const ram = cpu.ram;
        const ds = cpu.segmentRegister.ds;
        const codeSegment = cpu.segmentTable[ds];
        const linearAddress = getLinearAddress('si');
        const data =
            ram[linearAddress + 3] * 0x1000000 +
            ram[linearAddress + 2] * 0x10000 +
            ram[linearAddress + 1] * 0x100 +
            ram[linearAddress];
        cpuXram(
            `bus dados<br/>
            dados: ${data}`,
            'get',
            codeSegment.base + cpu.offsetRegister.si
        );
        setVisual("geral", "eax", data);
      },
    // step 7 (Reconhecimento Origem)
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        sub[3](setVisual, cpuXram, getLinearAddress, cpu);
        console.log('step 7');
    },
    // step 8
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const control = cpu.controlUnity;
        const linearAddress = getLinearAddress('ip');
        const data = control.line[2];
        cpuXram(
            `bus dados<br/>
            dados: ${data.toString(16)}`,
            'get', 
            linearAddress
        );
        setVisual('offset', 'si', parseInt(control.line[2], 16));
        setVisual('offset', 'ip', parseInt(cpu.offsetRegister.ip + 4));
    },
    // step 9
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        sub[5](setVisual, cpuXram, getLinearAddress, cpu);
    },
    // step 10
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const ram = cpu.ram;
        const ds = cpu.segmentRegister.ds;
        const codeSegment = cpu.segmentTable[ds];
        const linearAddress = getLinearAddress('si');
        const data =
            ram[linearAddress + 3] * 0x1000000 +
            ram[linearAddress + 2] * 0x10000 +
            ram[linearAddress + 1] * 0x100 +
            ram[linearAddress];
        cpuXram(
            `bus dados<br/>
            dados: ${data}`,
            'request',
            codeSegment.base + cpu.offsetRegister.si
        )
        setVisual('geral', 'ebx', data);
    },
    // step 12
    (setVisual, cpuXram, getLinearAddress, cpu) => {
        const eax = cpu.geralRegister.eax;
        const ebx = cpu.geralRegister.ebx;
        let subtraction = eax - ebx;
        setVisual('geral', 'eax', subtraction);
        cpu.geralRegister.eax -= cpu.geralRegister.ebx; 
        const linearAddress = getLinearAddress('di');
        cpuXram(
            `bus dados<br/>`,
            'request',
            linearAddress
        );
        setVisual('ram', linearAddress, cpu.geralRegister.eax);
        return true
    }
];
export default sub;

/* 
Passos:
1. Request p/ RAM da destino
2. Informações da RAM destino (Edita EAX)
3. Request p/ RAM destino 
4. Informações da Ram Destino (Edita EAX)
5. Operação EAX -> EAX - EBX (Edita EAX)
6. Atualiza Flags

*/