# Sağlık Günlüğü Mobil Uygulaması 🩺✨

Selam! 👋 **Üniversite ikinci sınıf projesi olarak başladığım daha sonra geliştirmelerle GitHub'a taşınan** bu React Native (Expo) projesi, kişisel sağlık verilerinizi (kilo, uyku, su, adımlar, kalori) kolayca takip etmeniz ve anlamlı grafiklerle analiz etmeniz için geliştirildi. Firebase ile verileriniz saklanır. Sağlıklı yaşam hedeflerinize ulaşırken motivasyonunuzu yüksek tutmanıza yardımcı olmayı amaçlıyor!

## 🚀 Hızlı Bakış (Demo)

<p align="center">
  Uygulamanın arayüzü ve temel özelliklerini gösteren kısa bir video/gif:
  <br>
  *[Video/GIF Buraya Eklenecek]*
</p>

## ✨ Öne Çıkan Özellikler

* 🔐 **Güvenli Giriş/Kayıt:** E-posta veya Google ile kolayca hesap oluşturun/giriş yapın.
* ✍️ **Hızlı Kayıt:** Günlük uyku, su, adım, kalori ve kilo verilerinizi pratik arayüzle saniyeler içinde ekleyin.
* 📜 **Geçmişi Görüntüleyin:** Tüm kayıtlarınızı tarihe göre sıralı, anlaşılır kartlar üzerinde görün.
* ✏️ **Düzenleyin ve Silin:** Kayıtlarınızı kolayca güncelleyin veya kaldırın.
* 📊 **Analiz Edin:** Verilerinizi (Adım, Uyku, Kalori vb.) günlük, haftalık, aylık **çizgi grafikleriyle** görselleştirin ve trendleri keşfedin.
* 👤 **Profilinizi Yönetin:** Kişisel bilgilerinizi (ad, yaş, bio vb.) görüntüleyin ve güncelleyin.

## 🛠️ Kullanılan Araçlar

* **Platform:** React Native (Expo)
* **Dil:** TypeScript
* **Backend:** Firebase (Authentication & Firestore)
* **Navigasyon:** React Navigation
* **UI & Animasyon:** React Native Reanimated, Expo Linear Gradient, React Native Feather
* **Grafikler:** React Native Chart Kit
* **Yardımcılar:** Picker Select, Responsive Screen, Safe Area Context, Haptics

## ⚙️ Kurulum ve Çalıştırma Kılavuzu

Projeyi kendi geliştirme ortamınızda kurup denemek için aşağıdaki basit adımları izleyin:

1.  **Projeyi Bilgisayarınıza İndirin (Klonlayın):**
    ```bash
    git clone [https://github.com/](https://github.com/)<kullanici_adiniz>/<repo_adiniz>.git
    cd <repo_adiniz>
    ```
    *( `<kullanici_adiniz>` ve `<repo_adiniz>` kısımlarını kendi GitHub bilgilerinizle değiştirin)*

2.  **Gerekli Paketleri Yükleyin:**
    ```bash
    npm install
    # veya eğer yarn kullanıyorsanız:
    yarn install
    ```

3.  **Firebase Projenizi Bağlayın:**
    * Bir Firebase projesi oluşturun ([https://console.firebase.google.com/](https://console.firebase.google.com/)).
    * Projenizde **Authentication** (E-posta/Şifre ile girişi etkinleştirin) ve **Firestore Database** (Test modunda başlatabilirsiniz) servislerini aktif hale getirin.
    * Proje ayarlarından **web uygulamanızın** yapılandırma bilgilerini (apiKey, authDomain vb.) kopyalayın.
    * Projenizin ana dizininde `.env` adında bir dosya oluşturun.
    * Kopyaladığınız Firebase yapılandırma bilgilerini, aşağıdaki gibi `EXPO_PUBLIC_` ön ekini kullanarak `.env` dosyasına yapıştırın:
        ```env
        EXPO_PUBLIC_FIREBASE_API_KEY=SIZIN_API_ANAHTARINIZ
        EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=siz-proje-id.firebaseapp.com
        EXPO_PUBLIC_FIREBASE_PROJECT_ID=sizin-proje-id
        EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=sizin-proje-id.appspot.com
        EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
        EXPO_PUBLIC_FIREBASE_APP_ID=...
        ```
    * **Önemli:** `src/config/firebase.ts` dosyanızın bu `.env` değişkenlerini okuduğundan emin olun.

4.  **Uygulamayı Çalıştırın:**
    ```bash
    npx expo start
    ```
    * Telefonunuza **Expo Go** uygulamasını yükleyin (App Store / Google Play).
    * Expo Go'yu açın ve terminalde çıkan **QR kodu** taratarak uygulamayı başlatın.

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altındadır.

---

