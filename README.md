# Sağlık Günlüğü Mobil Uygulaması 🩺✨

**Sağlıklı yaşam yolculuğunuzda size rehberlik edecek kişisel asistanınız!** Bu modern ve kullanıcı dostu React Native (Expo) mobil uygulaması, günlük sağlık verilerinizi (kilo değişiminiz, uyku düzeniniz, su tüketiminiz, fiziksel aktiviteniz ve kalori alımınız gibi) zahmetsizce kaydetmenizi sağlar. Kayıtlı verileriniz üzerinden zaman içindeki ilerlemenizi **anlaşılır grafiklerle** analiz edebilir, kişisel profilinizi yönetebilir ve sağlık hedeflerinize ulaşma yolunda motivasyonunuzu artırabilirsiniz. Güvenliğiniz bizim için önemli; tüm verileriniz Firebase'in güçlü altyapısı kullanılarak **güvenli bir şekilde** saklanır ve yönetilir.

## 🚀 Uygulama Demosu

<p align="center">
  Uygulamanın akıcı arayüzünü ve temel işlevlerini gösteren kısa bir tanıtım:
  <br>
  *[Video/GIF Buraya Eklenecek]*
</p>

## ✨ Öne Çıkan Özellikler

Bu uygulama, sağlıklı alışkanlıklar edinmenize ve sürdürmenize yardımcı olmak için özenle tasarlandı:

* 👤 **Güvenli ve Kolay Kullanıcı Yönetimi:**
    * Firebase Authentication ile E-posta/Şifre kullanarak saniyeler içinde **kayıt olun** veya **giriş yapın**.
    * Şifrenizi mi unuttunuz? Entegre **şifre sıfırlama** özelliği ile hesabınıza yeniden erişin.
* 📝 **Zahmetsiz Veri Girişi (Günlük Kayıt):**
    * Minimalist ve sezgisel arayüzü kullanarak **uyku süresi**, **içilen su miktarı**, **atılan adım sayısı**, **alınan kalori** ve **güncel kilo** gibi verileri hızla ve kolayca kaydedin.
    * Pratik **artı/eksi butonları** sayesinde sayısal değerleri anında ayarlayın.
    * Kayıtlarınızın doğruluğu için, **geçmişe dönük tarih seçimi engellenmiştir**.
* 🗓️ **Detaylı ve Organize Kayıt Geçmişi (Günlük):**
    * Tüm sağlık kayıtlarınızı **en yeniden en eskiye** doğru sıralanmış olarak görüntüleyin.
    * Her bir kayıt kartında, o güne ait tüm verileri (kilo, uyku, su vb.) **özet halinde** görün.
* ✏️ **Esnek Kayıt Yönetimi:**
    * Hatalı girişleri veya değişen değerleri **kolayca düzenleyin**.
    * İstemediğiniz kayıtları, **güvenli onay mekanizması** ile kalıcı olarak silin.
* 📊 **Anlaşılır Veri Analizi (Grafikler):**
    * **Adım Sayısı, Uyku Süresi, Alınan Kalori, İçilen Su** veya **Kilo Değişimi** verilerini seçerek ilerlemenizi detaylı olarak inceleyin.
    * Verilerinizi **günlük**, **haftalık** veya **aylık** periyotlarda, modern ve okunaklı **çizgi grafikleri** üzerinde görselleştirin.
    * Sağlık trendlerinizi ve alışkanlıklarınızı kolayca fark ederek **bilinçli kararlar** verin.
* 👤 **Kişiselleştirilebilir Profil:**
    * Ad, soyad, kullanıcı adı, yaş ve kısa bir **bio** gibi kişisel bilgilerinizi görüntüleyin.
    * **Profili Düzenle** seçeneği ile bu bilgileri istediğiniz zaman güncelleyin.
    * Profil resminizi eklemek/değiştirmek için hazır altyapı (+ butonu).
    * Hesabınızdan **güvenli bir şekilde çıkış yapın**.
* 🎨 **Modern ve Akıcı Tasarım:**
    * Göze hoş gelen, minimalist ve estetik bir kullanıcı arayüzü.
    * `React Native Reanimated` ile pürüzsüz **animasyonlar** ve kullanıcı etkileşimleri.
    * `Expo Linear Gradient` ile canlı ve modern renk geçişleri.
    * `React Native Feather` ikonları ile zenginleştirilmiş, anlaşılır görsel dil.
* 📱 **Evrensel Uyumluluk (Çapraz Platform):**
    * Expo sayesinde, **tek bir kod tabanı** ile hem **iOS** hem de **Android** cihazlarda **native performansla** çalışır.

## 🛠️ Kullanılan Teknolojiler ve Kütüphaneler

Bu projenin kalbinde yer alan modern ve güçlü araçlar:

* **Çerçeve (Framework):** React Native (Expo Managed Workflow)
* **Dil:** TypeScript
* **Navigasyon:** React Navigation v6 (Stack Navigator, Bottom Tab Navigator)
* **Veritabanı & Kimlik Doğrulama:** Firebase (Firestore, Authentication)
* **UI & Animasyon:** React Native Reanimated v3, Expo Linear Gradient, React Native Feather
* **Grafikler:** React Native Chart Kit
* **Yardımcı Kütüphaneler:** React Native Picker Select, React Native Responsive Screen, React Native Safe Area Context, Expo Haptics, Expo Auth Session (Google Sign-In için temel)
* **Platform API'ları:** Expo Web Browser

## ⚙️ Kurulum ve Çalıştırma Kılavuzu (Başlangıç)

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
    * 
4.  **Uygulamayı Çalıştırın:**
    ```bash
    npx expo start
    ```
    * Telefonunuza **Expo Go** uygulamasını yükleyin (App Store / Google Play).
    * Expo Go'yu açın ve terminalde çıkan **QR kodu** taratarak uygulamayı başlatın.




---

Umarım bu daha detaylı README, projenizi en iyi şekilde temsil eder! Başka bir konuda yardıma ihtiyacınız olursa çekinmeyin.
