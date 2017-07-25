/**
 * Checks that there is a section that has at least privacy and/or
 * security and considerations.
 *
 * The rule is "privacy" or "security", and "considerations", in any order,
 * case-insensitive, multi-line check.
 *
 */
import { lang as defaultLang } from "../l10n";

const rule = "privsec-section";

const meta = {
  en: {
    description: "Document must a Privacy and/or Security Considerations section.",
    howToFix: "Add a privacy and/or security considerations section.",
    help: "See the [Self-Review Questionnaire](https://w3ctag.github.io/security-questionnaire/).",
  },
};

// Fall back to english, if language is missing
const lang = defaultLang in meta ? defaultLang : "en";

function hasPriSecConsiderations(doc) {
  const privOrSecRegex = /(privacy|security)/im;
  const considerationsRegex = /(considerations)/im;
  return Array.from(
    doc.querySelectorAll("h2, h3, h4, h5, h6")
  ).some(({ textContent: text }) => {
    const saysPrivOrSec = privOrSecRegex.test(text);
    const saysConsiderations = considerationsRegex.test(text);
    return (saysPrivOrSec && saysConsiderations) || saysPrivOrSec;
  });
}

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
  if (conf.isRecTrack && !hasPriSecConsiderations(doc)) {
    result.push({
      rule,
      occurrances: 1,
      ...meta[lang],
    });
  }
  return result;
}
