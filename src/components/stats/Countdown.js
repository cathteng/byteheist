import $ from "jquery";
import Timer from "tiny-timer";

class Countdown {
  constructor(time) {
    this.timeToElapse = time;
    this.timer = new Timer();

    this.timer.start(this.timeToElapse);

    $('body').append($(
      '<div style="position: absolute; color: white; top: 0; right: 0">Time remaining: <span id="time-remaining"></span></div>'
  ));
  $('#time-remaining').html(this.timer.time / 1000);
  }

  update() {
    $('#time-remaining').html(this.timer.time / 1000);
  }
}

export default Countdown;