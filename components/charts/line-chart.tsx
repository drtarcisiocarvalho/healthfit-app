import { View, Text } from "react-native";
import { CartesianChart, Line, useChartPressState } from "victory-native";
import { Circle, useFont } from "@shopify/react-native-skia";
import { useColors } from "@/hooks/use-colors";

interface LineChartProps {
  data: { x: number; y: number }[];
  title?: string;
  yLabel?: string;
  height?: number;
  color?: string;
}

export function LineChart({ 
  data, 
  title, 
  yLabel, 
  height = 200, 
  color,
}: LineChartProps) {
  const colors = useColors();
  const chartColor = color || colors.primary;
  const { state, isActive } = useChartPressState({ x: 0, y: { y: 0 } });

  if (data.length === 0) {
    return (
      <View className="bg-surface rounded-2xl p-4" style={{ height }}>
        {title && <Text className="text-foreground font-bold mb-2">{title}</Text>}
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted">Sem dados para exibir</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-surface rounded-2xl p-4">
      {title && <Text className="text-foreground font-bold mb-2">{title}</Text>}
      {yLabel && <Text className="text-muted text-xs mb-2">{yLabel}</Text>}
      
      {isActive && (
        <View className="mb-2">
          <Text className="text-foreground text-sm">
            Valor selecionado
          </Text>
        </View>
      )}

      <CartesianChart
        data={data}
        xKey="x"
        yKeys={["y"]}
        chartPressState={state}
        axisOptions={{
          font: undefined,
          tickCount: 5,
          labelOffset: { x: 2, y: 4 },
          labelColor: colors.muted,
          lineColor: colors.border,
          formatXLabel: (value) => value.toString(),
          formatYLabel: (value) => value.toFixed(0),
        }}
      >
        {({ points }) => (
          <>
            <Line
              points={points.y}
              color={chartColor}
              strokeWidth={3}
              curveType="natural"
            />
            {isActive && (
              <Circle
                cx={state.x.position}
                cy={state.y.y.position}
                r={8}
                color={chartColor}
                opacity={0.8}
              />
            )}
          </>
        )}
      </CartesianChart>
    </View>
  );
}
