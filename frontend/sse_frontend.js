document.body.textContent = "Ready.";

const es = new EventSource("http://localhost:3000/progress");

es.addEventListener("progress", ({ type, lastEventId, data }) => {
  console.log(type, lastEventId, data);
  document.body.textContent = data;
});

es.addEventListener("done", ({ type, data }) => {
  console.log(type, data);
  document.body.textContent = "Finished!";
  es.close();
});
