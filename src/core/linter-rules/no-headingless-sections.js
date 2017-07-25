/**
 * Linter rule "no-headingless-sections".
 *
 * Checks that there are no sections in the document that don't start
 * with a heading element (h1-6).
 */
import { lang as defaultLang } from "../l10n";
const rule = "no-headingless-sections";
const meta = {
  en: {
    description: "All sections must start with a `h2-6` element.",
    howToFix: "Add a `h2-6` to the offending section or use a `<div>`.",
    help: "See developer console.",
  },
};
// Fall back to english, if language is missing
const lang = defaultLang in meta ? defaultLang : "en";
const hasNoHeading = ({ firstElementChild: elem }) => {
  return elem === null || /^h[1-6]$/.test(elem.localName) === false;
};

/**
 * Runs linter rule.
 *
 * @param {Object} config The ReSpec config.
 * @param  {Document} doc The document to be checked.
 */
export function lint(config = { lint: { [rule]: false } }, doc = document) {
  if (lint === false || !lint[rule]) {
    return;
  }
  const result = [];
  const offendingElements = Array.from(doc.querySelectorAll("section")).filter(
    hasNoHeading
  );
  if (offendingElements.length) {
    result.push({
      rule,
      offendingElements,
      occurances: offendingElements.length,
      ...meta[lang],
    });
  }
  return result;
}
