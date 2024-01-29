import {useEffect, useMemo} from 'react'
import './App.scss'
import {WaterContainer} from './components/water-container'
import {useGlobalContext} from './global-context'

function App() {
	const {state, dispatch} = useGlobalContext()

	const containers = useMemo(
		() => new Array(state.containerCount).fill(0),
		[state.containerCount],
	)

	const containerQuantities = containers.map((_, index) => state[index + 1])

	console.log(containerQuantities)

	useEffect(() => {
		/* 
			find the average
			calculate how much one can 
		
		*/

		const allEqual = containerQuantities.every((val) => val === containerQuantities[0])

		if (!allEqual) {
			const averageQuantity =
				containerQuantities.reduce((acc, quantity) => acc + quantity) /
				containerQuantities.length

			let rebalanceQuantity = 0

			const desceningOrderedQuantities = containers
				.map((_, index) => ({
					containerNo: index + 1,
					quantity: state[index + 1],
				}))
				.sort((a, b) => b['quantity'] - a['quantity'])
				.map((bucket, index) => {
					if (bucket.quantity > averageQuantity) {
						const quantityItCanMinimise = Math.min(
							25,
							bucket.quantity - averageQuantity,
						)
						bucket.quantity -= quantityItCanMinimise
						rebalanceQuantity += quantityItCanMinimise
					} else if (bucket.quantity < averageQuantity) {
						const remainingBuckets = containerQuantities.length - index
						// console.log('reaminaing buckets', remainingBuckets)
						const additionPerBucket = rebalanceQuantity / remainingBuckets
						const additionToCurrentBucket = Math.min(
							additionPerBucket,
							averageQuantity - bucket.quantity,
							25,
						)

						// console.log('additionPerBucket', additionPerBucket, additionToCurrentBucket)
						rebalanceQuantity -= additionToCurrentBucket
						bucket.quantity += additionToCurrentBucket
					}

					return bucket
				})

			// console.log('The descending Order Quantities', desceningOrderedQuantities)
			// calculation on making it equal

			setTimeout(() => {
				dispatch({
					type: 'REBALANCE',
					buckets: desceningOrderedQuantities,
				})
			}, 1500)
		}
	}, containerQuantities)

	const content = containers.map((_, index) => (
		<WaterContainer key={index + 1} containerNo={index + 1} />
	))

	return <div className="flex justify-evenly items-center h-lvh ">{content}</div>
}

export default App
