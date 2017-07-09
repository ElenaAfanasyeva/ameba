import Snap from 'snapsvg'
import { of, generate } from 'most'

const extend = (x, y) =>
	Object.assign({}, x, y);

const morph = (path, delay=1000) => d =>
	new Promise((res, rej) => {
		path.animate({d}, delay, mina.easeinout, () => res(d));
	})

const createPaper = (width, height) => 
	of( { paper: Snap(width, height) } );

const createGradients = gradients => svg =>
	extend(svg, {
		gradients: Object.keys(gradients)
				 .reduce((acc, gradient) => {
				 	acc[gradient] = svg.paper.gradient(gradients[gradient]);
				 	return acc;
				 },{})
	});

const createPath = svg =>
	extend(svg, {
		path: svg.paper.path()
	});

export default function ({ size: {width, height}, gradients, container }) {
	return createPaper(width, height)
			.map(createGradients(gradients))
			.map(createPath)
			.tap(({ paper }) => paper.appendTo(document.querySelector(container)))
			.map(({ gradients, path }) => ({ gradients, path  }));

}

export const draw = ({ shape, path, gradients }) =>
	path.attr({
		d: shape.paths[0],
		fill: gradients[shape.fill]
	});

export const morphLoop = ({ shape, path, gradients }) => 
	generate(function*(paths, animatePath, fill))
