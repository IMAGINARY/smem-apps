function InitFireworks() {
	max_fireworks = 6,
	max_sparks = 100;
	 canvasFireworks = document.getElementById('CanvasFireworks');
	 contextFireworks = canvasFireworks.getContext('2d');
	 fireworks = [];
	
}
 
 function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}


function Yeah() { 
for (let i = 0; i < max_fireworks; i++) {
  let firework = {
    sparks: []
  };
  for (let n = 0; n < max_sparks; n++) {
	MioH=hslToRgb(Math.random(),1,0.6+Math.random()*0.2);
    let spark = {
      vx: Math.random() * 5 + .5,
      vy: Math.random() * 5 + .5,
      weight: Math.random() * .3 + .03,

	  red:MioH[0],
	  green:MioH[1],
	  blue:MioH[2]
    };
    if (Math.random() > .5) spark.vx = -spark.vx;
    if (Math.random() > .5) spark.vy = -spark.vy;
    firework.sparks.push(spark);
  }
  fireworks.push(firework);
  resetFirework(firework);
}
//
window.requestAnimationFrame(explode);

}
 
function resetFirework(firework) {
  firework.x = Math.floor(Math.random() * canvasFireworks.width);
  firework.y = canvasFireworks.height;
  firework.age = 0;
  firework.phase = 'fly';
}
 
function explode() {
  contextFireworks.clearRect(0, 0, canvasFireworks.width, canvasFireworks.height);
  fireworks.forEach((firework,index) => {
    if (firework.phase == 'explode') {
        firework.sparks.forEach((spark) => {
        for (let i = 0; i < 10; i++) {
          let trailAge = firework.age + i;
          let x = firework.x + spark.vx * trailAge;
          let y = firework.y + spark.vy * trailAge + spark.weight * trailAge * spark.weight * trailAge;
          let fade = Math.min(1,(i * 20 - firework.age * 2)/1);
          let r = Math.floor(spark.red);
          let g = Math.floor(spark.green);
          let b = Math.floor(spark.blue);
          contextFireworks.beginPath();
          contextFireworks.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ','+1+')';
          contextFireworks.rect(x, y, 2, 2);
          contextFireworks.fill();
        }
      });
      firework.age++;
      if (firework.age > 100 && Math.random() < .05) {
        resetFirework(firework);
      }
    } else {
      firework.y = firework.y - 10;
      for (let spark = 0; spark < 15; spark++) {
        contextFireworks.beginPath();
        contextFireworks.fillStyle = 'rgba(' + 255 + ',' + spark * 255/15 + ',0,1)';
        contextFireworks.rect(firework.x + Math.random() * spark - spark / 2, firework.y + spark * 4, 2, 2);
        contextFireworks.fill();
      }
      if (Math.random() < .001 || firework.y < 200) firework.phase = 'explode';
    }
  });
  window.requestAnimationFrame(explode);
}