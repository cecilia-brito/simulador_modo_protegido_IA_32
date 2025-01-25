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
        endereço linear = ${(codeSegment.base + cpu.offsetRegister.ip).toString(
          16
        )}`,
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
            endereço linear = ${dataSegment.base.toString(
              16
            )} + ${cpu.offsetRegister.di.toString(16)}<br/>
            endereço linear = ${(
              dataSegment.base + cpu.offsetRegister.di
            ).toString(16)}`,
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
            dados: ${data}`,
      "get",
      linearAddress
    );
    setVisual("geral", "eax", data);
  },
  //step 7
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const eax = cpu.geralRegister.eax;
    const src = cpu.controlUnity.line[1]; // Operando fonte vindo do array
    const result = eax * src;
    cpu.geralRegister.eax = result & 0xffffffff; // Menos significativos
    cpu.geralRegister.edx = (result >> 32) & 0xffffffff; // Mais significativos
    setVisual("geral", "eax", cpu.geralRegister.eax);
    setVisual("geral", "edx", cpu.geralRegister.edx);
    const dataSegment = cpu.segmentTable[cpu.segmentRegister.ds];
    const linearAddress = getLinearAddress("di");
    cpuXram(
      `bus dados<br/>
        endereço linear = ${dataSegment.base} + ${cpu.offsetRegister.di}<br/>
        endereço linear = ${linearAddress}<br/>
        dados: ${cpu.geralRegister.eax.toString(16)}`,
      "request",
      linearAddress
    );
    setVisual("ram", linearAddress, cpu.geralRegister.eax);
    return true;
  },
];

export default mul;