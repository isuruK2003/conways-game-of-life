# Conway's Game of Life

A simple interactive implementation of Conway's Game of Life using HTML5 Canvas and JavaScript. Checkout the demo: [isuruk2003.github.io/conways-game-of-life/](https://isuruk2003.github.io/conways-game-of-life/src/index.html)

## What is Conway's Game of Life?

Conway's Game of Life is a cellular automaton devised by mathematician John Horton Conway. It is a zero-player game, meaning its evolution is determined by its initial state, requiring no further input. The game consists of a grid of cells, each of which can be alive or dead. The state of the grid evolves in discrete steps according to a set of simple rules.

### Rules

At each step, the following transitions occur for every cell:

1. **Underpopulation:** Any live cell with fewer than two live neighbors dies.
2. **Survival:** Any live cell with two or three live neighbors lives on to the next generation.
3. **Overpopulation:** Any live cell with more than three live neighbors dies.
4. **Reproduction:** Any dead cell with exactly three live neighbors becomes a live cell.

These simple rules can lead to surprisingly complex and beautiful patterns over time.
