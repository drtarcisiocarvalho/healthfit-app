import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Professional {
  id: string;
  name: string;
  avatar?: string;
  specialty: "personal_trainer" | "nutritionist" | "physiotherapist" | "psychologist";
  certifications: string[];
  experience: number; // anos
  rating: number; // 0-5
  reviewCount: number;
  hourlyRate: number; // R$
  bio: string;
  languages: string[];
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[];
    sunday: string[];
  };
  verified: boolean;
  responseTime: string; // "< 1h", "< 24h", etc
  totalClients: number;
}

export interface Review {
  id: string;
  professionalId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: Date;
  helpful: number;
}

export interface Appointment {
  id: string;
  professionalId: string;
  professionalName: string;
  userId: string;
  date: Date;
  duration: number; // minutos
  type: "video_call" | "chat" | "in_person";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  price: number;
  notes?: string;
}

export interface CustomPlan {
  id: string;
  professionalId: string;
  professionalName: string;
  userId: string;
  title: string;
  description: string;
  duration: number; // dias
  price: number;
  includes: string[];
  startDate?: Date;
  status: "available" | "active" | "completed";
}

// Obter profissionais disponíveis
export async function getProfessionals(
  specialty?: Professional["specialty"],
  searchQuery?: string
): Promise<Professional[]> {
  // Em produção, isso consultaria o backend
  // Por enquanto, retorna profissionais simulados
  
  const allProfessionals: Professional[] = [
    {
      id: "prof_1",
      name: "Carlos Mendes",
      specialty: "personal_trainer",
      certifications: ["CREF", "Especialização em Musculação", "Certificado CrossFit L1"],
      experience: 8,
      rating: 4.9,
      reviewCount: 127,
      hourlyRate: 150,
      bio: "Personal trainer especializado em hipertrofia e emagrecimento. Mais de 8 anos transformando vidas através do treinamento personalizado.",
      languages: ["Português", "Inglês"],
      availability: {
        monday: ["06:00", "07:00", "18:00", "19:00"],
        tuesday: ["06:00", "07:00", "18:00", "19:00"],
        wednesday: ["06:00", "07:00", "18:00", "19:00"],
        thursday: ["06:00", "07:00", "18:00", "19:00"],
        friday: ["06:00", "07:00", "18:00"],
        saturday: ["08:00", "09:00", "10:00"],
        sunday: [],
      },
      verified: true,
      responseTime: "< 1h",
      totalClients: 89,
    },
    {
      id: "prof_2",
      name: "Dra. Ana Paula Silva",
      specialty: "nutritionist",
      certifications: ["CRN", "Pós-graduação em Nutrição Esportiva", "Especialista em Emagrecimento"],
      experience: 12,
      rating: 5.0,
      reviewCount: 203,
      hourlyRate: 200,
      bio: "Nutricionista clínica e esportiva. Atendimento humanizado com foco em resultados sustentáveis e saúde integral.",
      languages: ["Português", "Espanhol"],
      availability: {
        monday: ["09:00", "10:00", "14:00", "15:00", "16:00"],
        tuesday: ["09:00", "10:00", "14:00", "15:00", "16:00"],
        wednesday: ["09:00", "10:00", "14:00", "15:00", "16:00"],
        thursday: ["09:00", "10:00", "14:00", "15:00", "16:00"],
        friday: ["09:00", "10:00", "14:00"],
        saturday: [],
        sunday: [],
      },
      verified: true,
      responseTime: "< 2h",
      totalClients: 156,
    },
    {
      id: "prof_3",
      name: "Dr. Rafael Costa",
      specialty: "physiotherapist",
      certifications: ["CREFITO", "Especialização em Fisioterapia Esportiva", "RPG"],
      experience: 10,
      rating: 4.8,
      reviewCount: 94,
      hourlyRate: 180,
      bio: "Fisioterapeuta especializado em reabilitação esportiva e prevenção de lesões. Trabalho com atletas profissionais e amadores.",
      languages: ["Português"],
      availability: {
        monday: ["08:00", "09:00", "10:00", "15:00", "16:00"],
        tuesday: ["08:00", "09:00", "10:00", "15:00", "16:00"],
        wednesday: ["08:00", "09:00", "10:00", "15:00", "16:00"],
        thursday: ["08:00", "09:00", "10:00", "15:00", "16:00"],
        friday: ["08:00", "09:00", "10:00"],
        saturday: ["09:00", "10:00"],
        sunday: [],
      },
      verified: true,
      responseTime: "< 3h",
      totalClients: 67,
    },
    {
      id: "prof_4",
      name: "Juliana Oliveira",
      specialty: "personal_trainer",
      certifications: ["CREF", "Certificado Pilates", "Yoga Alliance RYT 200"],
      experience: 6,
      rating: 4.7,
      reviewCount: 82,
      hourlyRate: 120,
      bio: "Personal trainer com foco em treino funcional, pilates e yoga. Especializada em público feminino e terceira idade.",
      languages: ["Português", "Inglês"],
      availability: {
        monday: ["07:00", "08:00", "09:00", "17:00", "18:00"],
        tuesday: ["07:00", "08:00", "09:00", "17:00", "18:00"],
        wednesday: ["07:00", "08:00", "09:00", "17:00", "18:00"],
        thursday: ["07:00", "08:00", "09:00", "17:00", "18:00"],
        friday: ["07:00", "08:00", "09:00"],
        saturday: ["08:00", "09:00"],
        sunday: ["09:00", "10:00"],
      },
      verified: true,
      responseTime: "< 1h",
      totalClients: 54,
    },
    {
      id: "prof_5",
      name: "Dr. Marcos Ferreira",
      specialty: "psychologist",
      certifications: ["CRP", "Especialização em Psicologia do Esporte", "TCC"],
      experience: 15,
      rating: 4.9,
      reviewCount: 156,
      hourlyRate: 220,
      bio: "Psicólogo especializado em performance esportiva e saúde mental. Atendimento online com foco em resultados mensuráveis.",
      languages: ["Português", "Inglês", "Francês"],
      availability: {
        monday: ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        tuesday: ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        wednesday: ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        thursday: ["10:00", "11:00", "14:00", "15:00", "16:00", "17:00"],
        friday: ["10:00", "11:00", "14:00", "15:00"],
        saturday: [],
        sunday: [],
      },
      verified: true,
      responseTime: "< 24h",
      totalClients: 112,
    },
  ];
  
  let filtered = allProfessionals;
  
  // Filtrar por especialidade
  if (specialty) {
    filtered = filtered.filter(p => p.specialty === specialty);
  }
  
  // Filtrar por busca
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.bio.toLowerCase().includes(query) ||
      p.certifications.some(c => c.toLowerCase().includes(query))
    );
  }
  
  // Ordenar por rating
  filtered.sort((a, b) => b.rating - a.rating);
  
  return filtered;
}

// Obter detalhes de um profissional
export async function getProfessionalDetails(professionalId: string): Promise<Professional | null> {
  const professionals = await getProfessionals();
  return professionals.find(p => p.id === professionalId) || null;
}

// Obter reviews de um profissional
export async function getProfessionalReviews(professionalId: string): Promise<Review[]> {
  // Em produção, isso consultaria o backend
  // Por enquanto, retorna reviews simuladas
  
  const mockReviews: Review[] = [
    {
      id: "rev_1",
      professionalId,
      userId: "user_1",
      userName: "Maria Santos",
      rating: 5,
      comment: "Excelente profissional! Muito atencioso e os resultados apareceram rápido. Super recomendo!",
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      helpful: 12,
    },
    {
      id: "rev_2",
      professionalId,
      userId: "user_2",
      userName: "João Silva",
      rating: 5,
      comment: "Melhor investimento que fiz! Profissional dedicado e com muito conhecimento. Valeu cada centavo.",
      date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      helpful: 8,
    },
    {
      id: "rev_3",
      professionalId,
      userId: "user_3",
      userName: "Pedro Costa",
      rating: 4,
      comment: "Muito bom! Única ressalva é que às vezes demora um pouco para responder, mas o atendimento é ótimo.",
      date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      helpful: 5,
    },
  ];
  
  return mockReviews;
}

// Agendar consulta
export async function bookAppointment(
  professionalId: string,
  date: Date,
  duration: number,
  type: Appointment["type"],
  notes?: string
): Promise<{ success: boolean; appointment?: Appointment; message: string }> {
  try {
    const professional = await getProfessionalDetails(professionalId);
    
    if (!professional) {
      return {
        success: false,
        message: "Profissional não encontrado.",
      };
    }
    
    const appointment: Appointment = {
      id: `appt_${Date.now()}`,
      professionalId,
      professionalName: professional.name,
      userId: "current_user",
      date,
      duration,
      type,
      status: "pending",
      price: (professional.hourlyRate * duration) / 60,
      notes,
    };
    
    // Salvar agendamento
    const appointments = await getMyAppointments();
    appointments.push(appointment);
    await AsyncStorage.setItem("appointments", JSON.stringify(appointments));
    
    console.log("✅ Consulta agendada:", appointment);
    
    return {
      success: true,
      appointment,
      message: "Consulta agendada com sucesso! O profissional receberá a solicitação.",
    };
  } catch (error) {
    console.error("❌ Erro ao agendar consulta:", error);
    return {
      success: false,
      message: "Não foi possível agendar a consulta. Tente novamente.",
    };
  }
}

// Obter meus agendamentos
export async function getMyAppointments(): Promise<Appointment[]> {
  try {
    const stored = await AsyncStorage.getItem("appointments");
    if (stored) {
      const appointments = JSON.parse(stored);
      return appointments
        .map((a: any) => ({
          ...a,
          date: new Date(a.date),
        }))
        .sort((a: Appointment, b: Appointment) => 
          b.date.getTime() - a.date.getTime()
        );
    }
  } catch (error) {
    console.error("Erro ao carregar agendamentos:", error);
  }
  return [];
}

// Cancelar agendamento
export async function cancelAppointment(appointmentId: string): Promise<boolean> {
  try {
    const appointments = await getMyAppointments();
    const filtered = appointments.filter(a => a.id !== appointmentId);
    await AsyncStorage.setItem("appointments", JSON.stringify(filtered));
    console.log("✅ Agendamento cancelado");
    return true;
  } catch (error) {
    console.error("❌ Erro ao cancelar agendamento:", error);
    return false;
  }
}

// Avaliar profissional
export async function rateProfessional(
  professionalId: string,
  rating: number,
  comment: string
): Promise<{ success: boolean; message: string }> {
  try {
    const review: Review = {
      id: `rev_${Date.now()}`,
      professionalId,
      userId: "current_user",
      userName: "Você",
      rating,
      comment,
      date: new Date(),
      helpful: 0,
    };
    
    // Salvar review
    const reviews = await getMyReviews();
    reviews.push(review);
    await AsyncStorage.setItem("myReviews", JSON.stringify(reviews));
    
    console.log("✅ Avaliação enviada:", review);
    
    return {
      success: true,
      message: "Avaliação enviada com sucesso! Obrigado pelo feedback.",
    };
  } catch (error) {
    console.error("❌ Erro ao enviar avaliação:", error);
    return {
      success: false,
      message: "Não foi possível enviar a avaliação. Tente novamente.",
    };
  }
}

// Obter minhas avaliações
async function getMyReviews(): Promise<Review[]> {
  try {
    const stored = await AsyncStorage.getItem("myReviews");
    if (stored) {
      return JSON.parse(stored).map((r: any) => ({
        ...r,
        date: new Date(r.date),
      }));
    }
  } catch (error) {
    console.error("Erro ao carregar avaliações:", error);
  }
  return [];
}

// Obter planos personalizados disponíveis
export async function getCustomPlans(professionalId?: string): Promise<CustomPlan[]> {
  // Em produção, isso consultaria o backend
  // Por enquanto, retorna planos simulados
  
  const allPlans: CustomPlan[] = [
    {
      id: "plan_1",
      professionalId: "prof_1",
      professionalName: "Carlos Mendes",
      userId: "",
      title: "Programa Hipertrofia 12 Semanas",
      description: "Plano completo de treino para ganho de massa muscular com acompanhamento semanal, ajustes personalizados e suporte via chat.",
      duration: 84,
      price: 899,
      includes: [
        "12 semanas de treino personalizado",
        "Ajustes semanais baseados em progresso",
        "Suporte via chat ilimitado",
        "2 consultas de avaliação (início e fim)",
        "Plano de nutrição básico",
      ],
      status: "available",
    },
    {
      id: "plan_2",
      professionalId: "prof_2",
      professionalName: "Dra. Ana Paula Silva",
      userId: "",
      title: "Reeducação Alimentar 8 Semanas",
      description: "Programa de reeducação alimentar com cardápios personalizados, receitas exclusivas e acompanhamento nutricional completo.",
      duration: 56,
      price: 1200,
      includes: [
        "8 semanas de acompanhamento",
        "Cardápio personalizado semanal",
        "Lista de compras",
        "Receitas exclusivas",
        "4 consultas de ajuste",
        "Grupo VIP no WhatsApp",
      ],
      status: "available",
    },
    {
      id: "plan_3",
      professionalId: "prof_3",
      professionalName: "Dr. Rafael Costa",
      userId: "",
      title: "Prevenção de Lesões - Atletas",
      description: "Programa de avaliação postural e fortalecimento preventivo para atletas de corrida e crossfit.",
      duration: 30,
      price: 650,
      includes: [
        "Avaliação postural completa",
        "Plano de exercícios preventivos",
        "3 sessões de acompanhamento",
        "Vídeos explicativos dos exercícios",
        "Suporte via chat",
      ],
      status: "available",
    },
  ];
  
  if (professionalId) {
    return allPlans.filter(p => p.professionalId === professionalId);
  }
  
  return allPlans;
}

// Contratar plano personalizado
export async function hirePlan(planId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const plans = await getCustomPlans();
    const plan = plans.find(p => p.id === planId);
    
    if (!plan) {
      return {
        success: false,
        message: "Plano não encontrado.",
      };
    }
    
    // Simular contratação
    const hiredPlan: CustomPlan = {
      ...plan,
      userId: "current_user",
      startDate: new Date(),
      status: "active",
    };
    
    // Salvar plano contratado
    const myPlans = await getMyPlans();
    myPlans.push(hiredPlan);
    await AsyncStorage.setItem("myPlans", JSON.stringify(myPlans));
    
    console.log("✅ Plano contratado:", hiredPlan);
    
    return {
      success: true,
      message: "Plano contratado com sucesso! O profissional entrará em contato em breve.",
    };
  } catch (error) {
    console.error("❌ Erro ao contratar plano:", error);
    return {
      success: false,
      message: "Não foi possível contratar o plano. Tente novamente.",
    };
  }
}

// Obter meus planos contratados
export async function getMyPlans(): Promise<CustomPlan[]> {
  try {
    const stored = await AsyncStorage.getItem("myPlans");
    if (stored) {
      return JSON.parse(stored).map((p: any) => ({
        ...p,
        startDate: p.startDate ? new Date(p.startDate) : undefined,
      }));
    }
  } catch (error) {
    console.error("Erro ao carregar planos:", error);
  }
  return [];
}

// Obter estatísticas do marketplace
export async function getMarketplaceStats(): Promise<{
  totalProfessionals: number;
  totalAppointments: number;
  totalPlans: number;
  totalSpent: number;
}> {
  const appointments = await getMyAppointments();
  const plans = await getMyPlans();
  
  const totalSpent = 
    appointments.reduce((sum, a) => sum + a.price, 0) +
    plans.reduce((sum, p) => sum + p.price, 0);
  
  return {
    totalProfessionals: 5, // Em produção, viria do backend
    totalAppointments: appointments.length,
    totalPlans: plans.length,
    totalSpent,
  };
}
