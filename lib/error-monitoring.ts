// Serviço de monitoramento de erros
// Em produção, isso usaria Sentry ou similar

export interface ErrorReport {
  message: string;
  stack?: string;
  context?: Record<string, any>;
  timestamp: Date;
  severity: "fatal" | "error" | "warning" | "info";
}

class ErrorMonitoringService {
  private errors: ErrorReport[] = [];
  private enabled: boolean = true;

  // Inicializar monitoramento
  async initialize() {
    console.log("🔍 Error monitoring inicializado");
    
    // Capturar erros não tratados
    if (typeof ErrorUtils !== "undefined") {
      const originalHandler = ErrorUtils.getGlobalHandler();
      
      ErrorUtils.setGlobalHandler((error, isFatal) => {
        this.captureException(error, {
          isFatal,
          context: "GlobalErrorHandler",
        });
        
        // Chamar handler original
        if (originalHandler) {
          originalHandler(error, isFatal);
        }
      });
    }

    console.log("✅ Error monitoring configurado");
  }

  // Capturar exceção
  captureException(error: Error, context?: Record<string, any>) {
    if (!this.enabled) return;

    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      context,
      timestamp: new Date(),
      severity: context?.isFatal ? "fatal" : "error",
    };

    this.errors.push(report);
    console.error("❌ Error captured:", report);

    // Em produção: Sentry.captureException(error);
  }

  // Capturar mensagem
  captureMessage(message: string, severity: ErrorReport["severity"] = "info", context?: Record<string, any>) {
    if (!this.enabled) return;

    const report: ErrorReport = {
      message,
      context,
      timestamp: new Date(),
      severity,
    };

    this.errors.push(report);
    console.log(`📝 Message captured [${severity}]:`, message);

    // Em produção: Sentry.captureMessage(message, severity);
  }

  // Adicionar breadcrumb
  addBreadcrumb(category: string, message: string, data?: Record<string, any>) {
    if (!this.enabled) return;

    console.log(`🍞 Breadcrumb [${category}]:`, message, data);
    // Em produção: Sentry.addBreadcrumb({ category, message, data });
  }

  // Definir contexto do usuário
  setUser(user: { id: string; email?: string; username?: string }) {
    console.log("👤 User context:", user);
    // Em produção: Sentry.setUser(user);
  }

  // Definir tag
  setTag(key: string, value: string) {
    console.log(`🏷️ Tag: ${key} = ${value}`);
    // Em produção: Sentry.setTag(key, value);
  }

  // Definir contexto extra
  setContext(key: string, context: Record<string, any>) {
    console.log(`📋 Context [${key}]:`, context);
    // Em produção: Sentry.setContext(key, context);
  }

  // Obter erros (para debug)
  getErrors(): ErrorReport[] {
    return this.errors;
  }

  // Limpar erros
  clearErrors() {
    this.errors = [];
  }

  // Habilitar/desabilitar monitoramento
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    console.log(`🔍 Error monitoring ${enabled ? "habilitado" : "desabilitado"}`);
  }

  // Obter estatísticas
  getStats() {
    const total = this.errors.length;
    const bySeverity = this.errors.reduce((acc, error) => {
      acc[error.severity] = (acc[error.severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total,
      bySeverity,
      lastError: this.errors[this.errors.length - 1],
    };
  }
}

export const errorMonitoring = new ErrorMonitoringService();
