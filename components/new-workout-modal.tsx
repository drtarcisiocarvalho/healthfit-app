import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";

interface WorkoutType {
  id: string;
  name: string;
  icon: string;
}

interface NewWorkoutModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectType: (type: WorkoutType) => void;
}

const workoutTypes: WorkoutType[] = [
  { id: "1", name: "Corrida", icon: "figure.run" },
  { id: "2", name: "Caminhada", icon: "figure.run" },
  { id: "3", name: "Ciclismo", icon: "bolt.fill" },
  { id: "4", name: "Musculação", icon: "flame.fill" },
  { id: "5", name: "Yoga", icon: "heart.fill" },
  { id: "6", name: "Natação", icon: "heart.fill" },
  { id: "7", name: "Pilates", icon: "heart.fill" },
  { id: "8", name: "CrossFit", icon: "flame.fill" },
  { id: "9", name: "Treino Funcional", icon: "flame.fill" },
  { id: "10", name: "Dança", icon: "heart.fill" },
];

export function NewWorkoutModal({ visible, onClose, onSelectType }: NewWorkoutModalProps) {
  const colors = useColors();

  const renderWorkoutType = ({ item }: { item: WorkoutType }) => (
    <TouchableOpacity
      className="bg-surface rounded-xl p-4 mb-3 border border-border flex-row items-center justify-between"
      activeOpacity={0.7}
      onPress={() => {
        onSelectType(item);
        onClose();
      }}
    >
      <View className="flex-row items-center gap-3">
        <View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: colors.primary + "33" }}>
          <IconSymbol name={item.icon as any} size={24} color={colors.primary} />
        </View>
        <Text className="text-foreground text-lg font-medium">{item.name}</Text>
      </View>
      <IconSymbol name="chevron.right" size={20} color={colors.muted} />
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View className="bg-background rounded-t-3xl p-6" style={{ maxHeight: "80%" }}>
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-foreground text-2xl font-bold">Selecione o Tipo</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <IconSymbol name="xmark" size={24} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <FlatList
            data={workoutTypes}
            renderItem={renderWorkoutType}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    </Modal>
  );
}
