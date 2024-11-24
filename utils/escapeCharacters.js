export default function escapeCharacters(text) {
  return text.replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&');
}