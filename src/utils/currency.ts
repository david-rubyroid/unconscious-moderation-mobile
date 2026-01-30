import type { Currency } from '@/api/queries/drink-session/dto'

const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  MXN: '$',
  COP: '$',
}

export function getCurrencySymbol(currency?: Currency | null): string {
  if (!currency || !(currency in CURRENCY_SYMBOLS)) {
    return CURRENCY_SYMBOLS.USD
  }
  return CURRENCY_SYMBOLS[currency as Currency]
}
