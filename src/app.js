import { combine, of, generate } from 'most'
import { create as createStream } from '@most/create'
import { create as createScrollMonitor, createContainer as createScrollMonitorContainer } from 'scrollmonitor'
import Snap from 'snapsvg'
import { compose, map, chain, pluck, identity, tap, match, apply, join, concat } from 'ramda'

const { svg_config, scroll_config, amoebas_config } = window;

const getMinAndMax = (numbers) =>
	[Math.min(...numbers), Math.max(...numbers)]
const log = tap(console.log.bind(console))
const getPathMax = compose( getMinAndMax, match(/-?(\d{1,8}(?:\.\d{1,8})?)/g), join(''), chain(identity))
const createViewBoxDimensions = (offsetX, offsetY, [min, max]) => 
		`${offsetX} ${offsetY} ${max-min} ${max-min}`

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

const createScrollMonitorStream = ({parent, children}) =>
    createStream(add => {
        const containerMonitor = createScrollMonitorContainer(document.querySelector(parent));
        [...document.querySelectorAll(children)]
            .forEach(element => {
                containerMonitor
                    .create(element, { bottom: - (window.innerHeight - (window.innerHeight * 0.3)), top: -(window.innerHeight * 0.3) })
                    .fullyEnterViewport(() => {
                        if(element.dataset.amoebaId) add(element.dataset.amoebaId)
                    })
            })
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

createAnimationLoop($animation).forEach(console.log.bind(console)).catch(console.log.bind(console))
