const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let streams = [];
const fadeInterval = 1.6;
const symbolSize = 30;
let frameCount = 0;

function Symbol(x, y, speed, first, opacity) {
    this.x = x;
    this.y = y;
    this.value;
    this.speed = speed;
    this.first = first;
    this.opacity = opacity;
    this.switchInterval = Math.round(Math.random() * 23 + 2);

    this.setToRandomSymbol = function() {
        if (frameCount % this.switchInterval == 0) {
            const charType = Math.round(Math.random() * 5);
            if (charType > 1) {
                this.value = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 97));
            } else {
                this.value = Math.floor(Math.random() * 10);
            }
        }
    };

    this.rain = function() {
        this.y = (this.y >= canvas.height) ? 0 : this.y + this.speed;
    };
}

function Stream() {
    this.symbols = [];
    this.z = Math.random();
    this.totalSymbols = Math.round(this.z * 25 + 10);
    this.speed = this.z * 5 + 3;
    this.fontSize = symbolSize * this.z + 5;


    this.generateSymbols = function(x, y) {
        let opacity = 255;
        let first = Math.round(Math.random() * 4) == 1;
        for (let i = 0; i <= this.totalSymbols; i++) {
            const symbol = new Symbol(x, y, this.speed, first, opacity);
            symbol.setToRandomSymbol();
            this.symbols.push(symbol);
            opacity -= (255 / this.totalSymbols) / fadeInterval;
            y -= (this.fontSize);
            first = false;
        }
    };

    this.render = function() {
        ctx.font = `${this.fontSize}px Consolas`
        this.symbols.forEach(function(symbol) {
            if (symbol.first) {
                ctx.fillStyle = `rgba(140, 255, 170, ${symbol.opacity / 255})`;
            } else {
                ctx.fillStyle = `rgba(0, 255, 70, ${symbol.opacity / 255})`;
            }
            ctx.fillText(symbol.value, symbol.x, symbol.y);
            symbol.rain();
            symbol.setToRandomSymbol();
        });
    };
}

let x = 0;
while (x < window.innerWidth) {
    const stream = new Stream();
    stream.generateSymbols(x, Math.random() * -2000);
    streams.push(stream);
    x += (stream.fontSize);
}
ctx.font = `${symbolSize}px Consolas`;

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.58)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    streams.forEach(function(stream) {
        stream.render();
    });

    frameCount++;
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});