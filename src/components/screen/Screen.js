import $ from "jquery";
import "./screen.css"

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
      `<div id="pause" class="screen">
      <h2>GAME PAUSED</h2>
      <div style="text-align: center">
        <span class="blinking">CLICK TO RESUME</span>
      </div>
      </div>
      `
    ));
    $("#pause").hide();
  }

  hideTitle() {
    $("#screen").hide();
  }
  hidePause() {
    $("#pause").hide();
  }
  showPause() {
    $("#pause").show();
  }
}

export default Screen;