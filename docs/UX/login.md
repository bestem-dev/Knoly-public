# Moon UX
- Crear pin
- Wallet disponible

# Current UX
1. Index
2. Connect wallet **Integration Friction**
3. Sign Mesage **Integration Friction**
4. Register Basic data
5. Success
6. Edit user
7. User page
8. User can show qr code and be validated
9. User can scan qr codes and validate

# App wallet Ux
1. Index
   - Login Button
   - Register Button
     1. Pkey is created in background, stored in localStorage encrypted by a key on sessionStorage
     2. User is given 12 digit base64 encryption key and is prompted to save it
        - Omit
          - Go to 1.4
        - Custom save
          1. User is propted to write passwordin box to see if he has saved it.
        - Send to email
        - Save to
     3. KYC
        - Omit
        - PoH
        <!-- - Classic KYC -->
     4. Register Basic data, encrypted pkey is sent to server
     5. Sucess
     6. Edit user
2. If user ommited in 1.2 or 1.3, A banner is shown 
3. User page
4. If user has saved code: User can show qr code and be validated
5. If user has passed KYC: User can scan qr codes and validate

# Integrate Ux (No wallet in app)
1. Index
   - Login Button
     - Login with:
       - Google
       - Github
       <!-- - email and Password -->
       - Wallet
       - Email link
2. If user GOTO -> User Page
3. Register Basic data
4. Link profile or verify
   - Omit
   - PoH
   <!-- - Classic KYC -->
   - Wallet
   - Email
5. Sucess
6. Edit user
7. User page
8. User can show qr code and be validated
9. User can scan qr codes and validate
