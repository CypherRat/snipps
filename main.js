document.addEventListener("DOMContentLoaded", (event) => {
  var currentPage = 1;
  var itemsPerPage = 5;

  document
    .getElementById("createButton")
    .addEventListener("click", function () {
      document.getElementById("menu").style.display = "none";
      document.getElementById("create").style.display = "grid";
    });

  document.getElementById("saveButton").addEventListener("click", function () {
    var code = document.getElementById("codeArea").value;
    var note = document.getElementById("noteArea").value;

    if (!code.trim()) {
      alert("Dump some code before hitting create!");
      return;
    }

    var savedCodes = JSON.parse(localStorage.getItem("savedCodes")) || [];

    savedCodes.push({
      code: code,
      note: note,
      datetime: new Date(),
    });

    localStorage.setItem("savedCodes", JSON.stringify(savedCodes));

    document.getElementById("menu").style.display = "grid";
    document.getElementById("create").style.display = "none";

    displaySavedCodes();
  });

  document
    .getElementById("loadMoreButton")
    .addEventListener("click", function () {
      currentPage++;
      displaySavedCodes();
    });

  document.getElementById("prevButton").addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      displaySavedCodes();
    }
  });

  function displaySavedCodes() {
    var savedCodes = JSON.parse(localStorage.getItem("savedCodes")) || [];

    var savedCodesElement = document.getElementById("savedCodes");

    savedCodesElement.innerHTML = "";

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var tab = tabs[0];

      for (
        var i = (currentPage - 1) * itemsPerPage;
        i < currentPage * itemsPerPage && i < savedCodes.length;
        i++
      ) {
        var codeBaseElement = document.createElement("div");
        codeBaseElement.className = "codeBase";

        var codeElement = document.createElement("pre");
        codeElement.textContent = savedCodes[i].code;
        codeElement.className = "border p-3 my-2";

        codeBaseElement.appendChild(codeElement);

        if (savedCodes[i].note) {
          var noteElement = document.createElement("p");
          noteElement.textContent = "Note: " + savedCodes[i].note;

          codeBaseElement.appendChild(noteElement);
        }

        var datetimeElement = document.createElement("p");
        datetimeElement.textContent =
          "Saved on: " + new Date(savedCodes[i].datetime).toLocaleString();

        codeBaseElement.appendChild(datetimeElement);

        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = '<i class="fas fa-trash"></i>Delete';
        deleteButton.className =
          "bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded float-right";

        deleteButton.addEventListener(
          "click",
          (function (index) {
            return function () {
              savedCodes.splice(index, 1);
              localStorage.setItem("savedCodes", JSON.stringify(savedCodes));
              displaySavedCodes();
            };
          })(i)
        );

        codeBaseElement.appendChild(deleteButton);

        var copyButton = document.createElement("button");
        copyButton.innerHTML = '<i class="fas fa-copy"></i>Copy';
        copyButton.className =
          "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded float-right mr-2";

        copyButton.addEventListener(
          "click",
          (function (code) {
            return function () {
              chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: function () {
                  navigator.clipboard.writeText(arguments[0]);
                  alert("Code copied to clipboard!");
                },
                args: [code],
              });
            };
          })(savedCodes[i].code)
        );

        // codeBaseElement.appendChild(copyButton);

        savedCodesElement.appendChild(codeBaseElement);
      }

      if (savedCodes.length === 0) {
        savedCodesElement.innerHTML = "No snippets saved.";
      }

      document.getElementById("prevButton").style.display =
        currentPage > 1 ? "block" : "none";
      document.getElementById("loadMoreButton").style.display =
        currentPage * itemsPerPage < savedCodes.length ? "block" : "none";
    });
  }

  //   function displaySavedCodes() {
  //     var savedCodes = JSON.parse(localStorage.getItem("savedCodes")) || [];

  //     var savedCodesElement = document.getElementById("savedCodes");

  //     savedCodesElement.innerHTML = "";

  //     for (
  //       var i = (currentPage - 1) * itemsPerPage;
  //       i < currentPage * itemsPerPage && i < savedCodes.length;
  //       i++
  //     ) {
  //       var codeElement = document.createElement("pre");
  //       codeElement.textContent = savedCodes[i].code;
  //       codeElement.className = "border p-3 my-2";

  //       savedCodesElement.appendChild(codeElement);

  //       if (savedCodes[i].note) {
  //         var noteElement = document.createElement("p");
  //         noteElement.textContent = "Note: " + savedCodes[i].note;

  //         savedCodesElement.appendChild(noteElement);
  //       }

  //       var datetimeElement = document.createElement("p");
  //       datetimeElement.textContent =
  //         "Saved on: " + new Date(savedCodes[i].datetime).toLocaleString();

  //       savedCodesElement.appendChild(datetimeElement);

  //       var deleteButton = document.createElement("button");
  //       deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
  //       deleteButton.className =
  //         "bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded float-right";

  //       // Use an IIFE to capture the value of `i` at each iteration
  //       deleteButton.addEventListener(
  //         "click",
  //         (function (index) {
  //           return function () {
  //             savedCodes.splice(index, 1);
  //             localStorage.setItem("savedCodes", JSON.stringify(savedCodes));
  //             displaySavedCodes();
  //           };
  //         })(i)
  //       );

  //       savedCodesElement.appendChild(deleteButton);

  //       var separatorElement = document.createElement("hr");

  //       savedCodesElement.appendChild(separatorElement);
  //     }

  //     if (savedCodes.length === 0) {
  //       savedCodesElement.innerHTML = "No snippets saved.";
  //     }

  //     document.getElementById("prevButton").style.display =
  //       currentPage > 1 ? "block" : "none";
  //     document.getElementById("loadMoreButton").style.display =
  //       currentPage * itemsPerPage < savedCodes.length ? "block" : "none";
  //   }

  displaySavedCodes();
});
