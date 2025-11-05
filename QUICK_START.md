# Quick Start Guide - Smart Metering System

## 5-Minute Setup

### Step 1: Web Dashboard Setup (2 min)
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Visit: http://localhost:5173

### Step 2: Create Account (1 min)
1. Click "Don't have an account? Create one"
2. Enter email and password
3. Click "Create Account"
4. Sign in

### Step 3: Raspberry Pi Setup (2 min)
```bash
# Install Python libraries
pip3 install -r requirements-rpi.txt

# Create environment file
cp .env.example .env
# Edit .env with your Supabase credentials and user ID

# Run the display controller
python3 raspberry_pi_display.py
```

Done! Your smart metering system is now running.

---

## First Steps

### On Web Dashboard
1. **Download Data:** Test the download button (→ get CSV file)
2. **Settings:** Change cost rate if needed
3. **View Slides:** Browse all 5 slides

### On Raspberry Pi Display
1. **Slide 1:** Check monthly bill calculation
2. **Slide 2:** Verify totals display correctly
3. **Slides 3-5:** View individual circuit readings
4. **Navigation:** Test previous/next buttons

---

## Where to Find Things

| What | Where |
|------|-------|
| Technical overview | `SMART_METERING_README.md` |
| Raspberry Pi setup details | `RASPBERRY_PI_SETUP.md` |
| Web dashboard help | `WEB_DASHBOARD_GUIDE.md` |
| Complete implementation details | `IMPLEMENTATION_SUMMARY.md` |

---

## Common Issues

### Dashboard shows "Loading..." forever
→ Check `.env` file has correct Supabase URL and key

### Raspberry Pi not showing data
→ Check SUPABASE_URL, SUPABASE_ANON_KEY, and USER_ID in `.env`

### No sensor readings appear
→ Verify PZEM-004T sensors are connected and powered
→ Check UART connections (TX/RX pins)

---

## Next: Customize Settings

Edit these files for your setup:

**raspberry_pi_display.py:**
- Line 34-36: UART pins for sensors
- Line 45-48: GPIO pins for display
- Line 50-51: PIR sensor and backlight pins

**Web dashboard:**
- Settings → Cost Rate (PHP/kWh)
- Default: 12.50, update based on your provider

---

## Need Help?

1. Check the relevant guide above
2. Review troubleshooting sections
3. Check console for error messages
4. Verify all connections and credentials

---

## What You've Built

✓ Web monitoring dashboard (React)
✓ Real-time data sync (Supabase)
✓ Raspberry Pi LCD display (Python)
✓ Three circuit monitoring (PZEM-004T)
✓ Cloud database (PostgreSQL)
✓ Authentication system
✓ Data export (CSV)

Enjoy your professional smart metering system!
