import { init } from 'snabbdom'
import h from 'snabbdom/h'
import attrs from 'snabbdom/modules/attributes'

const patch = init([
	attrs
])

const view = ({svg: {width, height}, ameba: { path, viewBox } }) =>
	h('svg', { attrs: { width, height, viewBox, xmlns:'http://www.w3.org/2000/svg', preserveAspectRatio: 'xMidYMid slice'} }, [
		h('defs', [
			h('linearGradient#gradient', { attrs: { gradientTransform: "rotate(45)"  } }, [
				h('stop', { attrs: { offset:'0', "stop-color":'#00ffa1' } }),
				h('stop', { attrs: { offset:'1', "stop-color": '#00ffff' } })
			])
		]),
		h('path', { attrs: { d:path, fill:'url(#gradient)' } })
	])

const render = selector => {
	let vnode = document.querySelector(selector)
	return data => {
		vnode = patch(vnode, view(data))
	}
}

export default render
