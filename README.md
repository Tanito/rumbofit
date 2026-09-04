# Rumbo Fit

Base de la aplicación móvil de Rumbo Fit: autenticación con Firebase y una pantalla privada mínima. El proyecto usa Expo SDK 57, React Native 0.86, React 19.2.3, TypeScript estricto y Expo Router 57.0.18. La integración nativa requiere Node.js 22.13.x o superior y un Expo Development Build; no está pensada para Expo Go.

## Inicio rápido

1. Usá Node 22.13.x (por ejemplo, con `nvm`) y ejecutá `npm install`.
2. Copiá `.env.example` a `.env` y completá los valores de Firebase. Las variables `EXPO_PUBLIC_*` no son secretos: son la configuración pública del cliente.
3. En Firebase Console habilitá Email/Password, Google y Apple según corresponda.
4. Agregá los archivos nativos descargados de Firebase en `android/app/google-services.json` e `ios/GoogleService-Info.plist`. Están ignorados por Git.
5. Ejecutá `npx expo run:android` o `npx expo run:ios` para generar el Development Build.

## Configuración de proveedores

Para Google, agregá el Web client ID en `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`, registrá `com.rumbofit.app` en Firebase/Google Cloud y configurá SHA-1 y SHA-256 para cada variante Android (debug y release). En iOS, configurá el bundle identifier `com.rumbofit.app`, el Google URL scheme generado por `GoogleService-Info.plist` y el proveedor Google en Firebase.

Para Apple, habilitá Sign in with Apple en Apple Developer, activá el capability en el App ID `com.rumbofit.app`, configurá el Service ID/private key cuando Firebase Console lo solicite y verificá el relay privado de emails de Apple. Apple solo se muestra en iOS.

No se versionan credenciales ni archivos `google-services.json`/`GoogleService-Info.plist`. Si falta la configuración, la app sigue mostrando sus pantallas y devuelve un mensaje controlado; el login social no se presenta como un crash.

Los enlaces legales son placeholders configurables en `app.json` (`extra.termsUrl` y `extra.privacyUrl`) y deben reemplazarse antes de publicar.

## Comandos

```bash
npm run typecheck
npm run lint
npm run format
```

## Estructura

- `app/`: rutas Expo Router, separadas en `(auth)` y `(app)`.
- `components/`: layout, marca, campos y botones reutilizables.
- `context/`: estado y escucha de sesión.
- `services/firebase.ts`: capa desacoplada de Firebase Auth y proveedores nativos.
- `validation/`: esquemas Zod de los formularios.
- `theme/`: colores, tipografías, espaciado y radios centralizados.
- `assets/images/logo.png`: logo provisto para Rumbo Fit.
