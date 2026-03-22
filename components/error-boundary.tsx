import React, { Component, ReactNode } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary capturou erro:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    try {
      router.replace("/");
    } catch (error) {
      console.error("Erro ao navegar:", error);
      // Recarregar app se navegação falhar
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 bg-background items-center justify-center p-6">
          <View className="bg-surface rounded-2xl p-6 border border-border w-full max-w-md">
            <Text className="text-error text-2xl font-bold mb-4 text-center">
              Ops! Algo deu errado
            </Text>
            <Text className="text-foreground text-base mb-4 text-center">
              O aplicativo encontrou um erro inesperado.
            </Text>
            
            {__DEV__ && this.state.error && (
              <ScrollView className="bg-background rounded-lg p-3 mb-4 max-h-48">
                <Text className="text-error text-xs font-mono">
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text className="text-muted text-xs font-mono mt-2">
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            )}

            <TouchableOpacity
              className="bg-primary rounded-xl p-4 items-center"
              activeOpacity={0.8}
              onPress={this.handleReset}
            >
              <Text className="text-background font-bold text-base">
                Voltar ao Início
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
