// XCHG DS1, DS2      Exchange DS1 and DS2
const xchg = [
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
          endereço linear = ${codeSegment.base.toString(
            16
          )} + ${cpu.offsetRegister.ip.toString(16)}<br/>
          endereço linear = ${(
            codeSegment.base + cpu.offsetRegister.ip
          ).toString(16)}`,
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
              dados: instrução XCHG`,
      "get",
      linearAddress
    );
    setVisual("offset", "ip", cpu.offsetRegister.ip + 4);
  },
  //step 3
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    xchg[1](setVisual, cpuXram, getLinearAddress, cpu);
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
              endereço linear = ${dataSegment.base.toString(
                16
              )} + ${cpu.offsetRegister.si.toString(16)}<br/>
              endereço linear = ${(
                dataSegment.base + cpu.offsetRegister.si
              ).toString(16)}`,
      "request",
      dataSegment.base + cpu.offsetRegister.si
    );
    getLinearAddress("si");
  },
  //step 6
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const ram = cpu.ram;
    const linearAddress = getLinearAddress("si");
    const data1 =
      ram[linearAddress + 3] * 0x1000000 +
      ram[linearAddress + 2] * 0x10000 +
      ram[linearAddress + 1] * 0x100 +
      ram[linearAddress];
    cpuXram(
      `bus dados<br/>
              dados: ${data1}`,
      "get",
      linearAddress
    );
    setVisual("geral", "eax", data1);
  },
  //step 7
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    xchg[1](setVisual, cpuXram, getLinearAddress, cpu);
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
              endereço linear = ${dataSegment.base.toString(
                16
              )} + ${cpu.offsetRegister.si.toString(16)}<br/>
              endereço linear = ${(
                dataSegment.base + cpu.offsetRegister.si
              ).toString(16)}`,
      "request",
      dataSegment.base + cpu.offsetRegister.si
    );
    getLinearAddress("si");
  },
  //step 10
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const ram = cpu.ram;
    const linearAddress = getLinearAddress("si");
    const data2 =
      ram[linearAddress + 3] * 0x1000000 +
      ram[linearAddress + 2] * 0x10000 +
      ram[linearAddress + 1] * 0x100 +
      ram[linearAddress];
    cpuXram(
      `bus dados<br/>
              dados: ${data2}`,
      "get",
      linearAddress
    );
    setVisual("geral", "ebx", data2);
  },
  //step 11
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
  //step 12
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const ebx = cpu.geralRegister.ebx;
    const linearAddress1 = getLinearAddress("di");
    cpuXram(
      `bus dados<br/>
          dados: ${ebx.toString(16)}`,
      "request",
      linearAddress1
    );
    setVisual("ram", linearAddress1, ebx);
  },
  //step 13
  (setVisual, cpuXram, getLinearAddress, cpu) => {
    const eax = cpu.geralRegister.eax;
    const linearAddress2 = getLinearAddress("si");

    cpuXram(
      `bus dados<br/>
          dados: ${eax.toString(16)}`,
      "request",
      linearAddress2
    );
    setVisual("ram", linearAddress2, eax);
    return true;
  },
];
export default xchg;
