import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountdown: () => void;
    resetCountdown: () => void;
}

interface CountdownProviderProps {
    children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData)

let countdownTimeout: NodeJS.Timeout;
let initialTime = 0.05 * 60

export function CountdownProvider(props: CountdownProviderProps) {
    const { startNewChallenge } = useContext(ChallengesContext);

    const [time, setTime] = useState(initialTime);
    const [isActive, setIsActive] = useState(false);
    const [hasFinished, setHasFinished] = useState(false);
  
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    function startCountdown() : void {
      setIsActive(true);
    }
  
    function resetCountdown() : void {
      clearTimeout(countdownTimeout);
      setIsActive(false);
      setTime(initialTime);
      setHasFinished(false);
    }
  
    useEffect(() => {
      if (isActive && time > 0) {
        countdownTimeout = setTimeout(() => {
          setTime(time - 1);
        }, 1000)
      } else if (isActive && time === 0) {
        setHasFinished(true);
        setIsActive(false);
        startNewChallenge();
      }
    }, [isActive, time]);
  
    return (
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            isActive,
            startCountdown,
            resetCountdown        
        }}>
            {props.children}
        </CountdownContext.Provider>
    )
}