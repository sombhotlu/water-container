import {createContext, useContext, useReducer} from 'react'

type GlobalState = {
	containerCount: number
}

type Action = {
	type: 'increment'
}

const GlobalContext = createContext<
	{state: GlobalState; dispatch: React.Dispatch<Action>} | undefined
>(undefined)

function globalStateReducer(state: GlobalState, action: Action) {
	switch (action.type) {
		case 'increment':
			return state
		default: {
			throw new Error(`Unhandled action type: ${action.type}`)
		}
	}
}

function GlobalStateProvider({children}: {children: React.ReactNode}) {
	const [state, dispatch] = useReducer(globalStateReducer, {
		containerCount: 4,
	})

	const value = {state, dispatch}

	return <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
}

function useGlobalContext() {
	const context = useContext(GlobalContext)
	if (context === undefined)
		throw new Error('useGlobalContext must be used within a GlobalContextProvider')
	return context
}

export {GlobalStateProvider, useGlobalContext}
