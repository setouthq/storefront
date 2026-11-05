export type Line = { name: string; price: number; qty: number };
export type Cart = { lines: Line[] };
export type Coupon = { code: string; amount: number };
