import { createContext, ReactNode, useState } from "react";
import challenges from "../../challenges.json"

interface Challenge {
    type: 'body' | 'eye',
    description: string,
    amount: number
}

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    completedChallenges: number
    activeChallenge: Challenge;
    experienceToNextLevel: number;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
}

interface ChallengesProviderProps {
    children: ReactNode;
}

export const ChallengesContext = createContext({} as ChallengesContextData)

export function ChallengesProvider( props: ChallengesProviderProps ) {
    const [level, setLevel] = useState(1);
    const [currentExperience, setCurrentExperience] = useState(0);
    const [completedChallenges, setcompletedChallenges] = useState(0);
    const [activeChallenge, setActiveChallenge] = useState(null);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    function levelUp(): void {
        setLevel(level + 1);
    }

    function startNewChallenge(): void {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);
    }

    function resetChallenge(): void {
        setActiveChallenge(null);
    }

    function completeChallenge(): void {
        if (!activeChallenge) {
            return;
        }

        const { amount } = activeChallenge;
        let finalExperience = currentExperience + amount;

        if (finalExperience >= experienceToNextLevel) {
            finalExperience -= experienceToNextLevel
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setcompletedChallenges(completedChallenges + 1);
    }

    return (
        <ChallengesContext.Provider 
            value={{
                level,
                currentExperience, 
                completedChallenges, 
                activeChallenge,
                experienceToNextLevel,
                levelUp,
                startNewChallenge,
                resetChallenge,
                completeChallenge
            }}
        >
            { props.children }
        </ChallengesContext.Provider>
    )
}