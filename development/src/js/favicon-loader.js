(function () {
  var ACCENT = "#cf9d7b";
  var SIZE = 32;

  var icons = Array.prototype.slice.call(
    document.querySelectorAll('link[rel~="icon"]')
  );
  if (!icons.length) return;

  var originals = icons.map(function (l) {
    return { el: l, href: l.getAttribute("href"), type: l.getAttribute("type") };
  });

  var canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  var ctx = canvas.getContext("2d");
  var angle = 0;

  function frame() {
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.save();
    ctx.translate(SIZE / 2, SIZE / 2);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.arc(0, 0, SIZE / 2 - 4, 0, Math.PI * 1.4);
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.restore();

    var url = canvas.toDataURL("image/png");
    icons.forEach(function (l) {
      l.type = "image/png";
      l.href = url;
    });
    angle += 0.35;
  }

  frame();
  var spin = setInterval(frame, 55);

  function restore() {
    clearInterval(spin);
    originals.forEach(function (o) {
      if (o.type) o.el.type = o.type; else o.el.removeAttribute("type");
      o.el.href = o.href;
    });
  }

  if (document.readyState === "complete") {
    restore();
  } else {
    window.addEventListener("load", restore);
  }
})();
