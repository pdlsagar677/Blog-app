

# Blog App

A full-featured blogging application built with **Next.js**, **TypeScript**, and **Tailwind CSS**, featuring user authentication, state management, and CRUD functionality. This app allows multiple users to create, edit, delete, and read blog posts, with secure session handling using tokens.

---

## **Features**

* **User Authentication**:

  * Users can **sign up** and **log in** securely.
  * Form validation is implemented for both login and signup to ensure valid input.
  * Authentication sessions are handled with **tokens** stored in the browser and database too , ensuring secure access to user-specific actions.

* **Blog Management**:

  * Authenticated users can **add multiple blog posts**.
  * Users can **edit** or **delete only their own posts**.
  * Users can **read posts created by other users**, providing a collaborative blog environment.

* **State Management**:

  * Uses **Zustand** for efficient global state management, handling blogs, authentication, and UI states like loading and errors.

* **Database**:

  * **MongoDB** is used to store users, sessions, and blog posts.
  * Each blog includes metadata such as `authorId`, `authorName`, `createdAt`, and `updatedAt`.

* **Frontend**:

  * Built with **Next.js** and **TypeScript** for a robust and scalable architecture.
  * **Tailwind CSS** is used for modern, responsive UI styling.
  * Navigation handled using **Next.js router**.

* **Security**:

  * Users can only edit or delete **their own posts**.
  * Access to API endpoints is protected using **session tokens**.
  * Unauthorized access attempts are handled gracefully with proper error messages.

* **UX & UI**:

  * Responsive design for both light and dark modes.
  * Loading states and error messages provide smooth user feedback.
  * Blog lists display previews with **“Read More”** functionality for full content.

---

## **Tech Stack**

* **Frontend**: Next.js, TypeScript, Tailwind CSS
* **State Management**: Zustand
* **Backend / API**: Next.js API Routes
* **Database**: MongoDB
* **Authentication**: Token-based sessions

---

## **Usage**

1. Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd blog-app
npm install
```

2. Configure your environment variables:

```env
MONGODB_URI=<your-mongodb-connection-string>
```

3. Run the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

---

## **Functionality Summary**

* **Signup / Login** with validation
* **Add blog posts**
* **Edit / Delete** your own posts
* **View blogs** from all users
* **Protected API endpoints** with token-based authentication
* **Responsive UI** with Tailwind CSS

---

## **Future Improvements**

* Add **comments** functionality for each blog post
* Implement **likes or reactions** for posts
* Rich text editor for blog content

---
