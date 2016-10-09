"use babel";

export const beVisible = (element) => {
  if (element instanceof HTMLElement) {
    return element.offsetWidth !== 0 || element.offsetHeight !== 0;
  } else {
    return element.is(':visible');
  }
}
