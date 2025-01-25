var currentDeg = 0;
var colors = [
  "#4C7B8B",
  "#9ACBD0",
  "#48A6A7",
  "#2973B2",
  "#3B6790",
  "#FFCC66",
  "#3B6790",
  "#2973B2",
  "#48A6A7",
  "#9ACBD0",
  "#4C7B8B",
  "#4C5B8B",
];
var items = [
  "10K",
  "20K",
  "50K",
  "100K",
  "200K",
  "500K",
  "10K",
  "20K",
  "50K",
  "100K",
  "200K",
  "5K",
];
var theChoosenIndex;
var choosenHistory = [];

let userName = "";

window.onload = function () {
  userName = prompt("Vui lòng nhập tên của bạn:");
  if (!userName) {
    alert("Bạn phải nhập tên để tiếp tục!");
    window.location.reload();
  }
};

init();

function init() {
  if (items.length > 1) {
    var degPerPart = 360 / items.length;

    for (let i = 0; i < items.length; i++) {
      var part = $("<div>");
      8;
      part.addClass("part");
      part.css({
        "background-color": colors[i % colors.length],
      });
      part.html('<div class="name">' + items[i] + "</div>");
      if (items.length === 2) {
        part.css({
          height: "100%",
          transform: "rotate(" + i * degPerPart + "deg)",
        });
      } else {
        part.css({
          height: Math.tan(((degPerPart / 2) * Math.PI) / 180) * 100 + "%",
          transform: "translateY(-50%) rotate(" + i * degPerPart * -1 + "deg)",
          "clip-path": "polygon(0 0, 0 100%, 100% 50%)",
          top: "50%",
        });
      }
      $("#wheel").append(part);
      $(".wheel-wrapper").show();
    }
  }
}
function onSpin() {
  const data = Cookies.get("user");

  if (data) {
    const convertData = JSON.parse(data);
    const spined = convertData.spined;

    if (!spined) {
      const newData = {
        name: convertData.name,
        spined: !spined,
      };
      Cookies.set("user", JSON.stringify(newData), {
        expires: 30 / 86400,
        path: "/",
      });
      spin();
    } else {
      alert(`Ban đã hết lượt quay`);
    }
  } else {
    Cookies.set(
      "user",
      JSON.stringify({
        name: userName,
        spined: true,
      }),
      {
        expires: 30 / 86400,
        path: "/",
      }
    );
    console.log("ok");
    spin();
  }
}
function getTheChoosen(deg) {
  theChoosenIndex =
    (Math.ceil((deg % 360) / (360 / items.length) + 0.5) - 1) % items.length;
  return items[theChoosenIndex];
}
function onInputData() {
  var inputData = $("#input-data").val();
  if (inputData) {
    items = inputData.split("\n").filter(function (item) {
      return item.trim();
    });
    if (items.length > 1) {
      $("#input-modal").modal("hide");
      choosenHistory = [];
      init();
    }
  }
}

function onRemoveTheChoosen() {
  if (items.length > 2) {
    items.splice(theChoosenIndex, 1);
    $("#result-modal").modal("hide");
    init();
  }
}
function sendMail(nanme, result) {
  const subject = nanme ?? "Anonymous";
  const message = result;

  let params = {
    subject: subject,
    message: message,
  };
  const serviceID = "service_52cnxce";
  const templateID = "template_4krw8w8";

  emailjs
    .send(serviceID, templateID, params)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.log(err));
}

function spin() {
  currentDeg = currentDeg + Math.floor(Math.random() * 360 + 360 * 20);
  $("#wheel").css({
    transform: "rotate(" + currentDeg + "deg)",
  });
  $("#spin-action").prop("disabled", true);
  setTimeout(function () {
    var theChoosen = getTheChoosen(currentDeg);
    $("#spin-action").prop("disabled", false);
    if (items.length > 2) {
      $("#result-modal #remove-the-choosen-btn").show();
    } else {
      $("#result-modal #remove-the-choosen-btn").hide();
    }
    $("#result-modal .modal-body").text(theChoosen);
    $("#result-modal").modal();
    choosenHistory.push(theChoosen);

    // sendMail(userName, theChoosen);
  }, 11000);
}
