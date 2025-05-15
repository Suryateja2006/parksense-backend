import qrcode

url = "https://4713-2001-4490-4c99-fc80-7d02-c46f-fe87-d314.ngrok-free.app"  

qr = qrcode.make(url)

qr.save("ngrok.png")

print("QR code saved as ngrok.png")
