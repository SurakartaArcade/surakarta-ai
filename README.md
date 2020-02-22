# Surakarta AI - Negamax Computer Engine (Web)

The aim of this project is to provide a high-performance computer engine for the Surakarta game. It uses the Negamax algorithm
with the following optimizations:


| Optimization                             | Status             |
|------------------------------------------|--------------------|
| Alpha/beta pruning                       | :white_check_mark: |
| Transposition Table                      | :white_check_mark: |
| Parallelization (workers)                | In-Progress        |
| Iterative deepening depth-first search   | In-Progress        |

## Benchmarks

You can analyze the effect of different optimizations using the `benchmark` script.

## Inspirations

* Alpha-beta pruning: https://en.wikipedia.org/wiki/Alpha–beta_pruning
* Transposition table: https://github.com/official-stockfish/Stockfish/blob/master/src/tt.h
* Parallel programming: http://www.pressibus.org/ataxx/autre/minimax/paper.html
