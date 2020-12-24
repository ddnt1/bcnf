import { base32_encode } from "./base32.js"
import { qrcode } from "./qrcode.js"
import AesCtr from './aes-ctr.js'

function parseInput(e) {
  hideAlert()

  const pin = document.getElementById("pin").value
  if (!!pin) {
    generateUsingPin(e)
  } else {
    generateUsingPlaintextSeed(e)
  }
}

function generateUsingPin(e) {
  const pin = document.getElementById("pin").value
  const encryptedSeed = document.getElementById("seed").value
  try {
    const decryptedSeed = AesCtr.decrypt(encryptedSeed, pin, 256).split(' ')[1]
    generateQrCode(decryptedSeed)
  } catch (e) {
    alert(e)
  }
}

function generateUsingPlaintextSeed(e) {
  const seed = document.getElementById("seed").value
  generateQrCode(seed)
}

function generateQrCode(plaintextSeed) {
  const qr = qrcode(0, "M")
  try {
    const seedBase32Encoded = base32_encode(plaintextSeed)

    qr.addData(`otpauth://totp/BROU:Cuenta?secret=${seedBase32Encoded}&issuer=BROU&digits=6&period=40&algorithm=SHA1`)
    qr.make()
    document.getElementById("qrcode").innerHTML = qr.createSvgTag()
  } catch (e) {
    alert(e)
  }
}

function hideAlert(message) {
  document.getElementById("alert").classList.remove("d-none")
  document.getElementById("alert").classList.add("d-none")
}

function alert(message) {
  document.getElementById("alert").textContent = message
  document.getElementById("alert").classList.remove("d-none")
}

document.getElementById("seed")
  .addEventListener("blur", parseInput)

document.getElementById("seed")
  .addEventListener("keydown", (e) => { if (e.key !== undefined ? e.key === 'Enter' : e.keyCode === 13) { generateQrCode() } })
