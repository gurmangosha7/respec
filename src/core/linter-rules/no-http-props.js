import { lang as defaultLang } from "core/l10n";

const rule = "no-https-props";
const offendingMembers = [];

function howToFix([start, end], offendingMembers) {
  const items = offendingMembers.map(item => "`" + item + "`").join(",");
  return start + items + end;
}

const meta = {
  en: {
    description: "Insecure URLs are not allowed in `respecConfig`.",
    get howToFix() {
      return howToFix`Please change the following properties to 'https://': ${offendingMembers}.`;
    },
  },
};

// Fall back to english, if language is missing
const lang = defaultLang in meta ? defaultLang : "en";

export function lint({ conf, doc }) {
  // We can only really perform this check over http/https
  if (!doc.location.href.startsWith("http")) {
    return;
  }
  Object.getOwnPropertyNames(conf)
    // this check is cheap, "prevED" is w3c exception.
    .filter(key => key.endsWith("URI") || key === "prevED")
    // this check is expensive, so seperate step
    .filter(key =>
      new URL(conf[key], doc.location.href).href.startsWith("http://")
    )
    .reduce((collector, key) => offendingMembers.push(key), offendingMembers);
  const result = [];
  if (offendingMembers.length) {
    result.push({
      rule,
      occurances: offendingMembers.length,
      ...meta[lang],
    });
  }
  return result;
}
