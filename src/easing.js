/*https://gist.github.com/gre/1650294
 *
 * Easing Functions - inspired from http://gizma.com/easing
 * only considering the t value for the range [0,1]
 * */

// no easing, no acceleration
const linear = t => t
// accelerating to zero velocity
const easeInQuad = t => t*t
// decelerating to zero velocity
const easeOutQuad = t => t*(2-t)
// acceleration until halfway, then deceleration
const easeInOutQuad = t => t < 0.5 ? 2*t*t : -1 + (4-2*t)*t
// accelerating from zero velocity
const easeOutCubic = t => (--t)*t*t+1
// acceleration until halfway, then deceleration
const easeInOutCubic = t => t < 0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1
// accelerating from zero velocity
const easeInQuart = t => t*t*t*t
// decelerating zero to velocity
const easeOutQuart = t => 1-(--t)*t*t*t
//acceleration until halfway, the deceleration
const easeInOutQuart = t => t < 0.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t
// accelerating from zero velocity
const easeInQuint = t => t*t*t*t*t
// decelarating to zero velocity
const easeOutQuint = t => 1+(--t)*t*t*t*t
// acceleration until halfway, then deceleration
const easeInOutQuint = t => t < 0.5 ? 16*t*t*t*t*t: 1+16*(--t)*t*t*t*t
// elastic bounce effect at the beginning
const easeInElastic = t => (0.04 - 0.04 / t) * Math.sin(25 * t) + 1
//elastic bounce effect at the beginning and end
const easeInOutElastic = t => (t -= 0.5) < 0 ? (0.01 + 0.01 / t) * Math.sin(50 * t) : (0.02 - 0.01 / t) * Math.sin(50 * t) + 1

export { 
	linear, 
	easeInQuad, 
	easeOutQuad, 
	easeInOutQuad as default, 
	easeOutCubic, 
	easeInOutCubic, 
	easeInQuart, 
	easeOutQuart, 
	easeInOutQuart, 
	easeInQuint, 
	easeOutQuint, 
	easeInOutQuint, 
	easeInElastic, 
	easeInOutElastic 
} 
