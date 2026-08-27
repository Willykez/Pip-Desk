// In-memory seed data. Swap this module out once you wire a real backend
// (see src/lib/supabaseClient.js and the README for the migration path).

export const demoUsers = {
  admin: { id: 'u-admin', name: 'You (Admin)', role: 'admin' },
  user: { id: 'u-trader', name: 'Guest Trader', role: 'user' }
}

export const initialPosts = [
  {
    id: 'p1',
    type: 'signal',
    author: 'You (Admin)',
    createdAt: '2026-08-25T08:15:00Z',
    pair: 'EUR/USD',
    direction: 'buy',
    entry: '1.0850',
    sl: '1.0800',
    tp: '1.0950',
    timeframe: '4H',
    reasoning:
      'Reclaimed the daily demand zone after the sweep of Tuesday\u2019s low. Looking for continuation into the 1.0950 supply area.',
    status: 'open' // open | tp_hit | sl_hit | closed
  },
  {
    id: 'p2',
    type: 'education',
    author: 'You (Admin)',
    createdAt: '2026-08-24T14:00:00Z',
    title: 'Reading order blocks without overcomplicating it',
    body:
      'An order block is just the last candle before a strong, decisive move away from a level. You don\u2019t need five indicators to see it \u2014 you need to slow down and look at where price left in a hurry.',
    status: null
  },
  {
    id: 'p3',
    type: 'signal',
    author: 'You (Admin)',
    createdAt: '2026-08-22T10:30:00Z',
    pair: 'GBP/USD',
    direction: 'sell',
    entry: '1.2740',
    sl: '1.2790',
    tp: '1.2640',
    timeframe: '1H',
    reasoning:
      'Rejection from the weekly supply zone with a clean liquidity sweep above the prior high.',
    status: 'tp_hit'
  },
  {
    id: 'p4',
    type: 'signal',
    author: 'You (Admin)',
    createdAt: '2026-08-20T09:00:00Z',
    pair: 'USD/JPY',
    direction: 'buy',
    entry: '147.20',
    sl: '146.70',
    tp: '148.10',
    timeframe: '4H',
    reasoning: 'Bullish continuation off the 4H order block, aligned with daily trend.',
    status: 'sl_hit'
  }
]

export const initialComments = {
  p1: [
    { id: 'c1', author: 'Guest Trader', text: 'Why SL below the swing low and not tighter?', createdAt: '2026-08-25T09:00:00Z' }
  ],
  p3: [
    { id: 'c2', author: 'Guest Trader', text: 'Caught this one live, thanks for the heads up on the sweep', createdAt: '2026-08-22T12:00:00Z' }
  ]
}

export const initialReactions = {
  p1: 12,
  p2: 8,
  p3: 21,
  p4: 5
}
