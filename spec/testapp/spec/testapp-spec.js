'use babel';
import { expect } from 'chai';
import { beVisible } from './spec-helper';
const Testapp = require("../lib/testapp");

describe("Testapp", () => {
  let [workspaceElement, activationPromise] = [];

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    return activationPromise = atom.packages.activatePackage("testapp");
  });

  describe("when the testapp:toggle event is triggered", () => {
    it("hides and shows the modal panel", function() {
      expect(workspaceElement.querySelector(".testapp")).not.exist;
      atom.commands.dispatch(workspaceElement, "testapp:toggle");

      return activationPromise.then(() => {
        expect(workspaceElement.querySelector(".testapp")).to.exist;
        const testappElement = workspaceElement.querySelector(".testapp");

        expect(testappElement).to.exist;
        const testappPanel = atom.workspace.panelForItem(testappElement);

        expect(testappPanel.isVisible()).to.be.true;

        atom.commands.dispatch(workspaceElement, "testapp:toggle");
        expect(testappPanel.isVisible()).to.be.false;
      });
    });

    return it("hides and shows the view", function() {
      jasmine.attachToDOM(workspaceElement);
      expect(workspaceElement.querySelector(".testapp")).not.to.exist();
      atom.commands.dispatch(workspaceElement, "testapp:toggle");

      return activationPromise.then(() => {
        const testappElement = workspaceElement.querySelector(".testapp");
        expect(testappElement).to.satisfy(beVisible);

        atom.commands.dispatch(workspaceElement, "testapp:toggle");
        expect(testappElement).not.to.satisfy(beVisible);
      });
    });
  });
});
