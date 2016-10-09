'use babel';
import * as fs from 'fs';
import * as path from 'path';
import Mocha from 'mocha';
import { remote } from 'electron';
import { format } from 'util';
import { Console } from 'console';

const runner = (pluginOptions = {}) => {
  return (testRunnerOptions = {}) => {
    const options = Runner.buildOptions(pluginOptions, testRunnerOptions);
    const runner = new Runner(options);
    return runner.run();
  };
};
export default runner;

export class Runner {
  static buildOptions(pluginOptions, testRunnerOptions) {
    return Object.assign({}, pluginOptions, testRunnerOptions);
  }

  constructor({ logfile, headless, testPaths, buildDefaultApplicationDelegate, buildAtomEnvironment }) {
    this.logfile = logfile;
    this.headless = headless;
    this.testPaths = testPaths;
    this.buildDefaultApplicationDelegate = buildDefaultApplicationDelegate;
    this.buildAtomEnvironment = buildAtomEnvironment;
  }

  run() {
    return new Promise((resolve, reject) => {
      try {
        window.__runner = this;
        this.applicationDelegate = this.buildDefaultApplicationDelegate();
        this.atom = window.atom = this.buildAtomEnvironment({
          window, document,
          applicationDelegate: this.applicationDelegate,
          configDirPath: process.env.ATOM_HOME,
          enablePersistence: false
        });

        if (!this.headless) {
          const element = document.createElement('div');
          element.id = 'mocha';
          document.body.appendChild(element);
        }

        const reporter = this.headless ? 'spec' : 'html';
        if (this.headless) { this.replaceLogger(); } else { this.setupStyles(); }

        this.mocha = new Mocha({ reporter });
        const specPaths = this.testPaths.map(testPath => this.lookupSpecs(testPath)).reduce((a, b) => a.concat(b), []);
        specPaths.forEach(specPath => this.mocha.addFile(specPath));

        this.mocha.run((failures) => {
          const status_code = (failures) ? 1 : 0;
          resolve(status_code);
        });
      } catch (e) {
        console.error(e);
        resolve(1);
      }
    });
  }

  setupStyles() {
    this.atom.styles.getStyleElements().forEach(element => this.atom.styles.removeStyleElement(element));
    this.atom.themes.requireStylesheet('mocha/mocha.css');
  }

  replaceLogger() {
    if (this.loggerBackup) return;
    this.loggerBackup = {
      console: console,
      stdout: process.stdout,
      stderr: process.stderr,
    };

    window.console = new Console(remote.process.stdout, remote.process.stderr);
    process.stdout = remote.process.stdout;
    process.stderr = remote.process.stderr;
  }

  lookupSpecs(testPath) {
    const stat = fs.statSync(testPath);
    if (stat.isDirectory()) {
      return fs.readdirSync(testPath).map((name) => {
        return this.lookupSpecs(path.join(testPath, name));
      }).filter(a => a).reduce((a, b) => a.concat(b), []);
    } if (stat.isFile() && /-spec\.(?:js|coffee|es6|jsx)$/.test(testPath)){
      return testPath;
    } else {
      return null;
    }
  }
}
