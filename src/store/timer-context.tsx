import { createContext, useContext, useReducer, type ReactNode }  from 'react'

export type Timer = { 
    name: string; 
    duration:  number;
}

type TimerState = {
    isRunning: boolean;
    timers: Timer[] 
}

const initialState: TimerState = {
    isRunning: false, 
    timers : []
}

type TimerContextValue = TimerState & { 
    addTimer : (timerData : Timer) => void;
    startTimer : () => void;
    stopTimer : () => void;
}

const TimerContext = createContext<TimerContextValue | null>(null)

export function useTimerContext(){
    const timerCtx = useContext(TimerContext)

    if (timerCtx === null){
        throw new Error("TimerContext is null")
    }

    return timerCtx
}

type TimerContextProviderProps ={
    children: ReactNode
}

type StartTimerAction = {
    type: 'START_TIMER' 
}
type StopTimerAction = {
    type: 'STOP_TIMER' 

}
type AddTimerAction = {
    type: 'ADD_TIMER' ;
    payload: Timer
}

type Action = StartTimerAction | StopTimerAction | AddTimerAction

function timersReducer(state: TimerState, action: Action): TimerState{
    if(action.type === "START_TIMER"){
        return {
            ...state, 
            isRunning: true
        }
    }

    if(action.type === "STOP_TIMER"){
        return {
            ...state, 
            isRunning: false
        }
    }

    if(action.type === "ADD_TIMER"){
        return {
            timers: [
                ...state.timers, 
                {
                   name: action.payload.name,
                   duration : action.payload.duration
                    
                }
            ],
            isRunning: false 
        }
    }

    return state
}

export default function TimerContextProvider({children}: TimerContextProviderProps){
    const [timerState,  dispatch] = useReducer(timersReducer, initialState)

    const ctx: TimerContextValue = {
        timers : timerState.timers, 
        isRunning: timerState.isRunning, 
        addTimer(timerData){
            dispatch({type: "ADD_TIMER", payload: timerData})
        },
        startTimer(){
            dispatch({type:  "START_TIMER"})
        },
        stopTimer() {
            dispatch({type:  "STOP_TIMER"})
        },

    }

    return <TimerContext.Provider value={ctx}>{children}</TimerContext.Provider>

}