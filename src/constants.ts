export const MDRegexes = {
  boldText: /\*\*(.*?)\*\*/,
  italicText1: /_(.*?)_/,
  italicText2: /\*(.*?)\*/,
  headers: /^#{1,6}\s.*/,
  unorderdLists: /^[*+-]\s.*/,
  orderdLists: /^\d+\.\s.*/,
  links: /\[(.*?)\]\((.*?)\)/,
};
