# traderei für iOS und Android

Capacitor-App mit derselben Supabase-Datenbank wie die Website. Kennung: `at.traderei.app`.
Die HTML-Oberfläche wird mit der App ausgeliefert. Änderungen auf Vercel verändern die installierte App nicht automatisch: nach Webänderungen synchronisieren, bauen und eine neue App-Version verteilen.

## Vorbereitung

Node.js >=22 installieren. In diesem Verzeichnis:

```sh
npm ci
npm run sync
npm run check
```

`npm run build` kopiert nur index.html, die drei Rechtstexte und assets aus dem Repository und ergänzt die native Integration. Niemals www von Hand bearbeiten. Es werden keine privaten Supabase-Schlüssel eingebaut.

## Android auf Windows

Android Studio mit dem zum Projekt passenden SDK installieren, das Projekt `mobile/android` öffnen (`npm run android`). Auf einem Android-Gerät mit USB-Debugging oder einem Emulator starten. Für einen lokalen Test: Gradle-Aufgabe `assembleDebug`. Zum Hochladen: Build > Generate Signed App Bundle, eigenen Keystore anlegen und sicher außerhalb von Git aufbewahren. Paketkennung vor dem ersten Store-Upload endgültig festlegen.

## iOS

Mac mit der für Capacitor 8 erforderlichen Xcode-Version verwenden, `npm ci` und `npm run ios`. In Xcode unter Signing & Capabilities dein Apple-Entwicklerteam auswählen und die Bundle-ID bestätigen. Zuerst auf Simulator und iPhone testen. Danach Product > Archive und über Organizer nach App Store Connect/TestFlight hochladen. Das Projekt verwendet Swift Package Manager.

## Eingebaute mobile Integration

- Native Standortabfrage, nur nach Benutzeraktion; keine Hintergrundortung.
- Native Fotoauswahl für Inserate (bis 3) und Profilbild (1). Vorhandene Größenlimits bleiben aktiv.
- Externe HTTPS-Links und Rechtstexte öffnen im System-Browserfenster.
- Android-Zurück schließt Dialoge, dann Menüs, führt zur Startseite und minimiert dort die App.
- Bestehende Cookie-Auswahl bleibt aktiv; Karten werden erst nach Freigabe geladen.
- Registrierung: Bestätigung auf `https://www.traderei.at`, anschließend Login in der App. In Supabase Authentication > URL Configuration muss diese URL als erlaubtes Redirect-Ziel hinterlegt sein. Ohne diese Einstellung wird ggf. auf die konfigurierte Site URL zurückgeleitet. Noch keine automatische Rückkehr vom E-Mail-Link in die App.

## Vor der Store-Einreichung noch offen

Dies ist eine technische Testversion, keine freigegebene Store-Version.

- Signierung mit eigenen Apple-/Google-Konten; Geräte- und Emulatorprüfung.
- Konto innerhalb der App löschen können, bei Google zusätzlich öffentlich erreichbaren Löschweg anbieten. Daten-/Aufbewahrungsregeln und Backend-Löschung zuerst umsetzen und prüfen.
- Meldungen, Nutzerblockierung und Moderation für Inserate/Chats tatsächlich Ende zu Ende prüfen. Ein sichtbarer Menüpunkt allein genügt nicht.
- Datenschutztexte um die tatsächlichen mobilen Berechtigungen und SDKs ergänzen; App Privacy / Data Safety wahrheitsgemäß ausfüllen.
- Screenshots, Support-URL, Alterseinstufung, Review-Testkonto erstellen. Bei entsprechenden neuen persönlichen Google-Konten geschlossenen Test mit mindestens 12 Testern über 14 zusammenhängende Tage abschließen.
- Push-Benachrichtigungen sind noch nicht eingebaut.
- CSV-Vorlagen-Download verwendet bisher einen Browser-Blob-Download; in der nativen App noch mit Dateisystem-/Teilen-Funktion ergänzen. Händler können die Vorlage vorerst über die Website herunterladen.

## Prüfliste auf Geräten

Anmelden/abmelden, Registrierung und E-Mail-Bestätigung, Inserat erstellen/bearbeiten, drei Fotos wählen/ersetzen, Avatar, Standort erlauben/ablehnen, manuelle Ortswahl, Cookie-Auswahl/widerrufen, Karten, Händler, CSV-Dateiauswahl, Chats, Tastatur, Zurück-Taste, externe Links und Offline-/Netzwerkfehler prüfen. App-Neustart muss die Sitzung beibehalten.

Dokumentation: https://capacitorjs.com/docs/ • https://developer.apple.com/app-store/review/guidelines/ • https://support.google.com/googleplay/android-developer/answer/14151465
