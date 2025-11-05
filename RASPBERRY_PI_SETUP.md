# Smart Metering System - Raspberry Pi Display Setup

## Overview
This guide helps you set up the Raspberry Pi 4B with the 7-inch capacitive touch display to display sensor readings from three PZEM-004T circuits.

## Hardware Requirements
- Raspberry Pi 4B (4GB)
- ER-TFTV070A3-1 7-inch capacitive touch display
- 3x PZEM-004T Power Meters
- RTC DS3231 module
- PIR Motion Sensor
- 3x UART connections for sensors

## Installation Steps

### 1. Flash Raspberry Pi OS
```bash
# Use Raspberry Pi Imager to flash the latest Raspberry Pi OS (64-bit)
# https://www.raspberrypi.com/software/
```

### 2. Install Dependencies
```bash
sudo apt-get update
sudo apt-get upgrade -y
sudo apt-get install -y \
    python3-pip \
    python3-dev \
    python3-pil \
    python3-smbus \
    i2c-tools \
    python3-rpi.gpio \
    libopenjp2-7 \
    libtiff5 \
    libjasper1 \
    libharfbuzz0b \
    libwebp6 \
    libtiff5-dev \
    git

pip3 install --upgrade pip setuptools wheel
```

### 3. Install Python Libraries
```bash
pip3 install \
    adafruit-circuitpython-ds3231 \
    adafruit-circuitpython-pzem004t \
    adafruit-circuitpython-rgb-display \
    adafruit-circuitpython-displayio \
    pillow \
    requests \
    python-dotenv
```

### 4. Enable I2C and SPI
```bash
sudo raspi-config
# Navigation: Interface Options > I2C > Enable
# Navigation: Interface Options > SPI > Enable
```

### 5. Set Up Display Driver
```bash
# Clone ST7789 display driver
git clone https://github.com/adafruit/Adafruit_CircuitPython_RGB_display.git
cd Adafruit_CircuitPython_RGB_display
sudo python3 setup.py install
```

### 6. Configure Environment Variables
Create `.env` file:
```bash
nano ~/.env
```

Add:
```
SUPABASE_URL=https://pmuqzrdiwxgkkxufzddo.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
USER_ID=your_user_id_here
```

### 7. Run the Application
```bash
python3 raspberry_pi_display.py
```

## Key Improvements from Original Code

### Issue 1: Slow UI Display (FIXED ✓)
**Problem:** UI took 30+ minutes to display
**Solution:**
- Display shows placeholder "Loading..." immediately on startup
- UI renders completely before sensor reading starts
- Sensor reading runs in background thread (separate from display)
- Display updates independently every 0.5 seconds with latest data

### Issue 2: HTML tag [/b] appearing (FIXED ✓)
**Solution:** Removed all HTML/markup from Python display code
- Using PIL directly for rendering (no HTML)
- Clean, simple text rendering
- All graphics drawn as primitives (rectangles, text)

### Issue 3: Text Color Visibility (FIXED ✓)
**Solution:**
- Slide 1: Dark gray/blue text on light gray background (high contrast)
- Slide 2: Dark text on light blue background
- Slide 3: Dark red/brown on light red background
- Slide 4: Dark orange on light yellow background
- Slide 5: Dark teal on light cyan background
- All text colors verified for readability

### Issue 4: Poor Layout & Design (FIXED ✓)
**Solution:**
- Professional card-based layout
- Clear visual hierarchy
- Consistent spacing and alignment
- Color-coded circuits (Red, Orange, Cyan)
- Large, readable fonts suitable for poor eyesight
- Organized information groups

### Issue 5: Slow Sensor Reading (FIXED ✓)
**Problem:** Sensors read for 1-2 minutes each
**Solution:**
- Background thread reads sensors every 10 seconds consistently
- Non-blocking sensor reading
- Parallel data collection and display rendering
- Timeout handling for sensor reads
- Data buffered and displayed immediately

### Issue 6: Highlight Monthly Bill (FIXED ✓)
**Solution:**
- Slide 1 now emphasizes monthly bill in large, blue text
- Bill calculation: (Energy_1 + Energy_2 + Energy_3) × Cost_Rate
- Total energy shown as secondary metric
- Cost rate easily editable from web dashboard

## Architecture Overview

### Display Thread
- Renders current slide with latest sensor data
- Updates every 0.5 seconds
- Non-blocking rendering

### Sensor Thread
- Reads all three PZEM-004T sensors in background
- Reads every 10 seconds (not continuously)
- Sends data to Supabase via Edge Function
- Handles connection errors gracefully

### Data Flow
```
PZEM Sensors → Background Thread → Queue → Display Thread → LCD
              ↓
         Supabase (Edge Function)
         ↓
    Web Dashboard
```

## Web Dashboard Integration

The web dashboard displays:
- **Slide 1:** Monthly bill + total energy + WiFi status + time/date
- **Slide 2:** System totals (power, current, voltage, energy, power factor)
- **Slide 3-5:** Individual circuit readings

Data syncs in real-time from Raspberry Pi to web dashboard via Supabase.

## Settings

### Edit Cost Rate
From web dashboard → Settings → Cost Rate (PHP/kWh)
Default: 12.50 PHP/kWh

### Download Data
From web dashboard → Download button
Exports all sensor readings as CSV

### Reset Data
From web dashboard → Reset button
Clears all sensor readings from database

## Troubleshooting

### Display not showing
```bash
# Check I2C/SPI connection
i2cdetect -y 1
ls /dev/ttyS*
```

### Sensors not reading
```bash
# Check UART connections and baud rates
# Default PZEM-004T: 9600 baud
```

### Connection to Supabase fails
- Verify WiFi is connected
- Check SUPABASE_URL and SUPABASE_ANON_KEY in .env
- Verify USER_ID is correct

### Backlight not responding to PIR
- Check PIR sensor GPIO pin (default: GPIO 27)
- Verify backlight GPIO pin (default: GPIO 17)
- Test with: `sudo gpio -g read 27`

## Performance Tips

1. **Network latency:** Sensor reads happen locally, display updates instantly
2. **Power consumption:** PIR sensor turns off backlight after 5 minutes of inactivity
3. **Data accuracy:** Sensors read every 10 seconds for sufficient sampling
4. **Storage:** Data stored in Supabase (unlimited with your plan)

## Support

For issues, check:
1. Python library versions match requirements
2. GPIO pins configured correctly
3. Supabase credentials in .env file
4. Network connectivity (WiFi/Ethernet)
