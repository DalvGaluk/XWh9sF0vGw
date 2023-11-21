const customWindowOnLoad = () => {
  document.addEventListener("readystatechange", () => {
    if (document.readyState == "interactive") console.log("beforeDOMContentLoaded");
    if (document.readyState == "complete") console.log("afterDOMContentLoaded");
  });
};