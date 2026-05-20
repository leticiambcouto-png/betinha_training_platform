/**
 * StellarStar — ícone oficial da Stellar Gaming (estrela assimétrica de 5 pontas)
 * Substitui todos os ícones Star comuns do Lucide em toda a plataforma.
 *
 * Props:
 *   size    — largura/altura em px (default: 20)
 *   color   — cor de preenchimento (default: "currentColor" → herda do CSS)
 *   className — classes Tailwind extras
 */
interface StellarStarProps {
  size?: number;
  color?: string;
  className?: string;
}

export function StellarStar({ size = 20, color = "currentColor", className = "" }: StellarStarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/*
        Estrela assimétrica de 5 pontas da Stellar Gaming.
        Pontos extraídos da forma original da logo (estrela inclinada para a direita).
        Ponto de referência: topo-esquerdo → sentido horário.
      */}
      <polygon
        points="
          18,72
          38,42
          28,8
          58,35
          88,10
          72,42
          95,68
          60,58
          50,92
          35,60
        "
        fill={color}
      />
    </svg>
  );
}

/** Versão com a imagem PNG/WebP real da estrela Stellar (maior fidelidade) */
export function StellarStarImg({
  size = 20,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <img
      src="/manus-storage/estrela_stellar_bbcf5dc9.webp"
      alt="Stellar star"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      aria-hidden="true"
    />
  );
}
