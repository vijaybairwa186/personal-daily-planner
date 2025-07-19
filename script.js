const planner = document.getElementById("planner");
const startHour = 7;
const endHour = 22;
const dateInput = document.getElementById("date");

function formatHour(hour) {
  const period = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 || 12;
  return `${display.toString().padStart(2, "0")}:00 ${period}`;
}

function getKey(hour) {
  const date = dateInput.value || new Date().toISOString().split("T")[0];
  return `task-${date}-${hour}`;
}

function createTimeBlock(hour) {
  const block = document.createElement("div");
  block.classList.add("time-block");
  block.dataset.hour = hour;

  const saved = JSON.parse(localStorage.getItem(getKey(hour))) || {};
  const priority = saved.priority || "low";

  block.innerHTML = `
    <div class="hour">${formatHour(hour)}</div>
    <input type="text" class="task-input" value="${
      saved.task || ""
    }" placeholder="Enter task" />
    <select class="priority">
      <option value="low" ${priority === "low" ? "selected" : ""}>Low</option>
      <option value="medium" ${
        priority === "medium" ? "selected" : ""
      }>Medium</option>
      <option value="high" ${
        priority === "high" ? "selected" : ""
      }>High</option>
    </select>
    <button class="save-btn">Save</button>
    <input type="checkbox" class="done-checkbox" title="Mark done" ${
      saved.done ? "checked" : ""
    } />
    <span class="saved-status" style="margin-left:10px; color:green; font-size:0.9em; display:none;">✔ Saved</span>
  `;

  const input = block.querySelector(".task-input");
  const prioritySelect = block.querySelector(".priority");
  const saveBtn = block.querySelector(".save-btn");
  const checkbox = block.querySelector(".done-checkbox");
  const status = block.querySelector(".saved-status");

  block.classList.add(priority);
  if (saved.done) input.classList.add("done");

  const saveData = () => {
    const data = {
      task: input.value,
      priority: prioritySelect.value,
      done: checkbox.checked,
    };
    localStorage.setItem(getKey(hour), JSON.stringify(data));

    input.classList.toggle("done", checkbox.checked);
    block.className = "time-block";
    block.classList.add(data.priority);

    status.style.display = "inline";
    setTimeout(() => (status.style.display = "none"), 1200);
  };

  saveBtn.addEventListener("click", saveData);

  checkbox.addEventListener("change", saveData);

  return block;
}

function renderPlanner() {
  planner.innerHTML = "";
  const selectedDate = new Date(
    dateInput.value || new Date().toISOString().split("T")[0]
  );
  const header = document.querySelector("h1");
  header.innerHTML = `🗓️ Planner for ${selectedDate.toDateString()}`;

  for (let hour = startHour; hour <= endHour; hour++) {
    planner.appendChild(createTimeBlock(hour));
  }
}

dateInput.addEventListener("change", renderPlanner);

window.addEventListener("DOMContentLoaded", () => {
  dateInput.value = new Date().toISOString().split("T")[0];
  renderPlanner();
});
