import { create } from '@most/create'

const lerp = (source, target, amount) => source + amount * (target - source)

const createAnimationStream = (duration, ease=_=>_) =>
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

export { lerp, createAnimationStream as default  } 
