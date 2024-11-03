import React, {ReactElement, useEffect, useState} from "react";
import {calculate, Results} from "../src/domain/calculate";


const Index = (): ReactElement => {
  const [numWhite, setNumWhite] = useState<number>(0)
  const [numYellow, setNumYellow] = useState<number>(0)
  const [numRed, setNumRed] = useState<number>(0)
  const [numBlack, setNumBlack] = useState<number>(0)
  const [showWarning, setShowWarning] = useState<boolean>(false)
  const [goal, setGoal] = useState<number | undefined>(undefined)
  const [results, setResults] = useState<Results>({
    pFailure: 0,
    pSums: {},
    averageSum: 0,
    pBeatGoal: 0
  })

  useEffect(() => {
    if (numWhite + numYellow + numRed + numBlack > 9) {
      setShowWarning(true)
    } else {
      setShowWarning(false)
      setResults(calculate({numWhite, numYellow, numRed, numBlack}, goal))
    }
  }, [numWhite, numYellow, numRed, numBlack, goal])

  return (
    <>
      <main>
        <div className="container mbxl mtm">
          <div className="row mbs">
            <div className="col-12">
              <h1 className="text-xxl bold">Oathsworn Dice Calculator</h1>
            </div>
          </div>

          <div className="row">
            <div className="col-12">
              <h2 className="text-xl bold mvd">Input Dice</h2>
              <div className="mbd">
                <label htmlFor="#white-dice">
                  <b>Number of ⬜ White Dice:</b>
                </label>
                <input
                    id="white-dice"
                    type="number"
                    className="mls"
                    value={numWhite}
                    onChange={(event) => setNumWhite(parseInt(event.target.value))}
                />
              </div>
              <div className="mbd">
                <label htmlFor="#yellow-dice">
                  <b>Number of 🟨 Yellow Dice:</b>
                </label>
                <input
                    id="yellow-dice"
                    type="number"
                    className="mls"
                    value={numYellow}
                    onChange={(event) => setNumYellow(parseInt(event.target.value))}
                />
              </div>
              <div className="mbd">
                <label htmlFor="#red-dice">
                  <b>Number of 🟥 Red Dice:</b>
                </label>
                <input
                    id="red-dice"
                    type="number"
                    className="mls"
                    value={numRed}
                    onChange={(event) => setNumRed(parseInt(event.target.value))}
                />
              </div>
              <div className="mbd">
                <label htmlFor="#black-dice">
                  <b>Number of ⬛ Black Dice:</b>
                </label>
                <input
                    id="black-dice"
                    type="number"
                    className="mls"
                    value={numBlack}
                    onChange={(event) => setNumBlack(parseInt(event.target.value))}
                />
              </div>

              <div className="mbd">
                <label htmlFor="#goal">
                  <b>(optional) Trying to beat:</b>
                </label>
                <input
                    id="goal"
                    type="number"
                    className="mls"
                    value={goal}
                    onChange={(event) => setGoal(parseInt(event.target.value))}
                />
              </div>
            </div>
          </div>

          <div className="row mbd">
            <div className="col-md-6">
              {showWarning && <>
                <div className="pad bg-alert">Too many dice to calculate. Try again with 9 or fewer dice.</div>
              </>}
            </div>
          </div>

          <div className="row mbxl">
            <div className="col-md-6">
              <h2 className="text-xl bold mbd mts">Results</h2>
              <div>
                <Probability label="Probability of failure" result={results.pFailure} isPercent/>
              </div>
              <hr/>
              <div>
                <Probability label="Average" result={results.averageSum} isPercent={false}/>
              </div>
              <hr/>
              {(goal !== undefined && !Number.isNaN(goal)) ? <>
                <Probability label={`Probability to beat ${goal} without failure`} result={results.pBeatGoal}
                             isPercent/>
                <hr/>
              </> : <></>}
              {Object.keys(results.pSums).map(sum => (
                  <Probability label={`Probability of sum ${sum}`} result={results.pSums[sum]} isPercent/>
              ))}

            </div>
          </div>

        </div>
      </main>
    </>
);
};

const Probability = (props: {
  label: string, result: number, isPercent: boolean }): ReactElement => {

  const percent = (dec: number) => `${(dec * 100).toFixed(0)}%`;

  return (
      <div>
        {props.label}: <span className=" font-mono text-m">{props.isPercent ? percent(props.result) : props.result}</span>
      </div>
  )
}

export default Index;
