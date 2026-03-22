import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface CoachingProgram {
  id: string;
  name: string;
  goal: string;
  duration: number;
  level: string;
  description: string;
  icon: string;
  color: string;
}

const PROGRAMS: CoachingProgram[] = [
  {
    id: "weight-loss",
    name: "Perda de Peso",
    goal: "Queimar gordura e definir",
    duration: 12,
    level: "Iniciante/Intermediário",
    description:
      "Programa focado em déficit calórico controlado, treinos HIIT e musculação para maximizar a queima de gordura preservando massa muscular.",
    icon: "flame.fill",
    color: "#FF5722",
  },
  {
    id: "muscle-gain",
    name: "Ganho de Massa",
    goal: "Hipertrofia muscular",
    duration: 12,
    level: "Intermediário/Avançado",
    description:
      "Programa de musculação progressiva com foco em volume e intensidade, nutrição hipercalórica e descanso adequado para máximo ganho muscular.",
    icon: "figure.strengthtraining.traditional",
    color: "#2196F3",
  },
  {
    id: "endurance",
    name: "Resistência",
    goal: "Melhorar condicionamento",
    duration: 12,
    level: "Todos os níveis",
    description:
      "Programa de corrida e cardio progressivo para aumentar VO2 max, capacidade aeróbica e resistência cardiovascular.",
    icon: "figure.run",
    color: "#4CAF50",
  },
];

interface WeekPlan {
  week: number;
  focus: string;
  workouts: number;
  completed: boolean;
}

const WEEK_PLANS: WeekPlan[] = [
  { week: 1, focus: "Adaptação e Fundamentos", workouts: 3, completed: true },
  { week: 2, focus: "Aumento de Volume", workouts: 4, completed: true },
  { week: 3, focus: "Intensidade Moderada", workouts: 4, completed: false },
  { week: 4, focus: "Deload e Recuperação", workouts: 3, completed: false },
];

export default function CoachingProgramScreen() {
  const colors = useColors();
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [currentWeek, setCurrentWeek] = useState(3);

  if (selectedProgram) {
    const program = PROGRAMS.find((p) => p.id === selectedProgram);
    if (!program) return null;

    const completedWeeks = WEEK_PLANS.filter((w) => w.completed).length;
    const progress = (completedWeeks / 12) * 100;

    return (
      <ScreenContainer edges={["top", "left", "right"]}>
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-border">
            <TouchableOpacity
              onPress={() => setSelectedProgram(null)}
              activeOpacity={0.7}
            >
              <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
            </TouchableOpacity>
            <Text className="text-foreground text-xl font-bold">{program.name}</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <IconSymbol name="ellipsis" size={24} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <View className="p-6 gap-6">
            {/* Progress Card */}
            <View className="bg-surface rounded-2xl p-6 border border-border">
              <View className="flex-row items-center justify-between mb-4">
                <View>
                  <Text className="text-muted text-sm mb-1">Semana Atual</Text>
                  <Text className="text-foreground text-3xl font-bold">{currentWeek}/12</Text>
                </View>
                <View
                  className="w-20 h-20 rounded-full items-center justify-center"
                  style={{ backgroundColor: program.color + "20" }}
                >
                  <IconSymbol name={program.icon as any} size={36} color={program.color} />
                </View>
              </View>

              {/* Progress Bar */}
              <View className="mb-3">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-muted text-sm">Progresso Geral</Text>
                  <Text className="text-foreground font-bold">{Math.round(progress)}%</Text>
                </View>
                <View className="h-2 rounded-full bg-border overflow-hidden">
                  <View
                    className="h-full rounded-full"
                    style={{ backgroundColor: program.color, width: `${progress}%` }}
                  />
                </View>
              </View>

              <View className="flex-row items-center gap-2">
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                <Text className="text-muted text-sm">
                  {completedWeeks} semanas completadas
                </Text>
              </View>
            </View>

            {/* Current Week */}
            <View>
              <Text className="text-foreground text-lg font-bold mb-3">Semana Atual</Text>
              <View
                className="rounded-2xl p-5 border-2"
                style={{
                  backgroundColor: program.color + "10",
                  borderColor: program.color,
                }}
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="text-foreground font-bold text-lg mb-1">
                      Semana {currentWeek}
                    </Text>
                    <Text className="text-muted">{WEEK_PLANS[currentWeek - 1].focus}</Text>
                  </View>
                  <View
                    className="px-3 py-1 rounded-full"
                    style={{ backgroundColor: program.color }}
                  >
                    <Text className="text-white text-xs font-semibold">EM ANDAMENTO</Text>
                  </View>
                </View>

                <View className="flex-row items-center gap-2 mb-4">
                  <IconSymbol name="figure.run" size={20} color={colors.foreground} />
                  <Text className="text-foreground font-semibold">
                    {WEEK_PLANS[currentWeek - 1].workouts} treinos programados
                  </Text>
                </View>

                <TouchableOpacity
                  className="rounded-xl p-3 items-center"
                  style={{ backgroundColor: program.color }}
                  activeOpacity={0.8}
                  onPress={() => {}}
                >
                  <Text className="text-white font-semibold">Ver Treinos da Semana</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Week Timeline */}
            <View>
              <Text className="text-foreground text-lg font-bold mb-3">Cronograma</Text>
              {WEEK_PLANS.map((week) => (
                <View
                  key={week.week}
                  className="bg-surface rounded-2xl p-5 mb-3 border border-border"
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View
                        className="w-12 h-12 rounded-full items-center justify-center"
                        style={{
                          backgroundColor: week.completed
                            ? colors.success + "20"
                            : week.week === currentWeek
                            ? program.color + "20"
                            : colors.muted + "20",
                        }}
                      >
                        {week.completed ? (
                          <IconSymbol name="checkmark" size={24} color={colors.success} />
                        ) : (
                          <Text
                            className="font-bold"
                            style={{
                              color:
                                week.week === currentWeek ? program.color : colors.muted,
                            }}
                          >
                            {week.week}
                          </Text>
                        )}
                      </View>
                      <View className="flex-1">
                        <Text className="text-foreground font-bold">Semana {week.week}</Text>
                        <Text className="text-muted text-sm">{week.focus}</Text>
                      </View>
                    </View>
                    <Text className="text-muted text-sm">{week.workouts} treinos</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Check-in */}
            <View className="bg-surface rounded-2xl p-5 border border-border">
              <View className="flex-row items-start gap-3 mb-4">
                <IconSymbol name="calendar.badge.clock" size={28} color={colors.health} />
                <View className="flex-1">
                  <Text className="text-foreground font-bold text-lg mb-1">
                    Check-in Semanal
                  </Text>
                  <Text className="text-muted text-sm">
                    Responda algumas perguntas para ajustarmos seu programa
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="rounded-xl p-3 items-center"
                style={{ backgroundColor: colors.health }}
                activeOpacity={0.8}
                onPress={() => {}}
              >
                <Text className="text-white font-semibold">Fazer Check-in</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer edges={["top", "left", "right"]}>
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 border-b border-border">
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <IconSymbol name="arrow.left" size={24} color={colors.foreground} />
          </TouchableOpacity>
          <Text className="text-foreground text-xl font-bold">Coaching Virtual</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="p-6 gap-6">
          {/* Info Banner */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <View className="flex-row items-start gap-3">
              <IconSymbol name="person.badge.clock.fill" size={28} color={colors.health} />
              <View className="flex-1">
                <Text className="text-foreground font-bold mb-1">Programas de 12 Semanas</Text>
                <Text className="text-muted text-sm">
                  Planos progressivos personalizados com check-ins semanais e ajustes automáticos
                  baseados no seu progresso
                </Text>
              </View>
            </View>
          </View>

          {/* Programs */}
          <View>
            <Text className="text-foreground text-lg font-bold mb-3">Escolha seu Objetivo</Text>
            {PROGRAMS.map((program) => (
              <TouchableOpacity
                key={program.id}
                className="bg-surface rounded-2xl p-5 mb-3 border border-border"
                activeOpacity={0.8}
                onPress={() => setSelectedProgram(program.id)}
              >
                <View className="flex-row items-start gap-4">
                  <View
                    className="w-16 h-16 rounded-full items-center justify-center"
                    style={{ backgroundColor: program.color + "20" }}
                  >
                    <IconSymbol name={program.icon as any} size={32} color={program.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-foreground font-bold text-lg mb-1">
                      {program.name}
                    </Text>
                    <Text className="text-muted text-sm mb-3">{program.goal}</Text>
                    <View className="flex-row flex-wrap gap-2 mb-3">
                      <View
                        className="px-3 py-1 rounded-full"
                        style={{ backgroundColor: colors.health + "10" }}
                      >
                        <Text className="text-xs" style={{ color: colors.health }}>
                          {program.duration} semanas
                        </Text>
                      </View>
                      <View
                        className="px-3 py-1 rounded-full"
                        style={{ backgroundColor: colors.warning + "10" }}
                      >
                        <Text className="text-xs" style={{ color: colors.warning }}>
                          {program.level}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-muted text-sm leading-relaxed">
                      {program.description}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Features */}
          <View className="bg-surface rounded-2xl p-5 border border-border">
            <Text className="text-foreground font-bold mb-3">O que está incluído?</Text>
            <View className="gap-3">
              <View className="flex-row items-start gap-2">
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                <Text className="text-muted text-sm flex-1">
                  Plano de treinos progressivo de 12 semanas
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                <Text className="text-muted text-sm flex-1">
                  Check-ins semanais para ajustes dinâmicos
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                <Text className="text-muted text-sm flex-1">
                  Progressão automática de carga e intensidade
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                <Text className="text-muted text-sm flex-1">
                  Relatórios de progresso detalhados
                </Text>
              </View>
              <View className="flex-row items-start gap-2">
                <IconSymbol name="checkmark.circle.fill" size={20} color={colors.success} />
                <Text className="text-muted text-sm flex-1">
                  Notificações de próximos treinos
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
