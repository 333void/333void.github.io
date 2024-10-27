import { scoreDefaults } from "./defaults.config.js"

export default function parsePlaintext(text) {
  const textArray = text.split(/\s+/);
  console.log(textArray)

  // if there is a config, update defaults var to match
  if (/^\[/.test(textArray[0])) {
    console.log('good')
  }
}