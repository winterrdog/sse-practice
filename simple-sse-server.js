// @ts-check
const http = require("node:http");

const PORT = 3_000;

http.createServer(handleReq).listen(PORT, () => {
  console.log("+ SSE server listening on port:", PORT);
});

function handleReq(req, res) {
  res.on("error", console.error);
  switch (req.url) {
    case "/progress": {
      sseSetup(res);
      sseProgress(res);
      return;
    }
    default:
      res.end("Hello");
      break;
  }
}

function sseSetup(res) {
  console.log("+ sse request received!");

  res.writeHead(200, {
    // main headers
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",

    // misc headers
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
  });
}

function sseProgress(res, progress = 0) {
  var newProgress = Math.min(progress + Math.random() * 10, 100),
    data = `data: ${Math.floor(newProgress)}% complete\n\n`;

  res.write("event: progress\n");
  res.write(`id: id_${newProgress.toFixed(2)}\n`);
  res.write(data);

  if (newProgress >= 100) {
    console.log("+ sse request complete\n");
    res.write("event: done\n");
    res.write("data: 100% complete\n\n");
    return;
  }

  const cb = function () {
    return sseProgress(res, newProgress);
  };
  setTimeout(cb, Math.random() * 500);
}
