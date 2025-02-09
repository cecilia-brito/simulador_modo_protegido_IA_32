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
        if(array[0] != undefined){
            let matches = array[0].matchAll(regex);
            let condition = matches[2];
            switch (condition) {
                case "G":
                    return array;
                case "GE":
                    return array;
                case "E":
                    return array;
                case "NE":
                    return array;
                case "LE":
                    return array;
                case "L":
                    return array;
                default:
                    break;
            }
        }
    },
    (setVisual, cpuXRam,getLinearAddress, cpu)=>{
        return true;
    }

];
export default jxx;