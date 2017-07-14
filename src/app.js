import { combine, of, generate } from 'most'
import { create as createStream } from '@most/create'
import { create as createScrollMonitor, createContainer as createScrollMonitorContainer } from 'scrollmonitor'
import Snap from 'snapsvg'
import { compose, map, prop, tryCatch, always } from 'ramda'

const { svg_config, scroll_config, amoebas_config } = window;

const createPaper = (width, height, offsetX=0, offsetY=0) =>
    of({ 

	paper: Snap(width, height)
		  .attr({
			preserveAspectRatio: 'xMidYMid slice',
			//viewBox: createViewBoxDimensions(offsetX, offsetY , getPathMax(pluck('paths', amoebas_config)))
			viewBox: '0 0 1920 1080' 
		  })	

    });

const createGradient = gradients => svg =>
	Object.assign({}, svg, {
		gradient: svg.paper.gradient('l(0,0,1,1)#fff-#fff'),
		gradients 
	})

const createPath = svg =>
    Object.assign({}, svg, { path: svg.paper.path()})

const animate = (path, delay=3000, gradient) => (d, fill) =>
    new Promise((res, rej) => {
	[...gradient.node.querySelectorAll('stop')].forEach((stop, index) => {
		stop.setAttribute('stop-color', fill[index])
	})
        path.animate({d}, delay, mina.easeinout, () => res(d));
    })

const createSvgStream = ({ size: {width, height}, gradients, container}) =>
    createPaper(width, height)
	.map(createGradient(gradients))
        .map(createPath)
        .tap(({paper}) => paper.appendTo(document.querySelector(container)))

const $svg = createSvgStream(svg_config)

const getElementPadding = (element) => {
	const style = getComputedStyle(element, null);
	return {
		top: parseInt(style.getPropertyValue('padding-top'), 10),
		left: parseInt(style.getPropertyValue('padding-left'), 10),
		right: parseInt(style.getPropertyValue('padding-right'), 10),
		bottom: parseInt(style.getPropertyValue('padding-bottom'), 10)
	}
	
}

const getElementsPadding = compose( map(element => ({ element, padding: getElementPadding(element) })), selector => [...document.querySelectorAll(selector)])

const getPadding = prop('padding')
const getTop = tryCatch(compose(prop('top'), getPadding), always(0))
const getBottom = tryCatch(compose(prop('bottom'), getPadding), always(0))

const setOffsets = (element, index, elements) => {
	const prev_bottom = getBottom(elements[index-1])
	const next_top = getTop(elements[index+1])
	const current_bottom = getBottom(element)
	const current_top = getTop(element)

	return Object.assign({}, element, { offset: { top: current_top+prev_bottom, bottom: current_bottom+next_top  } })
}

const createScrollMonitorStream = ({parent, children}) =>
    createStream(add => {
        const containerMonitor = createScrollMonitorContainer(document.querySelector(parent));
        getElementsPadding(children)
		.forEach(compose(({element, offset}) => {
			containerMonitor
                    		.create(element, { top: window.innerHeight * 0.7, bottom: window.innerHeight * 0.29 })
                    		.fullyEnterViewport(function() {
					console.log(this)
                        		if(element.dataset.amoebaId) add(element.dataset.amoebaId)
                    		})
		
		}, setOffsets))
    })

const $scroll_monitor = createScrollMonitorStream(scroll_config)

const createAmoebaStream = (amoebas_config, $event) =>
    $event
        .map(amoeba_id => amoebas_config.filter(amoeba => amoeba.id === amoeba_id)[0])
        .filter(amoeba => !!amoeba)
        .skipRepeats()

const $amoeba = createAmoebaStream(amoebas_config, $scroll_monitor)

const createAnimationStream = ($svg, $amoeba) => combine(({path, gradient, gradients}, amoeba) => ({path, gradient, gradients, amoeba}), $svg, $amoeba)

const $animation = createAnimationStream($svg, $amoeba);

const createAnimationLoop = $animation =>
    $animation
        .tap(({amoeba, path, gradient, gradients}) => {
            if(!path.attr('d')){
                path.attr({
                    d: amoeba.paths[0],
		    fill: gradient
                })
            }
        })
        .map(({amoeba, path, gradient, gradients}) =>
            generate(function*(paths, animatePath, fill){
                var len = paths.length;
                let index = 0;
                while(true){
                    yield animatePath(paths[index % len], fill);
                    index++;
                }
            }, amoeba.paths, animate(path, 2000, gradient), gradients[amoeba.fill])
        )
        .switchLatest()

createAnimationLoop($animation).forEach(_=>_).catch(console.log.bind(console))
