import $ from "jquery";

class Screen {
  constructor() {
    this.bits = 0;

    $('body').append($(
      '<div id="screen" style="position: absolute; background-color: white; top: 0; width: 100vw; height: 100vw;">HELLO</div>'
  ));
  }

  update() {
  }
}

export default Screen;