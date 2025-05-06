import qrcode

# Use the Ngrok public URL, not localhost
url = "https://ddaf-2001-4490-4c99-fc80-7d02-c46f-fe87-d314.ngrok-free.app"  # Replace with your actual Ngrok URL

# Generate the QR code
qr = qrcode.make(url)

# Save the QR code as an image
qr.save("ngrok.png")

print("✅ QR code saved as ngrok.png")
