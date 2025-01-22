//HLT;
const hlt = [
    line=>{
        return (line[0]&&!line[1]&&!line[2])&&[line[0]]
    }
];
export default hlt;