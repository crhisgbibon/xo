"use strict";

function CalculateVh()
{
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', vh + 'px');
}

window.addEventListener('DOMContentLoaded', CalculateVh);
window.addEventListener('resize', CalculateVh);
window.addEventListener('orientationchange', CalculateVh);

const WhiteScoreButton = document.getElementById("WhiteScoreButton");
const BlackScoreButton = document.getElementById("BlackScoreButton");

const checkboxXAI = document.getElementById("checkboxXAI");
checkboxXAI.onclick = function(){ ToggleAI('X') };
const checkboxOAI = document.getElementById("checkboxOAI");
checkboxOAI.onclick = function(){ ToggleAI('O') };

const speedAI = document.getElementById("speedAI");
speedAI.onchange = function(){ UpdateSlider(speedAI.value, 1) };
const display001 = document.getElementById("display001");
display001.onchange = function(){ UpdateText(display001.value, 1) };

const speedNewGame = document.getElementById("speedNewGame");
speedNewGame.onchange = function(){ UpdateSlider(speedNewGame.value, 2) };
const display002 = document.getElementById("display002");
display002.onchange = function(){ UpdateText(display002.value, 2) };

const ResetButton = document.getElementById("ResetButton");
ResetButton.onclick = function(){ Reset() };

const settingsMenu = document.getElementById("settingsMenu");
settingsMenu.style.display = 'none';
let toggleS = false;
const OptionsButton = document.getElementById("OptionsButton");
OptionsButton.onclick = function(){ ToggleSettings() };

const gameHolder = document.getElementById("gameHolder");
const buttons = document.getElementsByClassName("gameButton");
const imgs = document.getElementsByClassName("gameIMG");

for(let i = 0; i < buttons.length; i++) buttons[i].onclick = function(){ Clicked(i) };

let turn, xAI, oAI, speed, wait, playing;

xAI = false;
oAI = true;

let xCount = 0;
let oCount = 0;

let row1 = [0, 1, 2];
let row2 = [3, 4, 5];
let row3 = [6, 7, 8];
let col1 = [0, 3, 6];
let col2 = [1, 4, 7];
let col3 = [2, 5, 8];
let dia1 = [0, 4, 8];
let dia2 = [2, 4, 6];

let lists = [row1, row2, row3, col1, col2, col3, dia1, dia2];

let corners = [0, 2, 6, 8];
let sides = [1, 5, 7, 3];

function ToggleSettings()
{
  toggleS = !toggleS;
  if(toggleS) settingsMenu.style.display = '';
  else settingsMenu.style.display = 'none';
}

function ToggleAI(ai)
{
  if(ai == "X")
  {
    xAI = !xAI;
  }
  else
  {
    oAI = !oAI;
  }
}

function UpdateSlider(value, index)
{
  if(index == 1)
  {
    speed = value;
    display001.value = value;
  }

  if(index == 2)
  {
    wait = value;
    display002.value = value;
  }
}

function UpdateText(value, index)
{
  let toNum = Number(value);

  if(index == 1)
  {
    if(Number.isInteger(toNum))
    {
      if(toNum <= speedAI.max && toNum >= speedAI.min)
      {
        speed = toNum;
        speedAI.value = toNum;
        display001.value = toNum;
      }
      else
      {
        speed = 500;
        speedAI.value = 500;
        display001.value = 500;
      }
    }
  }

  if(index == 2)
  {
    if(Number.isInteger(toNum))
    {
      if(toNum <= speedNewGame.max && toNum >= speedNewGame.min)
      {
        wait = toNum;
        speedNewGame.value = toNum;
        display002.value = toNum;
      }
      else
      {
        wait = 1000;
        speedNewGame.value = 1000;
        display002.value = 1000;
      }
    }
  }
}

function SquareGame()
{
  let screenWidth = window.innerWidth * 0.9;
  let screenHeight = window.innerHeight * 0.8;
  let squareSize;
  
  if(screenWidth >= screenHeight) squareSize = screenHeight * 0.9;
  else squareSize = screenWidth * 0.9;

  gameHolder.style.width = squareSize + "px";
  gameHolder.style.height = squareSize + "px";
}

function Reset()
{
  xCount = 0;
  oCount = 0;
  NewGame();
}

function NewGame()
{
  turn = true;

  WhiteScoreButton.innerHTML = xCount;
  BlackScoreButton.innerHTML = oCount;

  speed = speedAI.value;
  wait = speedNewGame.value;

  playing = true;

  if (buttons.length > 0) 
  {
    for (let i = 0; i < buttons.length; i++)
    {
      buttons[i].dataset.visited = "false";
      buttons[i].dataset.contents = "BLANK";
      imgs[i].src = "/blank.svg";
    }
  }

  if(turn && xAI) setTimeout(AIMove, speed);
  if(!turn && oAI) setTimeout(AIMove, speed); 
}

function Clicked(index)
{
  if(buttons[index].dataset.visited == "true") return;
  if(!playing) return;
  FillButton(index);
  CheckGame();
}

function CheckGame() 
{
  if(buttons.length != 9 && imgs.length != 9) return;

  let gameOver = false;

  if( (buttons[0].dataset.contents == "X" && buttons[1].dataset.contents == "X" && buttons[2].dataset.contents == "X") ||
      (buttons[3].dataset.contents == "X" && buttons[4].dataset.contents == "X" && buttons[5].dataset.contents == "X") ||
      (buttons[6].dataset.contents == "X" && buttons[7].dataset.contents == "X" && buttons[8].dataset.contents == "X") ||

      (buttons[0].dataset.contents == "X" && buttons[3].dataset.contents == "X" && buttons[6].dataset.contents == "X") ||
      (buttons[1].dataset.contents == "X" && buttons[4].dataset.contents == "X" && buttons[7].dataset.contents == "X") ||
      (buttons[2].dataset.contents == "X" && buttons[5].dataset.contents == "X" && buttons[8].dataset.contents == "X") ||

      (buttons[0].dataset.contents == "X" && buttons[4].dataset.contents == "X" && buttons[8].dataset.contents == "X") ||
      (buttons[2].dataset.contents == "X" && buttons[4].dataset.contents == "X" && buttons[6].dataset.contents == "X") )
  {
    xCount++;
    gameOver = true;
  }

  if( (buttons[0].dataset.contents == "O" && buttons[1].dataset.contents == "O" && buttons[2].dataset.contents == "O") ||
      (buttons[3].dataset.contents == "O" && buttons[4].dataset.contents == "O" && buttons[5].dataset.contents == "O") ||
      (buttons[6].dataset.contents == "O" && buttons[7].dataset.contents == "O" && buttons[8].dataset.contents == "O") ||

      (buttons[0].dataset.contents == "O" && buttons[3].dataset.contents == "O" && buttons[6].dataset.contents == "O") ||
      (buttons[1].dataset.contents == "O" && buttons[4].dataset.contents == "O" && buttons[7].dataset.contents == "O") ||
      (buttons[2].dataset.contents == "O" && buttons[5].dataset.contents == "O" && buttons[8].dataset.contents == "O") ||

      (buttons[0].dataset.contents == "O" && buttons[4].dataset.contents == "O" && buttons[8].dataset.contents == "O") ||
      (buttons[2].dataset.contents == "O" && buttons[4].dataset.contents == "O" && buttons[6].dataset.contents == "O") )
  {
    oCount++;
    gameOver = true;
  }

  // if noone has won check if it is a draw
  if(!gameOver)
  {
    let checkOver = 0;

    for (let i = 0; i < buttons.length; i++) if(buttons[i].dataset.contents == "BLANK") checkOver++;

    // reset if a draw
    if(checkOver == 0)
    {
      xCount += 0.5;
      oCount += 0.5;
      setTimeout(NewGame, wait);
      playing = false;
    }
    else
    {
      // othrwise switch turns and trigger ai if necessary
      turn = !turn;
      if(turn && xAI) setTimeout(AIMove, speed);
      if(!turn && oAI) setTimeout(AIMove, speed);
    }
  }
  else
  {
    // if someone won, start a new game
    setTimeout(NewGame, wait);
    playing = false;
  }
}

function AIMove() 
{
  let player = "X";
  if(!turn) player = "O";

  // check each sub-list for pairs of own letter
  for (let i = 0; i < lists.length; i++)
  {
    let counter = 0;
    for (let n = 0; n < lists[i].length; n++) if (buttons[lists[i][n]].dataset.contents == player) counter++;
    if (counter == 2) // if 2 of the squares in a line owned by a player, find the empty one and play it
    {
      for (let n = 0; n < lists[i].length; n++)
      {
        if (buttons[lists[i][n]].dataset.contents == "BLANK")
        {
          FillButton(lists[i][n]);
          CheckGame();
          return;
        }
      }
    }
  }

  // check each sub-list for pairs of opponents and block
  let other = player;
  if (player == "X") other = "O";
  if (player == "O") other = "X";
  for (let i = 0; i < lists.length; i++)
  {
    let counter = 0;
    for (let n = 0; n < lists[i].length; n++) if (buttons[lists[i][n]].dataset.contents == other) counter++;
    if (counter == 2) // if 2 of the squares in a line owned by opponent, find the empty one and play it
    {
      for (let n = 0; n < lists[i].length; n++)
      {
        if (buttons[lists[i][n]].dataset.contents == "BLANK")
        {
          FillButton(lists[i][n]);
          CheckGame();
          return;
        }
      }
    }
  }

  // if no pairs then occupy center, corners and then sides
  if (buttons[4].dataset.contents == "BLANK")
  {
    FillButton(4);
    CheckGame();
    return;
  }

  let choices = [];
  for (let i = 0; i < corners.length; i++) if (buttons[corners[i]].dataset.contents == "BLANK") choices.push(corners[i]);
  if (choices.length > 0)
  {
    let result = Math.floor(Math.random() * choices.length);
    FillButton(choices[result]);
    CheckGame();
    return;
  }

  choices = [];
  for (let i = 0; i < sides.length; i++) if (buttons[sides[i]].dataset.contents == "BLANK") choices.push(sides[i]);
  if (choices.length > 0)
  {
    let result = Math.floor(Math.random() * choices.length);
    FillButton(choices[result]);
    CheckGame();
    return;
  }

  choices = [];
  // if somehow the above fails, fill any blank square
  for (let i = 0; i < buttons.length; i++) if (buttons[i].dataset.contents == "BLANK") choices.push(i);
  if (choices.length > 0)
  {
    let result = Math.floor(Math.random() * choices.length);
    FillButton(choices[result]);
    CheckGame();
    return;
  }
}

function FillButton(index)
{
  buttons[index].dataset.visited = "true";
  if(turn)
  {
    buttons[index].dataset.contents = "X";
    imgs[index].src = "/x.svg";
  }
  else
  {
    buttons[index].dataset.contents = "O";
    imgs[index].src = "/o.svg";
  }
}

window.addEventListener('resize', SquareGame);

window.addEventListener('DOMContentLoaded', NewGame);
window.addEventListener('DOMContentLoaded', SquareGame);