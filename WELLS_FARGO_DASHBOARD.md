# Wells Fargo Platform Investment Dashboard

## Descripción General

Dashboard integral para el análisis de inversión en redes sociales de Wells Fargo, implementado usando el dataset `banking-social-data.csv` con visualizaciones interactivas y insights basados en datos reales.

## Características Principales

### 🎯 Título Dinámico
- **Formato**: "Wells Fargo [YEAR] Social Spend"
- **Control**: Selector de año conectado a los datos del CSV
- **Colores**: Esquema de marca Wells Fargo (rojo característico)

### 📊 Visualizaciones Incluidas

#### 1. Gráfico de Dona - Distribución por Plataforma
- **Tipo**: Donut chart interactivo
- **Datos**: Gasto de Wells Fargo por plataforma para el año seleccionado
- **Funcionalidad**: 
  - Montos en dólares para cada segmento
  - Leyenda con valores formateados (K/M/B)
  - Colores específicos por plataforma (Facebook azul, Instagram rosa, etc.)

#### 2. Mapa de Calor - Tendencias Mensuales
- **Tipo**: Tabla con intensidad de color basada en datos
- **Estructura**: Filas = Plataformas, Columnas = Meses
- **Funcionalidad**:
  - Gradiente de color basado en montos de inversión
  - Colores más intensos = mayor inversión
  - Formato de moneda abreviado en celdas

#### 3. Gráfico de Línea de Tiempo - Comparación entre Bancos
- **Ejes**: X = Meses, Y = Inversión en dólares
- **Líneas**:
  - **Línea 1**: Wells Fargo (rojo sólido, grosor 3px)
  - **Línea 2**: Banco de comparación seleccionable (azul, grosor 2px)
  - **Línea 3**: Promedio industria (gris punteado, constante)
- **Cálculo promedio**: Total de dólares ÷ número de bancos ÷ número de meses

### 🎛️ Controles Interactivos

#### Selector de Año
- **Ubicación**: Header principal
- **Funcionalidad**: Filtra todo el dashboard por año
- **Fuente**: Años únicos del dataset CSV

#### Selector de Banco de Comparación
- **Opciones**: Todos los bancos excepto Wells Fargo
- **Predeterminado**: CHASE
- **Efecto**: Cambia la segunda línea en el gráfico de tiempo

#### Selector de Distribuidor/Plataforma
- **Opciones**: "Todas" + plataformas individuales del dataset
- **Predeterminado**: "Todas"
- **Efecto**: Filtra datos para gráfico de línea de tiempo

### 📈 Panel de Insights

#### Métricas Automáticas Incluidas:
- **Inversión total** para el año seleccionado
- **Plataforma líder** con porcentaje del gasto total
- **Segunda plataforma** con participación
- **Comparación porcentual** vs banco seleccionado
- **Datos 100% descriptivos** basados en cifras reales

## Implementación Técnica

### Componente Principal
```typescript
// Ubicación: src/components/charts/WellsFargoDashboard.tsx
import { WellsFargoDashboard } from './charts/WellsFargoDashboard';

// Uso:
<WellsFargoDashboard data={socialSpendData} />
```

### Integración en Presentación
- **Slide especial** insertado en `BankingSocialPresentation.tsx`
- **Posición**: Después de slides generales, antes de análisis individuales
- **Título**: "Wells Fargo - Platform Investment Dashboard"
- **Subtítulo**: "Comprehensive Social Media Analytics & Strategy Insights"

### Procesamiento de Datos

#### Filtrado Dinámico
```typescript
// Por año y distribuidor
const wellsFargoData = data.filter(item => 
  item.bank === "WELLS FARGO" && 
  item.year === selectedYear &&
  (selectedDistributor === "All" || item.platform === selectedDistributor)
);
```

#### Agregaciones
- **Por plataforma**: Suma de gastos por distribuidor
- **Por mes**: Agrupación temporal para mapa de calor
- **Promedio industria**: Cálculo dinámico multi-banco

### Manejo de Casos Extremos
- **Datos faltantes**: Valores cero mostrados como "-"
- **Años sin datos**: Componentes muestran estados vacíos
- **Selecciones inválidas**: Inicialización automática con datos disponibles

## Colores y Branding

### Wells Fargo
- **Rojo principal**: `#D71921`
- **Gradiente header**: `from-red-600 to-red-700`

### Plataformas
- **Facebook**: `#1877F2`
- **Instagram**: `#E4405F`
- **TikTok**: `#000000`
- **X (Twitter)**: `#1DA1F2`
- **Pinterest**: `#BD081C`
- **Reddit**: `#FF4500`

## Responsive Design
- **Grid adaptativo**: 1 columna en móvil, 2 en desktop
- **Gráficos responsivos**: ResponsiveContainer de Recharts
- **Tablas**: Scroll horizontal en dispositivos pequeños
- **Controles**: Flex wrap para múltiples pantallas

## Navegación en Presentación
1. **Iniciar presentación** desde página principal
2. **Navegar** con flechas de teclado o botones
3. **Buscar slide** "Wells Fargo - Platform Investment Dashboard"
4. **Interactuar** con controles sin salir de presentación

## Datos Fuente
- **Archivo**: `public/banking-social-data.csv`
- **Formato**: CSV con columnas Bank, Year, Month, Distributor, dollars
- **Carga**: Asíncrona mediante `dataService.ts`
- **Fallback**: Datos mock si falla carga de CSV 