//NEG DST         Negate DST (subtract it from 0)
const neg = [
    //line é uma array de três posições. 
    //Os elementos são as partes relevantes de uma linha.
    line=>{
        if(line[0] !== undefined && line[1] !== undefined && line[2] === undefined){
            return [line[0], line[1]]
        }
        //return (line[0]&&line[1]&&!line[2])&&[line[0], line[1]];
    },
    //step 1
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
        //registrador cs
        const cs = cpu.segmentRegister.cs;
        //acesso na tabela de segmentos referente a cs
        const codeSegment = cpu.segmentTable[cs];
        cpuXram(
            //desc
            `bus endereço\n`
            +`endereço linear = ${codeSegment.base} + ${cpu.offsetRegister.ip}\n`
            +`endereço linear = ${codeSegment.base + cpu.offsetRegister.ip}`,
            //request = "->"
            //get = "<-"
            //"" = [] (quadrado)
            "request",
            //posição na ram
            codeSegment.base+cpu.offsetRegister.ip
        );
        const linearAddress = getLinearAddress("ip");
        //muda o ip pra 5 no visual
        //não é necessário aquu, botei pra exemplificar.
        setVisual("offset", "ip", 5);   

    },
    //step 2
];
export default neg;