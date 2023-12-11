// Teh logic component

export const TILE_STATUSES = {
    HIDDEN: 'hidden',
    MINE: 'mine',
    NUMBER: 'number',
    MARKED: 'marked',
}

export function createBoard(boardSize, mineCount) {
    const board = []
    const minePositions = getMinePositions(boardSize, mineCount)

    for (let x=0; x<boardSize; x++) {
        const row = []
        for (let y=0; y<boardSize; y++) {
            const element = document.createElement('div')
            element.dataset.status = TILE_STATUSES.HIDDEN

            const tile = {
                element,
                x,
                y,
                mine: minePositions.some(samePosition.bind(null, { x, y })),    // Fancy bind trick
                get status() {
                    return this.element.dataset.status
                },
                set status(value) {
                    this.element.dataset.status = value
                }
            }
            row.push(tile)
        }
        board.push(row)
    }

    return board
}

export function flagTile(tile) {
    if(
        tile.status !== TILE_STATUSES.HIDDEN && 
        tile.status !== TILE_STATUSES.MARKED
        ) {
        return
    }

    if (tile.status === TILE_STATUSES.MARKED) {
        tile.status = TILE_STATUSES.HIDDEN
    } else {
        tile.status = TILE_STATUSES.MARKED
    }
}

export function revealTile(board, tile) {
    if(tile.status !== TILE_STATUSES.HIDDEN) {
        return
    }
    if (tile.mine) {
        tile.status = TILE_STATUSES.MINE
        return
    }
    tile.status = TILE_STATUSES.NUMBER
    const adjacentTiles = neighborTiles(board, tile)
    const mines = adjacentTiles.filter(t => t.mine)
    if(mines.length === 0) {
        adjacentTiles.forEach(revealTile.bind(null, board))     // This recursively invokes the revealTile function on tiles that have no mines beside it
    } else {
        tile.element.textContent = mines.length
    }
}

export function checkL(board) {
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE
        })
    })
}

export function checkW(board) {
    return board.every(row => {
        return row.every(tile => {
            return tile.status === TILE_STATUSES.NUMBER || (tile.mine && (tile.status === TILE_STATUSES.HIDDEN || tile.status === TILE_STATUSES.MARKED))
        })
    })
}

function getMinePositions(boardSize, mineCount) {
    const positions = []

    while(positions.length < mineCount) {
        const position = {
            x: rng(boardSize),
            y: rng(boardSize)
        }
        // Vibe check the position to see if it's not cringe
        if(!positions.some(samePosition.bind(null, position))) {    // Fancy bind trick
            positions.push(position)
        }
    }

    return positions
}

function samePosition(position1, position2) {
    return position1.x === position2.x && position1.y === position2.y
}

function rng(size) {
    return Math.floor(Math.random() * size)
}

function neighborTiles(board, { x, y }) {
    const tiles = []

    for(let xOffset = -1; xOffset <=1; xOffset++) {
        for(let yOffset = -1; yOffset <=1; yOffset++) {
            const tile = board[x + xOffset]?.[y + yOffset]
            if (tile) tiles.push(tile)
        }
    }

    return tiles
}