import { createContext, ReactNode, useEffect, useState } from "react";
import Cookies from "js-cookie";
import challenges from "../../challenges.json"
import { CompletedChallenges } from "../components/CompletedChallenges";
import { LevelUpModal } from "../components/LevelUpModal";

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
    closeLevelUpModal: () => void;
}

interface ChallengesProviderProps {
    children: ReactNode;
    level: number;
    currentExperience: number;
    completedChallenges: number;
}

export const ChallengesContext = createContext({} as ChallengesContextData)

export function ChallengesProvider( props: ChallengesProviderProps ) {
    const [level, setLevel] = useState(props.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(props.currentExperience ?? 0);
    const [completedChallenges, setcompletedChallenges] = useState(props.completedChallenges ?? 0);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    useEffect(() => {
        Notification.requestPermission();
    }, [])

    useEffect(() => {
        Cookies.set('level', level.toString());
        Cookies.set('currentExperience', currentExperience.toString());
        Cookies.set('completedChallenges', completedChallenges.toString());
    }, [level, currentExperience, completedChallenges])

    function levelUp(): void {
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }

    function startNewChallenge(): void {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if (Notification.permission === 'granted') {
            new Notification('New challenge! 🎉', {
                body: `Worth ${challenge.amount} xp`
            })
        }
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

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
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
                completeChallenge,
                closeLevelUpModal
            }}
        >
            { props.children }

            { isLevelUpModalOpen && <LevelUpModal /> }
        </ChallengesContext.Provider>
    )
}