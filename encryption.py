from cryptography.fernet import Fernet

KEY = b'LQUsXdndU6Q5PQOtTPfxS97NjP0tVLaf_l_tXO1Yhmo='

cipher = Fernet(KEY)

def encrypt_data(data):
    return cipher.encrypt(data)

def decrypt_data(data):
    return cipher.decrypt(data)