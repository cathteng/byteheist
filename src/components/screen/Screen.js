import $ from "jquery";
import "./screen.css";

class Screen {
  constructor() {
    this.bits = 0;

    $('body').append($(
      `<div id="screen" class="screen">
        <h1 data-text="byte heist"><span>byte heist</span></h1>
        <div style="text-align: center">
          <p>CONTROLS: WASD to move, SPACE to jump, ESC to pause</p>
          Collect the bits before time runs out!
          <p class="blinking">CLICK TO START</p>
        </div>
      </div>
      `
    ));
    $("#screen").show();

    $('body').append($(
      `<div id="flashing" class="screen flashing mid">
        <h2>VIRUS DETECTED</h2>
        <h2>CLEAN UP BEGINNING IN</h2>
        <h2 id="time"></h2>
      </div>
      `
    ));
    $("#flashing").hide();
    
    $('body').append($(
      `<div id="pause" class="screen mid">
      <h2>GAME PAUSED</h2>
      <div style="text-align: center">
        <span class="blinking">CLICK TO RESUME</span>
      </div>
      </div>
      `
    ));
    $("#pause").hide();

    $('body').append($(
      `<div id="end" class="screen mid">
      <h2>GAME OVER</h2>
      <div style="text-align: center">
        <p id="endText">You were caught by the antivirus!</p>
        <span class="blinking">CLICK TO RESTART</span>
      </div>
      </div>
      `
    ));
    $("#end").hide();
    
    $('body').append($(
      `<div id="win" class="screen mid">
      <h2>YOU WON!</h2>
      <div style="text-align: center">
        <p>You completely corrupted the computer.</p>
        <span class="blinking">CLICK TO RESTART</span>
      </div>
      </div>
      `
    ));
    $("#win").hide();

    $('body').append($(
      `<div id="loading" class="screen">
      <div class="loader">
        Loading
      </div>
      </div>
      `
    ));
    $("#loading").hide();
  }

  hideTitle() {
    $("#screen").hide();
  }
  hidePause() {
    $("#pause").hide();
  }
  hideEnd() {
    $("#end").hide();
  }
  hideWin() {
    $("#win").hide();
  }
  hideFlashing() {
    $("#flashing").hide();
  }

  showPause() {
    $("#pause").show();
  }
  showEnd(endText) {
    $("#endText").text(endText);
    $("#end").show();
  }
  showWin() {
    $("#win").show();
  }
  showLoading() {
    $("#loading").show();
    $("#loading").on("animationend webkitAnimationEnd", function() {
      $("#loading").hide();
    })
  }
  showFlashing() {
    $("#flashing").show();
    $("#flashing").on("animationend webkitAnimationEnd", function() {
      $("#flashing").hide();
    })
  }
  countdown(time) {
    $("#time").text(time);
  }
}

export default Screen;