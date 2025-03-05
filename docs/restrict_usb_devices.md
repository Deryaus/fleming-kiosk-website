### Restrict USB Access by Creating a Whitelist

Make sure your USB devices that you want to whitelist are currently connected to your device.

### 1. Install USBGuard:
```bash
sudo apt install usbguard
```

### 2. Enable and start the USBGuard service:
```bash
sudo systemctl enable usbguard
sudo systemctl start usbguard
```

### 3. Generate a policy to whitelist your currently connected USB devices:
```bash
usbguard generate-policy > rules.conf
```

### 4. Restart USBGuard to apply the changes:
```bash
sudo systemctl restart usbguard
```

This will whitelist your currently connected USB devices and block anything else.
