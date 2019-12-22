// Prevent scroll
function preventDefault(e)
{
    e.preventDefault();
}

var menu = document.getElementById('menu');
var pauseScreen = document.getElementById('pause');
var startButton = document.getElementById('startButton');
var pauseButton = document.getElementById('pauseButton');
var pauseScreen = document.getElementById('pauseScreen');
var quitButton = document.getElementById('quitButton');
var scoreLabel = document.getElementById('scoreLabel');
var pauseScoreLabel = document.getElementById('pauseScoreLabel');

var tetris;
var cnv
var gameRunning = false;

function toggleMenu()
{
  if (gameRunning)
  {
    scoreLabel.innerHTML = 'Score: ' + tetris.score;
    menu.style.display = 'block';
    pauseButton.style.display = 'none';
  }
  else
  {
    menu.style.display = 'none';
    pauseButton.style.display = 'block';
    tetris.reset();
  }

  gameRunning = !gameRunning;
}

function togglePause()
{
  if (gameRunning)
  {
    pauseButton.children[0].src = 'play.png';
    pauseScreen.style.display = 'block';
    pauseScoreLabel.innerHTML = 'Score: ' + tetris.score;
  }
  else
  {
    pauseButton.children[0].src = 'pause.png';
    pauseScreen.style.display = 'none';
  }

  gameRunning = !gameRunning;
}

startButton.onclick = function()
{
  toggleMenu();
};

pauseButton.onclick = function()
{
  togglePause();
};

quitButton.onclick = function()
{
  togglePause();
  toggleMenu();
}

document.body.addEventListener('touchmove', preventDefault, { passive: false });

function setup()
{
  cnv = createCanvas(windowHeight / 2 >> 0, windowHeight);
  cnv.position((windowWidth - width) / 2, 0);
  tetris = new Tetris();
  tetris.grid.show();
}

function draw()
{
  if (gameRunning)
  {
    tetris.draw();

    if (tetris.gameLost())
    {
      toggleMenu();
    }
  }
}

function windowResized()
{
  resizeCanvas(windowHeight / 2 >> 0, windowHeight);
  cnv.position((windowWidth - width) / 2, 0);
  tetris.windowResized();
}
