//Jxx ADDR        Conditional jumps based on flag
// temos que XX representa:
// G        >
// GE       >=
// E          =
// NE       !=
// L         <
// LE       <=

const jxx = [
    (array) => {
        const regex = /(j{1})([a-z]{1,2})/gi;
        console.log(array)
        if(array[0] != undefined && array[1] != undefined){
            let matches = array[0].matchAll(regex);
            let condition = [...matches]
            condition = condition[0][2].toUpperCase()
            switch (condition) {
                case "G":
                    return ["jxx", array[1], "G"];
                case "GE":
                    return ["jxx", array[1], "GE"];
                case "E":
                    return ["jxx", array[1], "E"];
                case "NE":
                    return ["jxx", array[1], "NE"];
                case "LE":
                    return ["jxx", array[1], "LE"];
                case "L":
                    return ["jxx", array[1], "L"];
                default:
                    break;
            }
        
        }
    },
    (setVisual, cpuXram, getLinearAddress, cpu)=>{
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
        console.log("step 1")
        return false;
    },  (setVisual, cpuXram, getLinearAddress, cpu)=>{
        const linearAddress = getLinearAddress('ip');
       
        cpuXram(
            //desc
            `Bus Dados<br>`
           +`${'J'+cpu.controlUnity.line[2]}`,
            //request = "->"
            //get = "<-"
            //"" = [] (quadrado)
            "get",
            //posição na ram
            linearAddress
        );
        setVisual("offset", "ip", cpu.offsetRegister.ip + 4);
        console.log("step 2")
        return false;
    },(setVisual, cpuXram, getLinearAddress, cpu) =>{
        jxx[1](setVisual, cpuXram, getLinearAddress, cpu);
	},(setVisual, cpuXram, getLinearAddress, cpu) =>{
		const cs = cpu.segmentRegister.cs;
        const codeSegment = cpu.segmentTable[cs];
        const control = cpu.controlUnity

        cpuXram(
            `Endereço para o salto =  ${control.line[1]}<br/>`,
            codeSegment.base+cpu.offsetRegister.ip
        );
        const linearAddress = getLinearAddress("ip");
		console.log('step 4')
        return false
	},
     (setVisual, cpuXram, getLinearAddress, cpu)=>{
        let condition = cpu.controlUnity.line[2]
		console.log(cpu.controlUnity)
        switch (condition) {
            case "G":
                if(cpu.flag.zero == false && cpu.flag.sign == false){
                    const cs = cpu.segmentRegister.cs;
                    const codeSegment = cpu.segmentTable[cs];
                    const control = cpu.controlUnity
                    const dataAdress = (parseInt(control.line[1], 16));
                    setVisual("offset", "ip", dataAdress)
					
                    console.log(cpu)

                    cpuXram(
                        
                        `Pulando para o endereço: ${showHexa(control.line[1])}`,

                        codeSegment.base+cpu.offsetRegister.ip
                    );
                }
            case "GE":
                if(cpu.flag.sign == cpu.flag.overflow){
                    const cs = cpu.segmentRegister.cs;
                    const codeSegment = cpu.segmentTable[cs];
                    const control = cpu.controlUnity
                    const dataAdress = (parseInt(control.line[1], 16));

                    setVisual("offset", "ip", dataAdress)
					
                    console.log(cpu)

                    cpuXram(
                        
                        `Pulando para o endereço: ${showHexa(control.line[1])}`,

                        codeSegment.base+cpu.offsetRegister.ip
                    );
                }
            case "E":
                if(cpu.flag.zero == true){
                    const cs = cpu.segmentRegister.cs;
                    const codeSegment = cpu.segmentTable[cs];
                    const control = cpu.controlUnity
                    const dataAdress = (parseInt(control.line[1], 16));

                    setVisual("offset", "ip", dataAdress)
				
                    console.log(cpu)

                    cpuXram(
                        
                        `Pulando para o endereço: ${showHexa(control.line[1])}`,

                        codeSegment.base+cpu.offsetRegister.ip
                    );
                }
            case "NE":
                if(cpu.flag.zero == false){
                    const cs = cpu.segmentRegister.cs;
                    const codeSegment = cpu.segmentTable[cs];
                    const control = cpu.controlUnity
                    const dataAdress = (parseInt(control.line[1], 16));
            
                    setVisual("offset", "ip", dataAdress)
					
                    console.log(cpu)
            
                    cpuXram(
                        
                        `Pulando para o endereço: ${showHexa(control.line[1])}`,
            
                        codeSegment.base+cpu.offsetRegister.ip
                    ); 
                }
            case "LE":
                if(cpu.flag.zero == true || cpu.flag.sign != cpu.flag.overflow){
                    const cs = cpu.segmentRegister.cs;
                    const codeSegment = cpu.segmentTable[cs];
                    const control = cpu.controlUnity
                    const dataAdress = (parseInt(control.line[1], 16));

                    setVisual("offset", "ip", dataAdress)
					
                    console.log(cpu)

                    cpuXram(
                        
                        `Pulando para o endereço: ${showHexa(control.line[1])}`,

                        codeSegment.base+cpu.offsetRegister.ip
                    );
                }

            case "L":
                if(cpu.flag.overflow != cpu.flag.sign){
					const cs = cpu.segmentRegister.cs;
					const codeSegment = cpu.segmentTable[cs];
					const control = cpu.controlUnity
					const dataAdress = (parseInt(control.line[1], 16));

					setVisual("offset", "ip", dataAdress)
					
					console.log(cpu)

					cpuXram(
						
						`Pulando para o endereço: ${showHexa(control.line[1])}`,

						codeSegment.base+cpu.offsetRegister.ip
					);
				}
            default:
                break;
        
        }
		
		console.log('step 5')
        return true;
    }

];
export default jxx;

function showHexa(value, pad = 8){
    return value.toString(16).padStart(pad, "0");
}