import Container from './UI/Container.tsx';
import { useTimerContext, type Timer as TimerProp } from '../store/timer-context.tsx';
import { useEffect, useRef, useState } from 'react';


export default function Timer({name, duration}: TimerProp) {
  const [remaining, setRemaining] = useState<number>(duration * 1000)
  const interval =  useRef<number | null >(null)
  const {isRunning} = useTimerContext()

  if (remaining <=0 && interval.current){
    clearInterval(interval.current)
  }

  useEffect(()=>{

    let timer:number;
    if(isRunning){
      timer =  setInterval(()=>{
        setRemaining((prevTime) =>{
          if (prevTime <=0){
            return prevTime
          }
          return prevTime  - 50
        })
      },  50);
      interval.current  =  timer

    }else if (!isRunning && interval.current){
      clearInterval(interval.current)
    }

    

    return ()  => clearInterval(timer)
  }, [isRunning])
  
  const formatedRemaining = (remaining/1000).toFixed(2)
  
  return (
    <Container as="article">
      <h2>{name}</h2>
      <p><progress max={duration*1000} value={remaining}/></p>
      <p>{formatedRemaining}</p>
    </Container>
  );
}
