import { useEffect, useState } from "react";
import "./App.css";

const _ = require("lodash");

const nextStep = new Map([
  [0, [1, 4]],
  [1, [0, 2, 5]],
  [2, [1, 3, 6]],
  [3, [2, 7]],
  [4, [0, 5, 8]],
  [5, [1, 4, 6, 9]],
  [6, [2, 5, 7, 10]],
  [7, [3, 6, 11]],
  [8, [4, 9, 12]],
  [9, [5, 8, 10, 13]],
  [10, [6, 9, 11, 14]],
  [11, [7, 10, 15]],
  [12, [8, 13]],
  [13, [9, 12, 14]],
  [14, [10, 13, 15]],
  [15, [11, 14]],
]);

const isPlayable = (chipArray) => {
  const parity = chipArray
    .filter((item) => {
      return item !== "16";
    })
    .map((item, index, arr) => {
      return arr.slice(index).filter((next) => {
        return parseInt(next) < parseInt(item);
      }).length;
    });
  const summ = parity.reduce((prev, value) => {
    return prev + value;
  });
  return summ % 2 === 0;
};

const getPlayableShuffle = (chipArray) => {
  let shuffled;
  do {
    shuffled = _.shuffle([...chipArray]);
  } while (!isPlayable(shuffled));
  return shuffled;
};

const rawChips = [...Array(16)].map((item, index) => {
  return String(index + 1);
});

const Board = ({ cls, childs }) => {
  return <div className={cls}>{childs}</div>;
};

const Chip = ({ text, clickHandler, cls }) => {
  return (
    <div className={cls} onClick={clickHandler}>
      {text}
    </div>
  );
};

const Win = ({ text, cls }) => {
  return <div className={cls}>{text}</div>;
};

const Game = ({ text, cls }) => {
  return <div className={cls}>{text}</div>;
};

const Footer = ({ text, href, cls }) => {
  return (
    <div className={cls}>
      <a href={href} target={"_blank"}>
        {text}
      </a>
    </div>
  );
};

const Counter = ({ value, cls }) => {
  return <div className={cls}>{`Steps: ${value}`}</div>;
};

const Restart = ({ text, clickHandler, cls }) => {
  return (
    <div className={cls} onClick={clickHandler}>
      {text}
    </div>
  );
};

const chipProps = (text, index, swap) => {
  return {
    key: text,
    text: text !== "16" && text,
    clickHandler: () => {
      swap(index);
    },
    cls: text === "16" ? "Empty" : "Chip",
  };
};

const boardProps = (chips, swap) => {
  return {
    cls: "Board",
    childs: chips.map((item, index) => {
      return <Chip {...chipProps(item, index, swap)} />;
    }),
  };
};

const counterProps = (step) => {
  return { value: step, cls: "Counter" };
};

const restartProps = (restart) => {
  return {
    text: "Shuffle",
    clickHandler: () => {
      restart();
    },
    cls: "Restart",
  };
};

const winProps = {
  text: "You win!",
  cls: "Win",
};

const gameProps = {
  text: "ffTeem Game!",
  cls: "Game",
};

const footerProps = {
  text: "[ source code ]",
  href: "https://github.com/olegbutrin/ffteen",
  cls: "Footer",
};

function App() {
  const [step, setStep] = useState(0);
  const [chips, setChips] = useState(getPlayableShuffle(rawChips));
  const [win, setWin] = useState(false);

  useEffect(() => {
    if (_.isEqual(chips, rawChips)) {
      setWin(true);
    }
  }, [chips, setWin]);

  const swap = (chipIndex) => {
    const chipValue = chips[chipIndex];
    const emptyIndex = chips.indexOf("16");
    const nextIndexes = nextStep.get(chipIndex);
    if (nextIndexes.includes(emptyIndex)) {
      setStep(step + 1);
      setChips([
        ...chips.map((item, index) => {
          return index === chipIndex
            ? "16"
            : index === emptyIndex
            ? chipValue
            : item;
        }),
      ]);
    }
  };

  const restart = () => {
    const shuffledChips = getPlayableShuffle(rawChips);
    setStep(0);
    setWin(false);
    setChips(shuffledChips);
  };

  return (
    <div className={"App"}>
      <div className={"Canvas"}>
        <Game {...gameProps} />
        <div className={"Header"}>
          <Counter {...counterProps(step)} />
          <Restart {...restartProps(restart)} />
        </div>
        {win ? <Win {...winProps} /> : <Board {...boardProps(chips, swap)} />}
        <Footer {...footerProps} />
      </div>
    </div>
  );
}

export default App;
