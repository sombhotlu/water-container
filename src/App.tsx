import {useEffect, useMemo} from 'react'
import './App.scss'
import {WaterContainer} from './components/water-container'
import {CONSTANTS, useGlobalContext} from './global-context'

function App() {
	const {state, dispatch} = useGlobalContext()

	const containers = useMemo(
		() => new Array(state.containerCount).fill(0),
		[state.containerCount],
	)

	const containerQuantities = containers.map((_, index) => state[index + 1])
	// console.log(containerQuantities, state.buffer)

	useEffect(() => {
		const allEqual = containerQuantities.every((val) => val === containerQuantities[0])
		if (allEqual) return

		let rebalanceQuantity = state.buffer

		const averageQuantity =
			(containerQuantities.reduce((acc, quantity) => acc + quantity) + rebalanceQuantity) /
			containerQuantities.length

		const desceningOrderedQuantities = containers
			.map((_, index) => ({
				containerNo: index + 1,
				quantity: state[index + 1],
			}))
			.sort((a, b) => b['quantity'] - a['quantity'])
			.map((bucket, index) => {
				if (bucket.quantity > averageQuantity) {
					const quantityItCanMinimise = Math.min(25, bucket.quantity - averageQuantity)
					bucket.quantity -= quantityItCanMinimise
					rebalanceQuantity += quantityItCanMinimise
				} else if (bucket.quantity < averageQuantity) {
					const remainingBuckets = containerQuantities.length - index
					const additionPerBucket = rebalanceQuantity / remainingBuckets
					const additionToCurrentBucket = Math.min(
						additionPerBucket,
						averageQuantity - bucket.quantity,
						25,
					)

					if (bucket.quantity + additionToCurrentBucket > 1000) {
						const subsetOfAdditionToCurrentBucket = 1000 - bucket.quantity
						bucket.quantity += subsetOfAdditionToCurrentBucket
						rebalanceQuantity -= subsetOfAdditionToCurrentBucket
					} else {
						bucket.quantity += additionToCurrentBucket
						rebalanceQuantity -= additionToCurrentBucket
					}
				}

				return bucket
			})

		const rebalanceTimeout = setTimeout(() => {
			dispatch({
				type: CONSTANTS.REBALANCE,
				buckets: desceningOrderedQuantities,
				buffer: rebalanceQuantity >= 1 ? rebalanceQuantity : 0,
			})
		}, 1000)

		return () => clearTimeout(rebalanceTimeout)
	}, [...containerQuantities])

	const content = containers.map((_, index) => (
		<WaterContainer key={index + 1} containerNo={index + 1} />
	))

	return <div className="flex justify-evenly items-center h-lvh ">{content}</div>
}

export default App
