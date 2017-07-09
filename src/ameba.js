import { compose, prop, chain, tap } from 'ramda'
import Result from 'folktale/result'

const getAmebaIdFromElement = compose(prop('ameba'), prop('dataset')) 
const getAmebaId = element => Result.try(_=> getAmebaIdFromElement(element))

const findAmeba = amebas => id =>
	Result.fromNullable(amebas[id])

const ameba = (gradients, amebas) => element =>
	chain(findAmeba(amebas), getAmebaId(element))

export { ameba as default } 
