/* @flow */
export const warning = (condition: any, message: string) => {
  if(condition) {
    return
  }
  if(typeof console !== "undefined" && typeof console.error === "function") {
    console.error(message)
  }
}
