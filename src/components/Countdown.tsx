import { clear } from "node:console";
import { useState, useEffect } from "react";
import styles from "../styles/components/Countdown.module.css"

let countdownTimeout: NodeJS.Timeout;
let initialTime = 0.05 * 60

export function Countdown() {
  const [time, setTime] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const [minutesLeft, minutesRight] = String(minutes).padStart(2, '0').split('');
  const [secondsLeft, secondsRight] = String(seconds).padStart(2, '0').split('');

  function startCountdown() : void {
    setIsActive(true);
  }

  function resetCountdown() : void {
    clearTimeout(countdownTimeout);
    setIsActive(false);
    setTime(initialTime)
  }

  useEffect(() => {
    if (isActive && time > 0) {
      countdownTimeout = setTimeout(() => {
        setTime(time - 1);
      }, 1000)
    } else if (isActive && time === 0) {
      setHasFinished(true);
      setIsActive(false);
    }
  }, [isActive, time]);

  return (
    <div>      
      <div className={styles.countdownContainer}>
        <div>
          <span>{minutesLeft}</span>
          <span>{minutesRight}</span>
        </div>
        <span>:</span>
        <div>
          <span>{secondsLeft}</span>
          <span>{secondsRight}</span>
        </div>
      </div>

      { hasFinished ? (
        <button 
          disabled
          className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
        >
          Cycle Finished
        </button>
      ) : (
        <>
          { isActive ? (
            <button 
              type="button" 
              className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
              onClick={resetCountdown}
            >
              Cancel Cycle
            </button>
          ) : (
            <button 
              type="button" 
              className={styles.countdownButton}
              onClick={startCountdown}
            >
              New Cycle
            </button>
          ) }
        </>
      ) }

    </div>
  )
}