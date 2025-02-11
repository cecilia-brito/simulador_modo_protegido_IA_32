//MUL DST        Multiply DST by EAX
const mul = [
  (line) => {
    if (line[0] !== undefined && line[1] !== undefined && line[2] === undefined) {
      return [line[0], line[1]];
    }
  },
  //step 1
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const cs = cpu.segmentRegister.cs;
    const codeSegment = cpu.segmentTable[cs];
    cpuXram(
      `bus endereço<br/>
        endereço linear = ${codeSegment.base.toString(
          16
        )} + ${cpu.offsetRegister.ip.toString(16)}<br/>
        endereço linear = ${showHexa(codeSegment.base + cpu.offsetRegister.ip)}`,
      "request",
      codeSegment.base + cpu.offsetRegister.ip
    );
    getLinearAddress("ip");
  },
  //step 2
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const linearAddress = getLinearAddress("ip");
    cpuXram(
      `bus dados<br/>
            dados: instrução MUL`,
      "get",
      linearAddress
    );
    setVisual("offset", "ip", cpu.offsetRegister.ip + 4);
  },
  //step 3
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    mul[1](setVisual, cpuXram, getLinearAddress, cpu);
  },
  //step 4
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const control = cpu.controlUnity;
    const linearAddress = getLinearAddress("ip");
    cpuXram(
      `bus dados<br/>
            dados: ${control.line[1]}`,
      "get",
      linearAddress
    );
    setVisual("offset", "di", parseInt(control.line[1], 16));
    setVisual("offset", "ip", cpu.offsetRegister.ip + 4);
  },
  //step 5
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const ds = cpu.segmentRegister.ds;
    const dataSegment = cpu.segmentTable[ds];
    cpuXram(
      `bus endereço<br/>
            endereço linear = ${showHexa(dataSegment.base)} + ${showHexa(cpu.offsetRegister.di)}<br/>
            endereço linear = ${showHexa(dataSegment.base + cpu.offsetRegister.di)}`,
      "request",
      dataSegment.base + cpu.offsetRegister.di
    );
    getLinearAddress("di");
  },
  //step 6
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const ram = cpu.ram;
    const linearAddress = getLinearAddress("di");
    const data =
      ram[linearAddress + 3] * 0x1000000 +
      ram[linearAddress + 2] * 0x10000 +
      ram[linearAddress + 1] * 0x100 +
      ram[linearAddress];
    cpuXram(
      `bus dados<br/>
            dados: ${showHexa(data)}`,
      "get",
      linearAddress
    );
    setVisual("geral", "ebx", data);
  },
  //step 7
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const eax = cpu.geralRegister.eax;
    const ebx = cpu.geralRegister.ebx; // Operando fonte vindo do array
    const result = (eax * ebx).toString(16).padStart(16, "0");
    console.log(result)
    cpu.geralRegister.eax = parseInt(result.slice(-8),16) // Menos significativos
    cpu.geralRegister.edx = parseInt(result.slice(0, 8),16); // Mais significativos
    setVisual("geral", "eax", cpu.geralRegister.eax);
    setVisual("geral", "edx", cpu.geralRegister.edx);
    const dataSegment = cpu.segmentTable[cpu.segmentRegister.ds];
    const linearAddress = getLinearAddress("di");
    cpuXram(
      `bus dados<br/>
        endereço linear = ${showHexa(dataSegment.base)} + ${showHexa(cpu.offsetRegister.di)}<br/>
        endereço linear = ${showHexa(linearAddress)}<br/>
        dados: ${showHexa(cpu.geralRegister.eax)}`,
      "request",
      linearAddress
    );
    setVisual("ram", linearAddress, cpu.geralRegister.eax);
    if (cpu.geralRegister.edx !== 0) {
      cpu.flag.overflow = true;
      cpu.flag.carry = true;
    }
    else {
      cpu.flag.overflow = false;
      cpu.flag.carry = false;
    }
    return true;
  },
];

export default mul;

function showHexa(value, pad = 8){
    return value.toString(16).padStart(pad, "0");
}