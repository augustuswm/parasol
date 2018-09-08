// @flow

export function gcd(a: number, b: number): number {
  if (!b) {
    return a;
  }

  return gcd(b, a % b);
}

export function noop(): void {}