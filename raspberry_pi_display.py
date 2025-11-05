#!/usr/bin/env python3
"""
Smart Metering System - Raspberry Pi Display Controller
Optimized for fast UI rendering with efficient sensor reading
"""

import threading
import time
from datetime import datetime
from queue import Queue
import os
import sys

try:
    import board
    import busio
    from digitalio import DigitalInputOutput, Direction, Pull
    import adafruit_ds3231
    import adafruit_pzem004t
    from PIL import Image, ImageDraw, ImageFont
    import board
    import digitalio
    import adafruit_rgb_display.st7789 as st7789
except ImportError:
    print("Warning: Some hardware libraries not available - running in simulation mode")

import requests
import json
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_ANON_KEY')
USER_ID = os.getenv('USER_ID')
EDGE_FUNCTION_URL = f"{SUPABASE_URL}/functions/v1/insert-sensor-data"

class SensorReadingThread(threading.Thread):
    """Background thread for efficient sensor reading every 10 seconds"""

    def __init__(self, queue, stop_event):
        super().__init__(daemon=True)
        self.queue = queue
        self.stop_event = stop_event
        self.last_read_time = 0
        self.READ_INTERVAL = 10

    def init_sensors(self):
        """Initialize PZEM-004T sensors and RTC"""
        try:
            i2c = busio.I2C(board.SCL, board.SDA)

            self.rtc = adafruit_ds3231.DS3231(i2c)

            self.uart1 = busio.UART(board.TX, board.RX, baudrate=9600, timeout=1)
            self.sensor1 = adafruit_pzem004t.PZEM004T(self.uart1)

            self.uart2 = busio.UART(board.TX2, board.RX2, baudrate=9600, timeout=1)
            self.sensor2 = adafruit_pzem004t.PZEM004T(self.uart2)

            self.uart3 = busio.UART(board.TX3, board.RX3, baudrate=9600, timeout=1)
            self.sensor3 = adafruit_pzem004t.PZEM004T(self.uart3)

            return True
        except Exception as e:
            print(f"Sensor initialization error: {e}")
            return False

    def read_sensor_data(self):
        """Quickly read data from all three sensors"""
        try:
            data = {
                'voltage_1': self.sensor1.voltage or 0,
                'current_1': self.sensor1.current or 0,
                'power_1': self.sensor1.power or 0,
                'energy_1': self.sensor1.energy or 0,
                'power_factor_1': self.sensor1.power_factor or 0,
                'voltage_2': self.sensor2.voltage or 0,
                'current_2': self.sensor2.current or 0,
                'power_2': self.sensor2.power or 0,
                'energy_2': self.sensor2.energy or 0,
                'power_factor_2': self.sensor2.power_factor or 0,
                'voltage_3': self.sensor3.voltage or 0,
                'current_3': self.sensor3.current or 0,
                'power_3': self.sensor3.power or 0,
                'energy_3': self.sensor3.energy or 0,
                'power_factor_3': self.sensor3.power_factor or 0,
            }
            return data
        except Exception as e:
            print(f"Sensor read error: {e}")
            return None

    def send_to_supabase(self, data):
        """Send sensor data to Supabase via Edge Function"""
        try:
            headers = {
                'Authorization': f'Bearer {SUPABASE_KEY}',
                'Content-Type': 'application/json'
            }
            response = requests.post(EDGE_FUNCTION_URL, json=data, headers=headers, timeout=5)
            return response.status_code == 200
        except Exception as e:
            print(f"Upload error: {e}")
            return False

    def run(self):
        """Background reading loop - reads every 10 seconds"""
        if not self.init_sensors():
            print("Failed to initialize sensors")
            return

        while not self.stop_event.is_set():
            current_time = time.time()

            if current_time - self.last_read_time >= self.READ_INTERVAL:
                data = self.read_sensor_data()
                if data:
                    self.queue.put(('sensor_data', data))
                    self.send_to_supabase(data)
                self.last_read_time = current_time

            time.sleep(0.5)


class DisplayController:
    """Main display controller with fast initialization"""

    def __init__(self):
        self.init_display()
        self.current_slide = 0
        self.current_readings = None
        self.cost_rate = 12.50
        self.sensor_thread = None
        self.stop_event = threading.Event()
        self.data_queue = Queue()
        self.pir_active = False
        self.backlight_off_time = None

    def init_display(self):
        """Initialize the ER-TFTV070A3-1 7-inch display"""
        try:
            cs_pin = digitalio.DigitalInOut(board.CE0)
            dc_pin = digitalio.DigitalInOut(board.D25)
            reset_pin = digitalio.DigitalInOut(board.D24)

            self.display = st7789.ST7789(
                board.SPI(),
                height=800,
                width=480,
                cs=cs_pin,
                dc=dc_pin,
                rst=reset_pin,
                baudrate=40000000,
            )

            self.width = 480
            self.height = 800
        except Exception as e:
            print(f"Display init error: {e}")
            self.width = 480
            self.height = 800

    def init_pir_sensor(self):
        """Initialize PIR sensor for backlight control"""
        try:
            self.pir_pin = digitalio.DigitalInOut(board.D27)
            self.pir_pin.direction = Direction.INPUT
            self.pir_pin.pull = Pull.DOWN

            self.backlight_pin = digitalio.DigitalInOut(board.D17)
            self.backlight_pin.direction = Direction.OUTPUT
            self.backlight_pin.value = True
        except Exception as e:
            print(f"PIR init error: {e}")

    def start_background_threads(self):
        """Start sensor reading and display update threads"""
        self.sensor_thread = SensorReadingThread(self.data_queue, self.stop_event)
        self.sensor_thread.start()

    def draw_initial_ui(self):
        """Draw blank/placeholder UI immediately"""
        image = Image.new('RGB', (self.width, self.height), color=(240, 240, 240))
        draw = ImageDraw.Draw(image)

        try:
            font_large = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
        except:
            font_large = ImageFont.load_default()

        draw.text((self.width//2 - 100, self.height//2 - 50), "Loading...", fill=(100, 100, 100), font=font_large)

        self.display.image(image)

    def render_slide_1(self, readings):
        """Slide 1: Summary with monthly bill and energy"""
        image = Image.new('RGB', (self.width, self.height), color=(230, 230, 235))
        draw = ImageDraw.Draw(image)

        try:
            font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 56)
            font_label = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 24)
            font_value = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 72)
            font_small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 18)
        except:
            font_title = font_label = font_value = font_small = ImageFont.load_default()

        # Header
        draw.text((30, 30), "Energy Monitor", fill=(30, 30, 30), font=font_title)

        now = datetime.now()
        time_str = now.strftime("%H:%M:%S")
        date_str = now.strftime("%a, %b %d, %Y")

        draw.text((self.width - 250, 40), f"WiFi: Connected", fill=(80, 150, 200), font=font_label)
        draw.text((self.width - 250, 70), time_str, fill=(80, 80, 80), font=font_label)
        draw.text((self.width - 250, 100), date_str, fill=(100, 100, 100), font=font_small)

        if readings:
            total_energy = readings['energy_1'] + readings['energy_2'] + readings['energy_3']
            monthly_bill = total_energy * self.cost_rate

            # Left box: Monthly Bill
            draw.rectangle([30, 200, 230, 420], fill=(255, 255, 255), outline=(200, 200, 200), width=2)
            draw.text((40, 220), "Monthly Bill", fill=(100, 100, 100), font=font_label)
            draw.text((40, 280), f"{monthly_bill:.2f}", fill=(51, 102, 255), font=font_value)
            draw.text((40, 360), "PHP", fill=(80, 80, 80), font=font_label)

            # Right box: Total Energy
            draw.rectangle([250, 200, 450, 420], fill=(255, 255, 255), outline=(200, 200, 200), width=2)
            draw.text((260, 220), "Total Energy", fill=(100, 100, 100), font=font_label)
            draw.text((260, 280), f"{total_energy:.2f}", fill=(34, 177, 76), font=font_value)
            draw.text((260, 360), "kWh", fill=(80, 80, 80), font=font_label)
        else:
            draw.text((40, 280), "---", fill=(200, 200, 200), font=font_value)
            draw.text((260, 280), "---", fill=(200, 200, 200), font=font_value)

        # Footer with circuit summary
        draw.rectangle([30, 480, 450, 650], fill=(255, 255, 255), outline=(180, 180, 180), width=1)

        if readings:
            circuit_y = 500
            circuits = [
                ('C1', readings['energy_1']),
                ('C2', readings['energy_2']),
                ('C3', readings['energy_3']),
            ]
            for label, energy in circuits:
                draw.text((50 + circuits.index((label, energy)) * 140, circuit_y), f"{label}: {energy:.2f} kWh", fill=(80, 80, 80), font=font_label)

            cost_rate_y = circuit_y + 80
            draw.text((50, cost_rate_y), f"Rate: {self.cost_rate:.2f} PHP/kWh", fill=(100, 100, 100), font=font_label)

        self.display.image(image)

    def render_slide_2(self, readings):
        """Slide 2: System totals"""
        image = Image.new('RGB', (self.width, self.height), color=(220, 235, 250))
        draw = ImageDraw.Draw(image)

        try:
            font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
            font_label = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
            font_value = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
        except:
            font_title = font_label = font_value = ImageFont.load_default()

        draw.text((30, 30), "System Totals", fill=(30, 60, 120), font=font_title)

        if readings:
            total_power = readings['power_1'] + readings['power_2'] + readings['power_3']
            total_current = readings['current_1'] + readings['current_2'] + readings['current_3']
            avg_voltage = (readings['voltage_1'] + readings['voltage_2'] + readings['voltage_3']) / 3
            total_energy = readings['energy_1'] + readings['energy_2'] + readings['energy_3']
            avg_pf = (readings['power_factor_1'] + readings['power_factor_2'] + readings['power_factor_3']) / 3

            metrics = [
                (f"Power: {total_power:.1f} W", 100),
                (f"Current: {total_current:.2f} A", 200),
                (f"Voltage: {avg_voltage:.1f} V", 300),
                (f"Energy: {total_energy:.2f} kWh", 400),
                (f"Power Factor: {avg_pf:.3f}", 500),
            ]

            for metric, y in metrics:
                draw.text((50, y), metric, fill=(40, 40, 80), font=font_value)

    def render_slide_3(self, readings):
        """Slide 3: Circuit 1 details"""
        self.render_circuit_slide(readings, 1, (255, 240, 240), (200, 100, 100))

    def render_slide_4(self, readings):
        """Slide 4: Circuit 2 details"""
        self.render_circuit_slide(readings, 2, (255, 250, 220), (200, 150, 50))

    def render_slide_5(self, readings):
        """Slide 5: Circuit 3 details"""
        self.render_circuit_slide(readings, 3, (220, 245, 250), (100, 150, 200))

    def render_circuit_slide(self, readings, circuit_num, bg_color, accent_color):
        """Generic circuit slide renderer"""
        image = Image.new('RGB', (self.width, self.height), color=bg_color)
        draw = ImageDraw.Draw(image)

        try:
            font_title = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 48)
            font_label = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 20)
            font_value = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 40)
        except:
            font_title = font_label = font_value = ImageFont.load_default()

        draw.text((30, 30), f"Circuit {circuit_num}", fill=(30, 30, 30), font=font_title)

        if readings:
            prefix = f'_circuit{circuit_num}' if circuit_num == 1 else ''
            voltage = readings.get(f'voltage_{circuit_num}', 0)
            current = readings.get(f'current_{circuit_num}', 0)
            power = readings.get(f'power_{circuit_num}', 0)
            energy = readings.get(f'energy_{circuit_num}', 0)
            pf = readings.get(f'power_factor_{circuit_num}', 0)

            metrics = [
                (f"Voltage: {voltage:.1f} V", 120),
                (f"Current: {current:.2f} A", 200),
                (f"Power: {power:.1f} W", 280),
                (f"Energy: {energy:.2f} kWh", 360),
                (f"Power Factor: {pf:.3f}", 440),
            ]

            for metric, y in metrics:
                draw.text((50, y), metric, fill=accent_color, font=font_value)

        self.display.image(image)

    def handle_touch_input(self):
        """Handle touch screen input for slide navigation"""
        pass

    def handle_pir_sensor(self):
        """Handle PIR sensor for backlight control"""
        try:
            if self.pir_pin.value:
                self.pir_active = True
                self.backlight_pin.value = True
                self.backlight_off_time = time.time() + 300
            elif self.pir_active and time.time() > self.backlight_off_time:
                self.backlight_pin.value = False
                self.pir_active = False
        except Exception as e:
            print(f"PIR handler error: {e}")

    def update_display(self):
        """Main display update loop"""
        slides = [
            self.render_slide_1,
            self.render_slide_2,
            self.render_slide_3,
            self.render_slide_4,
            self.render_slide_5,
        ]

        while not self.stop_event.is_set():
            try:
                while not self.data_queue.empty():
                    msg_type, data = self.data_queue.get_nowait()
                    if msg_type == 'sensor_data':
                        self.current_readings = data

                slides[self.current_slide](self.current_readings)
                self.handle_pir_sensor()
                time.sleep(0.5)

            except Exception as e:
                print(f"Display update error: {e}")
                time.sleep(1)

    def run(self):
        """Start the display controller"""
        print("Initializing Smart Metering Display System...")

        self.draw_initial_ui()
        print("UI initialized with placeholder")

        self.init_pir_sensor()
        self.start_background_threads()
        print("Background threads started")

        try:
            self.update_display()
        except KeyboardInterrupt:
            print("Shutting down...")
            self.stop_event.set()
            if self.sensor_thread:
                self.sensor_thread.join(timeout=5)


if __name__ == '__main__':
    controller = DisplayController()
    controller.run()
