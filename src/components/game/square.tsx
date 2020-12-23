// 三目並べゲームで一つ一つのボタンを表すコンポーネント

import * as React from "react";

type SquareValue = string | null

// props
type SquareProps = {
    value: SquareValue,
    onClick: () => void
}

// stateを操作しない ... 関数コンポーネント
const Square: React.FC<SquareProps> = props => {
    return (
        <button className={"square"} onClick={() => {
            props.onClick()
        }}>
            {props.value}
        </button>
    )
}

export default Square;