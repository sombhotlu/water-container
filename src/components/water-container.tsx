import {useState} from 'react'

function WaterContainer() {
	const [waterLevel, setWaterLevel] = useState(0)

	function handleAdd() {
		if (waterLevel > 5) return

		setTimeout(() => {
			setWaterLevel(waterLevel + 1)
		}, 1000)
	}

	function handleEmpty() {
		setWaterLevel(0)
	}

	return (
		<div className="flex flex-col">
			<button onClick={handleAdd} className="p-2 bg-green-700 rounded-md text-white mb-4">
				Add
			</button>
			<button
				onClick={handleEmpty}
				className="p-2 border-2 rounded-md text-red-500 border-red-400 "
			>
				Empty
			</button>

			<div className="mt-8 w-28 h-32 border-4 border-gray-500 rounded-lg relative border-opacity-80">
				<div
					className={`w-full h-${
						waterLevel < 5 ? `${waterLevel}/5` : `full`
					} bg-sky-500 rounded-t-md rounded-b-sm absolute bottom-0 border-sky-600  ${
						waterLevel > 0 ? 'border-4' : ''
					}`}
				></div>
			</div>
		</div>
	)
}

export {WaterContainer}
