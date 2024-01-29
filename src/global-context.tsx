import {createContext, useContext, useReducer} from 'react'

export const CONSTANTS = {
	INCREMENT: 'INCREMENT',
	EMPTY: 'EMPTY',
	REBALANCE: 'REBALANCE',
} as const

type GlobalState = {
	containerCount: number
	[container: number]: number
	buffer: number
	timeoutCompleted: boolean
}

type Action =
	| {
			type: (typeof CONSTANTS)['INCREMENT']
			containerNo: number
	  }
	| {
			type: (typeof CONSTANTS)['EMPTY']
			containerNo: number
	  }
	| {
			type: (typeof CONSTANTS)['REBALANCE']
			buckets: {
				containerNo: number
				quantity: number
			}[]
			buffer: number
	  }

const GlobalContext = createContext<
	{state: GlobalState; dispatch: React.Dispatch<Action>} | undefined
>(undefined)

function globalStateReducer(state: GlobalState, action: Action) {
	switch (action.type) {
		case CONSTANTS.INCREMENT: {
			if (state[action.containerNo] === 1000) return state
			let quantityToFill = 200,
				buffer = state.buffer
			if (state[action.containerNo] + quantityToFill > 1000) {
				quantityToFill = 1000 - state[action.containerNo]
				buffer = 200 - quantityToFill
			}

			return {
				...state,
				[action.containerNo]: state[action.containerNo] + quantityToFill,
				buffer,
			}
		}
		case CONSTANTS.EMPTY: {
			return {
				...state,
				[action.containerNo]: 0,
			}
		}
		case CONSTANTS.REBALANCE: {
			const originalState = state
			const values: Record<number, number> = {}
			for (const bucket of action.buckets) {
				values[bucket.containerNo] = bucket.quantity
			}
			return {
				...originalState,
				...values,
				buffer: action.buffer,
			}
		}

		default: {
			throw new Error(`Unhandled action type: ${action}`)
		}
	}
}

export function GlobalStateProvider({children}: {children: React.ReactNode}) {
	const initialState: GlobalState = {
		containerCount: 4,
		buffer: 0,
		timeoutCompleted: true,
	}

	for (let i = 1; i <= initialState.containerCount; i++) initialState[i] = 0

	const [state, dispatch] = useReducer(globalStateReducer, initialState)

	const value = {state, dispatch}

	return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
}

export function useGlobalContext() {
	const context = useContext(GlobalContext)
	if (context === undefined)
		throw new Error('useGlobalContext must be used within a GlobalContextProvider')
	return context
}
