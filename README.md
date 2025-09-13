How to Run in my device:
1) open the folder in your VS code.
2) change directory to backend (cd backend)
3) give command to node/nodemon to run the backend (node server.js)
(verify if it's running properly: 
Server running on port 5000
MongoDB connected successfully)
4) open new terminal/Split terminal
5) change directory to frontend (cd frontend)
6) give cmd to run the frontend in development mode (npm run dev)
(verify if frontend running properly: it'll provide you a localhost url)
7) NOW YOU ARE GOOD TO GO, JUST CLICK ON THAT http://localhost:5173/ URL 


Project Structure:
Where-is-My-Faculty
├─ backend
│  ├─ config
│  │  └─ db.js
│  ├─ controllers
│  │  ├─ adminController.js
│  │  ├─ clubController.js
│  │  ├─ facultyController.js
│  │  └─ studentController.js
│  ├─ index.js
│  ├─ middleware
│  │  ├─ auth.js
│  │  ├─ clubAuth.js
│  │  └─ facultyAuth.js
│  ├─ models
│  │  ├─ Admin.js
│  │  ├─ Club.js
│  │  ├─ Event.js
│  │  ├─ Faculty.js
│  │  └─ Student.js
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ routes
│  │  ├─ admin.js
│  │  ├─ club.js
│  │  ├─ faculty.js
│  │  └─ student.js
│  ├─ server.js
│  └─ uploads
│     ├─ 1757162683926-633122131.png
│     ├─ 1757164579680-41773285.png
│     ├─ 1757167073545-556053696.png
│     └─ 1757167115815-818966954.jpg
├─ frontend
│  ├─ css
│  │  └─ style.css
│  ├─ index.html
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  ├─ admin-dashboard.html
│  │  ├─ club-dashboard.html
│  │  ├─ club-login.html
│  │  ├─ club-register.html
│  │  ├─ faculty-dashboard.html
│  │  ├─ faculty-login.html
│  │  ├─ faculty-register.html
│  │  ├─ ffcs-dashboard.html
│  │  ├─ img
│  │  │  ├─ bg.jpg
│  │  │  ├─ InShot_20250908_232606967.jpg
│  │  │  ├─ WhatsApp Image 2025-09-08 at 23.19.30_002f780b.jpg
│  │  │  ├─ WhatsApp Image 2025-09-08 at 23.22.54_3ed7083a.jpg
│  │  │  ├─ WhatsApp Image 2025-09-08 at 23.38.59_26db485f.jpg
│  │  │  ├─ WhatsApp Image 2025-09-08 at 23.42.01_4e5c8fef.jpg
│  │  │  ├─ WhatsApp Image 2025-09-08 at 23.43.53_9a77392f.jpg
│  │  │  └─ WhatsApp Image 2025-09-09 at 00.02.48_83d882ec.jpg
│  │  ├─ js
│  │  │  └─ script.js
│  │  ├─ student-dashboard.html
│  │  ├─ student-login.html
│  │  └─ student-register.html
│  ├─ src
│  │  └─ input.css
│  └─ tailwind.config.js
└─ README.md

```