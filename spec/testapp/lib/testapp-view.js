"use babel";
export default class TestappView {
  constructor(serializedState) {
    this.element = document.createElement("div");
    this.element.classList.add("testapp");
    var message = document.createElement("div");
    message.textContent = "The Testapp package is Alive! It's ALIVE!";
    message.classList.add("message");
    this.element.appendChild(message);
  }

  serialize() {}

  destroy() {
    return this.element.remove();
  }

  getElement() {
    return this.element;
  }
};
