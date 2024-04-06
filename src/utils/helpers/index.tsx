export const showLoader = (): void => {
  const loaderDiv = document.getElementById("loaderForAPICall");
  const loaderDivForBatchApiCall = document.getElementById(
    "loaderForBatchAPICall"
  );

  if (loaderDivForBatchApiCall?.classList.contains("loaderShow")) {
    return;
  }
  if (loaderDiv) {
    loaderDiv.classList.add("loaderShow");
    loaderDiv.classList.remove("loaderHide");
  }
};

export const hideLoader = (): void => {
  const loaderDiv = document.getElementById("loaderForAPICall");
  if (loaderDiv) {
    loaderDiv.classList.remove("loaderShow");
    loaderDiv.classList.add("loaderHide");
  }
};
