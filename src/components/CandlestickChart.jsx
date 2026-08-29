import { useEffect, useRef, useState } from 'react'
import { buildCandles, TF_TICKS } from '../lib/chart.js'
import { fmtPrice } from '../context/AppContext.jsx'

export default function CandlestickChart({ pair, timeframe, price, signal }) {
  const canvasRef = useRef(null)
  const candlesRef = useRef([])
  const tickRef = useRef(0)
  const [hover, setHover] = useState(null)
  const [readout, setReadout] = useState(null)

  // rebuild candle history whenever the pair or timeframe changes
  useEffect(() => {
    candlesRef.current = buildCandles(price, timeframe, 90)
    tickRef.current = 0
    draw()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair, timeframe])

  // advance the chart on every live price tick
  useEffect(() => {
    const candles = candlesRef.current
    if (!candles.length) return
    const last = candles[candles.length - 1]
    last.c = price
    if (price > last.h) last.h = price
    if (price < last.l) last.l = price
    tickRef.current += 1
    if (tickRef.current >= (TF_TICKS[timeframe] || 4)) {
      tickRef.current = 0
      candles.push({ o: last.c, h: last.c, l: last.c, c: last.c })
      if (candles.length > 110) candles.shift()
    }
    draw()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [price])

  useEffect(() => {
    draw()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hover, signal])

  function draw() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const dpr = window.devicePixelRatio || 1
    const W = canvas.clientWidth || 300
    const H = canvas.clientHeight || 220
    if (canvas.width !== Math.round(W * dpr) || canvas.height !== Math.round(H * dpr)) {
      canvas.width = Math.round(W * dpr)
      canvas.height = Math.round(H * dpr)
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, W, H)

    const view = candlesRef.current.slice(-70)
    const n = view.length
    if (!n) return

    const padR = 56
    const padT = 10
    const padB = 18
    const plotW = W - padR - 6
    const plotH = H - padT - padB

    let min = Infinity
    let max = -Infinity
    view.forEach((c) => {
      if (c.l < min) min = c.l
      if (c.h > max) max = c.h
    })
    if (signal) {
      ;[parseFloat(signal.entry), parseFloat(signal.tp), parseFloat(signal.sl)].forEach((v) => {
        if (!Number.isNaN(v)) {
          if (v < min) min = v
          if (v > max) max = v
        }
      })
    }
    const pad = (max - min) * 0.08 || max * 0.001
    min -= pad
    max += pad

    const y = (v) => padT + ((max - v) / (max - min)) * plotH
    const xw = plotW / n
    const x = (i) => 6 + (i + 0.5) * xw

    ctx.font = '10px JetBrains Mono, monospace'
    for (let g = 0; g <= 4; g++) {
      const v = max - ((max - min) * g) / 4
      const yy = y(v)
      ctx.strokeStyle = 'rgba(233,237,241,0.06)'
      ctx.beginPath()
      ctx.moveTo(6, yy)
      ctx.lineTo(W - padR + 8, yy)
      ctx.stroke()
      ctx.fillStyle = '#6E7A8A'
      ctx.textAlign = 'left'
      ctx.fillText(fmtPrice(pair, v), W - padR + 12, yy + 3)
    }

    const bw = Math.max(2, xw * 0.6)
    view.forEach((c, i) => {
      const up = c.c >= c.o
      ctx.strokeStyle = up ? '#17D897' : '#FF5470'
      ctx.fillStyle = up ? '#17D897' : '#FF5470'
      ctx.beginPath()
      ctx.moveTo(x(i), y(c.h))
      ctx.lineTo(x(i), y(c.l))
      ctx.stroke()
      const top = y(Math.max(c.o, c.c))
      const bh = Math.max(1, Math.abs(y(c.o) - y(c.c)))
      ctx.fillRect(x(i) - bw / 2, top, bw, bh)
    })

    function level(v, label, color) {
      if (Number.isNaN(v)) return
      const yy = y(v)
      ctx.save()
      ctx.setLineDash([5, 4])
      ctx.strokeStyle = color
      ctx.globalAlpha = 0.85
      ctx.beginPath()
      ctx.moveTo(6, yy)
      ctx.lineTo(W - padR + 8, yy)
      ctx.stroke()
      ctx.setLineDash([])
      ctx.fillStyle = color
      ctx.font = 'bold 9px Inter, sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText(label, 10, yy - 4)
      ctx.restore()
    }
    if (signal) {
      level(parseFloat(signal.entry), 'ENTRY', '#4C8DFF')
      level(parseFloat(signal.tp), 'TP', '#17D897')
      level(parseFloat(signal.sl), 'SL', '#FF5470')
    }

    const last = view[n - 1]
    const ly = y(last.c)
    ctx.save()
    ctx.setLineDash([2, 3])
    ctx.strokeStyle = '#FFB648'
    ctx.globalAlpha = 0.7
    ctx.beginPath()
    ctx.moveTo(6, ly)
    ctx.lineTo(W - padR + 8, ly)
    ctx.stroke()
    ctx.restore()
    ctx.fillStyle = '#FFB648'
    ctx.fillRect(W - padR + 8, ly - 8, padR - 14, 16)
    ctx.fillStyle = '#05070A'
    ctx.font = 'bold 9px JetBrains Mono, monospace'
    ctx.textAlign = 'center'
    ctx.fillText(fmtPrice(pair, last.c), W - padR + 8 + (padR - 14) / 2, ly + 3)

    if (hover && hover.x >= 6 && hover.x <= W - padR && hover.y >= padT && hover.y <= padT + plotH) {
      const idx = Math.min(n - 1, Math.max(0, Math.floor((hover.x - 6) / xw)))
      const c = view[idx]
      ctx.save()
      ctx.setLineDash([3, 3])
      ctx.strokeStyle = 'rgba(233,237,241,0.25)'
      ctx.beginPath()
      ctx.moveTo(x(idx), padT)
      ctx.lineTo(x(idx), padT + plotH)
      ctx.moveTo(6, hover.y)
      ctx.lineTo(W - padR + 8, hover.y)
      ctx.stroke()
      ctx.restore()
      setReadout(c)
    } else {
      setReadout(last)
    }
  }

  function onMove(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    setHover({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }
  function onLeave() {
    setHover(null)
  }

  return (
    <div>
      <div className="h-56 w-full rounded-lg bg-ink sm:h-72">
        <canvas ref={canvasRef} className="h-full w-full cursor-crosshair" onMouseMove={onMove} onMouseLeave={onLeave} />
      </div>
      {readout && (
        <div className="mt-2 flex flex-wrap gap-3 font-mono text-[11px] text-mute tabular">
          <span>
            O <b className="text-paper">{fmtPrice(pair, readout.o)}</b>
          </span>
          <span>
            H <b className="text-long">{fmtPrice(pair, readout.h)}</b>
          </span>
          <span>
            L <b className="text-short">{fmtPrice(pair, readout.l)}</b>
          </span>
          <span>
            C{' '}
            <b className={readout.c >= readout.o ? 'text-long' : 'text-short'}>{fmtPrice(pair, readout.c)}</b>
          </span>
        </div>
      )}
    </div>
  )
}
