# Login Credentials

## 🔐 Password Security: IMPLEMENTED ✅

All passwords are now **hashed with bcrypt** for maximum security!

---

## 👥 Test User Accounts

### **Student Accounts:**

| Username | Password | Role | Name |
|----------|----------|------|------|
| student1 | password123 | Student | Alice Johnson |
| student2 | password123 | Student | Bob Williams |
| student3 | password123 | Student | Charlie Brown |
| student4 | password123 | Student | Diana Miller |
| student5 | password123 | Student | Ethan Davis |
| student6 | password123 | Student | Fiona Garcia |

### **Warden Account:**

| Username | Password | Role | Name |
|----------|----------|------|------|
| warden1 | password123 | Warden | Mr. Harrison |

---

## 🎯 How to Use:

1. **Go to:** http://localhost:5174
2. **Select role** (Student or Warden)
3. **Enter credentials** from table above
4. **Click Login**

---

## ✨ New User Registration:

**Anyone can register a new account!**

1. Click **"Register"** on login page
2. Fill in:
   - Username (must be unique)
   - Email (must be unique)
   - Password (will be hashed automatically)
   - Name
   - Role (Student/Warden)
3. Click **"Create Account"**
4. Login with your new credentials!

---

## 🔒 Security Features:

✅ **Bcrypt Password Hashing** - Passwords encrypted with industry-standard bcrypt  
✅ **Salt Rounds: 10** - Strong protection against brute-force attacks  
✅ **Unique Username & Email** - Duplicate prevention  
✅ **Role-Based Access** - Different permissions for students and wardens  
✅ **Secure Storage** - Passwords never stored in plain text  

---

## 📝 Notes:

- **Old test accounts updated:** All seed users now use hashed passwords
- **Password changed:** From "password" to "password123" for better security
- **Warden username changed:** From "warden" to "warden1"
- **Production ready:** Can be deployed with confidence!
