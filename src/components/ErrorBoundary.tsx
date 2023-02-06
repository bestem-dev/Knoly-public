import { useRouter } from "next/router";
import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <>
        <h1>Parece que ha habido un error.</h1>
        <p>
          Prueba refrescar la página.
        </p>
        <p>
          Si el problema persiste, intenta <a href="https://protecciondatos-lopd.com/empresas/borrar-cookies/">borrar las cookies</a>
        </p>
        <p>
          Si aún así no funciona, contactate con <a href={"mailto:"+process.env.NEXT_PUBLIC_SUPPORT_EMAIL}>{process.env.NEXT_PUBLIC_SUPPORT_EMAIL}</a>
        </p>
      </>
    }

    return this.props.children;
  }
}

export default ErrorBoundary;