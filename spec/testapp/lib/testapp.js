"use babel";
import TestappView from "./testapp-view";
import { CompositeDisposable } from "atom";

module.exports = {
  testappView: null,
  modalPanel: null,
  subscriptions: null,

  activate: function(state) {
    this.testappView = new TestappView(state.testappViewState);

    this.modalPanel = atom.workspace.addModalPanel({
      item: this.testappView.getElement(),
      visible: false
    });

    this.subscriptions = new CompositeDisposable();

    return this.subscriptions.add(atom.commands.add("atom-workspace", {
      "testapp:toggle": () => {
        return this.toggle();
      }
    }));
  },

  deactivate: function() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    return this.testappView.destroy();
  },

  serialize: function() {
    return {
      testappViewState: this.testappView.serialize()
    };
  },

  toggle: function() {
    console.log("Testapp was toggled!");

    if (this.modalPanel.isVisible()) {
      return this.modalPanel.hide();
    } else {
      return this.modalPanel.show();
    }
  }
};
