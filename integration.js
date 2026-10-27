export class IntegrationMethod {
  constructor(problem){this.problem=problem;this.name='Método';this.factor=1;}
  getNodes(){return this.problem.nodes();}
  integrate(){throw Error('Implementa integrate() en la subclase.');}
  weights(n){return Array.from({length:n+1},(_,i)=>this.weightAt(i,n));}
  weightAt(){return 1;}
  makeResult(value,weights,nodes){return {name:this.name,value,weights,nodes,n:nodes.length-1,h:(nodes.at(-1).x-nodes[0].x)/(nodes.length-1),factor:this.factor};}
}
export class TrapecioCompuesto extends IntegrationMethod {
  constructor(problem){super(problem);this.name='Trapecio compuesto';this.factor='h';}
  weightAt(i,n){return i===0||i===n?0.5:1;}
  integrate(n=this.problem.n){const nodes=this.problem.nodes(n);const h=(nodes.at(-1).x-nodes[0].x)/n;let sum=0;nodes.forEach((p,i)=>sum+=this.weightAt(i,n)*p.y);return this.makeResult(h*sum,this.weights(n),nodes);}
}
export class Simpson13 extends IntegrationMethod {
  constructor(problem){super(problem);this.name='Simpson 1/3';this.factor='h/3';}
  weightAt(i,n){return i===0||i===n?1:(i%2===1?4:2);}
  integrate(n=this.problem.n){if(n%2!==0)throw Error('Simpson 1/3 requiere un número par de subintervalos n.');const nodes=this.problem.nodes(n);const h=(nodes.at(-1).x-nodes[0].x)/n;let sum=0;nodes.forEach((p,i)=>sum+=this.weightAt(i,n)*p.y);return this.makeResult(h*sum/3,this.weights(n),nodes);}
}
export class Simpson38 extends IntegrationMethod {
  constructor(problem){super(problem);this.name='Simpson 3/8';this.factor='3h/8';}
  weightAt(i,n){return i===0||i===n?1:(i%3===0?2:3);}
  integrate(n=this.problem.n){if(n%3!==0)throw Error('Simpson 3/8 requiere que n sea múltiplo de 3.');const nodes=this.problem.nodes(n);const h=(nodes.at(-1).x-nodes[0].x)/n;let sum=0;nodes.forEach((p,i)=>sum+=this.weightAt(i,n)*p.y);return this.makeResult(3*h*sum/8,this.weights(n),nodes);}
}
export function combinedSimpson(problem,n=problem.n){if(n<2)throw Error('Se necesitan al menos dos subintervalos.');const nodes=problem.nodes(n),h=(nodes.at(-1).x-nodes[0].x)/n;let n13=n%2===0?n:(n>=3?n-3:0),n38=n-n13;if(n13===0&&n38%3!==0)throw Error('No se puede dividir n en bloques Simpson válidos.');let total=0,parts=[];if(n13){let s=nodes.slice(0,n13+1),sum=s[0].y+s.at(-1).y;for(let i=1;i<n13;i++)sum+=(i%2?4:2)*s[i].y;const val=h*sum/3;total+=val;parts.push({method:'Simpson 1/3',from:0,to:n13,value:val});}if(n38){let start=n13,s=nodes.slice(start);let sum=s[0].y+s.at(-1).y;for(let i=1;i<n38;i++)sum+=(i%3===0?2:3)*s[i].y;const val=3*h*sum/8;total+=val;parts.push({method:'Simpson 3/8',from:start,to:n,value:val});}return {value:total,parts};}
