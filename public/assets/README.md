# 🖼️ Assets Públicos

Carpeta para recursos estáticos públicos del frontend.

## 📁 Contenido

Esta carpeta contiene imágenes, iconos y otros recursos que se sirven directamente sin procesamiento de Vite.

### Archivos actuales

- (Vacío - agregar recursos aquí)

## 📝 Convenciones

### Nombres de Archivos
- Usar **kebab-case**: `mi-imagen.png`
- Ser descriptivos: `logo-cintli.png` mejor que `img1.png`
- Incluir dimensiones si hay múltiples versiones: `banner-1920x1080.jpg`

### Formatos Recomendados

| Tipo | Formato | Uso |
|------|---------|-----|
| **Logos** | PNG | Fondo transparente |
| **Fotos** | JPG | Compresión óptima |
| **Iconos** | SVG | Escalable sin pérdida |
| **Favicon** | ICO/PNG | 16x16, 32x32, 48x48 |

### Optimización

Antes de agregar imágenes:
- ✅ Comprimir con [TinyPNG](https://tinypng.com)
- ✅ Dimensionar al tamaño necesario
- ✅ Convertir a WebP para mejor compresión (cuando sea posible)

### Pesos Máximos

- Logos: <50KB
- Banners: <300KB
- Fotos: <500KB
- Iconos SVG: <10KB

## 📐 Especificaciones

Ver `ESPECIFICACIONES_IMAGENES.md` y `ESPECIFICACIONES_RESPONSIVE.md` en la raíz del proyecto para dimensiones exactas.

## 🔗 Uso en Componentes

```tsx
// Los archivos en public/ se acceden desde la raíz
<img src="/assets/logo.png" alt="Logo" />

// Para imágenes procesadas por Vite, usar import desde src/assets/
import logo from '@/assets/logo.png';
<img src={logo} alt="Logo" />
```

---

**Última actualización:** 7 de noviembre, 2025
