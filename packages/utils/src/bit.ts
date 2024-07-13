export function any(target: number, toMatch: number = 0): boolean {
  return !target || (target & toMatch) > 0;
}

export function all(target: number, toMatch: number = 0): boolean {
  return (target & toMatch) === target;
}

export function none(target: number, toMatch: number = 0): boolean {
  return !toMatch || !(toMatch & target);
}
