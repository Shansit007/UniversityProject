document.addEventListener("DOMContentLoaded", () => {
  console.log("script loaded");

  // Dark/Light toggle
  const toggle = document.getElementById("modeToggle");
  if (toggle) {
    toggle.addEventListener("change", () => {
      const isDark = toggle.checked;
      document.body.classList.toggle("dark-mode", isDark);
      console.log("Dark mode toggled:", isDark);
    });
  }

  // Login buttons (use your existing IDs)
  const studentBtn = document.getElementById("studentBtn");
  const facultyBtn = document.getElementById("facultyBtn");
  const clubBtn = document.getElementById("clubBtn");

  if (studentBtn) {
    studentBtn.addEventListener("click", () => {
      console.log("Student login clicked");
      window.open("/student-login.html", "_blank");   // served from public/
    });
  }
  if (facultyBtn) {
    facultyBtn.addEventListener("click", () => {
      console.log("Faculty login clicked");
      window.open("/faculty-login.html", "_blank");
    });
  }
  if (clubBtn) {
    clubBtn.addEventListener("click", () => {
      console.log("Club login clicked");
      window.open("/club-login.html", "_blank");
    });
  }
});
