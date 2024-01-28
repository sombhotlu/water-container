import './App.scss'
import {WaterContainer} from './components/water-container'
import {useGlobalContext} from './global-context'

function App() {
	const {state} = useGlobalContext()

	const content = new Array(state.containerCount)
		.fill(0)
		.map((_, index) => <WaterContainer key={index} containerNo={index} />)

	return <div className="flex justify-evenly items-center h-lvh ">{content}</div>
}

export default App
