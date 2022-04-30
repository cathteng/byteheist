import $ from "jquery";
import Timer from "tiny-timer";
import "./stats.css";

class Stats {
  constructor(time) {
    this.bits = 0;
    this.timeToElapse = time;
    this.timer = new Timer();

    $('body').append($(
      `<div class="stats">
        <p>> Current level: <span id="level"></span></p>
        <p>> Bits collected: <span id="bits-collected">0</span>/8</p>
        <p>> Time remaining: <span id="time-remaining"></span>s</p>
      </div>
      `
    ));
    $('#bits-collected').html(this.bits);
    $('#time-remaining').html(this.timer.time / 1000);
    $('#level').html(0);
  }

  update(bits, level) {
    this.bits = bits;
    $('#bits-collected').html(this.bits);
    $('#time-remaining').html(this.timer.time / 1000);
    $('level').html(level);
  }

  hide() {
    $('.stats').hide();
  }
}

export default Stats;