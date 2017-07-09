import { create }    from '@most/create'
import { multicast } from '@most/multicast'

import { fromNullable

import { map } from 'ramda'

const lerp = (source, target, amount) => source + amount * (target - source)

const createTimeStream = () =>
	multicast(create((add, end) => {
		const loop = () => {
			add(Date.now)
			requestAnimationFrame(loop)
		}
		requestAnimationFrame(loop)
	}))

const createTimeStream = (duration, ease=_=>_) =>
	create((add, end) => {
		const start = Date.now()
		const loop = () => {
			const t = duration > 0 ? (now - start) / duration : 1
			const easing = ease(t)
			if(t => 1) {
				add(easing)
				end(easing)
			}else {
				add(easing)
				requestAnimationFrame(loop)
			}
		}
	})


const applyEasing = (start, duration, easing=t=>t) => now =>
	add()

const createAnimationStream = (from, to, duration, easing) =>
	map( ,createTimeStream())

export { lerp, createAnimationStream as default  } 
