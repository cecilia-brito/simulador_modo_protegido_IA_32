import add from "./modules/arithmetic/add.js";
import dec from "./modules/arithmetic/dec.js";
import inc from "./modules/arithmetic/inc.js";
import mul from "./modules/arithmetic/mul.js";
import neg from "./modules/arithmetic/neg.js";
import sub from "./modules/arithmetic/sub.js";
import and from "./modules/boolean/and.js";
import not from "./modules/boolean/not.js";
import or from "./modules/boolean/or.js";
import xor from "./modules/boolean/xor.js";
import call from "./modules/compare_test/call.js";
import cmp from "./modules/compare_test/cmp.js";
import iret from "./modules/compare_test/iret.js";
import jmp from "./modules/compare_test/jmp.js";
import jxx from "./modules/compare_test/jxx.js";
import loop from "./modules/compare_test/loop.js";
import ret from "./modules/compare_test/ret.js";
import mob from "./modules/moves/mov.js";
import pop from "./modules/moves/pop.js";
import push from "./modules/moves/push.js";
import xcgh from "./modules/moves/xcgh.js";

const cpu = {
    geralRegister: {
    },
    offsetRegister: {
    },
    segmentRegister: {
    },
    flag: {
        zero: false,
        carry: false,
        overflow: false,
        sign: false,
        parity: false,
        auxiliary: false,
        direction: false,
        trap: false,
        interrupt: false,
        privilage: false,
        nested: false,
        resume: false,
        virtual: false,
        alignment: false,
        virtualInterrupt: false,
        pending: false,
        id: false,
    },
    controlUnity:{
        instruction: "",
        step: 0,
    },
    ram: Array.apply(null, Array(64000)).map(()=>0),
};


function setVisualRegister(type, register, value){
    cpu[type+"Register"][register] = value;
    document.getElementById(register).textContent = value.toString(16);
};
setVisualRegister("geral", "eax", 81);
setVisualRegister("geral", "ebx", 0);
setVisualRegister("geral", "ecx", 15);
setVisualRegister("geral", "edx", 4239);

setVisualRegister("segment", "cs", 0);
setVisualRegister("segment", "ds", 2**16);
setVisualRegister("segment", "ss", 2**17);

setVisualRegister("offset", "ip", 0);
setVisualRegister("offset", "sp", 563);
setVisualRegister("offset", "bp", 435);
setVisualRegister("offset", "si", 233);
setVisualRegister("offset", "di", 100);