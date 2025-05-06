import qrcode

# Use the Ngrok public URL, not localhost
url = " https://7c01-2409-40f0-1156-8354-a9a7-aeb-4968-7d04.ngrok-free.app"  # Replace with your actual Ngrok URL

# Generate the QR code
qr = qrcode.make(url)

# Save the QR code as an image
qr.save("ngrok.png")

print("✅ QR code saved as ngrok.png")
