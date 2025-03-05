## For Ubuntu 24.04.2 Distribution with kiosk user

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
- Install No Overview: [No Overview](https://extensions.gnome.org/extension/4099/no-overview/)

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
    },
    "Preferences": {
      "media.autoplay.default": {
        "Value": 0,
        "Status": "locked"
      },
      "media.autoplay.blocking_policy": {
        "Value": 0,
        "Status": "locked"
      },
      "browser.cache.disk.enable": {
        "Value": false,
        "Status": "locked"
      },
      "browser.cache.memory.enable": {
        "Value": false,
        "Status": "locked"
      },
      "browser.cache.offline.enable": {
        "Value": false,
        "Status": "locked"
      },
      "browser.cache.check_doc_frequency": {
        "Value": 1,
        "Status": "locked"
      }
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