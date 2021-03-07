import { clear } from "node:console";
import { useState, useEffect, useContext } from "react";
import { ChallengesContext } from "../contexts/ChallengesContext";
import { CountdownContext } from "../contexts/CountdownContext";
import styles from "../styles/components/Countdown.module.css"

export function Countdown() {
  const countdown = useContext(CountdownContext);

  const [minutesLeft, minutesRight] = String(countdown.minutes).padStart(2, '0').split('');
  const [secondsLeft, secondsRight] = String(countdown.seconds).padStart(2, '0').split('');

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

      { countdown.hasFinished ? (
        <button 
          disabled
          className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
        >
          Cycle Finished
        </button>
      ) : (
        <>
          { countdown.isActive ? (
            <button 
              type="button" 
              className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
              onClick={countdown.resetCountdown}
            >
              Cancel Cycle
            </button>
          ) : (
            <button 
              type="button" 
              className={styles.countdownButton}
              onClick={countdown.startCountdown}
            >
              New Cycle
            </button>
          ) }
        </>
      ) }

    </div>
  )
}