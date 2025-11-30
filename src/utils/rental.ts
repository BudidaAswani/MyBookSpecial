// src/utils/rental.ts
export function getRentalDays(pages: number): number {    //RentalDays
    const p = Number(pages) || 0;
    const RentalDays=0;
    if (p <= 200) return 4;
    if (p <= 400) return 6;
    if (p <= 600) return 10;
    if (p <= 900) return 13;
    if (p <= 1400) return 20;
    return RentalDays;
  }
  
  export function calculateRentalDeadline(pages: number): string {    //RentalDeadline
    const days = getRentalDays(pages);
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toISOString();
  }
  