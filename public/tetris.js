
// Enumeration for sqaure state; on, full or empty
const state =
{
  ON: 'on',
  FULL: 'full',
  EMPTY: 'empty'
}


// -----------------------------------------------------------------------------


// Class to represent each sqaure in a tetris grid. Contains color and state
class Square
{
  constructor()
  {
    this.fill = color(255);
    this.state = state.EMPTY;
  }

  set(other)
  {
    this.fill = other.fill;
    this.state = other.state;
  }

  setOn(fill)
  {
    this.state = state.ON;
    this.fill = fill;
  }

  setEmpty()
  {
    this.state = state.EMPTY;
    this.fill = color(255, 255, 255);
  }

  is(state)
  {
    return (this.state == state);
  }
}


// -----------------------------------------------------------------------------


// Class to represent color theme. More to come in future
class Theme
{
  constructor(colors)
  {
    this.colors = colors
  }

  get(i)
  {
    return this.colors[i];
  }
}


// -----------------------------------------------------------------------------


// Class to represent tetris grid and hold all helper methods
class Grid
{
  // Create new grid with width w, height h, and theme theme
  constructor(w, h, theme)
  {
    this.origin = createVector(0, 0);
    this.squareSize = createVector(width / w, height / h);
    this.theme = theme;

    // Create 2d array of empty squares
    this.squares = [];
    for (var y = 0; y < h; y++)
    {
      this.squares[y] = []
      for (var x = 0; x < w; x++)
      {
        this.squares[y][x] = new Square();
      }
    }
  }

  // Method to show each shape
  show()
  {
    for (var y = 0; y < this.squares.length; y++)
    {
      for (var x = 0; x < this.squares[y].length; x++)
      {
        this.showSquare(x, y);
      }
    }

    // Draw grid border
    strokeWeight(4);
    stroke(0);
    fill(255, 0);
    rect(2, 2, width-4, height-4);
  }

  // Method to show individual squares
  showSquare(x, y)
  {
    // Turn stroke on for empty squares, off for full.
    if (this.squares[y][x].is(state.EMPTY))
    {
      stroke(150);
      strokeWeight(1);
    }
    else
    {
      noStroke();
    }

    // Rectangle at sqaure position
    fill(this.squares[y][x].fill);
    rect(x * this.squareSize.x, y * this.squareSize.y, this.squareSize.x, this.squareSize.y);
  }

  // Update entire grid each frame. Returns number of lines cleared
  update()
  {
    var scoreAdd = 0;
    // Check if player has placed a block
    if (this.blockedDown())
    {
      this.allOff();
      scoreAdd = this.removeRows();

      if (!this.gameLost())
      {
        // Restart game upon loosing
        this.generateRandomShape();
      }
    }
    else
    {
      this.moveDown();
    }
    return scoreAdd;
  }

  //Remove all squares from grid upon loosing
  emptyGrid()
  {
    for (var y = 0; y < this.squares.length; y++)
    {
      for (var x = 0; x < this.squares[y].length; x++)
      {
        this.squares[y][x].setEmpty();
      }
    }
  }

  // Check if game is lost by viewing if top row contains squares
  gameLost()
  {
    for (var x = 0; x < this.squares[0].length; x++)
    {
      if (this.squares[this.squares.length-1][x].is(state.FULL))
      {
        return true;
      }
    }
    return false;
  }

  // Change state of all squares that were previously on after shape placed.
  allOff()
  {
    for (var y = 0; y < this.squares.length; y++)
    {
      for (var x = 0; x < this.squares[y].length; x++)
      {
        if (this.squares[y][x].is(state.ON))
        {
          this.squares[y][x].state = state.FULL;
        }
      }
    }
  }

  // Find and remove all full rows. Returns rows removed
  removeRows()
  {
    var rowsRemoved = 0;
    for (var y = this.squares.length - 1; y >= 0; y--)
    {
      if (this.rowFull(y))
      {
        rowsRemoved ++;
        this.removeRow(y);
      }
    }

    return rowsRemoved;
  }

  // Check if row at index y is full
  rowFull(y)
  {
    for (var x = 0; x < this.squares[0].length; x++)
    {
      if (this.squares[y][x].is(state.EMPTY))
      {
        return false;
      }
    }

    return true;
  }

  // Remove row at index i and shift all others
  removeRow(i)
  {
    for (var y = i; y < this.squares.length - 1; y++)
    {
      this.setRow(y);
    }

    for (var x = 0; x < this.squares[0].length; x++)
    {
      this.squares[this.squares.length - 1][x].setEmpty();
    }
  }

  // Helper method to transfer an entire row of the grid
  setRow(y)
  {
    for (var x = 0; x < this.squares[0].length; x++)
    {
      this.squares[y][x].set(this.squares[y+1][x]);
    }
  }

  // Generate random shape
  generateRandomShape()
  {
    this.generateShape(Math.floor(random(0, 7)));
  }

  // Generate specified shape
  generateShape(shape)
  {
    // Get color from theme
    var fill = this.theme.get(shape);
    switch (shape)
    {
      case 0: // |
        this.origin.set((this.squares[0].length / 2 >> 0) - 1, this.squares.length - 1);
        for (var x = -2; x < 2; x++)
        {
          this.squares[this.squares.length - 1][(this.squares[0].length / 2 >> 0) + x].setOn(fill);
        }
        break;

      case 1: // O
        this.origin.set(this.squares[0].length / 2 >> 0, this.squares.length - 1);
        for (var y = 1; y <= 2; y++)
        {
          for (var x = -1; x < 1; x++)
          {
            this.squares[this.squares.length - y][(this.squares[0].length / 2 >> 0) + x].setOn(fill);
          }
        }
        break;

      case 2: // J
        this.origin.set(this.squares[0].length / 2 >> 0, this.squares.length - 2);
        for (var y = 0; y < 3; y++)
        {
          this.squares[this.squares.length - y - 1][this.squares[0].length / 2 >> 0].setOn(fill);
        }

        this.squares[this.squares.length - 3][(this.squares[0].length / 2 >> 0) - 1].setOn(fill);
        break;

      case 3: // L
        this.origin.set(this.squares[0].length / 2 >> 0, this.squares.length - 2);
        for (var y = 0; y < 3; y++)
        {
          this.squares[this.squares.length - y - 1][this.squares[0].length / 2 >> 0].setOn(fill);
        }

        this.squares[this.squares.length - 3][(this.squares[0].length / 2 >> 0) + 1].setOn(fill);
        break;

      case 4: // Z
        this.origin.set(this.squares[0].length / 2 >> 0, this.squares.length - 2);
        for (var y = 1; y <= 2; y++)
        {
          this.squares[this.squares.length - y][this.squares[0].length / 2 >> 0].setOn(fill);
        }

        for (var y = 2; y <= 3; y++)
        {
          this.squares[this.squares.length - y][(this.squares[0].length / 2 >> 0) - 1].setOn(fill);
        }
        break;

      case 5: // S
        this.origin.set(this.squares[0].length / 2 >> 0, this.squares.length - 2);
        for (var y = 1; y <= 2; y++)
        {
          this.squares[this.squares.length - y][(this.squares[0].length / 2 >> 0) - 1].setOn(fill);
        }

        for (var y = 2; y <= 3; y++)
        {
          this.squares[this.squares.length - y][this.squares[0].length / 2 >> 0].setOn(fill);
        }
        break;

      case 6: // T
        this.origin.set(this.squares[0].length / 2 >> 0, this.squares.length - 1);
        for (var x = -1; x <= 1; x++)
        {
          this.squares[this.squares.length - 1][(this.squares[0].length / 2 >> 0) + x].setOn(fill);
        }
        this.squares[this.squares.length - 2][this.squares[0].length / 2 >> 0].setOn(fill);
    }
  }

  // Rotate shape right
  rotateRight()
  {
    // Generate empty list
    var newSquares = [];
    for (var y = 0; y < this.squares.length; y++)
    {
      newSquares[y] = [];
      for (var x = 0; x < this.squares[y].length; x++)
      {
        newSquares[y][x] = new Square();
      }
    }


    // Fill new list with correct location
    for (var y = 0; y < this.squares.length; y++)
    {
      for (var x = 0; x < this.squares[y].length; x++)
      {
        if (this.squares[y][x].is(state.ON))
        {
          var coord = createVector(x - this.origin.x, y - this.origin.y);
          var newCoord = createVector(coord.y + this.origin.x, -coord.x + this.origin.y);

          // Check if new coordinate is off grid. If so, move the shape and try again
          if (newCoord.x < 0)
          {
            this.moveRight();
            this.rotateRight();
            return;
          }
          else if (newCoord.x >= this.squares[0].length)
          {
            this.moveLeft();
            this.rotateRight();
            return;
          }
          else if (newCoord.y >= this.squares.length)
          {
            this.moveDown();
            this.rotateRight();
            return;
          }
          // Don't try again if shap is in other block or below grid.
          else if (newCoord.y < 0 || this.squares[newCoord.y][newCoord.x].is(state.FULL))
          {
            return;
          }
          newSquares[newCoord.y][newCoord.x].set(this.squares[y][x]);
        }
      }
    }

    // Transfer to new list
    for (var y = 0; y < this.squares.length; y++)
    {
      for (var x = 0; x < this.squares[y].length; x++)
      {
        if (this.squares[y][x].is(state.ON))
        {
          this.squares[y][x].setEmpty();
        }

        if (newSquares[y][x].is(state.ON))
        {
          this.squares[y][x].set(newSquares[y][x]);
        }
      }
    }
  }

  // Check if shape motion is blocked below.
  blockedDown()
  {
    for (var y = 0; y < this.squares.length; y++)
    {
      for (var x = 0; x < this.squares[y].length; x++)
      {
        if ((this.squares[y][x].is(state.ON) && y == 0) ||
        (this.squares[y][x].is(state.ON) && this.squares[y-1][x].is(state.FULL)))
        {
          return true;
        }
      }
    }

    return false;
  }

  // Move the shape down, if possible
  moveDown()
  {
    if (!this.blockedDown())
    {
      this.origin.y--;
      for (var y = 1; y < this.squares.length; y++)
      {
        for (var x = 0; x < this.squares[y].length; x++)
        {
          if (this.squares[y][x].is(state.ON))
          {
            this.squares[y-1][x].set(this.squares[y][x]);
            this.squares[y][x].setEmpty();
          }
        }
      }
    }
  }

  // Check if shape motion is blocked to the left
  blockedLeft()
  {
    for (var y = 0; y < this.squares.length; y++)
    {
      for (var x = 0; x < this.squares[y].length; x++)
      {
        if ((this.squares[y][x].is(state.ON) && x == 0) ||
        (this.squares[y][x].is(state.ON) && this.squares[y][x-1].is(state.FULL)))
        {
          return true;
        }
      }
    }

    return false;
  }

  // Move the shape left, if possible
  moveLeft()
  {
    if (!this.blockedLeft())
    {
      this.origin.x--;
      for (var y = 0; y < this.squares.length; y++)
      {
        for (var x = 0; x < this.squares[y].length; x++)
        {
          if (this.squares[y][x].is(state.ON))
          {
            this.squares[y][x-1].set(this.squares[y][x]);
            this.squares[y][x].setEmpty();
          }
        }
      }
    }
  }

  // Check if shape motion is blocked to the right
  blockedRight()
  {
    for (var y = 0; y < this.squares.length; y++)
    {
      for (var x = 0; x < this.squares[y].length; x++)
      {
        if ((this.squares[y][x].is(state.ON) && x == this.squares[y].length - 1) ||
        (this.squares[y][x].is(state.ON) && this.squares[y][x+1].is(state.FULL)))
        {
          return true;
        }
      }
    }
    return false;
  }

  // Move the shape to the right, if possible
  moveRight()
  {
    if (!this.blockedRight())
    {
      this.origin.x++;
      for (var y = 0; y < this.squares.length; y++)
      {
        for (var x = this.squares[y].length - 1; x >= 0; x--)
        {
          if (this.squares[y][x].is(state.ON))
          {
            this.squares[y][x+1].set(this.squares[y][x]);
            this.squares[y][x].setEmpty();
          }
        }
      }
    }
  }

  // Resize squares when window is resized.
  windowResized()
  {
    this.squareSize.set(width / this.squares[0].length, height / this.squares.length);
  }
}


// -----------------------------------------------------------------------------

// Class to represent a full tetris game
class Tetris
{
  // Prepare all instance variables in constructor
  constructor()
  {
    // Key control variables
    this.nextUpdate = 500;
    this.updateTimeout = 600;
    this.nextInput = 0;
    this.inputTimeout = 50;
    this.initialInputTimeout = 300;
    this.firstPress = true;

    // Touch control variables
    this.initialMouse = createVector(0, 0);
    this.unitsMoved = createVector(0, 0);
    this.pressTime = 0;
    this.firstClick = true;

    this.score = 0;
    var theme = new Theme([color(121,13,16), color(198,42,29), color(221,155,59),
      color(70,139,130), color(14,100,124), color(177,180,102), color(234,57,107)]);
    this.grid = new Grid(10, 20, theme);
  }

  reset()
  {
    // Key control variables
    this.nextUpdate = 500;
    this.updateTimeout = 600;
    this.nextInput = 0;
    this.inputTimeout = 50;
    this.initialInputTimeout = 300;
    this.firstPress = true;

    // Touch control variables
    this.initialMouse = createVector(0, 0);
    this.unitsMoved = createVector(0, 0);
    this.pressTime = 0;
    this.firstClick = true;

    this.score = 0;
    this.grid.emptyGrid();
    this.grid.generateRandomShape();
  }

  draw()
  {
    // Put origin in bottom left corner
    scale(1, -1);
    translate(0, -height);

    // Update the grid if update time is reached
    if (millis() >= this.nextUpdate)
    {
      var linesCleared = this.grid.update();

      if (linesCleared == 1)
      {
        this.score += 40;
      }
      else if (linesCleared == 2)
      {
        this.score += 100;
      }
      else if (linesCleared == 3)
      {
        this.score += 300;
      }
      else if (linesCleared == 4)
      {
        this.score += 1200;
      }

      this.nextUpdate = millis() + this.updateTimeout;
      if (this.updateTimeout > 250)
      {
        this.updateTimeout --;
      }
    }
    this.grid.show();

    // Key control every key interval
    if (millis() >= this.nextInput && keyIsPressed)
    {
      // Longer delay after first key down
      if (this.firstPress)
      {
        this.nextInput = millis() + this.initialInputTimeout;
        this.firstPress = false;
      }
      else
      {
        this.nextInput = millis() + this.inputTimeout;
      }

      // Execute code upon key down
      if (keyCode == LEFT_ARROW)
      {
        this.grid.moveLeft();
      }
      else if (keyCode == RIGHT_ARROW)
      {
        this.grid.moveRight();
      }
      else if (keyCode == DOWN_ARROW)
      {
        this.grid.moveDown();
      }
      else if (keyCode == UP_ARROW)
      {
        this.grid.rotateRight();
      }
    }

    // After key is released
    if (!keyIsPressed && !this.firstPress)
    {
      this.firstPress = true;
      this.nextInput = millis();
    }

    // Mouse/Finger control
    if (mouseIsPressed)
    {
      // set initial mouse position on first mouse click
      if (this.firstClick)
      {
        this.initialMouse.set(mouseX, mouseY);
        this.firstClick = false;
        this.pressTime = millis();
      }

      // Determine distance mouse has moved since initial click
      var fingerMoved = createVector((mouseX - this.initialMouse.x) / this.grid.squareSize.x >> 0,
                                     (mouseY - this.initialMouse.y) / this.grid.squareSize.y >> 0);

      // Move shape down if mouse has moved down significantly
      if (fingerMoved.y > this.unitsMoved.y)
      {
        this.grid.moveDown();
        this.unitsMoved.y++;
      }
      // Otherwise, move right
      else if (fingerMoved.x > this.unitsMoved.x)
      {
        this.grid.moveRight();
        this.unitsMoved.x++;
      }
      // Shape left
      else if (fingerMoved.x < this.unitsMoved.x)
      {
        this.grid.moveLeft();
        this.unitsMoved.x--;
      }
    }

    // At mouse release, reset variables and rotate shape if short click
    if (!mouseIsPressed && !this.firstClick)
    {
      this.firstClick = true;
      if (millis() - this.pressTime < 200 && this.unitsMoved.equals(0, 0))
      {
        this.grid.rotateRight();
      }

      this.unitsMoved.set(0, 0);
    }
  }

  // Code to execute when window changes size
  windowResized()
  {
    this.grid.windowResized();
  }

  gameLost()
  {
    return this.grid.gameLost();
  }
}
