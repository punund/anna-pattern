// config
const c = {
   canvas: {x: 500, y: 500}, // size
   start: [-24, -134, 0], // starting point
   unit: 20, // step in pixels
   neibrs: [ // points are different in each row
      [0,2,4].map(x => x * Math.PI / 3),
      [1,3,5].map(x => x * Math.PI / 3)
   ],
   steps: [2,0,1],
   randomNoise: 6,
   randomNoiseB: 6
}

const population = []

const randomize = (x, v) => x + (v?v:c.randomNoise) * (Math.random() - 0.5)
// const noisify = (x,y) => noise
const hypotenuse = (x, y) => Math.sqrt(x**2 + y**2)
const toPolar = (x, y) => [hypotenuse(x, y), Math.atan2(y, x)]
const fromPolar = (r, a) => [r * Math.cos(a), r * Math.sin(a)]
const rotat = (x, y, angle) => {
   const [r, a] = toPolar(x, y)
   return fromPolar(r, a + angle)
}
const isNear = (a, b) => hypotenuse(a.x - b.x, a.y - b.y) < c.unit * 1.35

setup = () => {

   createCanvas(c.canvas.x, c.canvas.y)
   background('gray')
   stroke('yellow')

   let odd = 0, d1
   for(let y=c.start[1]; y < c.canvas.y; y += c.unit*Math.sqrt(3)/2) {
      d1 = odd ? 2 : 0
      for(let x=c.start[0] + odd*c.unit/2; x < c.canvas.x + 200; x += c.unit) {
         const [xx, yy] = rotat(x, y, Math.PI / 12) // 15°
         if(d1 != 0) {
            // rotate the whole canvas to make it look less boring
            population.push({x: randomize(xx), y: randomize(yy), c: false})
         } else { // hexagon center
            population.push({x: xx, y: yy, c: true})

         }
         d1 = c.steps.indexOf(d1)
      }
      odd = 1 - odd
   }

   strokeWeight(1)
   stroke('yellow')
   // fill(88, 169, 209)

   population.filter(i => i.c).forEach(a => {
      const neib = population.filter(b => !b.c && isNear(b, a))
      fill(randomize(88), randomize(169), randomize(209, 60))
      beginShape()
      neib // sort in a circle
         .sort((i,j) => Math.atan2(i.y-a.y, i.x-a.x) - Math.atan2(j.y-a.y, j.x-a.x))
         .forEach(z => vertex(z.x, z.y))
      endShape()
   })
}

draw = function () { }
