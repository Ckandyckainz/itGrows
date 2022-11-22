let mcan = document.getElementById("mcan");
let mctx = mcan.getContext("2d");
mcan.width = window.innerWidth;
mcan.height = window.innerHeight;
let lcan = document.getElementById("lcan");
let lctx = lcan.getContext("2d");
lcan.width = window.innerWidth;
lcan.height = window.innerHeight;
mcw = mcan.width;
mch = mcan.height;
mctx.fillRect(0, 0, mcan.width, mcan.height);

class Path{
    constructor(parent){
        this.id = paths.length;
        this.x = parent.x;
        this.y = parent.y;
        this.color = parent.color;
        this.colorChange = [];
        parent.colorChange.forEach((item)=>{
            this.colorChange.push(item*(Math.random()*1+0.5));
        });
        this.angle = parent.angle;
        this.angleChange = parent.angleChange*(Math.random()+0.5);
        this.angleChangeChange = parent.angleChangeChange*-1*(Math.random()+0.5);
        this.branchProb = parent.branchProb;
        paths.push(this);
    }
    delete(){
        let i = 0;
        while (paths[i].id != this.id) {
            i ++;
        }
        paths.splice(i, 1);
    }
    drawSelf(ctx, cw){
        this.angleChange += this.angleChangeChange;
        this.angle += this.angleChange;
        ctx.lineWidth = cw/200;
        lctx.lineWidth = cw/200;
        for (let i=0; i<3; i++) {
            this.color[i] += this.colorChange[i];
            if (this.color[i] < 0) {
                this.color[i] -= this.colorChange[i]*2;
                this.colorChange[i] *= -1;
            }
            if (this.color[i] > 1) {
                this.color[i] -= this.colorChange[i]*2;
                this.colorChange[i] *= -1;
            }
        }
        ctx.strokeStyle = colorString(...this.color, 1);
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        lctx.strokeStyle = colorString(...this.color, 1);
        lctx.beginPath();
        lctx.moveTo(this.x, this.y);
        this.x += Math.cos(this.angle)*cw/200;
        this.y += Math.sin(this.angle)*cw/200;
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        lctx.lineTo(this.x, this.y);
        lctx.stroke();
    }
}

function colorString(r, g, b, a){
	let color = Math.floor(r*255)*256**3+Math.floor(g*255)*256**2+Math.floor(b*255)*256+Math.floor(a*255);
    return "#"+color.toString(16).padStart(8, "0");
}

let paths = [];
new Path({x: mcw/2, y: mch/2, color: [Math.random(), Math.random(), Math.random()], colorChange: [Math.random()/90-1/180, Math.random()/90-1/180, Math.random()/90-1/180], angle: 0, angleChange: (Math.random()/10-1/20)*Math.PI, angleChangeChange: (Math.random()/1000-1/2000)*Math.PI, branchProb: 1/300});

function drawingLoop(){
    let imgdt = mctx.getImageData(0, 0, mcw, mch);
    for (let i=0; i<imgdt.data.length; i++) {
        if (i%4 != 3) {
            imgdt.data[i-4] += imgdt.data[i]*0.25;
            if (imgdt.data[i-4] > 255) {
                imgdt.data[i-4] = 255;
            }
            imgdt.data[i+4] += imgdt.data[i]*0.25;
            if (imgdt.data[i+4] > 255) {
                imgdt.data[i+4] = 255;
            }
            imgdt.data[i-mcw*4] += imgdt.data[i]*0.25;
            if (imgdt.data[i-mcw*4] > 255) {
                imgdt.data[i-mcw*4] = 255;
            }
            imgdt.data[i+mcw*4] += imgdt.data[i]*0.25;
            if (imgdt.data[i+mcw*4] > 255) {
                imgdt.data[i+mcw*4] = 255;
            }
            imgdt.data[i] = 0;
        }
    }
    mctx.putImageData(imgdt, 0, 0);
    let limgdt = lctx.getImageData(0, 0, mcw, mch);
    for (let i=0; i<limgdt.data.length/4; i++) {
        limgdt.data[i*4+3] *= 0.99;
    }
    lctx.putImageData(limgdt, 0, 0);
    paths.forEach((path)=>{
        path.drawSelf(mctx, mcw);
        if (Math.random() < path.branchProb) {
            new Path(path);
        }
    });
    requestAnimationFrame(drawingLoop);
}
drawingLoop();