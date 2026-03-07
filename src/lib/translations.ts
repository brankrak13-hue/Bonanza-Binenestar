
export const translations: any = {
  es: {
    nav: {
      home: "INICIO",
      services: "SERVICIOS",
      advisor: "ASESOR IA",
      about: "NOSOTROS",
      contact: "CONTACTO",
      myAccount: "MI CUENTA",
      myProfile: "MI PERFIL",
      myAppointments: "MIS CITAS",
      signOut: "CERRAR SESIÓN",
      admin: "ADMIN"
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
      subtitle: "Nuestra Fundadora",
      title: "Conoce a Bonanza",
      desc1: "Con una pasión por el bienestar integral y años de estudio en técnicas de sanación ancestrales, Bonanza fundó este espacio como un refugio para el alma. Su misión es guiarte en un viaje de autodescubrimiento y sanación, combinando el arte del tacto con el poder de la vibración.",
      desc2: "Creemos que la verdadera belleza emana de un estado de equilibrio interior. Nuestro propósito es ayudarte a encontrarlo."
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
      rights: "Todos los derechos reservados."
    },
    legal: {
      terms: {
        title: "Términos y Condiciones",
        s1_title: "1. Aceptación de los Términos",
        s1_desc: "Al acceder y utilizar los servicios de Bonanza Arte & Bienestar, usted acepta estos Términos.",
        updated: "Última actualización: Febrero 2024"
      },
      privacy: {
        title: "Política de Privacidad",
        s1_title: "1. Recopilación de Información",
        s1_desc: "Protegemos tus datos personales.",
        updated: "Última actualización: Febrero 2024"
      }
    }
  },
  en: {
    nav: {
      home: "HOME",
      services: "SERVICES",
      advisor: "AI ADVISOR",
      about: "ABOUT US",
      contact: "CONTACT",
      myAccount: "MY ACCOUNT",
      myProfile: "MY PROFILE",
      myAppointments: "MY APPOINTMENTS",
      signOut: "SIGN OUT",
      admin: "ADMIN"
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
      description: "Discover a sanctuary of inner peace.",
      cta: "Book Your Appointment"
    },
    about: {
      subtitle: "Our Founder",
      title: "Meet Bonanza",
      desc1: "A refuge for the soul.",
      desc2: "True beauty emanates from a state of inner balance."
    },
    home: {
      facial: {
        subtitle: "ANCIENT TECHNIQUES",
        title: "Holistic Massages",
        description: "Rejuvenate your skin and release tension.",
        button: "View Menu"
      },
      sound: {
        subtitle: "Healing Vibrations",
        title: "Sound Healing Therapy",
        description: "Immerse yourself in a harmonic sound bath.",
        button: "Book Session"
      }
    },
    services: {
      title: "Our Experiences",
      subtitle: "PREMIUM WELLNESS",
      desc: "Restore your inner harmony.",
      min: "min"
    },
    massages: {
      purification: {
        title: "Subtle Purification",
        sub: "Drainage",
        desc: "Gentle movements to reduce inflammation.",
        prices: [
          { amount: 900, duration: 60, paymentLink: "https://buy.stripe.com/6oU8wIgnG46C0whf5z3oA04" },
          { amount: 1100, duration: 90, paymentLink: "https://buy.stripe.com/7sY9AM7Ra46CceZf5z3oA05" }
        ]
      },
      fluidity: {
        title: "Essential Fluidity",
        sub: "Swedish",
        desc: "Continuous movements to release tension.",
        prices: [
            { amount: 800, duration: 60, paymentLink: "https://buy.stripe.com/00wfZa3AU5aG2Ep6z33oA01" },
            { amount: 1000, duration: 90, paymentLink: "https://buy.stripe.com/5kQ7sEefy7iO5QBe1v3oA02" }
        ]
      },
      release: {
        title: "Tension Release",
        sub: "Deep Tissue",
        desc: "Deep technique for rigid muscle areas.",
        prices: [
            { amount: 900, duration: 60, paymentLink: "https://buy.stripe.com/00w28k5J2dHc3It3mR3oA09" },
            { amount: 1100, duration: 90, paymentLink: "https://buy.stripe.com/00w28k6N60Uqgvf1eJ3oA0a" }
        ]
      },
      awakening: {
        title: "Vital Awakening",
        sub: "Chiromassage",
        desc: "Intuitive hands releasing emotions.",
        prices: [
            { amount: 800, duration: 60, paymentLink: "https://buy.stripe.com/dRmeV68Ve1Yu2Epf5z3oA07" },
            { amount: 1000, duration: 90, paymentLink: "https://buy.stripe.com/00w28k5J2dHc3It3mR3oA09" }
        ]
      },
      reset: {
        title: "Mind Reset",
        sub: "Craniofacial",
        desc: "Profound treatment to dissolve tensions.",
        prices: [
            { amount: 700, duration: 60, paymentLink: "https://buy.stripe.com/aFa6oAdbu1Yufrb4qV3oA06" }
        ]
      },
      sculpt: {
        title: "Body Sculpting",
        sub: "Reductive",
        desc: "Intense massage to define figure.",
        prices: [
            { amount: 900, duration: 60, paymentLink: "https://buy.stripe.com/00w3coefyav04Mx6z33oA03" }
        ]
      }
    },
    ai: {
      title: "Your Digital Oracle",
      desc: "Our artificial wisdom will reveal the ritual your soul needs today.",
      placeholder: "E.g.: 'I feel a lot of mental load'...",
      cta: "Consult AI Wisdom",
      ritual: "Ritual Revealed",
      purpose: "Ritual Purpose",
      intuition: "Our Intuition",
      next: "Deepen your well-being",
      error: "Our AI channels are experiencing high vibration.",
      menuCta: "Explore Details"
    },
    contact: {
      title: "Book Your Experience",
      desc: "Begin your journey towards deep well-being.",
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
      successRegisterTitle: "Account Created!",
      errorRegisterTitle: "Registration Error",
      forgotPassword: "Forgot your password?",
      resetTitle: "Reset Password",
      resetDesc: "Enter your email for a recovery link.",
      sendReset: "Send Link",
      resetSuccess: "Link sent. Check your email.",
      newPassword: "New Password",
      confirmNewPassword: "Confirm Password",
      updatePassword: "Update Password",
      passwordSuccess: "Password updated.",
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
      error: "Update error",
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
      rights: "All rights reserved."
    },
    legal: {
      terms: {
        title: "Terms and Conditions",
        s1_title: "1. Acceptance of Terms",
        updated: "Last updated: February 2024"
      },
      privacy: {
        title: "Privacy Policy",
        s1_title: "1. Information Collection",
        updated: "Last updated: February 2024"
      }
    }
  }
};
