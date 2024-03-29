import {useGlobalContext, CONSTANTS} from '../global-context'

type WaterContainerProps = {
	containerNo: number
}

function WaterContainer({containerNo}: WaterContainerProps) {
	const {state, dispatch} = useGlobalContext()

	async function handleAdd() {
		dispatch({
			type: CONSTANTS.INCREMENT,
			containerNo,
		})
	}

	function handleEmpty() {
		dispatch({
			type: CONSTANTS.EMPTY,
			containerNo,
		})
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
					className={`w-full transition-[height] duration-1000 bg-sky-500 rounded-t-md rounded-b-sm absolute bottom-0 border-sky-600 ${
						state[containerNo] > 0 ? 'border-4' : ''
					}`}
					style={{
						height: `${state[containerNo] / 10}%`,
					}}
				></div>
			</div>
			<div className="mt-8 text-center text-gray-400 ">
				<span className="tracking-wider">{Math.round(state[containerNo])}</span>{' '}
				<span className="italic">lit. </span>{' '}
			</div>
		</div>
	)
}

export {WaterContainer}
