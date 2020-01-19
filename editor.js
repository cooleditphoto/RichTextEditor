window.addEventListener("load", function() {
  document
    .getElementById("editor")
    .setAttribute("contenteditable", "true");

  document.getElementById("editor").innerHTML =
    localStorage["text"] || "Just Write"; // default text

  setInterval(function() {
    // fuction that is saving the innerHTML of the div

    localStorage["text"] = document.getElementById("editor").innerHTML; // content div
  }, 1000);
});

function format(command, value) {
  document.execCommand(command, false, value);
}

function updateFont() {
  var selector = document.getElementById("selectFontFamily");
  var family = selector.options[selector.selectedIndex].value;
  var h1 = document.getElementById("editor");
  h1.style.fontFamily = family;
}

function saveAsTxt() {
  let text = document.getElementById("editor").innerText;
  let link = elt("a", {
    href: "data:text/plain;charset=utf-8," + encodeURIComponent(text),
    download: "editor.txt"
  });
  document.body.appendChild(link);
  link.click();
  link.remove();
}
function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}

function paintPieChart(tableId) {
  let table = document.getElementById(tableId);
  let results = [];
  let total = 0;
  for (var i = 0; i < table.rows.length; i++) {
    let cells = table.rows[i];
    total = total + parseFloat(cells.cells[1].innerText);
    results.push({
      name: cells.cells[0].innerText,
      count: parseFloat(cells.cells[1].innerText),
      color: getRandomColor()
    });
  }
  let cx = document.querySelector("canvas").getContext("2d");
  // Start at the top
  let currentAngle = -0.5 * Math.PI;
  for (let result of results) {
    let sliceAngle = (result.count / total) * 2 * Math.PI;
    cx.font = "12px Georgia";
    cx.fillText(
      result.name + " " + result.count,
      10 * Math.sin(currentAngle + sliceAngle),
      10 * Math.cos(currentAngle + sliceAngle)
    );

    cx.beginPath();
    // center=100,100, radius=100
    // from current angle, clockwise by slice's angle
    cx.arc(100, 100, 100, currentAngle, currentAngle + sliceAngle);
    currentAngle += sliceAngle;
    cx.lineTo(100, 100);
    cx.fillStyle = result.color;
    cx.fill();
  }
}

function tableCreate() {
  let body = document.getElementById("editor");
  let tbl = document.createElement("table");

  tbl.id = document.getElementById("tableName").value;
  tbl.contentEditable = true;
  tbl.style.width = "100px";
  tbl.style.border = "1px solid black";

  let rowNum = document.getElementById("rowNum").value;
  let columnNum = document.getElementById("columnNum").value;

  for (var i = 0; i < rowNum; i++) {
    var tr = tbl.insertRow();
    tr.style.border = "1px solid black";

    for (var j = 0; j < columnNum; j++) {
      var td = tr.insertCell();
      td.appendChild(document.createTextNode(""));
      td.style.border = "1px solid black";
    }
  }
  body.appendChild(tbl);

  let button = document.createElement("button");
  button.innerText = "generate a pie chart!";

  button.onclick = function() {
    paintPieChart(tbl.id);
  };
  body.appendChild(button);
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
