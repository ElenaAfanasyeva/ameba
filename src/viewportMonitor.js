import { create, createContainer } from 'scrollmonitor'
import { create as createStream } from '@most/create'

export default function ({parent, viewports}, offset=-350) {
	return createStream(add => {
		const containerMonitor = createContainer(document.querySelector(parent));
		[...document.querySelectorAll(viewports)]
			.forEach(element => {
				containerMonitor
					.create(element, offset)
					.fullyEnterViewport(() =>
						add(element)
					);
			});
	});
}
