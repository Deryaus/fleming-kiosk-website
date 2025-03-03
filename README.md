# Fleming Kiosk 

## Description
This **AI-powered Interactive Kiosk** was developed by the **Computer Engineering Technology** students at
**Fleming College** in its final year. It provides students and visitors with a seamless way to access information about the college
using a conversational AI.

The Kiosk leverages a **fine-tuned Gemini model** trained with **local knowledge** about Fleming College, allowing users
to interact with it to answer questions.

## Key Features:

- 🧠 **AI Assistant** – Interact with a locally optimized AI trained on Fleming College information.  
- 🗺 **Campus Map** – Easily navigate around campus.  
- ❓ **FAQs** – Get quick answers to common questions.  
- 🎮 **Multiple-Choice Game** – Engage with a fun educational quiz.  
- 📅 **Event Schedule** – Stay updated on Fleming SAQ events.  

## Tech Stack
  * **Flask** - Backend framework for the web application
  *  **Hypercorn & Nginx** - Deployment on a linux OS for high-performance hosting.

## Screenshots
![Screenshot](/static/images/welcome_screen.png)

## Table of Contents
- [Usage](#usage)
- [Installation](#installation)
- [Configuration](#configuration)


## Usage

### Welcome Video
- Upon launching the kiosk, a welcome video plays automatically
- Video transitions to Campus Map section when finished
- Can be skipped by clicking any navigation button

### Navigation
- Use the top navigation buttons to access different sections:
  - Campus Map
  - Event Schedule
  - FAQs
  - Chat With Blaze
  - Play A Game

### Campus Map
- View maps of Fleming campuses
- Toggle between Sutherland and Frost campuses
- Access upper/lower level views for Frost campus

### Event Schedule
- Browse upcoming Fleming SAC events
- View event details and images
- Scan QR code for more information

### FAQs
- Browse common questions about Fleming College
- Get instant answers from Blaze the Fleming College Mascot

### Chat with Blaze
- Interactive chat with Blaze Flemings AI assistant
- Support for both text and voice input

### Interactive Quiz
- Test your knowledge about Fleming College
- Multiple-choice questions covering:
  - College history
  - Campus information
  - Student services
  - Sir Sandford Fleming facts


## Installation 
### For Ubuntu 24.04.2 Distribution with kiosk user

### 1. Update System Packages
**Objective:** Ensure the system is up to date.  
**Procedure:** Run the following command to update and upgrade system packages:
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install and Configure SSH
**Objective:** Enable remote access to the system.  
**Procedure:** Install the SSH server:
```bash
sudo apt install openssh-server -y
```
Start and enable the SSH service:
```bash
sudo systemctl start ssh
sudo systemctl enable ssh
```

### 3. Download the Repository from Git
**Objective:** Retrieve the necessary project files.  
**Procedure:** Install Git:
```bash
sudo apt install git -y
```
Clone the repository:
```bash
git clone https://github.com/Deryaus/fleming-kiosk-website /home/kiosk
```

### 4. Purge the Keyring
**Objective:** Remove unnecessary keyring management.  
**Procedure:**
```bash
sudo apt remove --purge gnome-keyring
rm -rf ~/.local/share/keyrings/
```

### 5. Configure sudo to Run Without Password
**Objective:** Allow sudo commands to run without requiring a password.  
**Procedure:** Edit the sudoers file:
```bash
sudo visudo
```
Modify the following line:
```
%sudo ALL=(ALL:ALL) ALL
```
Change it to:
```
%sudo ALL=(ALL:ALL) NOPASSWD:ALL
```

### 6. Configure GNOME Settings
**Objective:** Optimize the user environment for kiosk mode.  
**Procedure:**
```bash
gsettings set org.gnome.mutter dynamic-workspaces false
gsettings set org.gnome.desktop.wm.preferences num-workspaces 1
```
Disable update notifications and allow updates to run automatically:
```bash
gsettings set com.ubuntu.update-notifier no-show-notifications true
sudo apt install unattended-upgrades -y
```
Disable the default touchscreen keyboard:
```bash
sudo apt install chrome-gnome-shell -y
```
- Install GNOME Shell Integration in Firefox: [GNOME Shell Integration](https://addons.mozilla.org/en-CA/firefox/addon/gnome-shell-integration/).
- Install Caribou Blocker: [Caribou Blocker](https://extensions.gnome.org/extension/3222/block-caribou-36/) and activate it.

### 7. Enable Auto Login
**Objective:** Automatically log in the kiosk user.  
**Procedure:** Edit the GDM configuration file:
```bash
sudo nano /etc/gdm3/custom.conf
```
Modify the `[daemon]` section:
```
[daemon]
AutomaticLoginEnable = true
AutomaticLogin = kiosk
```

### 8. Configure Hosts File
**Objective:** Define a hostname for easier access.  
**Procedure:**
```bash
sudo nano /etc/hostname
```
Add the following line:
```
127.0.0.1 flemingkiosk
```

### 9. Install and Configure Nginx
**Objective:** Set up Nginx as a web server.  
**Procedure:**
```bash
sudo apt install nginx -y
```
Remove the default site configuration:
```bash
sudo rm /etc/nginx/sites-available/default
sudo unlink /etc/nginx/sites-enabled/default
```
Create a new Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/flask_app
```
Add the following content:
```nginx
server {
    listen 80;
    server_name flemingkiosk;
 
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    location /static/ {
        alias /home/kiosk/fleming-kiosk-website/static/;
    }
}
```

### 10. Add Nginx to the Kiosk User Group
```bash
sudo usermod -aG kiosk www-data
```

### 11. Grant Audio Permissions
```bash
sudo usermod -a -G audio,pulse-access kiosk
```

### 12. Install Required Dependencies
**Install PortAudio (required for PyAudio compatibility):**
```bash
sudo apt install portaudio19-dev -y
```

### 13. Set Up Python Virtual Environment and Install Dependencies
```bash
cd ~/kiosk/fleming-kiosk-website
sudo apt install python3 python3-venv python3-pip -y
python3 -m venv venv
source venv/bin/activate
pip install --upgrade setuptools wheel
pip install -r requirements.txt
deactivate
```

### 14. Configure and Run Hypercorn
```bash
sudo nano /etc/systemd/system/kiosk.service
```
Add the following content:
```ini
[Unit]
Description=hypercorn for flask app
After=network.target

[Service]
User=kiosk
Group=kiosk
WorkingDirectory=/home/kiosk/fleming-kiosk-website
ExecStart=/home/kiosk/fleming-kiosk-website/venv/bin/hypercorn -w 3 -b 0.0.0.0:8000 main:app
Restart=always
StandardOutput=append:/home/kiosk/kiosk.log
StandardError=append:/home/kiosk/kiosk.log

[Install]
WantedBy=multi-user.target
```
Reload systemd and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable kiosk
sudo systemctl start kiosk
```

### 15. Configure Firefox Policies
```bash
sudo mkdir -p /etc/firefox/policies
sudo nano /etc/firefox/policies/policies.json
```
Add the following content:
```json
{
  "policies": {
    "DisableSessionRestore": true,
    "DisableAppUpdate": true,
    "DisableTelemetry": true,
    "DisableDefaultBrowserAgent": true,
    "DisableFeedbackCommands": true,
    "DisableFirefoxStudies": true,
    "DisablePocket": true,
    "DisableFirefoxAccounts": true,
    "Homepage": {
      "StartPage": "homepage",
      "URL": "http://flemingkiosk"
    }
  }
}
```

### 16. Create a Shell Script for Kiosk Mode
```bash
sudo nano /home/kiosk/start_kiosk.sh
```
Add the following content:
```bash
#!/bin/bash
sleep 10
firefox --fullscreen --kiosk --new-instance http://flemingkiosk
```
Set correct permissions:
```bash
sudo chmod +x /home/kiosk/start_kiosk.sh
```
Create a system service:
```bash
sudo nano /etc/systemd/system/start_kiosk.service
```
Add the following:
```ini
[Unit]
Description=Kiosk Mode
After=graphical.target network.target multi-user.target

[Service]
User=kiosk
Group=kiosk
ExecStart=/home/kiosk/start_kiosk.sh
Restart=always
RestartSec=5

[Install]
WantedBy=graphical.target
```
Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable start_kiosk
sudo systemctl start start_kiosk
```

Firefox will now automatically launch on boot into the `flemingkiosk` website hosted locally.



## Configuration
### How to Add or Remove Questions from the Quiz JSON File

### Adding a New Question
To add a new question to the JSON file, follow these steps:

1. Open the `quiz_questions.json` file in a text editor.
2. Inside the `"questions"` array, add a new question object at the desired location.
3. The question object should follow this format:

```json
{
    "question": "Your new question here?",
    "answers": [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
    ],
    "correct": 0
}
```

4. Ensure that:
   - The `"answers"` array contains four possible answer choices.
   - The `"correct"` value represents the index (starting from 0) of the correct answer in the `"answers"` array.
   - Each question ends with a comma `,` except for the last question in the array.

5. Save the file after making your changes.

### Example:
Adding the following question:

```json
{
    "question": "What color is the sky on a clear day?",
    "answers": [
        "Blue",
        "Green",
        "Red",
        "Yellow"
    ],
    "correct": 0
}
```

If adding it at the end of the array, ensure the previous question has a comma `,` at the end before adding the new one.

---

### Removing a Question
To remove a question from the JSON file:

1. Locate the question you want to remove in the `"questions"` array.
2. Delete the entire object, including the `{}` braces, along with the preceding comma if it is not the first question.
3. Ensure the remaining format is correct (i.e., no trailing commas on the last question in the array).
4. Save the file.

### Example:
Removing this question:

```json
{
    "question": "What is the name of the Peterborough campus?",
    "answers": [
        "Frost Campus",
        "Sutherland Campus",
        "Haliburton Campus",
        "Cobourg Campus"
    ],
    "correct": 1
}
```

Make sure to:
- Remove any unnecessary trailing commas to maintain valid JSON formatting.
