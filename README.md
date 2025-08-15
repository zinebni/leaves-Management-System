# 🚀 RHPlus

## 🧩 Why RHPlus?
There are many HR solutions available, but most have some key limitations:
- 🌍 They are universal platforms, not adapted to the local context in Morocco.
- ⚙️ They are often complex to use, requiring time and experience to learn.
- 💰 They are usually expensive, which is understandable for global platforms, but not aligned with local budgets.

## ✅ Our Solution: RHPlus
To address these limitations, we created RHPlus — an HR solution designed specifically for Morocco.
- 🇲🇦 Locally adapted: built with the Moroccan context in mind.
- 🎯 User-friendly: we focused on UX to ensure simplicity and ease of use.
- 💵 Affordable: priced appropriately for the Moroccan market.

At the moment, the core functionality of our platform is leave management. However, RHPlus is scalable, and we plan to add more features in the future.
## 📸 Demo

[Watch the full demo video](https://drive.google.com/file/d/1gpW2s1HAm0Pq0Pnpk_vmJzWXKIaUiUwA/view?usp=sharing)


## 📋 Common Rules & Functional Requirements

### 👥 Common Features for HR and Employees
- **Notifications** in real time and via email for important actions.   
- **Access to their dedicated personal space**.

### 🏢 Organization / Administrator Features
- **Create organization accounts**.  
- **Create and manage departments**.  
- **Create and manage HR accounts**.

### 🧑 Employee Features
- **Create a new leave request** (if no pending request exists).  
- **Consult leave request history** (past and current).  

### 🧑‍💼 HR Manager Features
- **Full employee management**: add, modify, delete, consult (CRUD).  
- **Consult leave requests** by status (pending, approved, rejected), including:  
  - Detailed info of the requesting employee.  
  - History of their leaves.  
  - Leaves of other employees in the same department.  
- **Validate or refuse requests**.  
- **Consult request history**.  
- **Create and manage events**.

### 🛠️ Scheduled Tasks (Automations)
- Automatic reset of taken leave days on **June 6th** every year.  
- Automatic blocking of new requests if another is pending.  
- Automatic assignment of leave entitlement after **6 months of seniority**.  
- Automatic addition of **+1.5 days every 5 years** of seniority, capped at 30 days.  
- **Secure authentication with 2FA** (verification code during login or password change).  


## 🛠️ Tech Stack

### Frontend
- **React.js** (UI library)
- **Tailwind CSS** (styling)
- **React Router** (routing)
- **Axios** (HTTP requests)
- **i18next / react-i18next** (internationalization)
- **React Toastify** (notifications)
- **AOS** (animations)
- **React Big Calendar, React Datepicker, Date-fns** (calendar & date handling)
- **Lucide / React-Icons** (icons)
- **Three.js & Vanta.js** (visual effects)

### Backend
- **Node.js & Express.js** (server)
- **MongoDB / Mongoose** (database)
- **JWT / Bcryptjs** (authentication & security)
- **Multer** (file uploads)
- **Nodemailer / Express-Handlebars** (emails & templates)
- **Node-cron** (scheduled tasks)
- **Socket.IO** (real-time notifications)

### Tools & Environment
- **Dotenv** (environment variables)
- **Nodemon** (development server auto-restart)
- **UUID / Dayjs** (utilities)
- **Git & GitHub** (version control)
- **VS Code** (IDE)
- **Postman** (API testing)
- **MongoDB Atlas / Compass** (database management)
- **Jira** (project management)

## ⚙️ Installation
Clone the repository with 
```bash
git clone https://github.com/your-username/leaves-Management-System.git
```
And navigate to the project folder using 
```bash
cd leaves-Management-System.
```

Open two terminals: 

In the first:
```bash
cd frontend
npm install
npm run dev
```
In the second terminal:

```bash
cd server
npm install
npm run server
```
The frontend will typically run on http://localhost:5173 and the backend on http://localhost:5000.

