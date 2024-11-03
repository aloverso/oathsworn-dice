import {BLACK, RED, WHITE, YELLOW} from "./consts";

type DiceToRoll = {
    numWhite: number,
    numYellow: number,
    numRed: number,
    numBlack: number,
}

export type Results = {
    pFailure: number,
    pSums: Record<number, number>,
    averageSum: number,
    pBeatGoal: number
}

export const calculate = (diceToRoll: DiceToRoll, goal: number | undefined): Results => {
    const allRolls: number[][] = []

    const nForLoops = (prevRolls: number[], diceToRoll: DiceToRoll) => {
        if (diceToRoll.numWhite > 0) {
            for (const die of WHITE) {
                nForLoops([...prevRolls, die], {...diceToRoll, numWhite: diceToRoll.numWhite-1});
            }
        }
        else if (diceToRoll.numYellow > 0) {
            for (const die of YELLOW) {
                nForLoops([...prevRolls, die], {...diceToRoll, numYellow: diceToRoll.numYellow-1});
            }
        }
        else if (diceToRoll.numRed > 0) {
            for (const die of RED) {
                nForLoops([...prevRolls, die], {...diceToRoll, numRed: diceToRoll.numRed-1});
            }
        }
        else if (diceToRoll.numBlack > 0) {
            for (const die of BLACK) {
                nForLoops([...prevRolls, die], {...diceToRoll, numBlack: diceToRoll.numBlack-1});
            }
        }
        else {
            allRolls.push([...prevRolls])
        }
    }

    nForLoops([], diceToRoll)

    const total = allRolls.length
    const resultsMap: Record<number, number> = {}
    let numFailures = 0
    let sumOfSums = 0
    let numBeatGoal = 0

    for (const result of allRolls) {
        const numBlanksInRoll = result.filter(it => it===0).length
        if (numBlanksInRoll >= 2) numFailures += 1
        const sum = result.reduce((acc, cur) => cur+acc, 0)

        if (goal && sum >= goal && numBlanksInRoll < 2) numBeatGoal+=1

        sumOfSums += sum
        if (resultsMap[sum]) {
            resultsMap[sum] += 1
        } else {
            resultsMap[sum] = 1
        }
    }

    const pSums = Object.values(resultsMap).map(count => count/total)

    return {
        pFailure: numFailures/total,
        pSums,
        averageSum: sumOfSums/total,
        pBeatGoal: numBeatGoal/total
    }
}
