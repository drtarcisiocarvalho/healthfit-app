import { Modal, View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useColors } from "@/hooks/use-colors";
import { useState } from "react";

interface VitalSignsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    bloodPressureSystolic: string;
    bloodPressureDiastolic: string;
    glucose: string;
    heartRate: string;
    spo2: string;
    temperature: string;
  }) => void;
}

export function VitalSignsModal({ visible, onClose, onSave }: VitalSignsModalProps) {
  const colors = useColors();
  const [bloodPressureSystolic, setBloodPressureSystolic] = useState("");
  const [bloodPressureDiastolic, setBloodPressureDiastolic] = useState("");
  const [glucose, setGlucose] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [spo2, setSpo2] = useState("");
  const [temperature, setTemperature] = useState("");

  const handleSave = () => {
    onSave({
      bloodPressureSystolic,
      bloodPressureDiastolic,
      glucose,
      heartRate,
      spo2,
      temperature,
    });
    // Reset
    setBloodPressureSystolic("");
    setBloodPressureDiastolic("");
    setGlucose("");
    setHeartRate("");
    setSpo2("");
    setTemperature("");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <View className="bg-background rounded-t-3xl p-6" style={{ maxHeight: "85%" }}>
          <View className="flex-row items-center justify-between mb-6">
            <Text className="text-foreground text-2xl font-bold">Registrar Sinais Vitais</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <IconSymbol name="xmark" size={24} color={colors.muted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Pressão Arterial */}
            <View className="mb-5">
              <Text className="text-foreground text-base font-semibold mb-2">Pressão Arterial (mmHg)</Text>
              <View className="flex-row gap-3">
                <TextInput
                  className="flex-1 bg-surface rounded-xl p-4 text-foreground border border-border"
                  placeholder="Sistólica"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                  value={bloodPressureSystolic}
                  onChangeText={setBloodPressureSystolic}
                  returnKeyType="done"
                />
                <TextInput
                  className="flex-1 bg-surface rounded-xl p-4 text-foreground border border-border"
                  placeholder="Diastólica"
                  placeholderTextColor={colors.muted}
                  keyboardType="numeric"
                  value={bloodPressureDiastolic}
                  onChangeText={setBloodPressureDiastolic}
                  returnKeyType="done"
                />
              </View>
            </View>

            {/* Glicemia */}
            <View className="mb-5">
              <Text className="text-foreground text-base font-semibold mb-2">Glicemia (mg/dL)</Text>
              <TextInput
                className="bg-surface rounded-xl p-4 text-foreground border border-border"
                placeholder="Ex: 95"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                value={glucose}
                onChangeText={setGlucose}
                returnKeyType="done"
              />
            </View>

            {/* Frequência Cardíaca */}
            <View className="mb-5">
              <Text className="text-foreground text-base font-semibold mb-2">Frequência Cardíaca (bpm)</Text>
              <TextInput
                className="bg-surface rounded-xl p-4 text-foreground border border-border"
                placeholder="Ex: 72"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                value={heartRate}
                onChangeText={setHeartRate}
                returnKeyType="done"
              />
            </View>

            {/* SpO2 */}
            <View className="mb-5">
              <Text className="text-foreground text-base font-semibold mb-2">Saturação de Oxigênio (%)</Text>
              <TextInput
                className="bg-surface rounded-xl p-4 text-foreground border border-border"
                placeholder="Ex: 98"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                value={spo2}
                onChangeText={setSpo2}
                returnKeyType="done"
              />
            </View>

            {/* Temperatura */}
            <View className="mb-5">
              <Text className="text-foreground text-base font-semibold mb-2">Temperatura (°C)</Text>
              <TextInput
                className="bg-surface rounded-xl p-4 text-foreground border border-border"
                placeholder="Ex: 36.5"
                placeholderTextColor={colors.muted}
                keyboardType="decimal-pad"
                value={temperature}
                onChangeText={setTemperature}
                returnKeyType="done"
              />
            </View>

            {/* Botão Salvar */}
            <TouchableOpacity
              className="rounded-xl p-4 items-center mt-4 mb-6"
              style={{ backgroundColor: colors.health }}
              activeOpacity={0.8}
              onPress={handleSave}
            >
              <Text className="text-background font-bold text-base">Salvar Medições</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
