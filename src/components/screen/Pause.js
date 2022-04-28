import $ from "jquery";

class Pause {
  constructor() {
    this.bits = 0;

    $('body').append($(
      '<div id="pause" style="position: absolute; background-color: white; top: 0; width: 100vw; height: 100vw; display: none;">PAUSE</div>'
  ));
  }

  update() {
  }
}

export default Pause;