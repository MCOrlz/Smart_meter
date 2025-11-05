# Web Dashboard - User Guide

## Accessing the Dashboard

1. Open your browser
2. Navigate to: `http://<raspberry-pi-ip>:5173`
3. Or if on the same network: `http://localhost:5173`

## First Time Setup

### Creating an Account
1. Click "Don't have an account? Create one"
2. Enter your email address
3. Create a strong password
4. Click "Create Account"
5. Sign in with your credentials

### Connecting the Raspberry Pi
1. On your Raspberry Pi, set the `USER_ID` environment variable to your account's user ID
2. This can be found in Supabase dashboard or by checking the response after signup
3. Restart the Raspberry Pi display script

## Dashboard Interface

### Header (Top Navigation)
- **Title:** Smart Metering System
- **WiFi Status:** Shows connection status
- **Settings:** Edit cost rate
- **Download Data:** Export readings as CSV
- **Reset Data:** Clear all sensor readings
- **Your Email:** Displays logged-in user
- **Logout:** Exit the dashboard

### Main Content Area (5 Slides)

#### Slide 1: Summary & Monthly Bill
**Key Metrics:**
- **Monthly Bill (PHP)** - Main highlight in large blue text
- **Total Energy (kWh)** - Combined consumption from all circuits
- **Cost Rate (PHP/kWh)** - Editable rate used for calculations
- **Circuit Breakdown** - Individual energy for each circuit
- **WiFi & Time** - Connection status and current time/date

**Formula:** Monthly Bill = (Energy_1 + Energy_2 + Energy_3) × Cost_Rate

**What this tells you:**
- Estimated monthly electricity cost
- Total consumption across all circuits
- Current electricity rate you're paying

---

#### Slide 2: System Totals
**Key Metrics:**
- **Total Power** - Combined instantaneous power from all circuits (Watts)
- **Total Energy** - Cumulative consumption (kWh)
- **Total Current** - Combined electrical current (Amps)
- **Avg Voltage** - Average voltage across circuits (Volts)
- **Power Factor** - Overall system efficiency
- **Last Update** - When data was last refreshed

**What this tells you:**
- Current system load
- Overall energy efficiency
- System voltage health
- Power quality

---

#### Slides 3-5: Individual Circuits
Each circuit (1, 2, and 3) displays:
- **Voltage (V)** - Electrical potential difference
- **Current (A)** - Electrical current flowing
- **Power (W)** - Instantaneous power consumption
- **Energy (kWh)** - Total consumption since measurement started
- **Power Factor** - How efficiently the circuit is using power

**What this tells you:**
- Which circuits use the most power
- Overloaded circuit detection
- Individual appliance efficiency
- Power quality per circuit

**Color coding:**
- Slide 3: Red/Orange (Circuit 1)
- Slide 4: Yellow/Amber (Circuit 2)
- Slide 5: Cyan/Teal (Circuit 3)

---

### Navigation

**Slide Navigation Methods:**
1. Click arrow buttons (← Previous | Next →)
2. Click dots at the bottom to jump to specific slide
3. Swipe left/right on mobile devices
4. Use keyboard arrow keys (when implemented)

**Status Indicator:**
"Slide X of 5" shows your current position

---

## Settings Management

### Accessing Settings
1. Click the gear icon (⚙️) in the header
2. Edit the cost rate
3. Click "Save" to apply changes

### Editable Settings

**Cost Rate (PHP/kWh)**
- Default: 12.50 PHP/kWh
- This value multiplies total energy to calculate your bill
- Update when your electricity rate changes
- Automatically syncs to Raspberry Pi display

**Example:**
- Energy: 100 kWh
- Cost Rate: 12.50 PHP/kWh
- Monthly Bill: 100 × 12.50 = 1,250 PHP

---

## Data Management

### Download Data (CSV Export)

**How to:**
1. Click the download button (⬇️) in header
2. File saves as: `sensor_readings_YYYY-MM-DD.csv`
3. Open in Excel, Google Sheets, or any spreadsheet app

**CSV Contents:**
```
Timestamp, V1, I1, P1, E1, PF1, V2, I2, P2, E2, PF2, V3, I3, P3, E3, PF3
2024-11-04 14:30:15, 230.5, 5.2, 1195.8, 45.3, 0.98, ...
```

**Uses:**
- Analyze consumption trends
- Create custom reports
- Track energy efficiency improvements
- Archive historical data

### Reset Data

**How to:**
1. Click the reset button (⟲) in header
2. Confirm the action
3. All sensor readings are permanently deleted
4. Cannot be undone - download first if needed!

**When to use:**
- Start fresh tracking period (new month)
- Remove test data
- Free up storage space
- System reset/maintenance

---

## Real-Time Updates

**Dashboard updates automatically when:**
- Raspberry Pi sends new sensor readings (every 10 seconds)
- Multiple devices can view simultaneously
- Changes sync across all open browser tabs

**Checking if connected:**
- WiFi icon shows "Connected" in top-right
- Data timestamp updates regularly
- Green connection indicator (when implemented)

---

## Mobile Responsiveness

The dashboard works on:
- Desktop (1920×1080 and up)
- Tablet (768px width)
- Mobile (375px width)

**Mobile optimizations:**
- Touch-friendly buttons
- Swipe navigation between slides
- Mobile menu for actions (⋮)
- Readable on smaller screens

---

## Troubleshooting

### Dashboard loads but no data
**Problem:** Sensors not connected or Raspberry Pi offline
- Check if Raspberry Pi is running
- Verify WiFi connection
- Check SUPABASE_URL and USER_ID

**Solution:**
1. SSH into Raspberry Pi
2. Check if `raspberry_pi_display.py` is running
3. Verify Supabase credentials
4. Restart the script: `python3 raspberry_pi_display.py`

### Data not updating
**Problem:** Readings are old or not refreshing
- Sensor data may be slow to send
- Network connection issue

**Solution:**
1. Refresh browser (F5 or Cmd+R)
2. Check Raspberry Pi connectivity
3. Wait 10 seconds for next sensor read
4. Check browser console for errors

### Can't change cost rate
**Problem:** Settings won't save
- Possible authentication issue
- Database connection error

**Solution:**
1. Try logging out and back in
2. Clear browser cache
3. Check browser console for errors
4. Restart dashboard server

### Download button not working
**Problem:** CSV file won't download
- Browser blocking downloads
- Insufficient data to export

**Solution:**
1. Check browser download settings
2. Allow pop-ups for this site
3. Try different browser
4. Ensure there's sensor data to export

---

## Performance Tips

### For Better Experience
1. **Refresh rate:** Auto-updates every 3 seconds
2. **Reduce data:** Download old readings regularly
3. **Offline mode:** Works with cached data temporarily
4. **Mobile:** Use WiFi for faster updates
5. **Server:** Keep Raspberry Pi on and connected

### Bandwidth Usage
- Each sensor reading: ~200 bytes
- 6 readings per minute: ~1.2 KB/min
- Monthly data: ~50 MB (comfortable limit)

---

## Security Notes

### Account Protection
- Never share your login credentials
- Use strong, unique passwords
- Change password regularly
- Logout on shared devices

### Data Privacy
- All data stored on Supabase
- Encrypted in transit (HTTPS/TLS)
- Protected by Row-Level Security (RLS)
- Only your account can access your data

### Recommendations
- Enable 2FA if available
- Backup your data regularly
- Monitor usage periodically
- Report suspicious activity

---

## Keyboard Shortcuts (When Implemented)

| Key | Action |
|-----|--------|
| ← | Previous slide |
| → | Next slide |
| 1-5 | Jump to slide |
| S | Settings |
| D | Download data |
| L | Logout |
| F5 | Refresh |

---

## Energy Consumption Guide

### Understanding Your Readings

**Voltage (230V typical in Philippines)**
- Normal: 220-240V
- Issue: Below 220V = low supply, Above 240V = overvoltage

**Current (Amps)**
- Higher current = more load
- Safe limit depends on circuit breaker rating
- Typical: 2-20A per circuit

**Power (Watts)**
- Instantaneous consumption
- 1000W = 1kW
- Used to calculate energy over time

**Energy (kWh)**
- Cumulative consumption
- Used for billing purposes
- 1kWh = 1000W × 1 hour

**Power Factor**
- Ideal: 0.95-1.0 (very efficient)
- Normal: 0.80-0.95 (efficient)
- Poor: <0.80 (inefficient, needs improvement)

### Tips to Reduce Consumption
1. **Identify high-power circuits** - Check Slide 3-5
2. **Monitor trends** - Download data weekly
3. **Peak usage** - Shift heavy loads off-peak hours
4. **Efficiency** - Replace old appliances
5. **Maintenance** - Keep circuits balanced

---

## Common Questions

**Q: Why is my bill higher than expected?**
A: Check the Cost Rate setting. Update if your electricity company changed rates.

**Q: Can I export data in other formats?**
A: Currently supports CSV. You can import to Excel/Google Sheets for other formats.

**Q: How long is data kept?**
A: Data is kept indefinitely until you reset. Download periodically for archival.

**Q: Multiple users for same Raspberry Pi?**
A: Each Raspberry Pi connects to one user. Create separate accounts for separate monitoring.

**Q: Real-time data or historical?**
A: Mix of both. Shows current readings + stores history for analysis.

---

For more technical details, see: `SMART_METERING_README.md` and `RASPBERRY_PI_SETUP.md`
