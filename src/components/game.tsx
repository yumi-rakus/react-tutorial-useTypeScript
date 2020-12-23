import * as React from "react";
import Board from "./game/board";

type stage = {
    squares: Array<string>
}

// props
type GameProps = {}

// state
type GameState = {
    history: Array<stage>,
    xIsNext: boolean,
    stepNumber: number
}

class Game extends React.Component<GameProps, GameState> {

    constructor(props: GameProps) {
        super(props);

        // stateの初期値
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null)
                }
            ],
            xIsNext: true,
            stepNumber: 0 // history[]のindex番号の役割を果たす変数
        }
    }

    // 勝者を判定するメソッド
    calculateWinner(squares: Array<string>) {
        //bingoリスト
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];

            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a]; // 勝者確定：X or ○
            }
        }
        return null;
    }

    // clickされたときの処理
    handleClick(i: number) {
        // i ... squareコンポーネントのindex番号

        // 履歴の取得
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];

        // そのときのsquaresの状況（をコピー）
        const squares = current.squares.slice();

        // 勝者が決まった場合、もうクリックされたマスの場合
        // 何も動作しないようにreturnのみ
        if (this.calculateWinner(squares) || squares[i]) {
            return;
        }

        // playerがどちらなのか判断しマークする
        squares[i] = this.state.xIsNext ? 'X' : '○';

        // console.log('history: ', history)
        // console.log('history.concat({squares: squares}): ', history.concat({squares: squares}))

        // stateの更新
        this.setState({
            // stepNumberでsliceしたコピーを新しいhistoryとしてセットしているため、
            // jumpしていればその時点でのhistoryが再セットされる
            history: history.concat({squares: squares}),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length
        });
    }

    // squaresを選択した履歴の状態に戻すメソッド
    jumpTo(step: number) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares);

        let status;
        if (winner) {
            // 勝者が確定した場合
            status = 'Winner: ' + winner;
        } else {
            // 勝者が確定していない場合　勝負は続く
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : '○');
        }

        // 初期表示時のhistory ... length1の中身Array(9).fill(null)

        // 履歴を表示するJSX
        const moves = history.map((step, index) => {
            const desc = index ? "Go to move #" + index : 'Go to game start';
            // ※ 0はfalse

            return (
                <li key={index}>
                    <button onClick={() => {
                        this.jumpTo(index)
                    }}>{desc}</button>
                </li>
            );
        });


        return (
            <div className={'game'}>
                <div className={'game-board'}>
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className={'game-info'}>
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        )
    }
}

export default Game;