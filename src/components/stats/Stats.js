import $ from "jquery";

class Stats {
  constructor() {
    this.bits = 0;

    $('body').append($(
      '<div style="position: absolute; color: white; top: 0;">Bits collected: <span id="bits-collected">0</span>/8</div>'
  ));
  $('#bits-collected').html(this.bits);
  }

  update(bits) {
    this.bits = bits;
    $('#bits-collected').html(this.bits);
  }
}

export default Stats;