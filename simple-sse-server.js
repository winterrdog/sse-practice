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
  var newProgress = Math.min(progress + Math.random() * 10, 100);

  var payload = [
    "event: progress",
    `id: id_${newProgress.toFixed(2)}`,
    `data: ${Math.floor(newProgress)}% complete`,
  ];
  res.write(setSsePayload(payload));

  if (newProgress >= 100) {
    console.log("+ sse request complete\n");

    payload = ["event: done", "data: 100% complete"];
    res.write(setSsePayload(payload));

    return;
  }

  const cb = function () {
    return sseProgress(res, newProgress);
  };
  setTimeout(cb, Math.random() * 500);
}

/**
 * Converts an array into a Server-Sent Events (SSE) compatible payload.
 *
 * @param {Array} arr - The array to be converted into SSE payload.
 * @returns {string} A formatted string that follows the SSE protocol format.
 */
function setSsePayload(arr) {
  return arr.join("\n") + "\n\n";
}
