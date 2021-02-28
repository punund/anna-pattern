// config
const c = {
   canvas: {x: 500, y: 500}, // size
   start: [-24, -134, 0], // starting point
   unit: 20, // step in pixels
   steps: [2,0,1], // to facilitate 0 → 1, 1 → 2, 2 → 0
   randomNoise: 6,
   randomNoiseB: 6
}

const population = [] // vertexes and centers of hexagons

const randomize = (x, v) => x + (v?v:c.randomNoise) * (Math.random() - 0.5)
const hypotenuse = (x, y) => Math.sqrt(x**2 + y**2)
const toPolar = (x, y) => [hypotenuse(x, y), Math.atan2(y, x)]
const fromPolar = (r, a) => [r * Math.cos(a), r * Math.sin(a)]
const rotat = (x, y, angle) => {
   // rotate point about 0,0 by angle
   const [r, a] = toPolar(x, y)
   return fromPolar(r, a + angle)
}
const isNear = (a, b) => hypotenuse(a.x - b.x, a.y - b.y) < c.unit * 1.35

setup = () => {

   createCanvas(c.canvas.x, c.canvas.y)
   strokeWeight(1)
   stroke('yellow')

   // odd: rows of points alternate with a shift
   // d1: every 3rd point is a center
   let odd = 0, d1
   for(let y=c.start[1]; y < c.canvas.y; y += c.unit*Math.sqrt(3)/2) {
      d1 = odd ? 2 : 0
      for(let x=c.start[0] + odd*c.unit/2; x < c.canvas.x + 200; x += c.unit) {
         // rotate the whole canvas to make it look less boring
         const [xx, yy] = rotat(x, y, Math.PI / 12) // 15°
         population.push(d1 == 0 ?
            {x: xx, y: yy, c: true} : // center
            {x: randomize(xx), y: randomize(yy), c: false} // vertex
         )
         d1 = c.steps.indexOf(d1) // cycle d1
      }
      odd = 1 - odd
   }

   population.filter(i => i.c).forEach(a => { // iterate centers
      fill(randomize(88), randomize(169), randomize(209, 60))
      beginShape()
      population // sort to lay out in circle
         .filter(b => !b.c && isNear(b, a))
         .sort((i,j) => Math.atan2(i.y-a.y, i.x-a.x) - Math.atan2(j.y-a.y, j.x-a.x))
         .forEach(z => vertex(z.x, z.y))
      endShape()
   })
}

draw = function () { }
