//NEG DST         Negate DST (subtract it from 0)
const neg = [
    line=>{
        return (line[0]&&line[1]&&!line[2])&&[line[0], line[1]];
    },
    //step 1
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const cs = cpu.segmentRegister.cs;
        const codeSegment = cpu.segmentTable[cs];
        
        const linearAddress = getLinearAddress("ip");

    }
];
export default neg;