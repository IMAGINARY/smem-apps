# Singing birds
## Url inline options
When opening the page, say .../index.html, append a string ?option1=value1&option2=value2&... to add options.
| OPTION NAME    | OPTION VALUE                  |DESCRIPTION                  |  DEFAULT |   
|----------------|-------------------------------|-----------------------------| ---------|
|birds               |Integer number from 1 to 6 |Change the number of birds   | 6        |


# Waterlilies
## Url inline options
When opening the page, say .../index.html, append a string ?option1=value1&option2=value2&... to add options.

| OPTION NAME    | OPTION VALUE                  |DESCRIPTION                  |  DEFAULT |   
|----------------|-------------------------------|-----------------------------| ---------|
|leaves               |Integer number from 1 to 10 |Change the number of vertices| 6        |
|maxEdges             |Integer number           |Change the maximum number of edges in the graph| 999        |
|SpeedEdges           |Float number from 0 to 1           |Change the speed of growth of the edges of the graph, from min to max| 1        |
|SpeedFlowers         |Float number from 0 to 1         |Change the speed of growth of the leaves of the graph, from min to max| 0        |

# Rabbit maze
## Url inline options
When opening the page, say .../index.html, append a string ?option1=value1&option2=value2&... to add options.

| OPTION NAME    | OPTION VALUE                  |DESCRIPTION                  |  DEFAULT |   
|----------------|-------------------------------|-----------------------------| ---------|
|r               |Integer number  |Change the number of rows of the initial table from which the maze is generated| 6        |
|c             |Integer number           |Change the number of columns of the initial table from which the maze is generated| 8        |
|s             |Integer number           |An indication of how many edges has to be removed from the initial table to get the maze|(2rc-r-c)/2        |
|b|Integer number           |Maximum number of distracting elements for the rabbits (carrots)| 3        |
|o|Integer number           |Number of rocks to block the path| 8        |
|FastSpeed|Float number from 0 to 1           |Change the fast speed of rabbits, from min to max| 1        |
