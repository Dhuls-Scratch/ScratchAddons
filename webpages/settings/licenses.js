const vue = new Vue({
  el: "body",
  data: {
    libraries: [],
  },
  methods: {},
});

chrome.runtime.sendMessage("getLibraryInfo", (libraryLicenses) => {
  const licenseNameToText = {};
  const searchParams = new URL(location.href).searchParams;
  const libraryParam = searchParams.get("libraries");
  if (typeof libraryParam !== "string") return;
  const libraries = libraryParam.split(",");
  console.log(libraryLicenses, libraries);
  for (const library of libraries) {
    const licenseName = libraryLicenses[library];
    if (!licenseName) continue;
    if (licenseNameToText.hasOwnProperty(licenseName)) {
      vue.libraries = [
        ...vue.libraries,
        {
          name: library,
          license: licenseNameToText[licenseName],
        },
      ];
      continue;
    }
    chrome.runtime.sendMessage({ licenseName }, ({ licenseText }) => {
      licenseNameToText[licenseName] = licenseText;
      vue.libraries = [
        ...vue.libraries,
        {
          name: library,
          license: licenseText,
        },
      ];
    });
  }
});