
export const translations: any = {
  es: {
    nav: {
      home: "Inicio",
      services: "Servicios",
      advisor: "Agente Virtual",
      about: "Nosotros",
      contact: "Contacto",
      myAccount: "Mi Cuenta",
      myProfile: "Mi Perfil",
      myAppointments: "Mis Citas",
      signOut: "Cerrar Sesión",
      admin: "Admin"
    },
    admin: {
      title: "Panel de Control",
      subtitle: "GESTIÓN DE CONTENIDO",
      accessTitle: "Acceso Administrativo",
      accessDesc: "Ingresa la llave maestra para obtener privilegios de administrador.",
      accessPlaceholder: "Contraseña larga de administrador...",
      accessButton: "Validar Llave",
      accessSuccess: "¡Acceso concedido!",
      accessError: "Llave incorrecta. Acceso denegado.",
      imagesTab: "Imágenes",
      pricesTab: "Precios",
      imagesTitle: "Gestión de Imágenes",
      imagesDesc: "Cambia las imágenes de cualquier sección pegando una nueva URL.",
      pricesTitle: "Gestión de Precios",
      pricesDesc: "Ajusta los costos de los servicios en tiempo real.",
      imageLabel: "Nueva URL de Imagen",
      save: "Actualizar",
      saving: "Actualizando...",
      section: "Sección",
      preview: "Vista Previa",
      logout: "Salir del Panel"
    },
    hero: {
      title: "Eleva tu Bienestar",
      subtitle: "BONANZA ARTE & BIENESTAR",
      description: "Descubre un santuario de paz interior a través de nuestros masajes faciales y terapias de sound healing.",
      cta: "Agenda tu Cita"
    },
    about: {
      subtitle: "Nuestra Esencia",
      title: "Santuario de Paz Interior",
      desc1: "Bonanza es un ecosistema dedicado al arte del bienestar integral, diseñado para fomentar el autodescubrimiento y las conexiones significativas. Unimos nuestra red de terapeutas certificados para ofrecer experiencias transformadoras directamente en hoteles, villas privadas y nuestro propio santuario físico.",
      desc2: "Nuestra filosofía se basa en la co-creación, la resonancia empática y la sostenibilidad del alma, honrando los ritmos naturales de cada ser para elevar el espíritu y restaurar la armonía."
    },
    home: {
      facial: {
        subtitle: "TÉCNICAS ANCESTRALES",
        title: "Masajes Holísticos",
        description: "Rejuvenece tu piel y libera tensiones con nuestros masajes faciales personalizados. Utilizamos técnicas que combinan drenaje linfático, reflexología y aromaterapia para una piel radiante y una relajación profunda.",
        button: "Ver Menú"
      },
      sound: {
        subtitle: "Vibraciones que Sanan",
        title: "Terapia de Sound Healing",
        description: "Sumérgete en un baño de sonidos armónicos con cuencos tibetanos y otros instrumentos. Sesiones disponibles todos los días a las 7:30 AM y 8:00 PM para un equilibrio total.",
        button: "Reservar Sesión"
      }
    },
    services: {
      title: "Nuestras Experiencias",
      subtitle: "BIENESTAR PREMIUM",
      desc: "Cada tratamiento es un ritual personalizado diseñado para restaurar tu armonía interior.",
      min: "min"
    },
    massages: {
      purification: {
        title: "Purificación Sutil",
        sub: "Drenaje",
        desc: "Movimientos suaves para reducir inflamación y dar ligereza.",
        prices: [
          { amount: 900, duration: 60, paymentLink: "https://buy.stripe.com/6oU8wIgnG46C0whf5z3oA04" },
          { amount: 1100, duration: 90, paymentLink: "https://buy.stripe.com/7sY9AM7Ra46CceZf5z3oA05" }
        ]
      },
      fluidity: {
        title: "Fluidez Esencial",
        sub: "Sueco",
        desc: "Movimientos continuos para soltar tensión y dar calma profunda.",
        prices: [
            { amount: 800, duration: 60, paymentLink: "https://buy.stripe.com/00wfZa3AU5aG2Ep6z33oA01" },
            { amount: 1000, duration: 90, paymentLink: "https://buy.stripe.com/5kQ7sEefy7iO5QBe1v3oA02" }
        ]
      },
      release: {
        title: "Liberación de Tensión",
        sub: "Tejido Profundo",
        desc: "Técnica profunda para alivio de tensión muscular rígida.",
        prices: [
            { amount: 900, duration: 60, paymentLink: "https://buy.stripe.com/00w28k5J2dHc3It3mR3oA09" },
            { amount: 1100, duration: 90, paymentLink: "https://buy.stripe.com/00w28k6N60Uqgvf1eJ3oA0a" }
        ]
      },
      awakening: {
        title: "Despertar Vital",
        sub: "Quiromasaje",
        desc: "Manos intuitivas que liberan emociones en espalda y hombros.",
        prices: [
            { amount: 800, duration: 60, paymentLink: "https://buy.stripe.com/dRmeV68Ve1Yu2Epf5z3oA07" },
            { amount: 1000, duration: 90, paymentLink: "https://buy.stripe.com/00w28k5J2dHc3It3mR3oA09" }
        ]
      },
      reset: {
        title: "Re-inicia tu Mente",
        sub: "Cráneo Facial",
        desc: "Tratamiento profundo para disolver tensiones arraigadas.",
        prices: [
            { amount: 700, duration: 60, paymentLink: "https://buy.stripe.com/aFa6oAdbu1Yufrb4qV3oA06" }
        ]
      },
      sculpt: {
        title: "Moldea tu figura",
        sub: "Reductivo",
        desc: "Masaje intenso para activar el cuerpo y definir figura.",
        prices: [
            { amount: 900, duration: 60, paymentLink: "https://buy.stripe.com/00w3coefyav04Mx6z33oA03" }
        ]
      }
    },
    ai: {
      title: "Tu Oráculo Digital",
      desc: "Dinos cómo te sientes y nuestra sabiduría artificial revelará el ritual que tu alma necesita hoy.",
      placeholder: "Ej: 'Me siento con mucha carga mental y tensión en el cuello'...",
      cta: "Consultar Sabiduría IA",
      ritual: "Ritual Revelado",
      purpose: "Propósito del Ritual",
      intuition: "Nuestra Intuición",
      next: "Profundiza en tu bienestar",
      error: "Nuestros canales de IA están experimentando alta vibración. Por favor, intenta de nuevo.",
      menuCta: "Explorar Detalles en Menú"
    },
    contact: {
      title: "Agenda Tu Experiencia",
      desc: "Inicia tu viaje hacia el bienestar profundo. Elige tu fecha ideal.",
      bannerTitle: "Sesiones de Sound Healing",
      bannerDesc: "Sesiones todos los días a las 7:30 AM y 8:00 PM",
      whatsapp: "Reservar por WhatsApp",
      location: "Nuestra Ubicación",
      name: "Tu Nombre",
      contactInfo: "Correo o Número de contacto",
      when: "¿Cuándo quieres visitarnos?",
      selectDate: "Selecciona una fecha",
      session: "Sesión Preferida",
      morning: "Mañana",
      evening: "Noche",
      message: "Mensaje o Preferencias",
      messagePlaceholder: "Cuéntanos sobre lo que buscas...",
      security: "PROTECCIÓN HUMANA ACTIVA",
      submit: "Solicitar Disponibilidad"
    },
    auth: {
      title: "Mi Cuenta",
      description: "Inicia sesión para gestionar tus citas.",
      loginTab: "Ingresar",
      registerTab: "Registrarse",
      email: "Correo electrónico",
      password: "Contraseña",
      name: "Nombre completo",
      loginButton: "Entrar",
      registerButton: "Crear Cuenta",
      successLoginTitle: "¡Bienvenido de nuevo!",
      successLoginDesc: "Has iniciado sesión correctamente.",
      errorLoginTitle: "Error al iniciar sesión",
      errorLoginDesc: "Credenciales incorrectas.",
      successRegisterTitle: "¡Cuenta creada!",
      successRegisterDesc: "Bienvenido a Bonanza.",
      errorRegisterTitle: "Error al registrarse",
      errorRegisterDesc: "No se pudo crear la cuenta.",
      forgotPassword: "¿Olvidaste tu contraseña?",
      resetTitle: "Recuperar Contraseña",
      resetDesc: "Ingresa tu email para recibir un enlace de recuperación.",
      sendReset: "Enviar Enlace",
      resetSuccess: "Enlace enviado. Revisa tu correo.",
      newPassword: "Nueva Contraseña",
      confirmNewPassword: "Confirmar Contraseña",
      updatePassword: "Actualizar Contraseña",
      passwordSuccess: "Contraseña actualizada.",
      passwordError: "Hubo un error.",
      matchError: "Las contraseñas no coinciden."
    },
    profile: {
      title: "Mi Perfil",
      subtitle: "GESTIÓN DE CUENTA",
      desc: "Mantén tu información actualizada.",
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Correo Electrónico (No editable)",
      phone: "Teléfono de Contacto",
      save: "Guardar Cambios",
      saving: "Guardando...",
      success: "Perfil actualizado",
      successDesc: "Tus datos se han guardado correctamente.",
      error: "Error al actualizar",
      errorDesc: "No se pudo actualizar el perfil.",
      noAuth: "Debes iniciar sesión para ver tu perfil."
    },
    appointments: {
      title: "Mis Citas",
      subtitle: "HISTORIAL Y RESERVAS",
      desc: "Consulta el estado de tus rituales.",
      upcoming: "Próximas",
      history: "Historial",
      noUpcoming: "No tienes citas próximas.",
      noHistory: "Aún no has completado ninguna sesión.",
      bookNow: "Agendar ahora",
      status: {
        pending: "Pendiente",
        processing: "En proceso",
        shipped: "Confirmada",
        delivered: "Completada",
        cancelled: "Cancelada"
      },
      date: "Fecha",
      total: "Total",
      details: "Detalles"
    },
    footer: {
      newsletter: "Newsletter",
      newsDesc: "Recibe noticias y promociones.",
      subscribe: "Suscribir",
      nav: "Navegación",
      legal: "Legal",
      rights: "Todos los derechos reservados.",
      menu: "Menú"
    },
    legal: {
      terms: {
        title: "Términos y Condiciones",
        s1_title: "1. Aceptación de los Términos",
        s1_desc: "Al acceder y utilizar este sitio web y los servicios de Bonanza Arte & Bienestar, usted acepta cumplir con estos términos. Nuestros servicios están destinados exclusivamente para fines de relajación y bienestar holístico.",
        s2_title: "2. Reservas y Cancelaciones",
        s2_desc: "Toda reserva está sujeta a disponibilidad. Las cancelaciones deben realizarse con al menos 24 horas de antelación para permitir la reasignación del espacio. Las sesiones de Sound Healing tienen horarios fijos (7:30 AM y 8:00 PM).",
        s3_title: "3. Pagos y Seguridad (Stripe)",
        s3_desc: "Para su seguridad, todos los pagos con tarjeta de crédito o débito se procesan a través de la plataforma externa Stripe. Bonanza Arte & Bienestar no almacena ni tiene acceso a los datos completos de su tarjeta. Al realizar un pago, usted acepta también los términos de servicio de Stripe.",
        s4_title: "4. Política de Reembolsos",
        s4_desc: "Los reembolsos se evaluarán caso por caso. En caso de no asistir a una cita confirmada sin aviso previo, Bonanza se reserva el derecho de no realizar la devolución del importe pagado.",
        s5_title: "5. Salud y Responsabilidad",
        s5_desc: "Es responsabilidad del cliente informar sobre cualquier condición médica, alergia o embarazo antes de iniciar un masaje o terapia. Nuestros tratamientos no sustituyen el asesoramiento médico profesional.",
        updated: "Última actualización: Marzo 2024"
      },
      privacy: {
        title: "Política de Privacidad",
        s1_title: "1. Recopilación de Datos",
        s1_desc: "Recopilamos información personal básica (nombre, correo, teléfono) únicamente para gestionar sus reservas y mejorar su experiencia en Bonanza.",
        s2_title: "2. Uso de la Información",
        s2_desc: "Sus datos no se venden ni comparten con terceros con fines publicitarios. Los utilizamos exclusivamente para confirmaciones de citas y, si usted lo autoriza, envío de nuestro boletín de bienestar.",
        s3_title: "3. Procesamiento de Pagos Seguro",
        s3_desc: "Utilizamos Stripe para procesar pagos de forma segura. Stripe recopila información necesaria para completar la transacción bajo sus propios estándares de seguridad PCI-DSS. Puede consultar la política de privacidad de Stripe para más detalles.",
        s4_title: "4. Derechos del Usuario",
        s4_desc: "Usted tiene derecho a solicitar el acceso, corrección o eliminación de sus datos personales de nuestra base de datos en cualquier momento a través de nuestro formulario de contacto.",
        s5_title: "5. Cookies",
        s5_desc: "Utilizamos cookies esenciales para el funcionamiento técnico del sitio y para recordar sus preferencias de idioma, asegurando una navegación fluida.",
        updated: "Última actualización: Marzo 2024"
      }
    }
  },
  en: {
    nav: {
      home: "Home",
      services: "Services",
      advisor: "Virtual Agent",
      about: "About Us",
      contact: "Contact",
      myAccount: "My Account",
      myProfile: "My Profile",
      myAppointments: "My Appointments",
      signOut: "Sign Out",
      admin: "Admin"
    },
    admin: {
      title: "Control Panel",
      subtitle: "CONTENT MANAGEMENT",
      accessTitle: "Administrative Access",
      accessDesc: "Enter the master key.",
      accessPlaceholder: "Long admin password...",
      accessButton: "Validate Key",
      accessSuccess: "Access granted!",
      accessError: "Incorrect key.",
      imagesTab: "Images",
      pricesTab: "Prices",
      imagesTitle: "Image Management",
      pricesTitle: "Price Management",
      imageLabel: "New Image URL",
      save: "Update",
      saving: "Updating...",
      logout: "Exit Panel"
    },
    hero: {
      title: "Elevate Your Well-being",
      subtitle: "BONANZA ART & WELLNESS",
      description: "Discover a sanctuary of inner peace through our holistic facial massages and sound healing therapies.",
      cta: "Book Your Appointment"
    },
    about: {
      subtitle: "Our Essence",
      title: "Sanctuary of Inner Peace",
      desc1: "Bonanza is an ecosystem dedicated to the art of holistic well-being, designed to foster self-discovery and meaningful connections. We unite our network of top-tier certified therapists to provide transformative experiences in hotels, private villas, and our own physical sanctuary.",
      desc2: "Our identity is built on co-creation, empathic resonance, and 'Soul Sustainability', honoring natural rhythms to elevate the spirit and restore harmony."
    },
    home: {
      facial: {
        subtitle: "ANCIENT TECHNIQUES",
        title: "Holistic Massages",
        description: "Rejuvenate your skin and release tension with our customized facial massages. We use techniques combining lymphatic drainage, reflexology, and aromatherapy for radiant skin and deep relaxation.",
        button: "View Menu"
      },
      sound: {
        subtitle: "Healing Vibrations",
        title: "Sound Healing Therapy",
        description: "Immerse yourself in a harmonic sound bath with Tibetan bowls and other instruments. Sessions available daily at 7:30 AM and 8:00 PM for total balance.",
        button: "Book Session"
      }
    },
    services: {
      title: "Our Experiences",
      subtitle: "PREMIUM WELLNESS",
      desc: "Every treatment is a customized ritual designed to restore your inner harmony.",
      min: "min"
    },
    massages: {
      purification: {
        title: "Subtle Purification",
        sub: "Drainage",
        desc: "Gentle movements to reduce inflammation and provide lightness.",
        prices: [
          { amount: 900, duration: 60, paymentLink: "https://buy.stripe.com/6oU8wIgnG46C0whf5z3oA04" },
          { amount: 1100, duration: 90, paymentLink: "https://buy.stripe.com/7sY9AM7Ra46CceZf5z3oA05" }
        ]
      },
      fluidity: {
        title: "Essential Fluidity",
        sub: "Swedish",
        desc: "Continuous movements to release tension and provide deep calm.",
        prices: [
            { amount: 800, duration: 60, paymentLink: "https://buy.stripe.com/00wfZa3AU5aG2Ep6z33oA01" },
            { amount: 1000, duration: 90, paymentLink: "https://buy.stripe.com/5kQ7sEefy7iO5QBe1v3oA02" }
        ]
      },
      release: {
        title: "Tension Release",
        sub: "Deep Tissue",
        desc: "Deep technique for rigid muscle areas relief.",
        prices: [
            { amount: 900, duration: 60, paymentLink: "https://buy.stripe.com/00w28k5J2dHc3It3mR3oA09" },
            { amount: 1100, duration: 90, paymentLink: "https://buy.stripe.com/00w28k6N60Uqgvf1eJ3oA0a" }
        ]
      },
      awakening: {
        title: "Vital Awakening",
        sub: "Chiromassage",
        desc: "Intuitive hands releasing emotions in back and shoulders.",
        prices: [
            { amount: 800, duration: 60, paymentLink: "https://buy.stripe.com/dRmeV68Ve1Yu2Epf5z3oA07" },
            { amount: 1000, duration: 90, paymentLink: "https://buy.stripe.com/00w28k5J2dHc3It3mR3oA09" }
        ]
      },
      reset: {
        title: "Mind Reset",
        sub: "Craniofacial",
        desc: "Profound treatment to dissolve deep-seated tensions.",
        prices: [
            { amount: 700, duration: 60, paymentLink: "https://buy.stripe.com/aFa6oAdbu1Yufrb4qV3oA06" }
        ]
      },
      sculpt: {
        title: "Body Sculpting",
        sub: "Reductive",
        desc: "Intense massage to activate the body and define figure.",
        prices: [
            { amount: 900, duration: 60, paymentLink: "https://buy.stripe.com/00w3coefyav04Mx6z33oA03" }
        ]
      }
    },
    ai: {
      title: "Your Digital Oracle",
      desc: "Tell us how you feel and our artificial wisdom will reveal the ritual your soul needs today.",
      placeholder: "E.g.: 'I feel a lot of mental load and neck tension'...",
      cta: "Consult AI Wisdom",
      ritual: "Ritual Revealed",
      purpose: "Ritual Purpose",
      intuition: "Our Intuition",
      next: "Deepen your well-being",
      error: "Our AI channels are experiencing high vibration. Please try again.",
      menuCta: "Explore Details in Menu"
    },
    contact: {
      title: "Book Your Experience",
      desc: "Begin your journey towards deep well-being. Choose your ideal date.",
      bannerTitle: "Sound Healing Sessions",
      bannerDesc: "Sessions every day at 7:30 AM and 8:00 PM",
      whatsapp: "Book via WhatsApp",
      location: "Our Location",
      name: "Your Name",
      contactInfo: "Email or Contact Number",
      when: "When do you want to visit?",
      selectDate: "Select a date",
      session: "Preferred Session",
      morning: "Morning",
      evening: "Evening",
      message: "Message or Preferences",
      messagePlaceholder: "Tell us what you're looking for...",
      security: "ACTIVE HUMAN PROTECTION",
      submit: "Request Availability"
    },
    auth: {
      title: "My Account",
      description: "Log in to manage your appointments.",
      loginTab: "Login",
      registerTab: "Register",
      email: "Email address",
      password: "Password",
      name: "Full name",
      loginButton: "Sign In",
      registerButton: "Create Account",
      successLoginTitle: "Welcome back!",
      successLoginDesc: "You have successfully logged in.",
      errorLoginTitle: "Login Error",
      errorLoginDesc: "Incorrect credentials.",
      successRegisterTitle: "Account Created!",
      successRegisterDesc: "Welcome to Bonanza.",
      errorRegisterTitle: "Registration Error",
      errorRegisterDesc: "Could not create account.",
      forgotPassword: "Forgot your password?",
      resetTitle: "Reset Password",
      resetDesc: "Enter your email for a recovery link.",
      sendReset: "Send Link",
      resetSuccess: "Link sent. Check your email.",
      newPassword: "New Password",
      confirmNewPassword: "Confirm Password",
      updatePassword: "Update Password",
      passwordSuccess: "Password updated.",
      passwordError: "There was an error.",
      matchError: "Passwords do not match."
    },
    profile: {
      title: "My Profile",
      subtitle: "ACCOUNT MANAGEMENT",
      desc: "Keep your information updated.",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email Address (Not editable)",
      phone: "Contact Phone",
      save: "Save Changes",
      saving: "Saving...",
      success: "Profile updated",
      successDesc: "Your data has been saved successfully.",
      error: "Update error",
      errorDesc: "Could not update profile.",
      noAuth: "You must log in to view your profile."
    },
    appointments: {
      title: "My Appointments",
      subtitle: "HISTORY AND BOOKINGS",
      desc: "Check the status of your rituals.",
      upcoming: "Upcoming",
      history: "History",
      noUpcoming: "You have no upcoming appointments.",
      noHistory: "You haven't completed any sessions yet.",
      bookNow: "Book now",
      status: {
        pending: "Pending",
        processing: "Processing",
        shipped: "Confirmed",
        delivered: "Completed",
        cancelled: "Cancelled"
      },
      date: "Date",
      total: "Total",
      details: "Details"
    },
    footer: {
      newsletter: "Newsletter",
      newsDesc: "Receive news and promotions.",
      subscribe: "Subscribe",
      nav: "Navigation",
      legal: "Legal",
      rights: "All rights reserved.",
      menu: "Menu"
    },
    legal: {
      terms: {
        title: "Terms and Conditions",
        s1_title: "1. Acceptance of Terms",
        s1_desc: "By accessing this website and the services of Bonanza Arte & Bienestar, you agree to comply with these terms. Our services are intended solely for relaxation and holistic well-being purposes.",
        s2_title: "2. Bookings and Cancellations",
        s2_desc: "All bookings are subject to availability. Cancellations must be made at least 24 hours in advance. Sound Healing sessions have fixed schedules (7:30 AM and 8:00 PM).",
        s3_title: "3. Payments and Security (Stripe)",
        s3_desc: "For your security, all credit and debit card payments are processed through the external platform Stripe. Bonanza Arte & Bienestar does not store or have access to your full card details. By making a payment, you also accept Stripe's terms of service.",
        s4_title: "4. Refund Policy",
        s4_desc: "Refunds will be evaluated on a case-by-case basis. In case of no-show for a confirmed appointment without prior notice, Bonanza reserves the right to withhold the amount paid.",
        s5_title: "5. Health and Liability",
        s5_desc: "It is the client's responsibility to inform us of any medical conditions, allergies, or pregnancy before starting a treatment. Our services do not replace professional medical advice.",
        updated: "Last updated: March 2024"
      },
      privacy: {
        title: "Privacy Policy",
        s1_title: "1. Data Collection",
        s1_desc: "We collect basic personal information (name, email, phone) solely to manage your bookings and improve your experience at Bonanza.",
        s2_title: "2. Use of Information",
        s2_desc: "Your data is not sold or shared with third parties for advertising purposes. We use it exclusively for appointment confirmations and, if you authorize it, our wellness newsletter.",
        s3_title: "3. Secure Payment Processing",
        s3_desc: "We use Stripe to process payments securely. Stripe collects information necessary to complete the transaction under its own PCI-DSS security standards. You can consult Stripe's privacy policy for more details.",
        s4_title: "4. User Rights",
        s4_desc: "You have the right to request access, correction, or deletion of your personal data from our database at any time through our contact form.",
        s5_title: "5. Cookies",
        s5_desc: "We use essential cookies for the technical operation of the site and to remember your language preferences, ensuring smooth navigation.",
        updated: "Last updated: March 2024"
      }
    }
  }
};
