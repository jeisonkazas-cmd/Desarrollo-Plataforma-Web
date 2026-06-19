from pathlib import Path

from PIL import Image


IMAGE_NAMES = [
    "CAIDA_LIBRE",
    "CAMPO_MAGNETICO",
    "CARGA_MASA",
    "COEFICIENTEFRICCION",
    "COLISIONES",
    "ESPECTROSCOPIA",
    "MICROONDAS",
    "MILLIKAN",
    "MUR",
    "ONDA_ESTACIONARIA",
    "PROYECTILES",
    "REPRESENTACION_VECTORIAL",
]


def main() -> None:
    images_dir = Path(__file__).resolve().parents[1] / "public" / "imagenes"

    for name in IMAGE_NAMES:
        source = images_dir / f"{name}.png"
        destination = images_dir / f"{name}.webp"

        with Image.open(source) as image:
            image.thumbnail((900, 700), Image.Resampling.LANCZOS)
            image.convert("RGB").save(
                destination,
                "WEBP",
                quality=76,
                method=6,
            )

        size_kb = round(destination.stat().st_size / 1024)
        print(f"{destination.name}: {size_kb} KB")


if __name__ == "__main__":
    main()
