# 🧠 ChatterMind

**Mobil öncelikli AI sohbet uygulaması** - Next.js, Supabase, Framer Motion ve Groq kullanılarak geliştirilmiştir.  
Bu proje **feature-based (özellik tabanlı) mimari** ve **service layer deseni** kullanarak responsive UI, gerçek zamanlı sohyet yetenekleri, akıcı animasyonlar ve çoklu dil desteği sağlar.

---

## ✨ Özellikler
- 📱 **Mobil öncelikli** responsive tasarım
- 🔐 **Google ile Giriş** (Supabase Auth)
- ⚡ **Gerçek zamanlı sohbet senkronizasyonu** (Supabase Realtime)
- 🧩 **Önceden tanımlı karakterler** (system prompts)
- 🤖 **Groq LLM entegrasyonu** (server-side proxy ile)
- 🌍 **Internationalization (i18n)** - `next-intl` ile çoklu dil desteği
- 🎞️ **Akıcı animasyonlar** (Framer Motion)
- 🎨 **Modern UI** (shadcn/ui ve Radix primitives)
- 🏗️ **Feature slice tasarımı** ve **Service layer mimarisi**

---

## 🧰 Teknoloji Stack'i
| Kategori       | Teknolojiler                        |
|----------------|------------------------------------|
| **Framework**  | Next.js (App Router)                |
| **Dil**        | TypeScript                          |
| **Styling**    | Tailwind CSS                        |
| **Backend**    | Supabase (Auth, Database, Realtime)|
| **AI / LLM**   | Groq API                            |
| **UI Library** | shadcn / Radix UI                   |
| **Animations** | Framer Motion                       |
| **i18n**       | next-intl                           |
| **Mimari**     | Feature Slice + Service Layer       |

---

## 🏗️ Proje Mimarisi

### Feature Slice Tasarımı
Proje feature-based (özellik tabanlı) yapı kullanır. Her özellik kendi içinde organize edilmiştir:

```
src/features/
├── auth/           # Kimlik doğrulama (login, register)
│   ├── components/ # Auth bileşenleri
│   ├── context/    # Auth Context Provider
│   └── hooks/      # Auth custom hooks
├── chat/           # Sohbet özellikleri
│   ├── components/ # Chat UI bileşenleri
│   ├── services/   # Chat servisleri (Supabase iletişimi)
│   ├── types/      # TypeScript tipleri
│   └── containers/ # Chat container bileşenleri
└── characters/     # Karakter yönetimi
    ├── components/ # Character UI bileşenleri
    ├── services/   # Character servisleri
    ├── data/       # Statik karakter verileri
    └── hooks/      # Character custom hooks
```

### Service Layer Pattern
Her feature kendi servislerini içerir. Servisler veritabanı ve dış API işlemlerini yönetir:

- **ChatService**: Sohbet ve mesaj işlemleri (`chatService.ts`)
- **CharacterService**: Karakter veri yönetimi (`characterService.ts`)
- **RealtimeService**: Gerçek zamanlı güncellemeler (`realtime.ts`)

---

## 🚀 Hızlı Başlangıç (Yerel Kurulum)

### 1️⃣ Depoyu klonlayın
```bash
git clone https://github.com/sertactoroz/chattermind.git
cd chattermind
```

### 2️⃣ Çevre değişkenlerini yapılandırın
`.env.local` dosyasını `.env.example` bazında oluşturun ve değerlerinizi doldurun:
```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
GROQ_API_KEY=
NEXT_PUBLIC_GROQ_BASE=
NEXT_PUBLIC_VERCEL_URL=
```

### 3️⃣ Bağımlılıkları yükleyin
```bash
npm install
```

### 4️⃣ Geliştirme sunucusunu başlatın
```bash
npm run dev
```

### 5️⃣ (İsteğe Bağlı) Supabase şemasını başlatın
```bash
psql < scripts/setup-supabase.sql
```

---

## 🌿 Git İş Akışı
Basit ama etkili bir branching stratejisi kullanıyoruz:  
- `main` → Stabil, production-ready kod  
- `dev` → Yeni özellikler için aktif geliştirme branch'i

### Önerilen Feature Branch İş Akışı
```bash
git checkout dev
git pull origin dev
git checkout -b feat/feature-adi
# özelliği implement et
git add .
git commit -m "feat(ozellik-adi): kısa açıklama"
git push -u origin feat/feature-adi
# PR aç -> dev
```

---

## 📂 Klasör Yapısı (src/)
```
src/
├── app/                # Next.js App Router sayfaları
├── components/         # Ortak UI bileşenleri (shadcn)
├── config/             # Konfigürasyon dosyaları
├── features/           # Feature-based modüller (auth, chat, characters)
│   ├── auth/          # Kimlik doğrulama
│   ├── chat/          # Sohbet işlevselliği
│   └── characters/    # Karakter yönetimi
├── i18n/               # Lokalizasyon kurulumu
├── lib/                # Supabase client'ları, utility fonksiyonları
├── scripts/            # Veritabanı kurulum scriptleri
└── styles/             # Global CSS stilleri
```

---

## ☕ Java Backend Oluşturma (Frontend ve Backend Ayrıştırma)

Frontend ve Backend'i ayırmak için şu adımları izleyebilirsiniz:

### 1. Proje Yapısı

```
chattermind/
├── frontend/           # Mevcut Next.js projesi
│   ├── src/
│   ├── package.json
│   └── ...
└── backend/            # Yeni Spring Boot projesi
    ├── src/
    │   ├── main/
    │   │   ├── java/
    │   │   │   └── com/chattermind/
    │   │   │       ├── ChattermindApplication.java
    │   │   │       ├── config/          # Konfigürasyonlar
    │   │   │       │   ├── SecurityConfig.java
    │   │   │       │   └── SupabaseConfig.java
    │   │   │       ├── domain/          # Domain modelleri
    │   │   │       │   ├── User.java
    │   │   │       │   ├── Chat.java
    │   │   │       │   └── Message.java
    │   │   │       ├── dto/             # Data Transfer Objects
    │   │   │       │   ├── AuthRequest.java
    │   │   │       │   ├── ChatRequest.java
    │   │   │       │   └── MessageRequest.java
    │   │   │       ├── features/        # Feature slice yapısı
    │   │   │       │   ├── auth/
    │   │   │       │   │   ├── service/
    │   │   │       │   │   │   ├── AuthService.java
    │   │   │       │   │   │   └── AuthServiceImpl.java
    │   │   │       │   │   ├── controller/
    │   │   │       │   │   │   └── AuthController.java
    │   │   │       │   │   └── repository/
    │   │   │       │   │       └── UserRepository.java
    │   │   │       │   ├── chat/
    │   │   │       │   │   ├── service/
    │   │   │       │   │   │   ├── ChatService.java
    │   │   │       │   │   │   ├── ChatServiceImpl.java
    │   │   │       │   │   │   └── RealtimeService.java
    │   │   │       │   │   ├── controller/
    │   │   │       │   │   │   └── ChatController.java
    │   │   │       │   │   └── repository/
    │   │   │       │   │       ├── ChatRepository.java
    │   │   │       │   │       └── MessageRepository.java
    │   │   │       │   └── character/
    │   │   │       │       ├── service/
    │   │   │       │       │   ├── CharacterService.java
    │   │   │       │       │   └── CharacterServiceImpl.java
    │   │   │       │       ├── controller/
    │   │   │       │       │   └── CharacterController.java
    │   │   │       │       └── repository/
    │   │   │       │           └── CharacterRepository.java
    │   │   │       ├── infrastructure/   # Dış servisler
    │   │   │       │   ├── groq/
    │   │   │       │   │   └── GroqClient.java
    │   │   │       │   └── supabase/
    │   │   │       │       └── SupabaseClient.java
    │   │   │       └── common/           # Ortak bileşenler
    │   │   │           ├── exceptions/
    │   │   │           │   └── GlobalExceptionHandler.java
    │   │   │           └── annotations/
    │   │   └── resources/
    │   │       └── application.yml
    │   └── pom.xml
```

### 2. Teknoloji Stack'i (Backend)

- **Framework**: Spring Boot 3.x
- **Dil**: Java 17+
- **Build Tool**: Maven veya Gradle
- **Database**: PostgreSQL (Supabase)
- **ORM**: Spring Data JPA
- **DI Framework**: Spring IoC (Inversify yerine)
- **Security**: Spring Security + JWT
- **API Documentation**: SpringDoc OpenAPI (Swagger)
- **Testing**: JUnit 5, Mockito

### 3. Maven Bağımlılıkları (pom.xml)

```xml
<dependencies>
    <!-- Spring Boot Starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
    
    <!-- PostgreSQL -->
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    
    <!-- JWT -->
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
    </dependency>
    
    <!-- Groq SDK / HTTP Client -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>
    
    <!-- Lombok -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    
    <!-- Swagger/OpenAPI -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
        <version>2.2.0</version>
    </dependency>
    
    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### 4. Uygulama Konfigürasyonu (application.yml)

```yaml
server:
  port: 8080

spring:
  application:
    name: chattermind-backend
  
  datasource:
    url: ${SUPABASE_JDBC_URL}
    username: ${SUPABASE_DB_USER}
    password: ${SUPABASE_DB_PASSWORD}
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect

  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: ${SUPABASE_ISSUER_URI}

groq:
  api-key: ${GROQ_API_KEY}
  base-url: ${GROQ_BASE_URL}

cors:
  allowed-origins:
    - http://localhost:3000
    - ${FRONTEND_URL}
```

### 5. Örnek Domain Model

```java
@Entity
@Table(name = "chats")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Chat {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @Column(name = "user_id")
    private UUID userId;
    
    @Column(name = "character_id")
    private String characterId;
    
    @Column(name = "title")
    private String title;
    
    @Column(name = "last_message")
    private String lastMessage;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL)
    private List<Message> messages;
}
```

### 6. Örnek Service Layer

```java
@Service
@Transactional
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {
    
    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final GroqClient groqClient;
    
    @Override
    public ChatDTO createChat(UUID userId, String characterId, String title) {
        Chat chat = new Chat();
        chat.setUserId(userId);
        chat.setCharacterId(characterId);
        chat.setTitle(title);
        chat.setCreatedAt(LocalDateTime.now());
        
        return ChatMapper.toDTO(chatRepository.save(chat));
    }
    
    @Override
    public MessageDTO addMessage(UUID chatId, String sender, String content) {
        Message message = new Message();
        message.setChatId(chatId);
        message.setSender(sender);
        message.setContent(content);
        message.setCreatedAt(LocalDateTime.now());
        
        Message saved = messageRepository.save(message);
        
        // Update chat last_message
        chatRepository.updateLastMessage(chatId, content);
        
        // If AI message, call Groq
        if ("ai".equals(sender)) {
            return generateAIResponse(chatId);
        }
        
        return MessageMapper.toDTO(saved);
    }
    
    private MessageDTO generateAIResponse(UUID chatId) {
        // Get chat history
        List<Message> history = messageRepository.findByChatIdOrderByCreatedAtAsc(chatId);
        
        // Call Groq API
        String aiResponse = groqClient.generateResponse(history);
        
        // Save AI response
        return addMessage(chatId, "ai", aiResponse);
    }
}
```

### 7. Örnek Controller

```java
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@CrossOrigin(origins = "${cors.allowed-origins}")
public class ChatController {
    
    private final ChatService chatService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ChatDTO>> getUserChats(@PathVariable UUID userId) {
        return ResponseEntity.ok(chatService.getUserChats(userId));
    }
    
    @PostMapping
    public ResponseEntity<ChatDTO> createChat(@RequestBody ChatRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(chatService.createChat(request.getUserId(), 
                                            request.getCharacterId(), 
                                            request.getTitle()));
    }
    
    @PostMapping("/{chatId}/message")
    public ResponseEntity<MessageDTO> addMessage(
            @PathVariable UUID chatId,
            @RequestBody MessageRequest request) {
        return ResponseEntity.ok(chatService.addMessage(chatId, 
                                                        request.getSender(), 
                                                        request.getContent()));
    }
}
```

### 8. Adım Adım Oluşturma

#### 8.1. Spring Boot Projesi Oluşturun

```bash
# Backend klasörü oluştur
mkdir backend
cd backend

# Maven ile Spring Boot projesi oluştur
curl https://start.spring.io/starter.zip \
  -d dependencies=web,data-jpa,security,validation,postgresql,lombok \
  -d type=maven-project \
  -d language=java \
  -d bootVersion=3.2.0 \
  -d baseDir=chattermind-backend \
  -o project.zip

unzip project.zip
cd chattermind-backend
```

#### 8.2. Proje Yapısını Oluşturun

```bash
mkdir -p src/main/java/com/chattermind/{config,domain,dto,features/{auth,chat,character}/{service,controller,repository},infrastructure/{groq,supabase},common/{exceptions,annotations}}
mkdir -p src/main/resources
mkdir -p src/test/java/com/chattermind
```

#### 8.3. Frontend API Çağrılarını Güncelleyin

Frontend'deki Supabase client çağrılarını REST API çağrılarıyla değiştirin:

```typescript
// Önceki (Supabase client)
import { supabase } from '@/lib/supabaseClient';
const res = await supabase.from('chats').select('*');

// Sonraki (REST API)
import { apiClient } from '@/lib/apiClient';
const res = await apiClient.get('/api/chat/user/' + userId);
```

### 9. Çalıştırma

#### Backend Başlatma
```bash
cd backend/chattermind-backend
mvn spring-boot:run
```
Backend: http://localhost:8080

#### Frontend Başlatma
```bash
cd frontend
npm run dev
```
Frontend: http://localhost:3000

### 10. API Dokümantasyonu

Swagger UI: http://localhost:8080/swagger-ui.html

---

## 🤝 Katkıda Bulunma
Pull request'leriniz memnuniyetle karşılanır!  
Büyük değişiklikler planlıyorsanız, lütfen önce bir issue açarak fikrinizi tartışın.

---

## ⚡ Lisans
MIT
