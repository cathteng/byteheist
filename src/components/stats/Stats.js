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
        > Bits collected: <span id="bits-collected">0</span>/8
        <p>> Time remaining: <span id="time-remaining"></span>s</p>
      </div>
      `
    ));
    $('#bits-collected').html(this.bits);
    $('#time-remaining').html(this.timer.time / 1000);
  }

  update(bits) {
    this.bits = bits;
    $('#bits-collected').html(this.bits);
    $('#time-remaining').html(this.timer.time / 1000);
  }
}

export default Stats;