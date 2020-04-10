var isSmallState = true
function toggleSizeState() {
let containers = _.flattenDeep([document.querySelectorAll('.code-container'),
														document.querySelectorAll('.centered-content')])

if (isSmallState) {
	document.getElementById('sizeChanger').classList.remove('expand')
	document.getElementById('sizeChanger').classList.add('shrink')
	containers.forEach((cont) => {
		cont.forEach((c) => {
			if (c.classList.contains('small')) {
				c.classList.remove('small')
				c.classList.add('large')
			}
		})
	})
} else {
	document.getElementById('sizeChanger').classList.remove('shrink')
	document.getElementById('sizeChanger').classList.add('expand')
	containers.forEach((cont) => {
		cont.forEach((c) => {
			if (c.classList.contains('large')) {
				c.classList.remove('large')
				c.classList.add('small')
			}
		})
	})
}
}
isSmallState = !isSmallState
