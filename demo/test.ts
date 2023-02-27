type ObjA = {
  a: number
}

type ObjB = {
  a: number
  b: string
}

let a: ObjA = { a: 1 }

const b: ObjB = { a: 1, b: '' }

a = b

console.log(a)
console.log(b)

function fn(obj: ObjB) {
  console.log(obj.a, obj.b)
}
fn(b)
