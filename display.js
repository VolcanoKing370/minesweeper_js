// Teh display component

import { TILE_STATUSES, createBoard, flagTile, revealTile, checkL, checkW } from "./logic.js"

const BOARD_SIZE = 5

const MINE_COUNT = 4

const board = createBoard(BOARD_SIZE, MINE_COUNT)
const boardElement = document.querySelector(".board")
const minesRemaining = document.querySelector("[data-mines-remaining]")
const statusText = document.querySelector(".subtext")

console.log(board)

boardElement.style.setProperty("--size", BOARD_SIZE)
board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element)
        tile.element.addEventListener("click", () => {
            revealTile(board, tile)
            checkGameOver()
        })
        tile.element.addEventListener("contextmenu", e => {
            e.preventDefault()
            flagTile(tile)
            listRemainingMines()
        })
    })
})
minesRemaining.textContent = MINE_COUNT

function listRemainingMines() {
    const markedTilesCount = board.reduce((count, row) => {
        return count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
    }, 0)

    minesRemaining.textContent = MINE_COUNT - markedTilesCount
}

function checkGameOver() {
    const win = checkW(board)
    const lose = checkL(board)
    
    if (win || lose) {
        boardElement.addEventListener('click', stopProp, {capture: true})
        boardElement.addEventListener('contextmenu', stopProp, {capture: true})
    }

    if(win) {
        statusText.textContent = "A Winner is You!"
    }
    if(lose) {
        statusText.textContent = "It's SOOOO OVER!"
        board.forEach(row => {
            row.forEach(tile => {
                if(tile.status === TILE_STATUSES.MARKED) flagTile(tile)
                if(tile.mine) revealTile(board, tile)
            })
        })
    }
}

function stopProp(e) {
    e.stopImmediatePropagation()
}