export const TF_VOL = { '1M': 0.0007, '5M': 0.0013, '15M': 0.002, '1H': 0.0032, '4H': 0.0055 }
export const TF_TICKS = { '1M': 3, '5M': 4, '15M': 5, '1H': 6, '4H': 7 }

export function buildCandles(livePrice, timeframe, count = 90) {
  const vol = TF_VOL[timeframe] || 0.0013
  const arr = []
  let p = livePrice
  for (let i = 0; i < count; i++) {
    const o = p
    const c = o + (Math.random() - 0.5) * 2 * vol * o
    const h = Math.max(o, c) + Math.random() * vol * o * 0.6
    const l = Math.min(o, c) - Math.random() * vol * o * 0.6
    arr.push({ o, h, l, c })
    p = c
  }
  const diff = livePrice - arr[count - 1].c
  arr.forEach((k) => {
    k.o += diff
    k.h += diff
    k.l += diff
    k.c += diff
  })
  return arr
}
