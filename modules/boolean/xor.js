//XOR DST, SRC      Boolean Exclusive OR SRC to DST
const xor = [
  (line) => {
    if (
      line[0] !== undefined &&
      line[1] !== undefined &&
      line[2] !== undefined
    ) {
      return [line[0], line[1], line[2]];
    }
  },
  //step 1
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const cs = cpu.segmentRegister.cs;
    const codeSegment = cpu.segmentTable[cs];
    cpuXram(
      `bus endereço<br/>
        endereço linear = ${showHexa(codeSegment.base)} + ${showHexa(cpu.offsetRegister.ip)}<br/>
        endereço linear = ${showHexa(codeSegment.base + cpu.offsetRegister.ip)}`,
      "request",
      codeSegment.base + cpu.offsetRegister.ip
    );
    getLinearAddress("ip");
    console.log(cpu.controlUnity);
  },
  //step 2
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const linearAddress = getLinearAddress("ip");
    cpuXram(
      `bus dados<br/>
            dados: instrução XOR`,
      "get",
      linearAddress
    );
    setVisual("offset", "ip", cpu.offsetRegister.ip + 4);
  },

  //step 3
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    xor[1](setVisual, cpuXram, getLinearAddress, cpu);
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
    setVisual("offset", "si", parseInt(control.line[1], 16));
    setVisual("offset", "ip", cpu.offsetRegister.ip + 4);
  },

  //step 5
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const ds = cpu.segmentRegister.ds;
    const dataSegment = cpu.segmentTable[ds];
    cpuXram(
      `bus endereço<br/>
            endereço linear = ${showHexa(dataSegment.base)} + ${showHexa(cpu.offsetRegister.si)}<br/>
            endereço linear = ${showHexa(dataSegment.base + cpu.offsetRegister.si)}`,
      "request",
      dataSegment.base + cpu.offsetRegister.si
    );
    getLinearAddress("si");
  },

  //step 6
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const ram = cpu.ram;
    const linearAddress = getLinearAddress("si");
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
    setVisual("geral", "eax", data);
  },

  //step 7
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    xor[1](setVisual, cpuXram, getLinearAddress, cpu);
  },

  //step 8
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const control = cpu.controlUnity;
    const linearAddress = getLinearAddress("ip");
    cpuXram(
      `bus dados<br/>
            dados: ${control.line[2]}`,
      "get",
      linearAddress
    );
    setVisual("offset", "si", parseInt(control.line[2], 16));
    setVisual("offset", "ip", cpu.offsetRegister.ip + 4);
  },

  //step 9
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const ds = cpu.segmentRegister.ds;
    const dataSegment = cpu.segmentTable[ds];
    cpuXram(
      `bus endereço<br/>
            endereço linear = ${showHexa(dataSegment.base)} + ${showHexa(cpu.offsetRegister.si)}<br/>
            endereço linear = ${showHexa(
              dataSegment.base + cpu.offsetRegister.si
            )}`,
      "request",
      dataSegment.base + cpu.offsetRegister.si
    );
    getLinearAddress("si");
  },

  //step 10
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const ram = cpu.ram;
    const linearAddress = getLinearAddress("si");
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

  //step 11
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

  //step 12
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const eax = cpu.geralRegister.eax;
    const ebx = cpu.geralRegister.ebx;
    let ExclusiveOr = eax ^ ebx;
    setVisual("geral", "eax", ExclusiveOr);
    const linearAddress = getLinearAddress("di");
    cpuXram(
      `bus dados<br/>
        dados: ${showHexa(cpu.geralRegister.eax)}`,
      "request",
      linearAddress
    );
    setVisual("ram", linearAddress, cpu.geralRegister.eax);
    return true;
  },
];
export default xor;

function showHexa(value, pad = 8){
    return value.toString(16).padStart(pad, "0");
}
