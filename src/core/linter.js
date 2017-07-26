/**
 * Module core/linter
 * 
 * Core linter module. Exports a linter object. 
 */

import { pub } from "core/pubsubhub";

// Default rules
import { lint as noHttpProps } from "core/linter-rules/no-http-props";
import { lint as noHlessSecs } from "core/linter-rules/no-headingless-sections";

export const name = "core/linter";

const privates = new WeakMap();

class Linter {
  constructor() {
    privates.set(this, {
      rules: new Set(),
    });
  }
  get rules() {
    return privates.get(this).rules;
  }
  register(...newRules) {
    newRules.reduce((rules, newRule) => rules.add(newRule), this.rules);
  }
  async lint(conf, doc = window.document) {
    const promisesToLint = [...privates.get(this).rules].map(
      async lint => await lint(doc, conf)
    );
    const results = await Promise.all(promisesToLint);
    return results.reduce(
      (collector, results) => collector.concat(results),
      []
    );
  }
}

const linter = new Linter();
linter.register(noHttpProps, noHlessSecs);

export default linter;

const baseResult = {
  rule: "unknown",
  description: "",
  occurances: 0,
  howToFix: "",
  offendingElements: [], // DOM Nodes
  help: "", // where to get help
};

export async function run(conf, doc, cb) {
  if (conf.lint === false) {
    cb(); // return early, don't do anything
    return;
  }
  cb(); // continue other processing
  await document.respecReady;
  const results = await linter.lint(doc, conf);
  results
    .map(result => {
      const output = { ...baseResult, ...result };
      const {
        description,
        occurances,
        rule,
        howToFix,
        help,
        offendingElements,
      } = output;
      const msg = `${description} ${howToFix} ${help}`;
      offendingElements.forEach(elem => {
        elem.classList.add("respec-offending-element");
        console.warn(rule, description, ...offendingElements);
      });
      return msg.trim();
    })
    .forEach(msg => {
      pub("warn", msg);
    });
}
