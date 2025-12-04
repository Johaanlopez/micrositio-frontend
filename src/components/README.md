# ⚛️ Componentes React

Componentes reutilizables de React con TypeScript y CSS Modules.

## 📋 Lista de Componentes

### 🔐 Autenticación

| Componente | Descripción | Props |
|------------|-------------|-------|
| `LoginForm.tsx` | Formulario de login | - |
| `RegisterForm.tsx` | Formulario de registro | - |
| `GoogleAuthSetup.tsx` | Setup de 2FA (QR code) | `tempToken?, userId?, onSuccess?` |
| `GoogleAuthLogin.tsx` | Login con código 2FA | `tempToken: string` |
| `EmailVerification.tsx` | Verificación de email | `email: string, onSuccess?: () => void` |
| `ForgotPassword.tsx` | Recuperación de contraseña | - |
| `ProtectedRoute.tsx` | Wrapper para rutas protegidas | `children: ReactElement` |

### 🏠 Páginas del Micrositio

| Componente | Descripción | Ruta |
|------------|-------------|------|
| `Home.tsx` | Página principal | `/dashboard` |
| `ActividadesRecreativas.tsx` | Actividades deportivas | `/dashboard/actividades-recreativas` |
| `ActividadesCulturales.tsx` | Actividades artísticas | `/dashboard/actividades-culturales` |
| `EventosSociales.tsx` | Eventos sociales | `/dashboard/eventos-sociales` |

### 🧭 Navegación

| Componente | Descripción | Ubicación |
|------------|-------------|-----------|
| `Header.tsx` | Barra de navegación | Todas las páginas del dashboard |

## 🎨 Estilos

Cada componente tiene su archivo CSS Module asociado:

```
LoginForm.tsx          →  LoginForm.module.css
RegisterForm.tsx       →  RegisterForm.module.css
Header.tsx             →  Header.module.css
ActividadesRecreativas.tsx  →  ActividadesRecreativas.module.css
...
```

### Convenciones CSS Modules

```tsx
// Importar estilos
import styles from './MiComponente.module.css';

// Usar clases
<div className={styles.container}>
  <h1 className={styles.title}>Título</h1>
</div>
```

## 🔄 Estado Global

El estado de autenticación se maneja con Context API:

```tsx
import useAuth from '../hooks/useAuth';

const MiComponente = () => {
  const { user, isAuthenticated, login, logout, checkAuth } = useAuth();
  // ...
};
```

## 📦 Estructura de un Componente

```tsx
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MiComponente.module.css';

// 2. Tipos/Interfaces
interface Props {
  nombre: string;
  opcional?: number;
}

// 3. Componente
const MiComponente: React.FC<Props> = ({ nombre, opcional = 0 }) => {
  // 4. Hooks
  const [estado, setEstado] = useState('');
  const navigate = useNavigate();

  // 5. useEffect
  useEffect(() => {
    // ...
  }, []);

  // 6. Funciones
  const handleClick = () => {
    // ...
  };

  // 7. Render
  return (
    <div className={styles.container}>
      {/* JSX */}
    </div>
  );
};

// 8. Export
export default MiComponente;
```

## 🧩 Componentes Externos

- **lucide-react**: Iconos (`ShieldCheck`, `Copy`, `DownloadCloud`, etc.)
- **react-router-dom**: Navegación (`Link`, `NavLink`, `useNavigate`)
- **react-hook-form**: Formularios
- **zod**: Validación

## ✅ Buenas Prácticas

1. **TypeScript:** Siempre tipar props e interfaces
2. **CSS Modules:** Un archivo por componente
3. **Reutilización:** Extraer lógica común a hooks custom
4. **Validación:** Usar Zod schemas para formularios
5. **Accesibilidad:** Agregar `alt` a imágenes, `aria-label` cuando sea necesario
6. **Performance:** Usar `React.memo` para componentes pesados
7. **Nombres:** PascalCase para componentes, camelCase para funciones

## 📝 Crear Nuevo Componente

```cmd
cd frontend/src/components

# Crear archivo del componente
echo. > MiComponente.tsx

# Crear archivo de estilos
echo. > MiComponente.module.css
```

Luego copiar la estructura base de arriba.

---

**Última actualización:** 7 de noviembre, 2025
