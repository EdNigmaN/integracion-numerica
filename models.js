export class FunctionProblem {
  constructor(expression,a,b,n,units='',reference=null){this.expression=expression;this.a=Number(a);this.b=Number(b);this.n=Number(n);this.units=units;this.reference=reference===''||reference===null||reference===undefined?null:Number(reference);this.kind='function';this.validate();this.fn=compileExpression(expression);}
  validate(){if(!Number.isFinite(this.a)||!Number.isFinite(this.b)||!Number.isInteger(this.n)||this.n<1)throw Error('a, b y n deben ser números válidos; n debe ser un entero positivo.');if(this.b<=this.a)throw Error('El límite superior b debe ser mayor que a.');if(!this.expression.trim())throw Error('Escribe una función f(x).');}
  evaluate(x){const y=this.fn(x);if(!Number.isFinite(y))throw Error(`La función no está definida o no es finita en x=${x}.`);return y;}
  nodes(n=this.n){const h=(this.b-this.a)/n;return Array.from({length:n+1},(_,i)=>({x:this.a+i*h,y:this.evaluate(this.a+i*h)}));}
}
export class TabulatedProblem {
  constructor(points,units=''){this.points=points.map(p=>({x:Number(p.x),y:Number(p.y)}));this.units=units;this.kind='table';this.validate();this.a=this.points[0].x;this.b=this.points[this.points.length-1].x;this.n=this.points.length-1;this.h=(this.b-this.a)/this.n;}
  validate(){if(this.points.length<2)throw Error('La tabla necesita al menos dos pares x,y.');for(let i=0;i<this.points.length;i++){const p=this.points[i];if(!Number.isFinite(p.x)||!Number.isFinite(p.y))throw Error(`La fila ${i+1} contiene datos no numéricos.`);if(i>0&&p.x<=this.points[i-1].x)throw Error('Los valores x deben ser estrictamente crecientes.');}const h=(this.points.at(-1).x-this.points[0].x)/(this.points.length-1);for(let i=1;i<this.points.length;i++){const hi=this.points[i].x-this.points[i-1].x;if(Math.abs(hi-h)>1e-8*Math.max(1,Math.abs(h)))throw Error('Los valores x no están igualmente espaciados. Ajusta la tabla antes de aplicar estos métodos.');}}
  nodes(){return this.points.map(p=>({...p}));}
}
function compileExpression(source){
  // Parser pequeño: no se usa eval ni Function. Acepta aritmética, potencias y funciones matemáticas comunes.
  const s=source.replace(/\s+/g,'').toLowerCase().replace(/π/g,'pi');let i=0;
  const funcs={sin:Math.sin,cos:Math.cos,tan:Math.tan,asin:Math.asin,acos:Math.acos,atan:Math.atan,sqrt:Math.sqrt,abs:Math.abs,exp:Math.exp,log:Math.log,ln:Math.log,log10:Math.log10,floor:Math.floor,ceil:Math.ceil};
  function expr(){let v=term();while(s[i]==='+'||s[i]==='-'){const op=s[i++],r=term();v=op==='+'?v+r:v-r;}return v;}
  function term(){let v=power();while(i<s.length){if(s[i]==='*'){i++;v*=power();}else if(s[i]==='/'){i++;v/=power();}else if(s[i]==='('||s[i]==='x'||/[0-9.]/.test(s[i])||/[a-z]/.test(s[i])){ // multiplicación implícita: 2x, 2(x), xsin(x)
      if(s[i]==='x'||s[i]==='('||/[0-9.]/.test(s[i])||/[a-z]/.test(s[i]))v*=power();else break;
    }else break;}return v;}
  function power(){let v=unary();if(s[i]==='^'){i++;v=Math.pow(v,power());}return v;}
  function unary(){if(s[i]==='+'){i++;return unary();}if(s[i]==='-'){i++;return -unary();}return atom();}
  function atom(){if(s[i]==='('){i++;const v=expr();if(s[i]!==')')throw Error('Falta cerrar un paréntesis.');i++;return v;}const rest=s.slice(i);const fm=rest.match(/^[a-z]+/);if(fm){const name=fm[0];i+=name.length;if(name==='x')return currentX;if(name==='pi')return Math.PI;if(name==='e')return Math.E;if(funcs[name]){if(s[i]!=='(')throw Error(`La función ${name} requiere paréntesis, por ejemplo ${name}(x).`);i++;const v=expr();if(s[i]!==')')throw Error('Falta cerrar paréntesis en una función.');i++;return funcs[name](v);}throw Error(`Nombre no reconocido: ${name}.`);}const nm=rest.match(/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/);if(nm){i+=nm[0].length;return Number(nm[0]);}throw Error(`Expresión no válida cerca de «${s.slice(i)}».`);}
  let currentX=0;
  return x=>{currentX=x;i=0;const value=expr();if(i<s.length)throw Error(`No se pudo interpretar la expresión cerca de «${s.slice(i)}».`);return value;};
}
